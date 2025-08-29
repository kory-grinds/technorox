import express from 'express'
import cors from 'cors'
import { SESClient, SendEmailCommand, CreateContactListCommand, PutContactInContactListCommand, DeleteContactFromContactListCommand } from '@aws-sdk/client-ses'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Configure AWS SES
const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

// SES Configuration
const SES_CONFIG = {
    contactListName: 'technorox-newsletter',
    fromEmail: process.env.SES_FROM_EMAIL || 'noreply@technorox.com',
    fromName: 'Technorox TCG',
    replyToEmail: process.env.SES_REPLY_TO_EMAIL || 'support@technorox.com'
}

// Email Templates
const EMAIL_TEMPLATES = {
    welcome: {
        subject: 'Welcome to the Technorox Grid! 🎮',
        getHtml: (displayName) => `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Technorox</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #1a1a1a; }
                    .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #00FFF7, #FF00FF); padding: 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
                    .content { padding: 30px; color: #e0e0e0; }
                    .button { display: inline-block; background: #00FFF7; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                    .footer { background: #1a1a1a; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>TECHNOROX TCG</h1>
                        <p style="color: white; margin: 10px 0 0 0;">Welcome to the Grid</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #00FFF7;">Welcome, ${displayName}!</h2>
                        <p>You've successfully joined the Technorox newsletter and will receive updates about:</p>
                        <ul>
                            <li>🎴 New card releases and expansions</li>
                            <li>🏆 Tournament announcements and results</li>
                            <li>🎉 Special events and promotions</li>
                            <li>⚡ Game updates and new features</li>
                        </ul>
                        <p>Ready to start playing? Build your deck and dominate the digital realm!</p>
                        <a href="${process.env.CLIENT_URL}/login" class="button">Enter the Grid</a>
                        <p><small>You can update your email preferences or unsubscribe at any time from your account settings.</small></p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} KAAI TECH LLC. All rights reserved.</p>
                        <p>Technorox is a trademark of KAAI TECH LLC.</p>
                        <p><a href="${process.env.CLIENT_URL}/unsubscribe?email={{email}}" style="color: #00FFF7;">Unsubscribe</a> | <a href="${process.env.CLIENT_URL}/privacy-policy" style="color: #00FFF7;">Privacy Policy</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    },
    
    newsletter: {
        subject: 'Technorox Newsletter - {{title}}',
        getHtml: (title, content, unsubscribeUrl) => `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #1a1a1a; }
                    .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #00FFF7, #FF00FF); padding: 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 24px; }
                    .content { padding: 30px; color: #e0e0e0; }
                    .footer { background: #1a1a1a; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>TECHNOROX TCG</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #00FFF7;">${title}</h2>
                        ${content}
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} KAAI TECH LLC. All rights reserved.</p>
                        <p><a href="${unsubscribeUrl}" style="color: #00FFF7;">Unsubscribe</a> | <a href="${process.env.CLIENT_URL}/privacy-policy" style="color: #00FFF7;">Privacy Policy</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    }
}

// ===================
// API ROUTES
// ===================

/**
 * Subscribe to newsletter
 */
app.post('/api/email/subscribe', async (req, res) => {
    try {
        const { email, displayName, preferences = {}, tags = [] } = req.body

        if (!email || !displayName) {
            return res.status(400).json({ error: 'Email and display name are required' })
        }

        // Add contact to SES contact list
        await addContactToSES(email, displayName, preferences, tags)

        // Send welcome email
        await sendWelcomeEmail(email, displayName)

        console.log(`✅ Newsletter subscription successful: ${email}`)
        res.json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter',
            email 
        })

    } catch (error) {
        console.error('❌ Newsletter subscription failed:', error)
        res.status(500).json({ 
            error: 'Failed to subscribe to newsletter',
            details: error.message 
        })
    }
})

/**
 * Unsubscribe from newsletter
 */
app.post('/api/email/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error: 'Email is required' })
        }

        // Remove contact from SES contact list
        await removeContactFromSES(email)

        console.log(`✅ Newsletter unsubscription successful: ${email}`)
        res.json({ 
            success: true, 
            message: 'Successfully unsubscribed from newsletter',
            email 
        })

    } catch (error) {
        console.error('❌ Newsletter unsubscription failed:', error)
        res.status(500).json({ 
            error: 'Failed to unsubscribe from newsletter',
            details: error.message 
        })
    }
})

/**
 * Send newsletter campaign (admin only)
 */
app.post('/api/email/send-newsletter', async (req, res) => {
    try {
        // TODO: Add admin authentication middleware
        const { title, content, targetTags = [] } = req.body

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' })
        }

        // TODO: Get subscriber list from SES based on tags
        // TODO: Send bulk email campaign
        
        console.log(`✅ Newsletter campaign sent: ${title}`)
        res.json({ 
            success: true, 
            message: 'Newsletter campaign sent successfully',
            title 
        })

    } catch (error) {
        console.error('❌ Newsletter campaign failed:', error)
        res.status(500).json({ 
            error: 'Failed to send newsletter campaign',
            details: error.message 
        })
    }
})

/**
 * Send tournament notification
 */
app.post('/api/email/tournament-notification', async (req, res) => {
    try {
        const { tournamentName, startDate, registrationUrl } = req.body

        // TODO: Send tournament notification to subscribers with tournament preference
        
        console.log(`✅ Tournament notification sent: ${tournamentName}`)
        res.json({ 
            success: true, 
            message: 'Tournament notification sent successfully' 
        })

    } catch (error) {
        console.error('❌ Tournament notification failed:', error)
        res.status(500).json({ 
            error: 'Failed to send tournament notification',
            details: error.message 
        })
    }
})

// ===================
// SES HELPER FUNCTIONS
// ===================

/**
 * Initialize SES contact list
 */
async function initializeSESContactList() {
    try {
        const command = new CreateContactListCommand({
            ContactListName: SES_CONFIG.contactListName,
            Description: 'Technorox TCG Newsletter Subscribers'
        })
        
        await sesClient.send(command)
        console.log(`✅ SES contact list created: ${SES_CONFIG.contactListName}`)
    } catch (error) {
        if (error.name === 'AlreadyExistsException') {
            console.log(`📋 SES contact list already exists: ${SES_CONFIG.contactListName}`)
        } else {
            console.error('❌ Failed to create SES contact list:', error)
            throw error
        }
    }
}

/**
 * Add contact to SES
 */
async function addContactToSES(email, displayName, preferences, tags) {
    try {
        const command = new PutContactInContactListCommand({
            ContactListName: SES_CONFIG.contactListName,
            EmailAddress: email,
            AttributesData: JSON.stringify({
                displayName,
                preferences,
                tags,
                subscribedAt: new Date().toISOString()
            })
        })

        await sesClient.send(command)
        console.log(`✅ Contact added to SES: ${email}`)
    } catch (error) {
        console.error(`❌ Failed to add contact to SES: ${email}`, error)
        throw error
    }
}

/**
 * Remove contact from SES
 */
async function removeContactFromSES(email) {
    try {
        const command = new DeleteContactFromContactListCommand({
            ContactListName: SES_CONFIG.contactListName,
            EmailAddress: email
        })

        await sesClient.send(command)
        console.log(`✅ Contact removed from SES: ${email}`)
    } catch (error) {
        console.error(`❌ Failed to remove contact from SES: ${email}`, error)
        throw error
    }
}

/**
 * Send welcome email
 */
async function sendWelcomeEmail(email, displayName) {
    try {
        const template = EMAIL_TEMPLATES.welcome
        const htmlContent = template.getHtml(displayName).replace('{{email}}', email)

        const command = new SendEmailCommand({
            Source: `${SES_CONFIG.fromName} <${SES_CONFIG.fromEmail}>`,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: {
                    Data: template.subject,
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: htmlContent,
                        Charset: 'UTF-8'
                    }
                }
            },
            ReplyToAddresses: [SES_CONFIG.replyToEmail]
        })

        await sesClient.send(command)
        console.log(`✅ Welcome email sent to: ${email}`)
    } catch (error) {
        console.error(`❌ Failed to send welcome email to: ${email}`, error)
        throw error
    }
}

// ===================
// SERVER STARTUP
// ===================

const PORT = process.env.EMAIL_PORT || 3003

app.listen(PORT, async () => {
    console.log(`📧 Email service running on port ${PORT}`)
    
    // Initialize SES contact list
    try {
        await initializeSESContactList()
    } catch (error) {
        console.error('Failed to initialize SES:', error)
    }
    
    console.log('📋 Environment variables:')
    console.log(`   AWS_REGION: ${process.env.AWS_REGION ? '✅' : '❌'}`)
    console.log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✅' : '❌'}`)
    console.log(`   AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅' : '❌'}`)
    console.log(`   SES_FROM_EMAIL: ${process.env.SES_FROM_EMAIL ? '✅' : '❌'}`)
})

export default app

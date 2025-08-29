const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Initialize Stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rox Chips Bundle Configuration (should match frontend)
const ROX_CHIPS_BUNDLES = {
    starter: {
        id: 'starter',
        name: 'Starter Bundle',
        priceUSD: 4.99,
        roxChips: 100,
        totalChips: 100
    },
    popular: {
        id: 'popular',
        name: 'Popular Bundle',
        priceUSD: 9.99,
        roxChips: 200,
        totalChips: 220
    },
    value: {
        id: 'value',
        name: 'Value Bundle',
        priceUSD: 24.99,
        roxChips: 500,
        totalChips: 600
    },
    premium: {
        id: 'premium',
        name: 'Premium Bundle',
        priceUSD: 49.99,
        roxChips: 1000,
        totalChips: 1300
    },
    ultimate: {
        id: 'ultimate',
        name: 'Ultimate Bundle',
        priceUSD: 99.99,
        roxChips: 2000,
        totalChips: 2800
    }
}

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { bundleId, userId } = req.body
        
        // Validate bundle
        const bundle = ROX_CHIPS_BUNDLES[bundleId]
        if (!bundle) {
            return res.status(400).json({ error: 'Invalid bundle ID' })
        }

        // Validate user
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' })
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${bundle.name} - ${bundle.totalChips} Rox Chips`,
                            description: `Get ${bundle.totalChips} Rox Chips for Technorox TCG (KAAI TECH LLC)`,
                            images: ['https://technorox.com/assets/rox-chips-icon.png'], // Add your icon URL
                            metadata: {
                                company: 'KAAI TECH LLC',
                                product: 'Technorox TCG',
                                item_type: 'Virtual Currency'
                            }
                        },
                        unit_amount: Math.round(bundle.priceUSD * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/store`,
            metadata: {
                userId,
                bundleId,
                roxChips: bundle.totalChips.toString(),
                company: 'KAAI TECH LLC',
                product: 'Technorox TCG'
            },
            customer_email: req.body.email, // Optional: pre-fill email if available
            billing_address_collection: 'required',
            payment_intent_data: {
                statement_descriptor: 'KAAI TECH LLC',
                statement_descriptor_suffix: 'Technorox'
            }
        })

        res.json({ 
            sessionId: session.id,
            url: session.url 
        })

    } catch (error) {
        console.error('Error creating checkout session:', error)
        res.status(500).json({ error: 'Failed to create checkout session' })
    }
})

// Stripe Webhook Handler
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object
            
            // Extract metadata
            const { userId, bundleId, roxChips } = session.metadata
            
            console.log('Payment successful:', {
                sessionId: session.id,
                userId,
                bundleId,
                roxChips,
                amountPaid: session.amount_total / 100
            })

            // Here you would typically:
            // 1. Update user's Rox Chips balance in Firebase
            // 2. Record the transaction
            // 3. Send confirmation email
            
            // For now, we'll just log it
            // In a real implementation, you'd call your Firebase function or API
            try {
                // This would be handled by your RoxChipsService.completePurchase()
                console.log(`Awarding ${roxChips} Rox Chips to user ${userId}`)
                
                // You could make an API call to your main server here
                // await fetch(`${process.env.API_URL}/complete-purchase`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ sessionId: session.id })
                // })
                
            } catch (error) {
                console.error('Error processing completed payment:', error)
            }
            
            break

        case 'checkout.session.expired':
            console.log('Checkout session expired:', event.data.object.id)
            break

        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
})

// Get bundle information
app.get('/api/bundles', (req, res) => {
    res.json(ROX_CHIPS_BUNDLES)
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'stripe-integration',
        timestamp: new Date().toISOString()
    })
})

const PORT = process.env.STRIPE_PORT || 3002

app.listen(PORT, () => {
    console.log(`Stripe server running on port ${PORT}`)
    console.log(`Webhook endpoint: http://localhost:${PORT}/api/stripe-webhook`)
    console.log(`Make sure to set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your .env file`)
})

module.exports = app

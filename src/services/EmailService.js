import { firebaseService } from './FirebaseService.js'

/**
 * EmailService - Handles email subscriptions and notifications using Amazon SES
 * This service manages newsletter subscriptions, email preferences, and sending notifications
 */
export class EmailService {
    constructor() {
        this.isInitialized = false
        this.apiEndpoint = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    }

    async init() {
        this.isInitialized = true
        console.log('📧 EmailService initialized')
        return true
    }

    // ===================
    // NEWSLETTER SUBSCRIPTIONS
    // ===================

    /**
     * Subscribe user to newsletter
     */
    async subscribeToNewsletter(email, displayName, userId, preferences = {}) {
        try {
            const subscription = {
                email,
                displayName,
                userId,
                subscribedAt: new Date(),
                status: 'active',
                preferences: {
                    tournaments: preferences.tournaments ?? true,
                    newCards: preferences.newCards ?? true,
                    events: preferences.events ?? true,
                    gameUpdates: preferences.gameUpdates ?? true,
                    ...preferences
                },
                source: 'registration', // registration, manual, import, etc.
                tags: ['technorox-players', 'new-subscribers'],
                metadata: {
                    userAgent: navigator.userAgent,
                    subscriptionIP: await this.getClientIP(),
                    gameVersion: '1.0.0'
                }
            }

            // Save to Firebase
            const result = await firebaseService.createDocument('newsletter_subscriptions', subscription)
            
            if (result.success) {
                // Call backend to add to SES mailing list
                await this.addToSESList(subscription)
                console.log('✅ Newsletter subscription created:', email)
                return { success: true, subscriptionId: result.id }
            } else {
                throw new Error('Failed to save subscription to database')
            }

        } catch (error) {
            console.error('❌ Newsletter subscription failed:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Unsubscribe user from newsletter
     */
    async unsubscribeFromNewsletter(email, reason = 'user_request') {
        try {
            // Update subscription status in Firebase
            const subscriptions = await firebaseService.getCollection('newsletter_subscriptions', {
                where: [['email', '==', email], ['status', '==', 'active']]
            })

            if (subscriptions.length > 0) {
                const subscription = subscriptions[0]
                await firebaseService.updateDocument('newsletter_subscriptions', subscription.id, {
                    status: 'unsubscribed',
                    unsubscribedAt: new Date(),
                    unsubscribeReason: reason
                })

                // Remove from SES mailing list
                await this.removeFromSESList(email)
                
                console.log('✅ Newsletter unsubscription processed:', email)
                return { success: true }
            } else {
                return { success: false, error: 'Subscription not found' }
            }

        } catch (error) {
            console.error('❌ Newsletter unsubscription failed:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Update subscription preferences
     */
    async updateSubscriptionPreferences(email, preferences) {
        try {
            const subscriptions = await firebaseService.getCollection('newsletter_subscriptions', {
                where: [['email', '==', email], ['status', '==', 'active']]
            })

            if (subscriptions.length > 0) {
                const subscription = subscriptions[0]
                await firebaseService.updateDocument('newsletter_subscriptions', subscription.id, {
                    preferences: {
                        ...subscription.preferences,
                        ...preferences
                    },
                    updatedAt: new Date()
                })

                console.log('✅ Subscription preferences updated:', email)
                return { success: true }
            } else {
                return { success: false, error: 'Subscription not found' }
            }

        } catch (error) {
            console.error('❌ Failed to update subscription preferences:', error)
            return { success: false, error: error.message }
        }
    }

    // ===================
    // SES INTEGRATION
    // ===================

    /**
     * Add email to SES mailing list via backend
     */
    async addToSESList(subscription) {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/email/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: subscription.email,
                    displayName: subscription.displayName,
                    preferences: subscription.preferences,
                    tags: subscription.tags
                })
            })

            if (!response.ok) {
                throw new Error(`SES subscription failed: ${response.statusText}`)
            }

            const result = await response.json()
            console.log('✅ Added to SES mailing list:', subscription.email)
            return result

        } catch (error) {
            console.error('❌ Failed to add to SES mailing list:', error)
            throw error
        }
    }

    /**
     * Remove email from SES mailing list via backend
     */
    async removeFromSESList(email) {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/email/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            if (!response.ok) {
                throw new Error(`SES unsubscription failed: ${response.statusText}`)
            }

            console.log('✅ Removed from SES mailing list:', email)
            return await response.json()

        } catch (error) {
            console.error('❌ Failed to remove from SES mailing list:', error)
            throw error
        }
    }

    // ===================
    // EMAIL CAMPAIGNS
    // ===================

    /**
     * Send newsletter campaign (admin only)
     */
    async sendNewsletter(campaignData) {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/email/send-newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAuthToken()}`
                },
                body: JSON.stringify(campaignData)
            })

            if (!response.ok) {
                throw new Error(`Newsletter send failed: ${response.statusText}`)
            }

            const result = await response.json()
            console.log('✅ Newsletter sent successfully')
            return result

        } catch (error) {
            console.error('❌ Failed to send newsletter:', error)
            throw error
        }
    }

    /**
     * Send tournament notification
     */
    async sendTournamentNotification(tournamentData) {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/email/tournament-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAuthToken()}`
                },
                body: JSON.stringify(tournamentData)
            })

            if (!response.ok) {
                throw new Error(`Tournament notification failed: ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            console.error('❌ Failed to send tournament notification:', error)
            throw error
        }
    }

    /**
     * Send new card announcement
     */
    async sendNewCardAnnouncement(cardData) {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/email/new-card-announcement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAuthToken()}`
                },
                body: JSON.stringify(cardData)
            })

            if (!response.ok) {
                throw new Error(`Card announcement failed: ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            console.error('❌ Failed to send card announcement:', error)
            throw error
        }
    }

    // ===================
    // SUBSCRIPTION MANAGEMENT
    // ===================

    /**
     * Get subscription statistics (admin only)
     */
    async getSubscriptionStats() {
        try {
            const allSubscriptions = await firebaseService.getCollection('newsletter_subscriptions')
            
            const stats = {
                total: allSubscriptions.length,
                active: allSubscriptions.filter(sub => sub.status === 'active').length,
                unsubscribed: allSubscriptions.filter(sub => sub.status === 'unsubscribed').length,
                bounced: allSubscriptions.filter(sub => sub.status === 'bounced').length,
                bySource: {},
                byPreferences: {
                    tournaments: 0,
                    newCards: 0,
                    events: 0,
                    gameUpdates: 0
                },
                recentSubscriptions: allSubscriptions
                    .filter(sub => sub.subscribedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                    .length
            }

            // Count by source
            allSubscriptions.forEach(sub => {
                const source = sub.source || 'unknown'
                stats.bySource[source] = (stats.bySource[source] || 0) + 1

                // Count preferences for active subscriptions
                if (sub.status === 'active' && sub.preferences) {
                    Object.keys(stats.byPreferences).forEach(pref => {
                        if (sub.preferences[pref]) {
                            stats.byPreferences[pref]++
                        }
                    })
                }
            })

            return stats

        } catch (error) {
            console.error('❌ Failed to get subscription stats:', error)
            throw error
        }
    }

    /**
     * Get all active subscriptions (admin only)
     */
    async getActiveSubscriptions(limit = 100, offset = 0) {
        try {
            return await firebaseService.getCollection('newsletter_subscriptions', {
                where: [['status', '==', 'active']],
                orderBy: [['subscribedAt', 'desc']],
                limit,
                offset
            })
        } catch (error) {
            console.error('❌ Failed to get active subscriptions:', error)
            throw error
        }
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Get client IP address
     */
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json')
            const data = await response.json()
            return data.ip
        } catch (error) {
            return 'unknown'
        }
    }

    /**
     * Get authentication token for API calls
     */
    async getAuthToken() {
        try {
            const user = window.technorox?.authManager?.getCurrentUser()
            if (user) {
                return await user.getIdToken()
            }
            return null
        } catch (error) {
            console.error('Failed to get auth token:', error)
            return null
        }
    }

    /**
     * Validate email address
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Check if user is subscribed
     */
    async isSubscribed(email) {
        try {
            const subscriptions = await firebaseService.getCollection('newsletter_subscriptions', {
                where: [['email', '==', email], ['status', '==', 'active']]
            })
            return subscriptions.length > 0
        } catch (error) {
            console.error('Failed to check subscription status:', error)
            return false
        }
    }
}

// Create singleton instance
export const emailService = new EmailService()

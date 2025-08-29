import { firebaseService } from './FirebaseService.js'
import { 
    ROX_CHIPS_BUNDLES, 
    STORE_ITEMS, 
    TRANSACTION_TYPES, 
    EARNING_SOURCES,
    MISSIONS,
    ACHIEVEMENTS,
    RoxChipsUtils,
    FIREBASE_COLLECTIONS,
    createUserWallet,
    createTransaction,
    createPurchase,
    createUserInventory
} from '../data/roxChipsSchema.js'

/**
 * Rox Chips Service - Manages all currency operations
 * Handles purchases, transactions, earning, spending, and inventory
 */
export class RoxChipsService {
    constructor() {
        this.isInitialized = false
        this.currentUser = null
        this.userWallet = null
        this.userInventory = null
    }

    async init(userId) {
        this.currentUser = userId
        await this.loadUserWallet()
        await this.loadUserInventory()
        this.isInitialized = true
    }

    // ===================
    // WALLET MANAGEMENT
    // ===================

    async loadUserWallet() {
        if (!this.currentUser || !firebaseService.isReady()) return null

        try {
            const result = await firebaseService.getDocument(FIREBASE_COLLECTIONS.userWallets, this.currentUser)
            
            if (result.success) {
                this.userWallet = result.data
            } else {
                // Create new wallet for user
                this.userWallet = createUserWallet(this.currentUser)
                await this.saveUserWallet()
            }
            
            return this.userWallet
        } catch (error) {
            console.error('Error loading user wallet:', error)
            return null
        }
    }

    async saveUserWallet() {
        if (!this.userWallet || !firebaseService.isReady()) return false

        try {
            this.userWallet.lastUpdated = new Date()
            const result = await firebaseService.updateDocument(
                FIREBASE_COLLECTIONS.userWallets, 
                this.currentUser, 
                this.userWallet
            )
            return result.success
        } catch (error) {
            console.error('Error saving user wallet:', error)
            return false
        }
    }

    getRoxChipsBalance() {
        return this.userWallet?.roxChipsBalance || 0
    }

    async updateBalance(amount, type, source, metadata = {}) {
        if (!this.userWallet) return false

        const oldBalance = this.userWallet.roxChipsBalance
        this.userWallet.roxChipsBalance += amount

        // Update totals
        if (amount > 0) {
            if (type === TRANSACTION_TYPES.PURCHASE) {
                this.userWallet.totalPurchased += amount
            } else {
                this.userWallet.totalEarned += amount
            }
        } else {
            this.userWallet.totalSpent += Math.abs(amount)
        }

        // Save wallet
        const saved = await this.saveUserWallet()
        
        if (saved) {
            // Record transaction
            await this.recordTransaction(amount, type, source, metadata)
            
            // Log analytics
            firebaseService.logGameEvent('rox_chips_balance_changed', {
                userId: this.currentUser,
                oldBalance,
                newBalance: this.userWallet.roxChipsBalance,
                amount,
                type,
                source
            })
            
            return true
        }
        
        return false
    }

    async recordTransaction(amount, type, source, metadata = {}) {
        if (!firebaseService.isReady()) return false

        try {
            const transaction = createTransaction(this.currentUser, type, amount, source, metadata)
            const result = await firebaseService.createDocument(FIREBASE_COLLECTIONS.transactions, transaction)
            return result.success
        } catch (error) {
            console.error('Error recording transaction:', error)
            return false
        }
    }

    // ===================
    // STRIPE INTEGRATION
    // ===================

    async createStripeCheckoutSession(bundleId) {
        const bundle = RoxChipsUtils.getBundle(bundleId)
        if (!bundle) {
            throw new Error('Invalid bundle ID')
        }

        try {
            // This would integrate with your backend Stripe endpoint
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bundleId,
                    userId: this.currentUser,
                    priceUSD: bundle.priceUSD,
                    roxChips: bundle.totalChips
                })
            })

            const session = await response.json()
            
            if (session.error) {
                throw new Error(session.error)
            }

            // Record pending purchase
            await this.recordPendingPurchase(bundleId, session.id, bundle.priceUSD)

            return session
        } catch (error) {
            console.error('Error creating Stripe session:', error)
            throw error
        }
    }

    async recordPendingPurchase(bundleId, stripeSessionId, amountUSD) {
        if (!firebaseService.isReady()) return false

        try {
            const purchase = createPurchase(this.currentUser, bundleId, stripeSessionId, amountUSD)
            const result = await firebaseService.createDocument(FIREBASE_COLLECTIONS.purchases, purchase)
            return result.success
        } catch (error) {
            console.error('Error recording pending purchase:', error)
            return false
        }
    }

    async completePurchase(stripeSessionId) {
        if (!firebaseService.isReady()) return false

        try {
            // Find the pending purchase
            const purchasesResult = await firebaseService.getCollection(FIREBASE_COLLECTIONS.purchases, {
                where: [['stripeSessionId', '==', stripeSessionId], ['status', '==', 'pending']]
            })

            if (!purchasesResult.success || purchasesResult.data.length === 0) {
                throw new Error('Purchase not found')
            }

            const purchase = purchasesResult.data[0]
            const bundle = RoxChipsUtils.getBundle(purchase.bundleId)

            if (!bundle) {
                throw new Error('Invalid bundle')
            }

            // Add Rox Chips to user wallet
            const success = await this.updateBalance(
                bundle.totalChips,
                TRANSACTION_TYPES.PURCHASE,
                `bundle_${purchase.bundleId}`,
                {
                    bundleId: purchase.bundleId,
                    stripeSessionId,
                    amountUSD: purchase.amountUSD
                }
            )

            if (success) {
                // Update purchase status
                await firebaseService.updateDocument(FIREBASE_COLLECTIONS.purchases, purchase.id, {
                    status: 'completed',
                    completedAt: new Date()
                })

                // Log analytics
                firebaseService.logGameEvent('rox_chips_purchased', {
                    userId: this.currentUser,
                    bundleId: purchase.bundleId,
                    amountUSD: purchase.amountUSD,
                    roxChipsReceived: bundle.totalChips
                })

                return true
            }

            return false
        } catch (error) {
            console.error('Error completing purchase:', error)
            return false
        }
    }

    // ===================
    // EARNING SYSTEM
    // ===================

    async earnRoxChips(amount, source, metadata = {}) {
        return await this.updateBalance(amount, TRANSACTION_TYPES.EARNED, source, metadata)
    }

    async completeDailyMission(missionId) {
        const mission = MISSIONS.daily[missionId]
        if (!mission) return false

        // Check if already completed today
        const today = new Date().toDateString()
        const completedToday = await this.checkMissionCompleted(missionId, today)
        
        if (completedToday) return false

        // Award Rox Chips
        const success = await this.earnRoxChips(
            mission.reward,
            EARNING_SOURCES.DAILY_MISSION,
            { missionId, missionName: mission.name }
        )

        if (success) {
            // Record mission completion
            await this.recordMissionCompletion(missionId, 'daily', today)
            return true
        }

        return false
    }

    async completeWeeklyMission(missionId) {
        const mission = MISSIONS.weekly[missionId]
        if (!mission) return false

        // Check if already completed this week
        const weekStart = this.getWeekStart()
        const completedThisWeek = await this.checkMissionCompleted(missionId, weekStart)
        
        if (completedThisWeek) return false

        // Award Rox Chips
        const success = await this.earnRoxChips(
            mission.reward,
            EARNING_SOURCES.WEEKLY_MISSION,
            { missionId, missionName: mission.name }
        )

        if (success) {
            // Record mission completion
            await this.recordMissionCompletion(missionId, 'weekly', weekStart)
            return true
        }

        return false
    }

    async unlockAchievement(achievementId) {
        const achievement = ACHIEVEMENTS[achievementId]
        if (!achievement) return false

        // Check if already unlocked
        const alreadyUnlocked = await this.checkAchievementUnlocked(achievementId)
        if (alreadyUnlocked) return false

        // Award Rox Chips
        const success = await this.earnRoxChips(
            achievement.reward,
            EARNING_SOURCES.ACHIEVEMENT,
            { achievementId, achievementName: achievement.name }
        )

        if (success) {
            // Record achievement unlock
            await this.recordAchievementUnlock(achievementId)
            return true
        }

        return false
    }

    // ===================
    // SPENDING SYSTEM
    // ===================

    async spendRoxChips(amount, itemId, metadata = {}) {
        if (this.getRoxChipsBalance() < amount) {
            throw new Error('Insufficient Rox Chips')
        }

        return await this.updateBalance(-amount, TRANSACTION_TYPES.SPENT, itemId, metadata)
    }

    async purchaseStoreItem(itemId, quantity = 1) {
        const item = RoxChipsUtils.getStoreItem(itemId)
        if (!item) {
            throw new Error('Item not found')
        }

        if (!item.available) {
            throw new Error('Item not available')
        }

        const totalCost = item.price * quantity
        
        if (this.getRoxChipsBalance() < totalCost) {
            throw new Error('Insufficient Rox Chips')
        }

        // Spend Rox Chips
        const success = await this.spendRoxChips(totalCost, itemId, {
            itemName: item.name,
            quantity,
            category: item.category
        })

        if (success) {
            // Add item to inventory
            await this.addToInventory(itemId, quantity)
            
            // Log analytics
            firebaseService.logGameEvent('store_item_purchased', {
                userId: this.currentUser,
                itemId,
                itemName: item.name,
                quantity,
                totalCost,
                category: item.category
            })

            return true
        }

        return false
    }

    // ===================
    // INVENTORY MANAGEMENT
    // ===================

    async loadUserInventory() {
        if (!this.currentUser || !firebaseService.isReady()) return null

        try {
            const result = await firebaseService.getDocument(FIREBASE_COLLECTIONS.userInventory, this.currentUser)
            
            if (result.success) {
                this.userInventory = result.data
            } else {
                // Create new inventory for user
                this.userInventory = createUserInventory(this.currentUser)
                await this.saveUserInventory()
            }
            
            return this.userInventory
        } catch (error) {
            console.error('Error loading user inventory:', error)
            return null
        }
    }

    async saveUserInventory() {
        if (!this.userInventory || !firebaseService.isReady()) return false

        try {
            this.userInventory.lastUpdated = new Date()
            const result = await firebaseService.updateDocument(
                FIREBASE_COLLECTIONS.userInventory, 
                this.currentUser, 
                this.userInventory
            )
            return result.success
        } catch (error) {
            console.error('Error saving user inventory:', error)
            return false
        }
    }

    async addToInventory(itemId, quantity = 1) {
        if (!this.userInventory) return false

        // Add item to owned items
        for (let i = 0; i < quantity; i++) {
            this.userInventory.ownedItems.push(itemId)
        }

        return await this.saveUserInventory()
    }

    hasItem(itemId) {
        return this.userInventory?.ownedItems.includes(itemId) || false
    }

    async equipItem(itemId, slot) {
        if (!this.hasItem(itemId)) return false

        this.userInventory.equippedItems[slot] = itemId
        return await this.saveUserInventory()
    }

    // ===================
    // UTILITY METHODS
    // ===================

    async checkMissionCompleted(missionId, period) {
        if (!firebaseService.isReady()) return false

        try {
            const result = await firebaseService.getCollection(FIREBASE_COLLECTIONS.userMissions, {
                where: [
                    ['userId', '==', this.currentUser],
                    ['missionId', '==', missionId],
                    ['period', '==', period]
                ]
            })
            
            return result.success && result.data.length > 0
        } catch (error) {
            console.error('Error checking mission completion:', error)
            return false
        }
    }

    async recordMissionCompletion(missionId, type, period) {
        if (!firebaseService.isReady()) return false

        try {
            const completion = {
                userId: this.currentUser,
                missionId,
                type,
                period,
                completedAt: new Date()
            }
            
            const result = await firebaseService.createDocument(FIREBASE_COLLECTIONS.userMissions, completion)
            return result.success
        } catch (error) {
            console.error('Error recording mission completion:', error)
            return false
        }
    }

    async checkAchievementUnlocked(achievementId) {
        if (!firebaseService.isReady()) return false

        try {
            const result = await firebaseService.getCollection(FIREBASE_COLLECTIONS.userAchievements, {
                where: [
                    ['userId', '==', this.currentUser],
                    ['achievementId', '==', achievementId]
                ]
            })
            
            return result.success && result.data.length > 0
        } catch (error) {
            console.error('Error checking achievement:', error)
            return false
        }
    }

    async recordAchievementUnlock(achievementId) {
        if (!firebaseService.isReady()) return false

        try {
            const unlock = {
                userId: this.currentUser,
                achievementId,
                unlockedAt: new Date()
            }
            
            const result = await firebaseService.createDocument(FIREBASE_COLLECTIONS.userAchievements, unlock)
            return result.success
        } catch (error) {
            console.error('Error recording achievement unlock:', error)
            return false
        }
    }

    getWeekStart() {
        const now = new Date()
        const dayOfWeek = now.getDay()
        const diff = now.getDate() - dayOfWeek
        return new Date(now.setDate(diff)).toDateString()
    }

    async getTransactionHistory(limit = 50) {
        if (!firebaseService.isReady()) return []

        try {
            const result = await firebaseService.getCollection(FIREBASE_COLLECTIONS.transactions, {
                where: [['userId', '==', this.currentUser]],
                orderBy: ['timestamp', 'desc'],
                limit
            })
            
            return result.success ? result.data : []
        } catch (error) {
            console.error('Error getting transaction history:', error)
            return []
        }
    }
}

// Export singleton instance
export const roxChipsService = new RoxChipsService()
export default roxChipsService

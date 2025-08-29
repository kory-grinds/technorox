/**
 * Rox Chips Currency System - Data Models and Schema
 * Technorox TCG In-Game Currency System
 */

// Rox Chips Bundle Configuration
export const ROX_CHIPS_BUNDLES = {
    starter: {
        id: 'starter',
        name: 'Starter Bundle',
        description: 'Perfect for new players',
        priceUSD: 4.99,
        roxChips: 100,
        bonusPercentage: 0,
        bonusChips: 0,
        totalChips: 100,
        popular: false,
        icon: '💎'
    },
    popular: {
        id: 'popular',
        name: 'Popular Bundle',
        description: 'Most popular choice',
        priceUSD: 9.99,
        roxChips: 200,
        bonusPercentage: 10,
        bonusChips: 20,
        totalChips: 220,
        popular: true,
        icon: '⭐'
    },
    value: {
        id: 'value',
        name: 'Value Bundle',
        description: 'Great value for money',
        priceUSD: 24.99,
        roxChips: 500,
        bonusPercentage: 20,
        bonusChips: 100,
        totalChips: 600,
        popular: false,
        icon: '🔥'
    },
    premium: {
        id: 'premium',
        name: 'Premium Bundle',
        description: 'For serious players',
        priceUSD: 49.99,
        roxChips: 1000,
        bonusPercentage: 30,
        bonusChips: 300,
        totalChips: 1300,
        popular: false,
        icon: '👑'
    },
    ultimate: {
        id: 'ultimate',
        name: 'Ultimate Bundle',
        description: 'Maximum value',
        priceUSD: 99.99,
        roxChips: 2000,
        bonusPercentage: 40,
        bonusChips: 800,
        totalChips: 2800,
        popular: false,
        icon: '💫'
    }
}

// Store Items Configuration
export const STORE_ITEMS = {
    // Card Packs
    standardPack: {
        id: 'standard_pack',
        name: 'Standard Card Pack',
        description: '5 random cards with guaranteed uncommon',
        category: 'packs',
        price: 100,
        contents: {
            cardCount: 5,
            guaranteedRarity: 'uncommon',
            possibleRarities: ['common', 'uncommon', 'rare', 'mythic']
        },
        icon: '📦',
        available: true
    },
    premiumPack: {
        id: 'premium_pack',
        name: 'Premium Pack',
        description: '5 cards with guaranteed rare',
        category: 'packs',
        price: 200,
        contents: {
            cardCount: 5,
            guaranteedRarity: 'rare',
            possibleRarities: ['uncommon', 'rare', 'mythic']
        },
        icon: '🎁',
        available: true
    },
    legendaryPack: {
        id: 'legendary_pack',
        name: 'Legendary Pack',
        description: '5 cards with guaranteed mythic',
        category: 'packs',
        price: 500,
        contents: {
            cardCount: 5,
            guaranteedRarity: 'mythic',
            possibleRarities: ['rare', 'mythic']
        },
        icon: '✨',
        available: true
    },
    
    // Cosmetics
    cardBackCyber: {
        id: 'cardback_cyber',
        name: 'Cyber Circuit Card Back',
        description: 'Animated cyberpunk card back design',
        category: 'cosmetics',
        subcategory: 'cardbacks',
        price: 200,
        icon: '🔮',
        available: true,
        preview: '/assets/cardbacks/cyber-preview.jpg'
    },
    cardBackNeon: {
        id: 'cardback_neon',
        name: 'Neon Glow Card Back',
        description: 'Pulsing neon lights card back',
        category: 'cosmetics',
        subcategory: 'cardbacks',
        price: 200,
        icon: '💫',
        available: true,
        preview: '/assets/cardbacks/neon-preview.jpg'
    },
    
    // Avatars
    avatarHacker: {
        id: 'avatar_hacker',
        name: 'Elite Hacker Avatar',
        description: 'Mysterious hooded figure with glowing eyes',
        category: 'cosmetics',
        subcategory: 'avatars',
        price: 300,
        icon: '👤',
        available: true,
        preview: '/assets/avatars/hacker-preview.jpg'
    },
    avatarCyborg: {
        id: 'avatar_cyborg',
        name: 'Cyborg Warrior Avatar',
        description: 'Half-human, half-machine warrior',
        category: 'cosmetics',
        subcategory: 'avatars',
        price: 400,
        icon: '🤖',
        available: true,
        preview: '/assets/avatars/cyborg-preview.jpg'
    },
    
    // Board Skins
    boardFactory: {
        id: 'board_factory',
        name: 'Cyber Factory Board',
        description: 'Industrial cyberpunk battlefield',
        category: 'cosmetics',
        subcategory: 'boards',
        price: 500,
        icon: '🏭',
        available: true,
        preview: '/assets/boards/factory-preview.jpg'
    },
    
    // Battle Pass
    seasonalBattlePass: {
        id: 'battle_pass_s1',
        name: 'Season 1 Battle Pass',
        description: 'Unlock exclusive rewards and cosmetics',
        category: 'battlepass',
        price: 1000,
        duration: 90, // days
        rewards: 100, // number of rewards
        icon: '🏆',
        available: true,
        seasonal: true
    }
}

// Transaction Types
export const TRANSACTION_TYPES = {
    PURCHASE: 'purchase',
    EARNED: 'earned',
    SPENT: 'spent',
    REFUND: 'refund',
    BONUS: 'bonus',
    ADMIN_GRANT: 'admin_grant'
}

// Earning Sources
export const EARNING_SOURCES = {
    DAILY_MISSION: 'daily_mission',
    WEEKLY_MISSION: 'weekly_mission',
    ACHIEVEMENT: 'achievement',
    TOURNAMENT_REWARD: 'tournament_reward',
    LEVEL_UP: 'level_up',
    FIRST_WIN_BONUS: 'first_win_bonus',
    LOGIN_STREAK: 'login_streak',
    REFERRAL_BONUS: 'referral_bonus'
}

// Daily/Weekly Missions Configuration
export const MISSIONS = {
    daily: {
        playGames: {
            id: 'daily_play_games',
            name: 'Play 3 Games',
            description: 'Complete 3 matches in any mode',
            requirement: 3,
            reward: 10,
            type: 'daily'
        },
        winGames: {
            id: 'daily_win_games',
            name: 'Win 2 Games',
            description: 'Win 2 matches in any mode',
            requirement: 2,
            reward: 15,
            type: 'daily'
        },
        playCards: {
            id: 'daily_play_cards',
            name: 'Play 20 Cards',
            description: 'Play 20 cards across all matches',
            requirement: 20,
            reward: 5,
            type: 'daily'
        }
    },
    weekly: {
        winStreak: {
            id: 'weekly_win_streak',
            name: 'Win Streak',
            description: 'Win 5 games in a row',
            requirement: 5,
            reward: 50,
            type: 'weekly'
        },
        playRanked: {
            id: 'weekly_play_ranked',
            name: 'Ranked Warrior',
            description: 'Play 10 ranked matches',
            requirement: 10,
            reward: 75,
            type: 'weekly'
        },
        collectCards: {
            id: 'weekly_collect_cards',
            name: 'Card Collector',
            description: 'Open 5 card packs',
            requirement: 5,
            reward: 100,
            type: 'weekly'
        }
    }
}

// Achievement Configuration
export const ACHIEVEMENTS = {
    firstWin: {
        id: 'first_win',
        name: 'First Victory',
        description: 'Win your first match',
        reward: 25,
        icon: '🏆',
        category: 'gameplay'
    },
    cardCollector: {
        id: 'card_collector_100',
        name: 'Card Collector',
        description: 'Collect 100 unique cards',
        reward: 100,
        icon: '📚',
        category: 'collection'
    },
    deckMaster: {
        id: 'deck_master',
        name: 'Deck Master',
        description: 'Create 10 different decks',
        reward: 50,
        icon: '🎯',
        category: 'deckbuilding'
    },
    winStreak10: {
        id: 'win_streak_10',
        name: 'Unstoppable',
        description: 'Win 10 games in a row',
        reward: 200,
        icon: '🔥',
        category: 'gameplay'
    }
}

// Utility Functions
export const RoxChipsUtils = {
    // Convert USD to Rox Chips (base rate)
    usdToRoxChips(usd) {
        return Math.floor(usd * 20) // 20 chips per dollar
    },
    
    // Convert Rox Chips to USD
    roxChipsToUsd(chips) {
        return chips * 0.05
    },
    
    // Format Rox Chips for display
    formatRoxChips(chips) {
        if (chips >= 1000000) {
            return `${(chips / 1000000).toFixed(1)}M`
        } else if (chips >= 1000) {
            return `${(chips / 1000).toFixed(1)}K`
        }
        return chips.toLocaleString()
    },
    
    // Get bundle by ID
    getBundle(bundleId) {
        return ROX_CHIPS_BUNDLES[bundleId]
    },
    
    // Get store item by ID
    getStoreItem(itemId) {
        return STORE_ITEMS[itemId]
    },
    
    // Get items by category
    getItemsByCategory(category) {
        return Object.values(STORE_ITEMS).filter(item => item.category === category)
    },
    
    // Calculate total cost for multiple items
    calculateTotalCost(items) {
        return items.reduce((total, item) => {
            const storeItem = this.getStoreItem(item.id)
            return total + (storeItem ? storeItem.price * (item.quantity || 1) : 0)
        }, 0)
    }
}

// Firebase Schema Definitions
export const FIREBASE_COLLECTIONS = {
    // User wallet/balance
    userWallets: 'user_wallets',
    
    // Transaction history
    transactions: 'transactions',
    
    // Purchase history
    purchases: 'purchases',
    
    // User inventory (owned cosmetics, etc.)
    userInventory: 'user_inventory',
    
    // Mission progress
    userMissions: 'user_missions',
    
    // Achievement progress
    userAchievements: 'user_achievements',
    
    // Store configuration (for dynamic updates)
    storeConfig: 'store_config'
}

// User Wallet Schema
export const createUserWallet = (userId) => ({
    userId,
    roxChipsBalance: 0,
    totalEarned: 0,
    totalSpent: 0,
    totalPurchased: 0,
    lastUpdated: new Date(),
    createdAt: new Date()
})

// Transaction Schema
export const createTransaction = (userId, type, amount, source, metadata = {}) => ({
    userId,
    type, // TRANSACTION_TYPES
    amount,
    source, // What caused this transaction
    metadata, // Additional data (item purchased, mission completed, etc.)
    timestamp: new Date(),
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
})

// Purchase Schema (for Stripe integration)
export const createPurchase = (userId, bundleId, stripeSessionId, amount) => ({
    userId,
    bundleId,
    stripeSessionId,
    amountUSD: amount,
    roxChipsReceived: ROX_CHIPS_BUNDLES[bundleId]?.totalChips || 0,
    status: 'pending', // pending, completed, failed, refunded
    createdAt: new Date(),
    completedAt: null
})

// User Inventory Schema
export const createUserInventory = (userId) => ({
    userId,
    ownedItems: [], // Array of item IDs
    equippedItems: {
        cardBack: null,
        avatar: null,
        board: null
    },
    createdAt: new Date(),
    lastUpdated: new Date()
})

export default {
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
}

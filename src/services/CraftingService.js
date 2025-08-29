export class CraftingService {
    constructor() {
        this.scrapValues = {
            'common': 5,
            'uncommon': 20,
            'rare': 100,
            'mythic': 400
        }
        
        this.craftCosts = {
            'common': 40,
            'uncommon': 100,
            'rare': 400,
            'mythic': 1600
        }
    }
    
    /**
     * Get the scrap value for a card based on its rarity
     */
    getScrapValue(rarity) {
        return this.scrapValues[rarity.toLowerCase()] || 0
    }
    
    /**
     * Get the craft cost for a card based on its rarity
     */
    getCraftCost(rarity) {
        return this.craftCosts[rarity.toLowerCase()] || 0
    }
    
    /**
     * Scrap a card and return the dust value
     */
    async scrapCard(card) {
        const dustValue = this.getScrapValue(card.rarity)
        
        console.log(`🔨 Scrapping ${card.name} (${card.rarity}) for ${dustValue} Cyber Dust`)
        
        // Add dust to player's balance
        await this.addCyberDust(dustValue)
        
        // Remove card from collection (handled by collection manager)
        
        return {
            success: true,
            dustGained: dustValue,
            message: `Scrapped ${card.name} for ${dustValue} Cyber Dust`
        }
    }
    
    /**
     * Scrap multiple cards at once
     */
    async scrapCards(cards) {
        let totalDust = 0
        const results = []
        
        for (const card of cards) {
            const dustValue = this.getScrapValue(card.rarity)
            totalDust += dustValue
            results.push({
                card: card.name,
                rarity: card.rarity,
                dust: dustValue
            })
        }
        
        console.log(`🔨 Mass scrapping ${cards.length} cards for ${totalDust} total Cyber Dust`)
        
        // Add dust to player's balance
        await this.addCyberDust(totalDust)
        
        return {
            success: true,
            totalDust: totalDust,
            scrapResults: results,
            message: `Scrapped ${cards.length} cards for ${totalDust} Cyber Dust`
        }
    }
    
    /**
     * Check if player can craft a specific card
     */
    canCraftCard(rarity, playerDust) {
        const cost = this.getCraftCost(rarity)
        return playerDust >= cost
    }
    
    /**
     * Craft a specific card
     */
    async craftCard(cardTemplate, rarity) {
        const cost = this.getCraftCost(rarity)
        const playerDust = await this.getCyberDust()
        
        if (!this.canCraftCard(rarity, playerDust)) {
            return {
                success: false,
                message: `Not enough Cyber Dust. Need ${cost}, have ${playerDust}`
            }
        }
        
        console.log(`⚡ Crafting ${cardTemplate.name} (${rarity}) for ${cost} Cyber Dust`)
        
        // Deduct dust
        await this.spendCyberDust(cost)
        
        // Create the crafted card
        const craftedCard = {
            ...cardTemplate,
            id: `crafted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            rarity: rarity,
            isCrafted: true,
            craftedAt: new Date().toISOString()
        }
        
        return {
            success: true,
            card: craftedCard,
            dustSpent: cost,
            message: `Crafted ${cardTemplate.name} for ${cost} Cyber Dust`
        }
    }
    
    /**
     * Get player's current Cyber Dust balance
     */
    async getCyberDust() {
        if (window.technorox?.authManager?.userProfile) {
            return window.technorox.authManager.userProfile.cyberDust || 0
        }
        return 0
    }
    
    /**
     * Add Cyber Dust to player's balance
     */
    async addCyberDust(amount) {
        if (window.technorox?.authManager?.userProfile) {
            window.technorox.authManager.userProfile.cyberDust = 
                (window.technorox.authManager.userProfile.cyberDust || 0) + amount
            
            // Save to storage/database
            this.saveCyberDustBalance()
            
            // Notify UI
            window.technorox.uiManager?.showSuccess(`+${amount} Cyber Dust`)
            
            return window.technorox.authManager.userProfile.cyberDust
        }
        return 0
    }
    
    /**
     * Spend Cyber Dust from player's balance
     */
    async spendCyberDust(amount) {
        if (window.technorox?.authManager?.userProfile) {
            const currentDust = window.technorox.authManager.userProfile.cyberDust || 0
            
            if (currentDust >= amount) {
                window.technorox.authManager.userProfile.cyberDust = currentDust - amount
                
                // Save to storage/database
                this.saveCyberDustBalance()
                
                return window.technorox.authManager.userProfile.cyberDust
            }
        }
        return false
    }
    
    /**
     * Save Cyber Dust balance to localStorage (in demo mode)
     */
    saveCyberDustBalance() {
        if (window.technorox?.authManager?.userProfile) {
            localStorage.setItem('technorox_cyberDust', 
                window.technorox.authManager.userProfile.cyberDust.toString())
        }
    }
    
    /**
     * Load Cyber Dust balance from localStorage (in demo mode)
     */
    loadCyberDustBalance() {
        const saved = localStorage.getItem('technorox_cyberDust')
        if (saved && window.technorox?.authManager?.userProfile) {
            window.technorox.authManager.userProfile.cyberDust = parseInt(saved) || 0
        }
    }
    
    /**
     * Get crafting recommendations based on player's collection
     */
    getCraftingRecommendations(collection) {
        // Analyze collection and suggest cards to craft
        const recommendations = []
        
        // Example logic: recommend cards that would complete sets or improve deck archetypes
        // This would be more sophisticated in a real implementation
        
        return recommendations
    }
    
    /**
     * Get bulk scrap recommendations (duplicate cards, low-value cards)
     */
    getScrapRecommendations(collection) {
        const recommendations = []
        
        // Find duplicate cards (keep max 4 of each)
        const cardCounts = {}
        collection.forEach(card => {
            const key = card.name
            cardCounts[key] = (cardCounts[key] || [])
            cardCounts[key].push(card)
        })
        
        // Recommend scrapping excess duplicates
        Object.entries(cardCounts).forEach(([name, cards]) => {
            if (cards.length > 4) {
                const excess = cards.slice(4) // Keep first 4, scrap the rest
                recommendations.push({
                    type: 'excess_duplicates',
                    cards: excess,
                    reason: `You have ${cards.length} copies of ${name}. Consider scrapping ${excess.length} excess copies.`,
                    dustValue: excess.reduce((sum, card) => sum + this.getScrapValue(card.rarity), 0)
                })
            }
        })
        
        return recommendations
    }
}

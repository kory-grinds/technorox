export class Player {
    constructor(id, name, deck = []) {
        this.id = id
        this.name = name
        this.deck = [...deck] // Copy the deck
        this.hand = []
        this.battlefield = []
        this.graveyard = []
        this.coreIntegrity = 50 // Starting life total
        this.dataStreams = 3 // Starting energy
        this.maxDataStreams = 3
        this.isReady = false
        this.turnActions = {
            hasDrawn: false,
            cardsPlayed: 0,
            attacksMade: 0
        }
    }
    
    // Shuffle the deck
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
        }
    }
    
    // Draw a card from deck to hand
    drawCard() {
        if (this.deck.length === 0) {
            return null // Deck is empty
        }
        
        const card = this.deck.pop()
        this.hand.push(card)
        return card
    }
    
    // Draw multiple cards
    drawCards(count) {
        const drawnCards = []
        for (let i = 0; i < count; i++) {
            const card = this.drawCard()
            if (card) {
                drawnCards.push(card)
            }
        }
        return drawnCards
    }
    
    // Play a card from hand
    playCard(cardId) {
        const cardIndex = this.hand.findIndex(card => card.id === cardId)
        if (cardIndex === -1) {
            throw new Error('Card not found in hand')
        }
        
        const card = this.hand[cardIndex]
        
        // Check if player has enough data streams
        if (card.dataStreamCost > this.dataStreams) {
            throw new Error('Not enough data streams')
        }
        
        // Remove card from hand
        this.hand.splice(cardIndex, 1)
        
        // Pay data stream cost
        this.dataStreams -= card.dataStreamCost
        
        // Add to battlefield or resolve effect
        if (card.type === 'creature') {
            card.summonedThisTurn = true
            card.hasAttacked = false
            card.attachedMods = []
            this.battlefield.push(card)
        }
        
        this.turnActions.cardsPlayed++
        
        return card
    }
    
    // Attack with a creature
    attackWithCreature(creatureId, targetId) {
        const creature = this.battlefield.find(c => c.id === creatureId)
        if (!creature) {
            throw new Error('Creature not found on battlefield')
        }
        
        if (creature.hasAttacked) {
            throw new Error('Creature has already attacked this turn')
        }
        
        if (creature.summonedThisTurn && !creature.keywords?.includes('Fast')) {
            throw new Error('Creature has summoning sickness')
        }
        
        creature.hasAttacked = true
        this.turnActions.attacksMade++
        
        return creature
    }
    
    // Take damage
    takeDamage(amount) {
        this.coreIntegrity -= amount
        if (this.coreIntegrity < 0) {
            this.coreIntegrity = 0
        }
        return this.coreIntegrity
    }
    
    // Heal
    heal(amount) {
        this.coreIntegrity += amount
        if (this.coreIntegrity > 50) {
            this.coreIntegrity = 50 // Max health
        }
        return this.coreIntegrity
    }
    
    // Add data streams (energy)
    addDataStreams(amount) {
        this.dataStreams += amount
        if (this.dataStreams > this.maxDataStreams) {
            this.dataStreams = this.maxDataStreams
        }
        return this.dataStreams
    }
    
    // Increase max data streams
    increaseMaxDataStreams(amount = 1) {
        this.maxDataStreams += amount
        if (this.maxDataStreams > 10) {
            this.maxDataStreams = 10 // Game maximum
        }
        this.dataStreams = this.maxDataStreams // Refill to max
        return this.maxDataStreams
    }
    
    // Start turn - reset turn actions and add data stream
    startTurn() {
        this.turnActions = {
            hasDrawn: false,
            cardsPlayed: 0,
            attacksMade: 0
        }
        
        // Increase max data streams (up to 10)
        if (this.maxDataStreams < 10) {
            this.increaseMaxDataStreams(1)
        } else {
            this.dataStreams = this.maxDataStreams // Just refill
        }
        
        // Reset creature attack status
        this.battlefield.forEach(creature => {
            if (creature.type === 'creature') {
                creature.hasAttacked = false
                creature.summonedThisTurn = false
            }
        })
    }
    
    // End turn
    endTurn() {
        // Any end-of-turn effects would go here
    }
    
    // Move creature to graveyard
    destroyCreature(creatureId) {
        const creatureIndex = this.battlefield.findIndex(c => c.id === creatureId)
        if (creatureIndex === -1) {
            return null
        }
        
        const creature = this.battlefield[creatureIndex]
        this.battlefield.splice(creatureIndex, 1)
        this.graveyard.push(creature)
        
        return creature
    }
    
    // Attach mod to creature
    attachMod(modCard, creatureId) {
        const creature = this.battlefield.find(c => c.id === creatureId)
        if (!creature || creature.type !== 'creature') {
            throw new Error('Invalid target for mod')
        }
        
        if (creature.attachedMods.length >= creature.modSlots) {
            throw new Error('Creature has no available mod slots')
        }
        
        creature.attachedMods.push(modCard)
        
        // Apply stat modifications
        if (modCard.statModifiers) {
            Object.keys(modCard.statModifiers).forEach(stat => {
                if (creature[stat] !== undefined) {
                    creature[stat] += modCard.statModifiers[stat]
                }
            })
        }
        
        return creature
    }
    
    // Get public state (visible to opponent)
    getPublicState() {
        return {
            id: this.id,
            name: this.name,
            handSize: this.hand.length,
            deckSize: this.deck.length,
            battlefield: this.battlefield.map(card => ({...card})), // Full battlefield info
            graveyardSize: this.graveyard.length,
            coreIntegrity: this.coreIntegrity,
            dataStreams: this.dataStreams,
            maxDataStreams: this.maxDataStreams,
            isReady: this.isReady
        }
    }
    
    // Get full state (for the player themselves)
    getFullState() {
        return {
            ...this.getPublicState(),
            hand: [...this.hand],
            deck: [...this.deck],
            graveyard: [...this.graveyard],
            turnActions: {...this.turnActions}
        }
    }
    
    // Validate deck (40 cards)
    validateDeck() {
        const errors = []
        
        if (this.deck.length !== 40) {
            errors.push(`Deck must contain exactly 40 cards (current: ${this.deck.length})`)
        }
        
        // Check for card limits (max 4 of any card except basic lands)
        const cardCounts = {}
        this.deck.forEach(card => {
            cardCounts[card.name] = (cardCounts[card.name] || 0) + 1
        })
        
        Object.entries(cardCounts).forEach(([cardName, count]) => {
            if (count > 4) {
                errors.push(`Too many copies of "${cardName}" (max 4, found ${count})`)
            }
        })
        
        return {
            isValid: errors.length === 0,
            errors
        }
    }
}

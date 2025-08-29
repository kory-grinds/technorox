export class GameState {
    constructor(player1, player2) {
        this.player1 = player1
        this.player2 = player2
        this.currentPlayer = player1
        this.turnNumber = 1
        this.phase = 'draw' // draw, main, combat, end
        this.gameEnded = false
        this.winner = null
        this.endReason = null
        this.gameLog = []
        this.createdAt = new Date()
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1
        this.turnNumber++
        this.phase = 'draw'
        
        this.logEvent(`Turn ${this.turnNumber}: ${this.currentPlayer.name}'s turn begins`)
    }
    
    getOpponent(player) {
        return player === this.player1 ? this.player2 : this.player1
    }
    
    getCurrentPlayer() {
        return this.currentPlayer
    }
    
    getOpponentPlayer() {
        return this.getOpponent(this.currentPlayer)
    }
    
    setPhase(phase) {
        this.phase = phase
        this.logEvent(`Phase changed to: ${phase}`)
    }
    
    logEvent(message, data = null) {
        const logEntry = {
            turn: this.turnNumber,
            phase: this.phase,
            player: this.currentPlayer.name,
            message,
            data,
            timestamp: new Date()
        }
        
        this.gameLog.push(logEntry)
        console.log(`[Game Log] ${message}`, data)
    }
    
    getGameState() {
        return {
            player1: this.player1.getPublicState(),
            player2: this.player2.getPublicState(),
            currentPlayer: this.currentPlayer.id,
            turnNumber: this.turnNumber,
            phase: this.phase,
            gameEnded: this.gameEnded,
            winner: this.winner?.id || null,
            endReason: this.endReason
        }
    }
    
    // Get state visible to a specific player (hides opponent's hand)
    getPlayerState(playerId) {
        const state = this.getGameState()
        
        if (playerId === this.player1.id) {
            state.player1.hand = this.player1.hand
            state.player2.hand = this.player2.hand.map(() => ({ hidden: true }))
        } else {
            state.player2.hand = this.player2.hand
            state.player1.hand = this.player1.hand.map(() => ({ hidden: true }))
        }
        
        return state
    }
    
    canPlayCard(card, player) {
        // Check if it's the player's turn
        if (player !== this.currentPlayer) {
            return { canPlay: false, reason: 'Not your turn' }
        }
        
        // Check phase
        if (this.phase !== 'main') {
            return { canPlay: false, reason: 'Can only play cards during main phase' }
        }
        
        // Check data stream cost
        if (card.dataStreamCost > player.dataStreams) {
            return { canPlay: false, reason: 'Not enough data streams' }
        }
        
        // Check if card is in hand
        if (!player.hand.find(c => c.id === card.id)) {
            return { canPlay: false, reason: 'Card not in hand' }
        }
        
        return { canPlay: true }
    }
    
    canAttack(creature, attacker, target) {
        // Check if it's the attacker's turn
        if (attacker !== this.currentPlayer) {
            return { canAttack: false, reason: 'Not your turn' }
        }
        
        // Check phase
        if (this.phase !== 'combat') {
            return { canAttack: false, reason: 'Can only attack during combat phase' }
        }
        
        // Check if creature has already attacked
        if (creature.hasAttacked) {
            return { canAttack: false, reason: 'Creature has already attacked this turn' }
        }
        
        // Check if creature has summoning sickness (played this turn)
        if (creature.summonedThisTurn && !creature.keywords?.includes('Fast')) {
            return { canAttack: false, reason: 'Creature has summoning sickness' }
        }
        
        return { canAttack: true }
    }
    
    getValidTargets(card, player) {
        const targets = []
        const opponent = this.getOpponent(player)
        
        switch (card.type) {
            case 'creature':
                // Creatures can be played to battlefield (no specific target needed)
                return []
                
            case 'mod':
                // Mods target friendly creatures
                targets.push(...player.battlefield.filter(c => c.type === 'creature'))
                break
                
            case 'data':
                // Data cards can target various things based on their effects
                if (card.targets?.includes('creature')) {
                    targets.push(...player.battlefield.filter(c => c.type === 'creature'))
                    targets.push(...opponent.battlefield.filter(c => c.type === 'creature'))
                }
                if (card.targets?.includes('player')) {
                    targets.push(player, opponent)
                }
                break
        }
        
        return targets
    }
}

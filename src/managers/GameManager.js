import { GameState } from '../game/GameState.js'
import { Player } from '../game/Player.js'
import { GameEngine } from '../game/GameEngine.js'

export class GameManager {
    constructor() {
        this.currentGame = null
        this.gameEngine = new GameEngine()
        this.isInGame = false
        this.gameListeners = []
    }
    
    async startSinglePlayerGame(playerDeck) {
        try {
            const player = new Player('player', 'Player', playerDeck)
            const aiPlayer = new Player('ai', 'AI Opponent', this.generateAIDeck())
            
            this.currentGame = new GameState(player, aiPlayer)
            this.isInGame = true
            
            // Initialize game
            await this.gameEngine.initializeGame(this.currentGame)
            
            this.notifyGameListeners('game_started', this.currentGame)
            
            return this.currentGame
        } catch (error) {
            console.error('Error starting single player game:', error)
            throw error
        }
    }
    
    async startMultiplayerGame(playerDeck, opponentId) {
        try {
            // This would connect to matchmaking service
            // For now, we'll implement basic local multiplayer
            const player = new Player('player', 'Player', playerDeck)
            const opponent = new Player('opponent', 'Opponent', this.generateAIDeck())
            
            this.currentGame = new GameState(player, opponent)
            this.isInGame = true
            
            await this.gameEngine.initializeGame(this.currentGame)
            
            this.notifyGameListeners('game_started', this.currentGame)
            
            return this.currentGame
        } catch (error) {
            console.error('Error starting multiplayer game:', error)
            throw error
        }
    }
    
    async playCard(cardId, targetId = null, modSlotIndex = null) {
        if (!this.currentGame || !this.isInGame) {
            throw new Error('No active game')
        }
        
        try {
            const result = await this.gameEngine.playCard(
                this.currentGame, 
                cardId, 
                targetId, 
                modSlotIndex
            )
            
            this.notifyGameListeners('card_played', result)
            
            // Check for game end conditions
            await this.checkGameEnd()
            
            return result
        } catch (error) {
            console.error('Error playing card:', error)
            throw error
        }
    }
    
    async attackWithCreature(creatureId, targetId) {
        if (!this.currentGame || !this.isInGame) {
            throw new Error('No active game')
        }
        
        try {
            const result = await this.gameEngine.attack(
                this.currentGame,
                creatureId,
                targetId
            )
            
            this.notifyGameListeners('attack_performed', result)
            
            await this.checkGameEnd()
            
            return result
        } catch (error) {
            console.error('Error attacking:', error)
            throw error
        }
    }
    
    async endTurn() {
        if (!this.currentGame || !this.isInGame) {
            throw new Error('No active game')
        }
        
        try {
            const result = await this.gameEngine.endTurn(this.currentGame)
            
            this.notifyGameListeners('turn_ended', result)
            
            // If it's AI turn, play AI turn
            if (this.currentGame.currentPlayer.id === 'ai') {
                setTimeout(() => this.playAITurn(), 1000)
            }
            
            return result
        } catch (error) {
            console.error('Error ending turn:', error)
            throw error
        }
    }
    
    async playAITurn() {
        if (!this.currentGame || this.currentGame.currentPlayer.id !== 'ai') {
            return
        }
        
        try {
            // Simple AI logic - play random valid cards
            const aiPlayer = this.currentGame.currentPlayer
            const hand = aiPlayer.hand
            
            // Try to play cards
            for (const card of hand) {
                if (card.dataStreamCost <= aiPlayer.dataStreams) {
                    try {
                        await this.playCard(card.id)
                        break // Play one card per turn for now
                    } catch (error) {
                        // Card couldn't be played, try next
                        continue
                    }
                }
            }
            
            // Try to attack with creatures
            const creatures = aiPlayer.battlefield.filter(card => 
                card.type === 'creature' && !card.hasAttacked
            )
            
            for (const creature of creatures) {
                const opponent = this.currentGame.getOpponent(aiPlayer)
                try {
                    // Attack opponent directly if no defenders
                    await this.attackWithCreature(creature.id, opponent.id)
                    break // One attack per turn for now
                } catch (error) {
                    continue
                }
            }
            
            // End AI turn
            setTimeout(() => this.endTurn(), 1000)
            
        } catch (error) {
            console.error('Error in AI turn:', error)
            // End turn anyway
            this.endTurn()
        }
    }
    
    async checkGameEnd() {
        if (!this.currentGame) return
        
        const player1 = this.currentGame.player1
        const player2 = this.currentGame.player2
        
        let winner = null
        let reason = null
        
        // Check core integrity
        if (player1.coreIntegrity <= 0) {
            winner = player2
            reason = 'core_destroyed'
        } else if (player2.coreIntegrity <= 0) {
            winner = player1
            reason = 'core_destroyed'
        }
        
        // Check deck out
        if (player1.deck.length === 0 && player1.hand.length === 0) {
            winner = player2
            reason = 'deck_out'
        } else if (player2.deck.length === 0 && player2.hand.length === 0) {
            winner = player1
            reason = 'deck_out'
        }
        
        if (winner) {
            this.currentGame.gameEnded = true
            this.currentGame.winner = winner
            this.currentGame.endReason = reason
            this.isInGame = false
            
            this.notifyGameListeners('game_ended', {
                winner,
                reason,
                gameState: this.currentGame
            })
        }
    }
    
    generateAIDeck() {
        // Generate a basic AI deck with sample cards
        // Import is handled dynamically to avoid circular dependencies
        const deck = []
        
        // Basic AI deck structure - replace with actual card data
        const basicCards = [
            { name: 'Cyber Wolf', type: 'creature', dataStreamCost: 2, attack: 2, defense: 1, health: 3 },
            { name: 'Data Spike', type: 'data', dataStreamCost: 1 },
            { name: 'Neural Implant', type: 'mod', dataStreamCost: 1 }
        ]
        
        // Add multiple copies of basic cards to make a 40-card deck
        for (let i = 0; i < 40; i++) {
            const baseCard = basicCards[i % basicCards.length]
            deck.push({ ...baseCard, id: `ai_card_${i}` })
        }
        
        return deck
    }
    
    getCurrentGame() {
        return this.currentGame
    }
    
    isGameActive() {
        return this.isInGame && this.currentGame && !this.currentGame.gameEnded
    }
    
    onGameEvent(callback) {
        this.gameListeners.push(callback)
    }
    
    removeGameListener(callback) {
        const index = this.gameListeners.indexOf(callback)
        if (index > -1) {
            this.gameListeners.splice(index, 1)
        }
    }
    
    notifyGameListeners(event, data) {
        this.gameListeners.forEach(callback => {
            try {
                callback(event, data)
            } catch (error) {
                console.error('Error in game listener:', error)
            }
        })
    }
    
    forfeitGame() {
        if (this.currentGame && this.isInGame) {
            const opponent = this.currentGame.getOpponent(this.currentGame.player1)
            this.currentGame.gameEnded = true
            this.currentGame.winner = opponent
            this.currentGame.endReason = 'forfeit'
            this.isInGame = false
            
            this.notifyGameListeners('game_ended', {
                winner: opponent,
                reason: 'forfeit',
                gameState: this.currentGame
            })
        }
    }
}

import Phaser from 'phaser'
import { BasePage } from './BasePage.js'
import { GameScene } from '../game/scenes/GameScene.js'

export default class GamePage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.phaserGame = null
        this.gameManager = null
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'h-screen flex flex-col'
        
        content.innerHTML = `
            <!-- Game Header -->
            <div class="bg-cyber-dark border-b border-neon-cyan/30 p-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <button id="exitGame" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </button>
                        <h1 class="text-xl font-cyber font-bold text-neon-cyan">Technorox Arena</h1>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <div id="gameStatus" class="text-sm text-gray-400">
                            Initializing...
                        </div>
                        <button id="settingsBtn" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Game Container -->
            <div class="flex-1 relative">
                <!-- Phaser Game Canvas Container -->
                <div id="gameCanvas" class="w-full h-full bg-gradient-to-br from-neon-purple/20 to-cyber-dark"></div>
                
                <!-- Game UI Overlay -->
                <div id="gameUI" class="absolute inset-0 pointer-events-none">
                    <!-- Player Info -->
                    <div class="absolute top-4 left-4 pointer-events-auto">
                        <div class="cyber-card p-3">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-full flex items-center justify-center">
                                    <span class="text-black font-bold text-sm">P1</span>
                                </div>
                                <div>
                                    <div class="font-medium text-white text-sm" id="playerName">Player</div>
                                    <div class="flex items-center space-x-2 text-xs">
                                        <span class="text-red-400">❤️ <span id="playerHealth">50</span></span>
                                        <span class="text-neon-cyan">⚡ <span id="playerEnergy">3</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Opponent Info -->
                    <div class="absolute top-4 right-4 pointer-events-auto">
                        <div class="cyber-card p-3">
                            <div class="flex items-center space-x-3">
                                <div>
                                    <div class="font-medium text-white text-sm text-right" id="opponentName">Opponent</div>
                                    <div class="flex items-center justify-end space-x-2 text-xs">
                                        <span class="text-red-400">❤️ <span id="opponentHealth">50</span></span>
                                        <span class="text-neon-cyan">⚡ <span id="opponentEnergy">3</span></span>
                                    </div>
                                </div>
                                <div class="w-10 h-10 bg-gradient-to-br from-neon-magenta to-purple-500 rounded-full flex items-center justify-center">
                                    <span class="text-black font-bold text-sm">P2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Turn Indicator -->
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                        <div id="turnIndicator" class="cyber-card px-6 py-3 text-center hidden">
                            <div class="neon-text font-cyber font-bold text-lg" id="turnText">Your Turn</div>
                        </div>
                    </div>
                    
                    <!-- Game Controls -->
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                        <div class="flex items-center space-x-4">
                            <button id="endTurnBtn" class="cyber-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                End Turn
                            </button>
                            <button id="forfeitBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Forfeit
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Loading Screen -->
                <div id="loadingScreen" class="absolute inset-0 bg-cyber-dark flex items-center justify-center">
                    <div class="text-center">
                        <div class="animate-spin w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h2 class="text-2xl font-cyber font-bold text-neon-cyan mb-2">Initializing Game</h2>
                        <p class="text-gray-400" id="loadingText">Setting up the cyberpunk arena...</p>
                    </div>
                </div>
                
                <!-- Match Found Screen -->
                <div id="matchFoundScreen" class="absolute inset-0 bg-cyber-dark flex items-center justify-center hidden">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-neon">
                            <span class="text-3xl">⚔️</span>
                        </div>
                        <h2 class="text-3xl font-cyber font-bold text-neon-cyan mb-4">Match Found!</h2>
                        <p class="text-xl text-gray-300 mb-2">Opponent: <span id="foundOpponentName" class="text-neon-magenta font-bold">CyberNinja</span></p>
                        <p class="text-gray-400">Preparing battlefield...</p>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        this.gameManager = window.technorox.gameManager
        this.setupEventListeners()
        await this.initializeGame()
    }
    
    setupEventListeners() {
        // Exit game
        this.element.querySelector('#exitGame').addEventListener('click', () => {
            this.exitGame()
        })
        
        // End turn
        this.element.querySelector('#endTurnBtn').addEventListener('click', () => {
            this.endTurn()
        })
        
        // Forfeit
        this.element.querySelector('#forfeitBtn').addEventListener('click', () => {
            this.forfeitGame()
        })
        
        // Settings
        this.element.querySelector('#settingsBtn').addEventListener('click', () => {
            this.showSettings()
        })
        
        // Game manager events
        this.gameManager.onGameEvent((event, data) => {
            this.handleGameEvent(event, data)
        })
    }
    
    async initializeGame() {
        const loadingText = this.element.querySelector('#loadingText')
        
        try {
            // Update loading text
            loadingText.textContent = 'Loading game assets...'
            
            // Initialize Phaser game
            await this.initializePhaser()
            
            loadingText.textContent = 'Generating AI deck...'
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            loadingText.textContent = 'Starting match...'
            
            // Start single player game with AI
            const playerDeck = this.generatePlayerDeck() // Mock deck for now
            const gameState = await this.gameManager.startSinglePlayerGame(playerDeck)
            
            // Hide loading screen
            this.element.querySelector('#loadingScreen').classList.add('hidden')
            
            // Update UI with game state
            this.updateGameUI(gameState)
            
            // Update status
            this.element.querySelector('#gameStatus').textContent = 'In Game'
            
        } catch (error) {
            console.error('Error initializing game:', error)
            window.technorox.uiManager.showError('Failed to initialize game')
            this.exitGame()
        }
    }
    
    async initializePhaser() {
        // Dynamically import Phaser to avoid loading issues
        const Phaser = await import('phaser')
        
        const config = {
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            parent: 'gameCanvas',
            backgroundColor: '#0A0A0F',
            scene: [GameScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        }
        
        this.phaserGame = new Phaser.Game(config)
        
        // Wait for game to be ready
        return new Promise((resolve) => {
            this.phaserGame.events.once('ready', resolve)
        })
    }
    
    generatePlayerDeck() {
        // Mock player deck - replace with actual deck from user's collection
        const deck = []
        const cardTypes = [
            { name: 'Cyber Wolf', type: 'creature', cost: 2 },
            { name: 'Data Hack', type: 'data', cost: 1 },
            { name: 'Neural Link', type: 'mod', cost: 1 }
        ]
        
        for (let i = 0; i < 40; i++) {
            const baseCard = cardTypes[i % cardTypes.length]
            deck.push({ ...baseCard, id: `player_card_${i}` })
        }
        
        return deck
    }
    
    handleGameEvent(event, data) {
        switch (event) {
            case 'game_started':
                this.onGameStarted(data)
                break
            case 'card_played':
                this.onCardPlayed(data)
                break
            case 'attack_performed':
                this.onAttackPerformed(data)
                break
            case 'turn_ended':
                this.onTurnEnded(data)
                break
            case 'game_ended':
                this.onGameEnded(data)
                break
        }
    }
    
    onGameStarted(gameState) {
        console.log('Game started:', gameState)
        this.updateGameUI(gameState)
        this.showTurnIndicator('Game Started!', 2000)
    }
    
    onCardPlayed(data) {
        console.log('Card played:', data)
        this.updateGameUI(data.gameState)
    }
    
    onAttackPerformed(data) {
        console.log('Attack performed:', data)
        // Add visual effects for attacks
    }
    
    onTurnEnded(data) {
        console.log('Turn ended:', data)
        this.updateGameUI(data.gameState)
        
        const isPlayerTurn = data.newCurrentPlayer === 'player'
        this.showTurnIndicator(isPlayerTurn ? 'Your Turn' : 'Opponent Turn', 1500)
        
        // Update end turn button
        const endTurnBtn = this.element.querySelector('#endTurnBtn')
        endTurnBtn.disabled = !isPlayerTurn
    }
    
    onGameEnded(data) {
        console.log('Game ended:', data)
        
        const message = data.winner.id === 'player' ? 'Victory!' : 'Defeat!'
        const color = data.winner.id === 'player' ? 'text-green-400' : 'text-red-400'
        
        // Show game end modal
        const modal = window.technorox.uiManager.createModal(`
            <div class="text-center">
                <h2 class="text-3xl font-cyber font-bold ${color} mb-4">${message}</h2>
                <p class="text-gray-300 mb-6">Reason: ${this.formatEndReason(data.reason)}</p>
                <div class="flex justify-center space-x-4">
                    <button onclick="this.closest('.fixed').remove(); window.technorox.router.navigate('/dashboard')" 
                            class="cyber-button">Return to Dashboard</button>
                    <button onclick="this.closest('.fixed').remove(); location.reload()" 
                            class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
                            Play Again
                    </button>
                </div>
            </div>
        `, { title: 'Game Over' })
    }
    
    updateGameUI(gameState) {
        if (!gameState) return
        
        // Update player info
        const player = gameState.player1
        const opponent = gameState.player2
        
        this.element.querySelector('#playerName').textContent = player.name
        this.element.querySelector('#playerHealth').textContent = player.coreIntegrity
        this.element.querySelector('#playerEnergy').textContent = player.dataStreams
        
        this.element.querySelector('#opponentName').textContent = opponent.name
        this.element.querySelector('#opponentHealth').textContent = opponent.coreIntegrity
        this.element.querySelector('#opponentEnergy').textContent = opponent.dataStreams
        
        // Update turn indicator
        const isPlayerTurn = gameState.currentPlayer === 'player'
        const endTurnBtn = this.element.querySelector('#endTurnBtn')
        endTurnBtn.disabled = !isPlayerTurn
    }
    
    showTurnIndicator(text, duration = 2000) {
        const indicator = this.element.querySelector('#turnIndicator')
        const textElement = this.element.querySelector('#turnText')
        
        textElement.textContent = text
        indicator.classList.remove('hidden')
        
        setTimeout(() => {
            indicator.classList.add('hidden')
        }, duration)
    }
    
    async endTurn() {
        try {
            await this.gameManager.endTurn()
        } catch (error) {
            console.error('Error ending turn:', error)
            window.technorox.uiManager.showError('Failed to end turn')
        }
    }
    
    forfeitGame() {
        const modal = window.technorox.uiManager.createModal(`
            <div class="text-center">
                <h3 class="text-xl font-bold text-red-400 mb-4">Forfeit Match?</h3>
                <p class="text-gray-300 mb-6">Are you sure you want to forfeit this match? This will count as a loss.</p>
                <div class="flex justify-center space-x-4">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onclick="this.closest('.fixed').remove(); window.technorox.gameManager.forfeitGame(); window.technorox.router.navigate('/dashboard')" 
                            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Forfeit
                    </button>
                </div>
            </div>
        `)
    }
    
    showSettings() {
        const modal = window.technorox.uiManager.createModal(`
            <div>
                <h3 class="text-xl font-bold text-neon-cyan mb-4">Game Settings</h3>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Sound Effects</span>
                        <input type="checkbox" checked class="toggle-checkbox">
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Background Music</span>
                        <input type="checkbox" checked class="toggle-checkbox">
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Animations</span>
                        <input type="checkbox" checked class="toggle-checkbox">
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Auto-End Turn</span>
                        <input type="checkbox" class="toggle-checkbox">
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <button onclick="this.closest('.fixed').remove()" class="cyber-button">
                        Close
                    </button>
                </div>
            </div>
        `, { title: 'Settings' })
    }
    
    formatEndReason(reason) {
        const reasons = {
            'core_destroyed': 'Core Integrity depleted',
            'deck_out': 'Deck exhausted',
            'forfeit': 'Player forfeited',
            'disconnect': 'Player disconnected'
        }
        return reasons[reason] || reason
    }
    
    exitGame() {
        if (this.gameManager.isGameActive()) {
            const modal = window.technorox.uiManager.createModal(`
                <div class="text-center">
                    <h3 class="text-xl font-bold text-yellow-400 mb-4">Leave Game?</h3>
                    <p class="text-gray-300 mb-6">You have an active game. Leaving will forfeit the match.</p>
                    <div class="flex justify-center space-x-4">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Stay
                        </button>
                        <button onclick="this.closest('.fixed').remove(); window.technorox.gameManager.forfeitGame(); window.technorox.router.navigate('/dashboard')" 
                                class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Leave Game
                        </button>
                    </div>
                </div>
            `)
        } else {
            window.technorox.router.navigate('/dashboard')
        }
    }
    
    destroy() {
        // Clean up Phaser game
        if (this.phaserGame) {
            this.phaserGame.destroy(true)
            this.phaserGame = null
        }
        
        // Remove game event listeners
        if (this.gameManager) {
            // Remove listeners if needed
        }
        
        super.destroy()
    }
}

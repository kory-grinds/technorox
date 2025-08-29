import { BasePage } from './BasePage.js'
import { firebaseService } from '../services/FirebaseService.js'

export default class PlayerDashboardPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.requiredRole = 'player'
        this.playerStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            winRate: 0,
            currentRank: 'Bronze',
            elo: 1000,
            cardsOwned: 0,
            decksBuilt: 0
        }
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900'
        
        const authManager = window.technorox?.authManager
        const profile = authManager?.getUserProfile()
        const user = authManager?.getCurrentUser()
        
        content.innerHTML = `
            <div class="p-8">
                <!-- Welcome Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-cyber font-bold mb-2">
                        Welcome back, <span class="neon-text">${profile?.displayName || user?.displayName || 'Player'}</span>
                    </h1>
                    <p class="text-gray-400">Ready to dominate the cyber battlefield?</p>
                </div>
                
                <!-- Player Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Current Rank -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Current Rank</p>
                                <p class="text-2xl font-bold text-neon-cyan" id="currentRank">${profile?.stats?.rank || 'Bronze'}</p>
                            </div>
                            <div class="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="rankProgress">Next: Silver (${profile?.stats?.elo || 1000}/1200 ELO)</div>
                    </div>
                    
                    <!-- Win Rate -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Win Rate</p>
                                <p class="text-2xl font-bold text-neon-magenta" id="winRate">${this.calculateWinRate(profile?.stats)}%</p>
                            </div>
                            <div class="w-12 h-12 bg-neon-magenta/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-gray-400" id="gamesPlayed">${profile?.stats?.gamesWon || 0}W / ${(profile?.stats?.gamesPlayed || 0) - (profile?.stats?.gamesWon || 0)}L</div>
                    </div>
                    
                    <!-- Cards Owned -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Cards Owned</p>
                                <p class="text-2xl font-bold text-green-400" id="cardsOwned">${profile?.collection?.length || 0}</p>
                            </div>
                            <div class="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-yellow-400">+3 new this week</div>
                    </div>
                    
                    <!-- ELO Rating -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">ELO Rating</p>
                                <p class="text-2xl font-bold text-yellow-400" id="eloRating">${profile?.stats?.elo || 1000}</p>
                            </div>
                            <div class="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400">+25 this week</div>
                    </div>
                </div>
                
                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Quick Play Section -->
                    <div class="lg:col-span-2">
                        <div class="cyber-card mb-6">
                            <h3 class="text-xl font-bold mb-4 text-neon-cyan">Quick Play</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button class="quick-play-btn bg-gradient-to-r from-neon-cyan/20 to-neon-cyan/10 border border-neon-cyan/30 hover:from-neon-cyan/30 hover:to-neon-cyan/20" onclick="window.technorox?.router?.navigate('/matchmaking')">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                                            <svg class="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                            </svg>
                                        </div>
                                        <div class="text-left">
                                            <div class="text-white font-medium">Find Match</div>
                                            <div class="text-neon-cyan text-sm">Ranked matchmaking</div>
                                        </div>
                                    </div>
                                </button>
                                
                                <button class="quick-play-btn bg-gradient-to-r from-neon-magenta/20 to-neon-magenta/10 border border-neon-magenta/30 hover:from-neon-magenta/30 hover:to-neon-magenta/20" onclick="window.technorox?.router?.navigate('/tournaments')">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-12 h-12 bg-neon-magenta/20 rounded-lg flex items-center justify-center">
                                            <svg class="w-6 h-6 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                            </svg>
                                        </div>
                                        <div class="text-left">
                                            <div class="text-white font-medium">Tournaments</div>
                                            <div class="text-neon-magenta text-sm">Compete for prizes</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Recent Matches -->
                        <div class="cyber-card">
                            <h3 class="text-xl font-bold mb-4 text-neon-cyan">Recent Matches</h3>
                            <div class="space-y-3" id="recentMatches">
                                <!-- Match history will be loaded here -->
                                <div class="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <div>
                                            <div class="text-white font-medium">Victory vs CyberNinja</div>
                                            <div class="text-gray-400 text-sm">Ranked • 2 hours ago</div>
                                        </div>
                                    </div>
                                    <div class="text-green-400 font-medium">+25 ELO</div>
                                </div>
                                
                                <div class="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                                        <div>
                                            <div class="text-white font-medium">Defeat vs TechMaster</div>
                                            <div class="text-gray-400 text-sm">Ranked • 5 hours ago</div>
                                        </div>
                                    </div>
                                    <div class="text-red-400 font-medium">-18 ELO</div>
                                </div>
                                
                                <div class="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <div>
                                            <div class="text-white font-medium">Victory vs DataGhost</div>
                                            <div class="text-gray-400 text-sm">Casual • 1 day ago</div>
                                        </div>
                                    </div>
                                    <div class="text-gray-400 font-medium">Casual</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sidebar Content -->
                    <div>
                        <!-- Daily Challenges -->
                        <div class="cyber-card mb-6">
                            <h3 class="text-xl font-bold mb-4 text-neon-magenta">Daily Challenges</h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                    <div>
                                        <div class="text-white text-sm font-medium">Win 3 Ranked Games</div>
                                        <div class="text-gray-400 text-xs">Progress: 1/3</div>
                                    </div>
                                    <div class="text-neon-cyan text-sm">50 XP</div>
                                </div>
                                
                                <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                    <div>
                                        <div class="text-white text-sm font-medium">Play 10 Cards</div>
                                        <div class="text-gray-400 text-xs">Progress: 7/10</div>
                                    </div>
                                    <div class="text-neon-cyan text-sm">25 XP</div>
                                </div>
                                
                                <div class="flex items-center justify-between p-3 bg-green-600/20 border border-green-400/30 rounded-lg">
                                    <div>
                                        <div class="text-white text-sm font-medium">Open 1 Card Pack</div>
                                        <div class="text-green-400 text-xs">Completed!</div>
                                    </div>
                                    <div class="text-green-400 text-sm">✓ 75 XP</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Collection Highlights -->
                        <div class="cyber-card mb-6">
                            <h3 class="text-xl font-bold mb-4 text-green-400">Collection Highlights</h3>
                            <div class="space-y-3">
                                <div class="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
                                    <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                                        <span class="text-black font-bold text-xs">M</span>
                                    </div>
                                    <div>
                                        <div class="text-white text-sm font-medium">Mythic Cards</div>
                                        <div class="text-gray-400 text-xs">${this.getMythicCount(profile)} owned</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
                                    <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
                                        <span class="text-white font-bold text-xs">R</span>
                                    </div>
                                    <div>
                                        <div class="text-white text-sm font-medium">Rare Cards</div>
                                        <div class="text-gray-400 text-xs">${this.getRareCount(profile)} owned</div>
                                    </div>
                                </div>
                                
                                <button class="w-full text-left p-3 border border-green-400/30 rounded-lg hover:bg-green-400/10 transition-colors" onclick="window.technorox?.router?.navigate('/collection')">
                                    <div class="text-green-400 text-sm font-medium">View Full Collection →</div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="cyber-card">
                            <h3 class="text-xl font-bold mb-4 text-yellow-400">Quick Actions</h3>
                            <div class="space-y-2">
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/deck-builder')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                        </svg>
                                        <span>Build Deck</span>
                                    </div>
                                </button>
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/packs')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                                        </svg>
                                        <span>Open Packs</span>
                                    </div>
                                </button>
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/leaderboard')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                        <span>Leaderboard</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    calculateWinRate(stats) {
        if (!stats || !stats.gamesPlayed || stats.gamesPlayed === 0) return 0
        return Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    }
    
    getMythicCount(profile) {
        // Mock data - in real implementation, filter collection by rarity
        return profile?.collection?.filter(card => card.rarity === 'mythic')?.length || 2
    }
    
    getRareCount(profile) {
        // Mock data - in real implementation, filter collection by rarity
        return profile?.collection?.filter(card => card.rarity === 'rare')?.length || 15
    }
    
    async init() {
        await this.loadPlayerData()
        this.setupEventListeners()
        this.addStyles()
    }
    
    async loadPlayerData() {
        const authManager = window.technorox?.authManager
        const profile = authManager?.getUserProfile()
        
        if (profile) {
            this.playerStats = {
                gamesPlayed: profile.stats?.gamesPlayed || 0,
                gamesWon: profile.stats?.gamesWon || 0,
                winRate: this.calculateWinRate(profile.stats),
                currentRank: profile.stats?.rank || 'Bronze',
                elo: profile.stats?.elo || 1000,
                cardsOwned: profile.collection?.length || 0,
                decksBuilt: profile.decks?.length || 0
            }
        }
        
        // Load additional data from Firebase if needed
        if (firebaseService.isReady()) {
            try {
                // Load recent matches, challenges, etc.
                // This would be implemented based on your game data structure
            } catch (error) {
                console.error('Error loading player data:', error)
            }
        }
    }
    
    setupEventListeners() {
        // Event listeners are handled by onclick attributes in HTML
        // Additional listeners can be added here
    }
    
    addStyles() {
        const style = document.createElement('style')
        style.textContent = `
            .quick-play-btn {
                width: 100%;
                padding: 1rem;
                border-radius: 0.5rem;
                transition: all 0.2s;
                cursor: pointer;
            }
            
            .quick-play-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
        `
        
        if (!document.querySelector('#player-dashboard-styles')) {
            style.id = 'player-dashboard-styles'
            document.head.appendChild(style)
        }
    }
}

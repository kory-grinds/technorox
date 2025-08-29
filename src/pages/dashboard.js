import { BasePage } from './BasePage.js'

export default class DashboardPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'py-8'
        
        const user = window.technorox?.authManager?.getCurrentUser()
        const profile = window.technorox?.authManager?.getUserProfile()
        
        content.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Welcome Header -->
                <section class="mb-8">
                    <div class="cyber-card">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 class="text-3xl font-cyber font-bold mb-2">
                                    Welcome back, <span class="neon-text">${profile?.displayName || user?.displayName || 'Player'}</span>
                                </h1>
                                <p class="text-gray-400">Ready to dominate the cyberpunk grid?</p>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row gap-3">
                                <a href="/game" data-route="/game" class="cyber-button">
                                    Quick Match
                                </a>
                                <a href="/deck-builder" data-route="/deck-builder" class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
                                    Deck Builder
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Quick Stats -->
                <section class="mb-8">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="cyber-card text-center">
                            <div class="text-3xl font-bold text-neon-cyan mb-2" id="playerRank">#42</div>
                            <div class="text-gray-400 text-sm">Current Rank</div>
                        </div>
                        
                        <div class="cyber-card text-center">
                            <div class="text-3xl font-bold text-neon-magenta mb-2" id="playerElo">1456</div>
                            <div class="text-gray-400 text-sm">ELO Rating</div>
                        </div>
                        
                        <div class="cyber-card text-center">
                            <div class="text-3xl font-bold text-green-400 mb-2" id="winRate">67%</div>
                            <div class="text-gray-400 text-sm">Win Rate</div>
                        </div>
                        
                        <div class="cyber-card text-center">
                            <div class="text-3xl font-bold text-yellow-400 mb-2" id="playerTier">Gold</div>
                            <div class="text-gray-400 text-sm">Current Tier</div>
                        </div>
                    </div>
                </section>
                
                <!-- Main Dashboard Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Recent Matches -->
                        <section>
                            <div class="cyber-card">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-2xl font-cyber font-bold text-neon-cyan">Recent Matches</h2>
                                    <a href="/matches" data-route="/matches" class="text-neon-cyan hover:text-white transition-colors text-sm">View All</a>
                                </div>
                                
                                <div class="space-y-3" id="recentMatches">
                                    <!-- Matches will be populated by JavaScript -->
                                </div>
                                
                                <div class="text-center mt-6">
                                    <a href="/game" data-route="/game" class="cyber-button">
                                        Start New Match
                                    </a>
                                </div>
                            </div>
                        </section>
                        
                        <!-- Daily Challenges -->
                        <section>
                            <div class="cyber-card">
                                <h2 class="text-2xl font-cyber font-bold text-neon-magenta mb-6">Daily Challenges</h2>
                                
                                <div class="space-y-4" id="dailyChallenges">
                                    <!-- Challenges will be populated by JavaScript -->
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <!-- Right Column -->
                    <div class="space-y-8">
                        <!-- Quick Actions -->
                        <section>
                            <div class="cyber-card">
                                <h2 class="text-xl font-cyber font-bold text-neon-cyan mb-4">Quick Actions</h2>
                                
                                <div class="space-y-3">
                                    <a href="/collection" data-route="/collection" class="block w-full text-left p-3 rounded-lg border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                                <span class="text-black text-lg">📚</span>
                                            </div>
                                            <div>
                                                <div class="font-medium text-white">View Collection</div>
                                                <div class="text-sm text-gray-400">Browse your cards</div>
                                            </div>
                                        </div>
                                    </a>
                                    
                                    <a href="/packs" data-route="/packs" class="block w-full text-left p-3 rounded-lg border border-gray-600 hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 bg-gradient-to-br from-neon-magenta to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                                <span class="text-black text-lg">📦</span>
                                            </div>
                                            <div>
                                                <div class="font-medium text-white">Open Packs</div>
                                                <div class="text-sm text-gray-400">Get new cards</div>
                                            </div>
                                        </div>
                                    </a>
                                    
                                    <a href="/tournaments" data-route="/tournaments" class="block w-full text-left p-3 rounded-lg border border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                                                <span class="text-black text-lg">🏆</span>
                                            </div>
                                            <div>
                                                <div class="font-medium text-white">Tournaments</div>
                                                <div class="text-sm text-gray-400">Compete for prizes</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </section>
                        
                        <!-- Deck Status -->
                        <section>
                            <div class="cyber-card">
                                <h2 class="text-xl font-cyber font-bold text-neon-magenta mb-4">Your Decks</h2>
                                
                                <div class="space-y-3" id="playerDecks">
                                    <!-- Decks will be populated by JavaScript -->
                                </div>
                                
                                <div class="mt-4">
                                    <a href="/deck-builder" data-route="/deck-builder" class="block w-full text-center py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300">
                                        + Create New Deck
                                    </a>
                                </div>
                            </div>
                        </section>
                        
                        <!-- News & Updates -->
                        <section>
                            <div class="cyber-card">
                                <h2 class="text-xl font-cyber font-bold text-green-400 mb-4">Latest News</h2>
                                
                                <div class="space-y-4" id="newsUpdates">
                                    <!-- News will be populated by JavaScript -->
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    init() {
        this.loadDashboardData()
    }
    
    async loadDashboardData() {
        // Load all dashboard data
        await Promise.all([
            this.loadRecentMatches(),
            this.loadDailyChallenges(),
            this.loadPlayerDecks(),
            this.loadNewsUpdates()
        ])
    }
    
    async loadRecentMatches() {
        const container = this.element.querySelector('#recentMatches')
        
        // Mock data - replace with actual Firebase queries
        const matches = [
            {
                id: 1,
                opponent: 'CyberNinja',
                result: 'win',
                duration: '12:34',
                timeAgo: '2 hours ago',
                elo_change: '+15'
            },
            {
                id: 2,
                opponent: 'DataMancer',
                result: 'loss',
                duration: '8:45',
                timeAgo: '5 hours ago',
                elo_change: '-12'
            },
            {
                id: 3,
                opponent: 'NeonHacker',
                result: 'win',
                duration: '15:22',
                timeAgo: '1 day ago',
                elo_change: '+18'
            }
        ]
        
        container.innerHTML = matches.map(match => `
            <div class="flex items-center justify-between p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center mr-3">
                        <span class="text-white text-sm font-bold">${match.result === 'win' ? 'W' : 'L'}</span>
                    </div>
                    <div>
                        <div class="font-medium text-white">vs ${match.opponent}</div>
                        <div class="text-sm text-gray-400">${match.duration} • ${match.timeAgo}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-medium ${match.elo_change.startsWith('+') ? 'text-green-400' : 'text-red-400'}">
                        ${match.elo_change}
                    </div>
                    <div class="text-xs text-gray-400">ELO</div>
                </div>
            </div>
        `).join('')
    }
    
    async loadDailyChallenges() {
        const container = this.element.querySelector('#dailyChallenges')
        
        // Mock data
        const challenges = [
            {
                title: 'Win 3 matches',
                description: 'Achieve victory in 3 ranked matches',
                progress: 2,
                total: 3,
                reward: '50 Credits',
                completed: false
            },
            {
                title: 'Play 10 creature cards',
                description: 'Summon 10 creatures across all matches',
                progress: 10,
                total: 10,
                reward: '1 Card Pack',
                completed: true
            },
            {
                title: 'Deal 100 damage',
                description: 'Deal a total of 100 damage to opponents',
                progress: 67,
                total: 100,
                reward: '25 Credits',
                completed: false
            }
        ]
        
        container.innerHTML = challenges.map(challenge => `
            <div class="p-4 rounded-lg border ${challenge.completed ? 'border-green-500/50 bg-green-500/10' : 'border-gray-600'} transition-colors">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-white">${challenge.title}</h3>
                    <span class="text-xs px-2 py-1 rounded ${challenge.completed ? 'bg-green-500 text-black' : 'bg-neon-cyan text-black'}">${challenge.reward}</span>
                </div>
                <p class="text-sm text-gray-400 mb-3">${challenge.description}</p>
                <div class="flex items-center justify-between">
                    <div class="flex-1 mr-3">
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="h-2 rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-neon-cyan'}" 
                                 style="width: ${(challenge.progress / challenge.total) * 100}%"></div>
                        </div>
                    </div>
                    <span class="text-sm text-gray-400">${challenge.progress}/${challenge.total}</span>
                </div>
            </div>
        `).join('')
    }
    
    async loadPlayerDecks() {
        const container = this.element.querySelector('#playerDecks')
        
        // Mock data
        const decks = [
            {
                name: 'Cyber Aggro',
                cardCount: 40,
                lastUsed: '2 hours ago',
                winRate: 72,
                isActive: true
            },
            {
                name: 'Control Matrix',
                cardCount: 40,
                lastUsed: '1 day ago',
                winRate: 58,
                isActive: false
            }
        ]
        
        container.innerHTML = decks.map(deck => `
            <div class="p-3 rounded-lg border ${deck.isActive ? 'border-neon-cyan bg-neon-cyan/10' : 'border-gray-600'} hover:border-neon-cyan/60 transition-colors">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-white">${deck.name}</h3>
                    ${deck.isActive ? '<span class="text-xs px-2 py-1 rounded bg-neon-cyan text-black">Active</span>' : ''}
                </div>
                <div class="flex justify-between text-sm text-gray-400">
                    <span>${deck.cardCount} cards</span>
                    <span>${deck.winRate}% WR</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">Used ${deck.lastUsed}</div>
            </div>
        `).join('')
    }
    
    async loadNewsUpdates() {
        const container = this.element.querySelector('#newsUpdates')
        
        // Mock data
        const news = [
            {
                title: 'New Card Set: Neural Storm',
                summary: '50 new cards featuring AI constructs and quantum abilities.',
                timeAgo: '2 days ago',
                type: 'update'
            },
            {
                title: 'Season 1 Championship',
                summary: 'Registration now open for the first official tournament.',
                timeAgo: '1 week ago',
                type: 'event'
            }
        ]
        
        container.innerHTML = news.map(item => `
            <div class="p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <h3 class="font-medium text-white text-sm mb-1">${item.title}</h3>
                <p class="text-xs text-gray-400 mb-2">${item.summary}</p>
                <div class="text-xs text-gray-500">${item.timeAgo}</div>
            </div>
        `).join('')
    }
}

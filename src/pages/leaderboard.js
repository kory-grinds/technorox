import { BasePage } from './BasePage.js'

export default class LeaderboardPage extends BasePage {
    constructor() {
        super()
        this.isPublic = true
        this.leaderboardData = []
        this.currentFilter = 'all'
        this.currentSort = 'elo'
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'py-12'
        
        content.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Header -->
                <section class="text-center mb-12">
                    <h1 class="text-5xl font-cyber font-bold mb-6">
                        <span class="neon-text">Leaderboard</span>
                    </h1>
                    <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                        The elite warriors of the cyberpunk grid. Climb the ranks and claim your place among legends.
                    </p>
                </section>
                
                <!-- Filters and Controls -->
                <section class="mb-8">
                    <div class="cyber-card">
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div class="flex flex-wrap gap-2">
                                <button class="filter-btn active" data-filter="all">All Players</button>
                                <button class="filter-btn" data-filter="bronze">Bronze</button>
                                <button class="filter-btn" data-filter="silver">Silver</button>
                                <button class="filter-btn" data-filter="gold">Gold</button>
                                <button class="filter-btn" data-filter="platinum">Platinum</button>
                                <button class="filter-btn" data-filter="diamond">Diamond</button>
                                <button class="filter-btn" data-filter="master">Master</button>
                            </div>
                            
                            <div class="flex items-center gap-4">
                                <select id="sortSelect" class="cyber-input">
                                    <option value="elo">ELO Rating</option>
                                    <option value="wins">Total Wins</option>
                                    <option value="winrate">Win Rate</option>
                                    <option value="recent">Recent Activity</option>
                                </select>
                                
                                <button id="refreshBtn" class="cyber-button px-4 py-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Top 3 Podium -->
                <section class="mb-12">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="podium">
                        <!-- Podium will be populated by JavaScript -->
                    </div>
                </section>
                
                <!-- Leaderboard Table -->
                <section>
                    <div class="cyber-card">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-neon-cyan/30">
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Rank</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Player</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Tier</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">ELO</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Wins</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Losses</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Win Rate</th>
                                        <th class="text-left py-4 px-4 text-neon-cyan font-cyber">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody id="leaderboardTable">
                                    <!-- Table rows will be populated by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Loading State -->
                        <div id="loadingState" class="text-center py-12">
                            <div class="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p class="text-gray-400">Loading leaderboard data...</p>
                        </div>
                        
                        <!-- Empty State -->
                        <div id="emptyState" class="hidden text-center py-12">
                            <div class="w-20 h-20 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-gray-300">No Players Found</h3>
                            <p class="text-gray-400">No players match the current filter criteria.</p>
                        </div>
                    </div>
                </section>
                
                <!-- Player Stats (if logged in) -->
                ${this.isAuthenticated() ? `
                    <section class="mt-12">
                        <div class="cyber-card">
                            <h2 class="text-2xl font-cyber font-bold mb-6 text-neon-magenta">Your Stats</h2>
                            <div id="playerStats" class="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <!-- Player stats will be populated by JavaScript -->
                            </div>
                        </div>
                    </section>
                ` : ''}
                
                <!-- Season Info -->
                <section class="mt-12">
                    <div class="cyber-card text-center">
                        <h2 class="text-2xl font-cyber font-bold mb-4 text-neon-cyan">Season 1: Neural Uprising</h2>
                        <p class="text-gray-300 mb-6">
                            Compete for exclusive rewards and eternal glory. Season ends in <span class="text-neon-magenta font-bold">23 days</span>.
                        </p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg p-4">
                                <div class="text-2xl mb-2">🥇</div>
                                <h3 class="font-bold text-yellow-400">Champion</h3>
                                <p class="text-sm text-gray-400">Exclusive card back + 1000 credits</p>
                            </div>
                            
                            <div class="bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-lg p-4">
                                <div class="text-2xl mb-2">🥈</div>
                                <h3 class="font-bold text-gray-300">Runner-up</h3>
                                <p class="text-sm text-gray-400">Premium card back + 500 credits</p>
                            </div>
                            
                            <div class="bg-gradient-to-br from-orange-600/20 to-orange-700/20 rounded-lg p-4">
                                <div class="text-2xl mb-2">🥉</div>
                                <h3 class="font-bold text-orange-400">Third Place</h3>
                                <p class="text-sm text-gray-400">Special card back + 250 credits</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `
        
        return content
    }
    
    init() {
        this.setupEventListeners()
        this.loadLeaderboardData()
    }
    
    setupEventListeners() {
        // Filter buttons
        const filterButtons = this.element.querySelectorAll('.filter-btn')
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'))
                e.target.classList.add('active')
                
                // Update filter and reload data
                this.currentFilter = e.target.dataset.filter
                this.loadLeaderboardData()
            })
        })
        
        // Sort dropdown
        const sortSelect = this.element.querySelector('#sortSelect')
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value
            this.loadLeaderboardData()
        })
        
        // Refresh button
        const refreshBtn = this.element.querySelector('#refreshBtn')
        refreshBtn.addEventListener('click', () => {
            this.loadLeaderboardData(true)
        })
    }
    
    async loadLeaderboardData(forceRefresh = false) {
        const loadingState = this.element.querySelector('#loadingState')
        const emptyState = this.element.querySelector('#emptyState')
        const table = this.element.querySelector('#leaderboardTable')
        const podium = this.element.querySelector('#podium')
        
        // Show loading state
        loadingState.classList.remove('hidden')
        emptyState.classList.add('hidden')
        table.innerHTML = ''
        podium.innerHTML = ''
        
        try {
            // Simulate API call - replace with actual Firebase query
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Generate mock data for demonstration
            this.leaderboardData = this.generateMockData()
            
            // Filter and sort data
            let filteredData = this.filterData(this.leaderboardData)
            filteredData = this.sortData(filteredData)
            
            // Hide loading state
            loadingState.classList.add('hidden')
            
            if (filteredData.length === 0) {
                emptyState.classList.remove('hidden')
                return
            }
            
            // Render podium (top 3)
            this.renderPodium(filteredData.slice(0, 3))
            
            // Render table
            this.renderTable(filteredData)
            
            // Render player stats if authenticated
            if (this.isAuthenticated()) {
                this.renderPlayerStats()
            }
            
        } catch (error) {
            console.error('Error loading leaderboard:', error)
            loadingState.classList.add('hidden')
            window.technorox.uiManager.showError('Failed to load leaderboard data')
        }
    }
    
    generateMockData() {
        const names = [
            'CyberNinja', 'NeonHacker', 'DataMancer', 'GridRunner', 'SynthWave',
            'QuantumByte', 'VoidWalker', 'NeuralLink', 'CodeBreaker', 'CyberPunk',
            'DigitalGhost', 'TechnoMage', 'BinaryBeast', 'NetRunner', 'CyberSamurai',
            'DataStream', 'NeonBlade', 'QuantumHack', 'VirtualViper', 'CyberStorm'
        ]
        
        const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master']
        
        return names.map((name, index) => ({
            id: `player_${index}`,
            name,
            tier: tiers[Math.floor(Math.random() * tiers.length)],
            elo: 1000 + Math.floor(Math.random() * 2000),
            wins: Math.floor(Math.random() * 500),
            losses: Math.floor(Math.random() * 300),
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            isOnline: Math.random() > 0.7
        })).map(player => ({
            ...player,
            winRate: player.wins + player.losses > 0 ? 
                ((player.wins / (player.wins + player.losses)) * 100).toFixed(1) : '0.0'
        }))
    }
    
    filterData(data) {
        if (this.currentFilter === 'all') return data
        return data.filter(player => player.tier.toLowerCase() === this.currentFilter)
    }
    
    sortData(data) {
        return data.sort((a, b) => {
            switch (this.currentSort) {
                case 'elo':
                    return b.elo - a.elo
                case 'wins':
                    return b.wins - a.wins
                case 'winrate':
                    return parseFloat(b.winRate) - parseFloat(a.winRate)
                case 'recent':
                    return new Date(b.lastActive) - new Date(a.lastActive)
                default:
                    return b.elo - a.elo
            }
        })
    }
    
    renderPodium(topPlayers) {
        const podium = this.element.querySelector('#podium')
        const positions = [1, 0, 2] // Second, First, Third for visual layout
        const medals = ['🥈', '🥇', '🥉']
        const colors = ['text-gray-300', 'text-yellow-400', 'text-orange-400']
        
        positions.forEach((playerIndex, posIndex) => {
            if (!topPlayers[playerIndex]) return
            
            const player = topPlayers[playerIndex]
            const actualRank = playerIndex + 1
            
            const podiumCard = document.createElement('div')
            podiumCard.className = `cyber-card text-center ${posIndex === 1 ? 'md:order-1 transform md:scale-110' : posIndex === 0 ? 'md:order-0' : 'md:order-2'}`
            
            podiumCard.innerHTML = `
                <div class="text-6xl mb-4">${medals[playerIndex]}</div>
                <div class="text-4xl font-cyber font-bold mb-2 ${colors[playerIndex]}">#${actualRank}</div>
                <h3 class="text-xl font-bold mb-2 ${player.isOnline ? 'text-green-400' : 'text-white'}">
                    ${player.name}
                    ${player.isOnline ? '<span class="text-xs ml-1">●</span>' : ''}
                </h3>
                <div class="text-sm text-gray-400 mb-2">${player.tier}</div>
                <div class="text-2xl font-bold text-neon-cyan mb-2">${player.elo}</div>
                <div class="text-sm text-gray-400">
                    ${player.wins}W / ${player.losses}L (${player.winRate}%)
                </div>
            `
            
            podium.appendChild(podiumCard)
        })
    }
    
    renderTable(data) {
        const table = this.element.querySelector('#leaderboardTable')
        
        data.forEach((player, index) => {
            const row = document.createElement('tr')
            row.className = 'border-b border-gray-700 hover:bg-cyber-light/30 transition-colors'
            
            const rank = index + 1
            const rankColor = rank <= 3 ? 'text-yellow-400' : rank <= 10 ? 'text-neon-cyan' : 'text-gray-300'
            
            row.innerHTML = `
                <td class="py-4 px-4">
                    <span class="font-bold ${rankColor}">#${rank}</span>
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center">
                        <span class="font-medium ${player.isOnline ? 'text-green-400' : 'text-white'}">
                            ${player.name}
                        </span>
                        ${player.isOnline ? '<span class="text-green-400 text-xs ml-2">● Online</span>' : ''}
                    </div>
                </td>
                <td class="py-4 px-4">
                    <span class="px-2 py-1 rounded text-xs font-medium ${this.getTierColor(player.tier)}">
                        ${player.tier}
                    </span>
                </td>
                <td class="py-4 px-4 font-bold text-neon-cyan">${player.elo}</td>
                <td class="py-4 px-4 text-green-400">${player.wins}</td>
                <td class="py-4 px-4 text-red-400">${player.losses}</td>
                <td class="py-4 px-4 font-medium">${player.winRate}%</td>
                <td class="py-4 px-4 text-gray-400 text-sm">${this.formatLastActive(player.lastActive)}</td>
            `
            
            table.appendChild(row)
        })
    }
    
    renderPlayerStats() {
        const statsContainer = this.element.querySelector('#playerStats')
        if (!statsContainer) return
        
        // Mock player stats - replace with actual data
        const playerStats = {
            currentRank: 42,
            elo: 1456,
            wins: 23,
            losses: 17,
            winRate: '57.5',
            tier: 'Gold'
        }
        
        statsContainer.innerHTML = `
            <div class="text-center">
                <div class="text-2xl font-bold text-neon-cyan">#${playerStats.currentRank}</div>
                <div class="text-sm text-gray-400">Current Rank</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-neon-magenta">${playerStats.elo}</div>
                <div class="text-sm text-gray-400">ELO Rating</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-green-400">${playerStats.winRate}%</div>
                <div class="text-sm text-gray-400">Win Rate</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold ${this.getTierColor(playerStats.tier).replace('bg-', 'text-').replace('/20', '')}">${playerStats.tier}</div>
                <div class="text-sm text-gray-400">Current Tier</div>
            </div>
        `
    }
    
    getTierColor(tier) {
        const colors = {
            'Bronze': 'bg-orange-600/20 text-orange-400',
            'Silver': 'bg-gray-400/20 text-gray-300',
            'Gold': 'bg-yellow-500/20 text-yellow-400',
            'Platinum': 'bg-cyan-400/20 text-cyan-300',
            'Diamond': 'bg-blue-500/20 text-blue-400',
            'Master': 'bg-purple-500/20 text-purple-400'
        }
        return colors[tier] || 'bg-gray-600/20 text-gray-400'
    }
    
    formatLastActive(date) {
        const now = new Date()
        const diff = now - new Date(date)
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }
}

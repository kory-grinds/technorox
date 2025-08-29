import { BasePage } from './BasePage.js'
import { firebaseService } from '../services/FirebaseService.js'

export default class AdminAnalyticsPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.requiredRole = 'admin'
        this.analyticsData = {
            userRegistrations: [],
            gameActivity: [],
            cardGeneration: [],
            systemMetrics: {}
        }
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900'
        
        content.innerHTML = `
            <div class="p-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-cyber font-bold mb-2">
                        <span class="neon-text">Analytics Dashboard</span>
                    </h1>
                    <p class="text-gray-400">User behavior, system performance, and business insights</p>
                </div>
                
                <!-- Time Range Selector -->
                <div class="cyber-card mb-8">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-neon-cyan">Time Range</h3>
                        <div class="flex items-center space-x-4">
                            <select id="timeRange" class="cyber-input">
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                            <button id="refreshAnalytics" class="cyber-button">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Key Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">New Registrations</p>
                                <p class="text-2xl font-bold text-neon-cyan" id="newRegistrations">0</p>
                            </div>
                            <div class="w-10 h-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="registrationGrowth">+15% vs last period</div>
                    </div>
                    
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Games Played</p>
                                <p class="text-2xl font-bold text-neon-magenta" id="gamesPlayed">0</p>
                            </div>
                            <div class="w-10 h-10 bg-neon-magenta/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="gameGrowth">+8% vs last period</div>
                    </div>
                    
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Cards Generated</p>
                                <p class="text-2xl font-bold text-green-400" id="cardsGenerated">0</p>
                            </div>
                            <div class="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="cardGrowth">+23% vs last period</div>
                    </div>
                    
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Active Users</p>
                                <p class="text-2xl font-bold text-yellow-400" id="activeUsers">0</p>
                            </div>
                            <div class="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="userGrowth">+12% vs last period</div>
                    </div>
                </div>
                
                <!-- Charts Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- User Registration Chart -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-neon-cyan">User Registrations</h3>
                        <div class="h-64 flex items-end justify-between space-x-2" id="registrationChart">
                            <!-- Chart bars will be generated here -->
                        </div>
                    </div>
                    
                    <!-- Game Activity Chart -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-neon-magenta">Daily Game Activity</h3>
                        <div class="h-64 flex items-end justify-between space-x-2" id="gameChart">
                            <!-- Chart bars will be generated here -->
                        </div>
                    </div>
                </div>
                
                <!-- Detailed Analytics -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Top Players -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-neon-cyan">Top Players</h3>
                        <div class="space-y-3" id="topPlayers">
                            <!-- Top players will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Popular Cards -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-neon-magenta">Most Generated Cards</h3>
                        <div class="space-y-3" id="popularCards">
                            <!-- Popular cards will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- System Performance -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-green-400">System Performance</h3>
                        <div class="space-y-4" id="systemPerformance">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-300">API Response Time</span>
                                <span class="text-green-400">125ms</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-300">Database Queries/sec</span>
                                <span class="text-green-400">45</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-300">Active Connections</span>
                                <span class="text-green-400">23</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-300">Memory Usage</span>
                                <span class="text-yellow-400">67%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-300">Uptime</span>
                                <span class="text-green-400">99.9%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Event Log -->
                <div class="mt-8">
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-yellow-400">Recent Events</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-gray-700">
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">Time</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">Event</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                                        <th class="text-left py-3 px-4 text-gray-300 font-medium">Details</th>
                                    </tr>
                                </thead>
                                <tbody id="eventLog">
                                    <!-- Events will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.loadAnalyticsData()
        this.setupEventListeners()
        this.renderCharts()
        this.startRealTimeUpdates()
    }
    
    async loadAnalyticsData() {
        try {
            if (firebaseService.isReady()) {
                // Load real analytics data from Firebase
                const [usersResult, cardsResult, gamesResult] = await Promise.all([
                    firebaseService.getCollection('users'),
                    firebaseService.getCollection('cards'),
                    firebaseService.getCollection('games')
                ])
                
                if (usersResult.success) {
                    this.processUserData(usersResult.data)
                }
                
                if (cardsResult.success) {
                    this.processCardData(cardsResult.data)
                }
                
                if (gamesResult.success) {
                    this.processGameData(gamesResult.data)
                }
                
            } else {
                // Use mock data for development
                this.generateMockAnalytics()
            }
            
            this.updateMetrics()
            this.renderTopPlayers()
            this.renderPopularCards()
            this.renderEventLog()
            
        } catch (error) {
            console.error('Error loading analytics data:', error)
        }
    }
    
    generateMockAnalytics() {
        // Generate mock data for the last 7 days
        const days = 7
        const today = new Date()
        
        this.analyticsData.userRegistrations = Array.from({length: days}, (_, i) => ({
            date: new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000),
            count: Math.floor(Math.random() * 20) + 5
        }))
        
        this.analyticsData.gameActivity = Array.from({length: days}, (_, i) => ({
            date: new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000),
            count: Math.floor(Math.random() * 100) + 20
        }))
        
        this.analyticsData.cardGeneration = Array.from({length: days}, (_, i) => ({
            date: new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000),
            count: Math.floor(Math.random() * 50) + 10
        }))
    }
    
    processUserData(users) {
        // Process user registration data
        const registrationsByDay = {}
        users.forEach(user => {
            const date = new Date(user.createdAt?.seconds * 1000 || user.createdAt)
            const dayKey = date.toDateString()
            registrationsByDay[dayKey] = (registrationsByDay[dayKey] || 0) + 1
        })
        
        // Convert to chart data
        this.analyticsData.userRegistrations = Object.entries(registrationsByDay)
            .map(([date, count]) => ({ date: new Date(date), count }))
            .sort((a, b) => a.date - b.date)
    }
    
    processCardData(cards) {
        // Process card generation data
        const cardsByDay = {}
        cards.forEach(card => {
            const date = new Date(card.createdAt?.seconds * 1000 || card.createdAt)
            const dayKey = date.toDateString()
            cardsByDay[dayKey] = (cardsByDay[dayKey] || 0) + 1
        })
        
        this.analyticsData.cardGeneration = Object.entries(cardsByDay)
            .map(([date, count]) => ({ date: new Date(date), count }))
            .sort((a, b) => a.date - b.date)
    }
    
    processGameData(games) {
        // Process game activity data
        const gamesByDay = {}
        games.forEach(game => {
            const date = new Date(game.createdAt?.seconds * 1000 || game.createdAt)
            const dayKey = date.toDateString()
            gamesByDay[dayKey] = (gamesByDay[dayKey] || 0) + 1
        })
        
        this.analyticsData.gameActivity = Object.entries(gamesByDay)
            .map(([date, count]) => ({ date: new Date(date), count }))
            .sort((a, b) => a.date - b.date)
    }
    
    updateMetrics() {
        const totalRegistrations = this.analyticsData.userRegistrations.reduce((sum, day) => sum + day.count, 0)
        const totalGames = this.analyticsData.gameActivity.reduce((sum, day) => sum + day.count, 0)
        const totalCards = this.analyticsData.cardGeneration.reduce((sum, day) => sum + day.count, 0)
        
        this.element.querySelector('#newRegistrations').textContent = totalRegistrations.toLocaleString()
        this.element.querySelector('#gamesPlayed').textContent = totalGames.toLocaleString()
        this.element.querySelector('#cardsGenerated').textContent = totalCards.toLocaleString()
        this.element.querySelector('#activeUsers').textContent = Math.floor(totalRegistrations * 0.7).toLocaleString()
    }
    
    renderCharts() {
        this.renderRegistrationChart()
        this.renderGameChart()
    }
    
    renderRegistrationChart() {
        const chartContainer = this.element.querySelector('#registrationChart')
        const data = this.analyticsData.userRegistrations.slice(-7) // Last 7 days
        
        if (data.length === 0) {
            chartContainer.innerHTML = '<div class="text-gray-400 text-center">No data available</div>'
            return
        }
        
        const maxValue = Math.max(...data.map(d => d.count))
        const maxHeight = 200
        
        chartContainer.innerHTML = data.map(day => `
            <div class="flex flex-col items-center">
                <div class="w-8 bg-neon-cyan rounded-t" style="height: ${(day.count / maxValue) * maxHeight}px;"></div>
                <span class="text-xs text-gray-400 mt-2">${day.date.toLocaleDateString('en', {weekday: 'short'})}</span>
                <span class="text-xs text-neon-cyan">${day.count}</span>
            </div>
        `).join('')
    }
    
    renderGameChart() {
        const chartContainer = this.element.querySelector('#gameChart')
        const data = this.analyticsData.gameActivity.slice(-7) // Last 7 days
        
        if (data.length === 0) {
            chartContainer.innerHTML = '<div class="text-gray-400 text-center">No data available</div>'
            return
        }
        
        const maxValue = Math.max(...data.map(d => d.count))
        const maxHeight = 200
        
        chartContainer.innerHTML = data.map(day => `
            <div class="flex flex-col items-center">
                <div class="w-8 bg-neon-magenta rounded-t" style="height: ${(day.count / maxValue) * maxHeight}px;"></div>
                <span class="text-xs text-gray-400 mt-2">${day.date.toLocaleDateString('en', {weekday: 'short'})}</span>
                <span class="text-xs text-neon-magenta">${day.count}</span>
            </div>
        `).join('')
    }
    
    renderTopPlayers() {
        const container = this.element.querySelector('#topPlayers')
        const mockPlayers = [
            { name: 'CyberNinja', elo: 1850, games: 127 },
            { name: 'TechMaster', elo: 1720, games: 89 },
            { name: 'DataGhost', elo: 1680, games: 156 },
            { name: 'NeonHacker', elo: 1650, games: 78 },
            { name: 'QuantumPlayer', elo: 1620, games: 92 }
        ]
        
        container.innerHTML = mockPlayers.map((player, index) => `
            <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center text-black text-xs font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <div class="text-white font-medium">${player.name}</div>
                        <div class="text-gray-400 text-xs">${player.games} games</div>
                    </div>
                </div>
                <div class="text-neon-cyan font-bold">${player.elo}</div>
            </div>
        `).join('')
    }
    
    renderPopularCards() {
        const container = this.element.querySelector('#popularCards')
        const mockCards = [
            { name: 'Cyber Dragon', generated: 45, rarity: 'Mythic' },
            { name: 'Neural Implant', generated: 38, rarity: 'Rare' },
            { name: 'Data Phantom', generated: 32, rarity: 'Uncommon' },
            { name: 'Quantum Beast', generated: 28, rarity: 'Rare' },
            { name: 'Neon Stalker', generated: 25, rarity: 'Common' }
        ]
        
        container.innerHTML = mockCards.map(card => `
            <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div>
                    <div class="text-white font-medium">${card.name}</div>
                    <div class="text-gray-400 text-xs">${card.rarity}</div>
                </div>
                <div class="text-neon-magenta font-bold">${card.generated}</div>
            </div>
        `).join('')
    }
    
    renderEventLog() {
        const container = this.element.querySelector('#eventLog')
        const mockEvents = [
            { time: '2 min ago', event: 'User Registration', user: 'NewPlayer123', details: 'Account created' },
            { time: '5 min ago', event: 'Card Generated', user: 'Admin', details: 'Cyber Dragon (Mythic)' },
            { time: '8 min ago', event: 'Game Completed', user: 'CyberNinja', details: 'Victory vs TechMaster' },
            { time: '12 min ago', event: 'Pack Opened', user: 'DataGhost', details: 'Premium Pack x1' },
            { time: '15 min ago', event: 'Tournament Started', user: 'System', details: 'Weekly Championship' }
        ]
        
        container.innerHTML = mockEvents.map(event => `
            <tr class="border-b border-gray-800">
                <td class="py-3 px-4 text-gray-300">${event.time}</td>
                <td class="py-3 px-4 text-white">${event.event}</td>
                <td class="py-3 px-4 text-neon-cyan">${event.user}</td>
                <td class="py-3 px-4 text-gray-400">${event.details}</td>
            </tr>
        `).join('')
    }
    
    setupEventListeners() {
        // Time range selector
        this.element.querySelector('#timeRange').addEventListener('change', () => {
            this.loadAnalyticsData()
        })
        
        // Refresh button
        this.element.querySelector('#refreshAnalytics').addEventListener('click', () => {
            this.loadAnalyticsData()
        })
    }
    
    startRealTimeUpdates() {
        // Update analytics data every 60 seconds
        setInterval(() => {
            this.loadAnalyticsData()
        }, 60000)
    }
}

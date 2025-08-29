import { BasePage } from './BasePage.js'
import { firebaseService } from '../services/FirebaseService.js'

export default class AdminDashboardPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.requiredRole = 'admin'
        this.stats = {
            totalUsers: 0,
            totalCards: 0,
            activeGames: 0,
            newRegistrations: 0,
            cardsGenerated: 0,
            systemHealth: 'healthy'
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
                        <span class="neon-text">Admin Dashboard</span>
                    </h1>
                    <p class="text-gray-400">System overview and management center</p>
                </div>
                
                <!-- Quick Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Total Users -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Total Users</p>
                                <p class="text-2xl font-bold text-neon-cyan" id="totalUsers">Loading...</p>
                            </div>
                            <div class="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="userGrowth">+12% from last month</div>
                    </div>
                    
                    <!-- Total Cards -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Total Cards</p>
                                <p class="text-2xl font-bold text-neon-magenta" id="totalCards">Loading...</p>
                            </div>
                            <div class="w-12 h-12 bg-neon-magenta/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400" id="cardGrowth">+45 generated today</div>
                    </div>
                    
                    <!-- Active Games -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Active Games</p>
                                <p class="text-2xl font-bold text-green-400" id="activeGames">Loading...</p>
                            </div>
                            <div class="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-yellow-400" id="gameActivity">Peak: 47 concurrent</div>
                    </div>
                    
                    <!-- System Health -->
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">System Health</p>
                                <p class="text-2xl font-bold text-green-400" id="systemHealth">Healthy</p>
                            </div>
                            <div class="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-green-400">All services operational</div>
                    </div>
                </div>
                
                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Recent Activity -->
                    <div class="lg:col-span-2">
                        <div class="cyber-card">
                            <h3 class="text-xl font-bold mb-4 text-neon-cyan">Recent Activity</h3>
                            <div class="space-y-4" id="recentActivity">
                                <!-- Activity items will be loaded here -->
                                <div class="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
                                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <div class="flex-1">
                                        <p class="text-white text-sm">New user registered: PlayerX</p>
                                        <p class="text-gray-400 text-xs">2 minutes ago</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
                                    <div class="w-2 h-2 bg-neon-cyan rounded-full"></div>
                                    <div class="flex-1">
                                        <p class="text-white text-sm">5 new cards generated</p>
                                        <p class="text-gray-400 text-xs">5 minutes ago</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
                                    <div class="w-2 h-2 bg-neon-magenta rounded-full"></div>
                                    <div class="flex-1">
                                        <p class="text-white text-sm">Tournament "Cyber Clash" started</p>
                                        <p class="text-gray-400 text-xs">15 minutes ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div>
                        <div class="cyber-card mb-6">
                            <h3 class="text-xl font-bold mb-4 text-neon-magenta">Quick Actions</h3>
                            <div class="space-y-3">
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/admin')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                        </svg>
                                        <span>Generate Cards</span>
                                    </div>
                                </button>
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/admin/users')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                        </svg>
                                        <span>Manage Users</span>
                                    </div>
                                </button>
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/admin/analytics')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                        <span>View Analytics</span>
                                    </div>
                                </button>
                                <button class="w-full cyber-button text-left" onclick="window.technorox?.router?.navigate('/settings')">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        <span>System Settings</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- System Status -->
                        <div class="cyber-card">
                            <h3 class="text-xl font-bold mb-4 text-green-400">System Status</h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Firebase</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-green-400 text-sm">Online</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">OpenAI API</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-green-400 text-sm">Online</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Game Server</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-green-400 text-sm">Online</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">App Check</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-green-400 text-sm">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- User Registration Chart -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-neon-cyan">User Registrations (Last 7 Days)</h3>
                        <div class="h-64 flex items-end justify-between space-x-2" id="userChart">
                            <!-- Simple bar chart -->
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 60px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Mon</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 80px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Tue</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 45px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Wed</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 90px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Thu</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 70px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Fri</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 110px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Sat</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-cyan rounded-t" style="height: 95px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Sun</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Card Generation Chart -->
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-4 text-neon-magenta">Cards Generated (Last 7 Days)</h3>
                        <div class="h-64 flex items-end justify-between space-x-2" id="cardChart">
                            <!-- Simple bar chart -->
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 40px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Mon</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 65px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Tue</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 55px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Wed</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 85px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Thu</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 75px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Fri</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 120px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Sat</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-8 bg-neon-magenta rounded-t" style="height: 100px;"></div>
                                <span class="text-xs text-gray-400 mt-2">Sun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.loadDashboardData()
        this.setupEventListeners()
        this.startRealTimeUpdates()
    }
    
    async loadDashboardData() {
        try {
            if (firebaseService.isReady()) {
                // Load real data from Firebase
                const [usersResult, cardsResult, gamesResult] = await Promise.all([
                    firebaseService.getCollection('users'),
                    firebaseService.getCollection('cards'),
                    firebaseService.getCollection('games', { 
                        where: [['status', '==', 'active']] 
                    })
                ])
                
                // Update stats
                if (usersResult.success) {
                    this.stats.totalUsers = usersResult.data.length
                    this.updateStatDisplay('totalUsers', this.stats.totalUsers.toLocaleString())
                    
                    // Calculate new registrations today
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const newToday = usersResult.data.filter(user => {
                        const userDate = new Date(user.createdAt?.seconds * 1000 || user.createdAt)
                        return userDate >= today
                    }).length
                    this.stats.newRegistrations = newToday
                }
                
                if (cardsResult.success) {
                    this.stats.totalCards = cardsResult.data.length
                    this.updateStatDisplay('totalCards', this.stats.totalCards.toLocaleString())
                    
                    // Calculate cards generated today
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const generatedToday = cardsResult.data.filter(card => {
                        const cardDate = new Date(card.createdAt?.seconds * 1000 || card.createdAt)
                        return cardDate >= today
                    }).length
                    this.stats.cardsGenerated = generatedToday
                    this.updateStatDisplay('cardGrowth', `+${generatedToday} generated today`)
                }
                
                if (gamesResult.success) {
                    this.stats.activeGames = gamesResult.data.length
                    this.updateStatDisplay('activeGames', this.stats.activeGames.toString())
                }
                
            } else {
                // Use mock data when Firebase is not available
                this.updateStatDisplay('totalUsers', '1,247')
                this.updateStatDisplay('totalCards', '3,892')
                this.updateStatDisplay('activeGames', '23')
            }
            
            // Update system health
            this.updateSystemHealth()
            
        } catch (error) {
            console.error('Error loading dashboard data:', error)
            this.updateStatDisplay('totalUsers', 'Error')
            this.updateStatDisplay('totalCards', 'Error')
            this.updateStatDisplay('activeGames', 'Error')
        }
    }
    
    updateStatDisplay(elementId, value) {
        const element = this.element.querySelector(`#${elementId}`)
        if (element) {
            element.textContent = value
        }
    }
    
    updateSystemHealth() {
        const healthElement = this.element.querySelector('#systemHealth')
        const isFirebaseReady = firebaseService.isReady()
        const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY
        
        if (isFirebaseReady && hasOpenAI) {
            healthElement.textContent = 'Healthy'
            healthElement.className = 'text-2xl font-bold text-green-400'
        } else {
            healthElement.textContent = 'Warning'
            healthElement.className = 'text-2xl font-bold text-yellow-400'
        }
    }
    
    setupEventListeners() {
        // Quick action buttons are handled by onclick attributes in HTML
        // Additional event listeners can be added here
    }
    
    startRealTimeUpdates() {
        // Update dashboard data every 30 seconds
        setInterval(() => {
            this.loadDashboardData()
        }, 30000)
    }
}

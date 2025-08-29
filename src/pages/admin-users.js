import { BasePage } from './BasePage.js'
import { firebaseService } from '../services/FirebaseService.js'

export default class AdminUsersPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.requiredRole = 'admin'
        this.users = []
        this.filteredUsers = []
        this.currentFilter = 'all'
        this.searchTerm = ''
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900'
        
        content.innerHTML = `
            <div class="p-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-cyber font-bold mb-2">
                        <span class="neon-text">User Management</span>
                    </h1>
                    <p class="text-gray-400">Manage players, admins, and user permissions</p>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Total Users</p>
                                <p class="text-2xl font-bold text-neon-cyan" id="totalUsers">0</p>
                            </div>
                            <div class="w-10 h-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Active Players</p>
                                <p class="text-2xl font-bold text-green-400" id="activePlayers">0</p>
                            </div>
                            <div class="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">New Today</p>
                                <p class="text-2xl font-bold text-neon-magenta" id="newToday">0</p>
                            </div>
                            <div class="w-10 h-10 bg-neon-magenta/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cyber-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Admins</p>
                                <p class="text-2xl font-bold text-yellow-400" id="adminCount">0</p>
                            </div>
                            <div class="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Controls -->
                <div class="cyber-card mb-6">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <!-- Search -->
                        <div class="flex-1 max-w-md">
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="searchUsers" 
                                    placeholder="Search users..." 
                                    class="cyber-input pl-10 w-full"
                                >
                                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                        </div>
                        
                        <!-- Filters -->
                        <div class="flex items-center space-x-4">
                            <select id="roleFilter" class="cyber-input">
                                <option value="all">All Roles</option>
                                <option value="player">Players</option>
                                <option value="admin">Admins</option>
                            </select>
                            
                            <select id="statusFilter" class="cyber-input">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            
                            <button id="refreshUsers" class="cyber-button">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Users Table -->
                <div class="cyber-card">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700">
                                    <th class="text-left py-4 px-4 text-gray-300 font-medium">User</th>
                                    <th class="text-left py-4 px-4 text-gray-300 font-medium">Role</th>
                                    <th class="text-left py-4 px-4 text-gray-300 font-medium">Status</th>
                                    <th class="text-left py-4 px-4 text-gray-300 font-medium">Joined</th>
                                    <th class="text-left py-4 px-4 text-gray-300 font-medium">Games</th>
                                    <th class="text-left py-4 px-4 text-gray-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="usersTableBody">
                                <!-- Users will be loaded here -->
                                <tr>
                                    <td colspan="6" class="text-center py-8 text-gray-400">
                                        <div class="flex items-center justify-center space-x-2">
                                            <div class="animate-spin w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full"></div>
                                            <span>Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- User Detail Modal -->
            <div id="userModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden backdrop-blur-sm">
                <div class="cyber-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-cyber font-bold text-neon-cyan">User Details</h3>
                        <button id="closeUserModal" class="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                    
                    <div id="userModalContent">
                        <!-- User details will be loaded here -->
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.loadUsers()
        this.setupEventListeners()
    }
    
    async loadUsers() {
        try {
            if (firebaseService.isReady()) {
                const result = await firebaseService.getCollection('users')
                
                if (result.success) {
                    this.users = result.data
                    this.filteredUsers = [...this.users]
                    this.updateStats()
                    this.renderUsersTable()
                } else {
                    throw new Error(result.error)
                }
            } else {
                // Mock data for development
                this.users = this.generateMockUsers()
                this.filteredUsers = [...this.users]
                this.updateStats()
                this.renderUsersTable()
            }
        } catch (error) {
            console.error('Error loading users:', error)
            this.showError('Failed to load users')
        }
    }
    
    generateMockUsers() {
        const mockUsers = []
        const names = ['CyberNinja', 'TechMaster', 'DataGhost', 'NeonHacker', 'QuantumPlayer', 'PixelWarrior']
        
        for (let i = 0; i < 25; i++) {
            mockUsers.push({
                id: `user_${i}`,
                displayName: names[i % names.length] + (i > 5 ? i : ''),
                email: `user${i}@example.com`,
                role: i < 2 ? 'admin' : 'player',
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                stats: {
                    gamesPlayed: Math.floor(Math.random() * 100),
                    gamesWon: Math.floor(Math.random() * 50),
                    elo: 800 + Math.floor(Math.random() * 800)
                },
                lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            })
        }
        
        return mockUsers
    }
    
    updateStats() {
        const totalUsers = this.users.length
        const activePlayers = this.users.filter(user => user.role === 'player').length
        const adminCount = this.users.filter(user => user.role === 'admin').length
        
        // Calculate new users today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const newToday = this.users.filter(user => {
            const userDate = new Date(user.createdAt?.seconds * 1000 || user.createdAt)
            return userDate >= today
        }).length
        
        this.element.querySelector('#totalUsers').textContent = totalUsers.toLocaleString()
        this.element.querySelector('#activePlayers').textContent = activePlayers.toLocaleString()
        this.element.querySelector('#newToday').textContent = newToday.toString()
        this.element.querySelector('#adminCount').textContent = adminCount.toString()
    }
    
    renderUsersTable() {
        const tbody = this.element.querySelector('#usersTableBody')
        
        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-400">
                        No users found matching your criteria
                    </td>
                </tr>
            `
            return
        }
        
        tbody.innerHTML = this.filteredUsers.map(user => `
            <tr class="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td class="py-4 px-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                            <span class="text-black font-bold text-sm">
                                ${(user.displayName || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div class="text-white font-medium">${user.displayName || 'Unknown'}</div>
                            <div class="text-gray-400 text-sm">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                            ? 'bg-yellow-400/20 text-yellow-400' 
                            : 'bg-neon-cyan/20 text-neon-cyan'
                    }">
                        ${user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Player'}
                    </span>
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span class="text-green-400 text-sm">Active</span>
                    </div>
                </td>
                <td class="py-4 px-4 text-gray-300">
                    ${this.formatDate(user.createdAt)}
                </td>
                <td class="py-4 px-4 text-gray-300">
                    ${user.stats?.gamesPlayed || 0}
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center space-x-2">
                        <button 
                            class="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                            onclick="this.closest('tr').dispatchEvent(new CustomEvent('viewUser', {detail: '${user.id}'}))"
                            title="View Details"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </button>
                        <button 
                            class="text-yellow-400 hover:text-yellow-400/80 transition-colors"
                            onclick="this.closest('tr').dispatchEvent(new CustomEvent('editUser', {detail: '${user.id}'}))"
                            title="Edit User"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </button>
                        ${user.role !== 'admin' ? `
                            <button 
                                class="text-red-400 hover:text-red-400/80 transition-colors"
                                onclick="this.closest('tr').dispatchEvent(new CustomEvent('deleteUser', {detail: '${user.id}'}))"
                                title="Delete User"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('')
        
        // Add event listeners for user actions
        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('viewUser', (e) => this.viewUser(e.detail))
            row.addEventListener('editUser', (e) => this.editUser(e.detail))
            row.addEventListener('deleteUser', (e) => this.deleteUser(e.detail))
        })
    }
    
    formatDate(date) {
        if (!date) return 'Unknown'
        const d = new Date(date.seconds * 1000 || date)
        return d.toLocaleDateString()
    }
    
    setupEventListeners() {
        // Search
        const searchInput = this.element.querySelector('#searchUsers')
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase()
            this.filterUsers()
        })
        
        // Filters
        const roleFilter = this.element.querySelector('#roleFilter')
        const statusFilter = this.element.querySelector('#statusFilter')
        
        roleFilter.addEventListener('change', () => this.filterUsers())
        statusFilter.addEventListener('change', () => this.filterUsers())
        
        // Refresh button
        this.element.querySelector('#refreshUsers').addEventListener('click', () => {
            this.loadUsers()
        })
        
        // Modal close
        this.element.querySelector('#closeUserModal').addEventListener('click', () => {
            this.element.querySelector('#userModal').classList.add('hidden')
        })
    }
    
    filterUsers() {
        const roleFilter = this.element.querySelector('#roleFilter').value
        const statusFilter = this.element.querySelector('#statusFilter').value
        
        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = !this.searchTerm || 
                user.displayName?.toLowerCase().includes(this.searchTerm) ||
                user.email?.toLowerCase().includes(this.searchTerm)
            
            const matchesRole = roleFilter === 'all' || user.role === roleFilter
            const matchesStatus = statusFilter === 'all' // For now, all users are considered active
            
            return matchesSearch && matchesRole && matchesStatus
        })
        
        this.renderUsersTable()
    }
    
    viewUser(userId) {
        const user = this.users.find(u => u.id === userId)
        if (!user) return
        
        const modal = this.element.querySelector('#userModal')
        const content = this.element.querySelector('#userModalContent')
        
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-bold mb-4 text-neon-cyan">User Information</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                            <div class="cyber-input bg-gray-800">${user.displayName || 'N/A'}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <div class="cyber-input bg-gray-800">${user.email}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <div class="cyber-input bg-gray-800 capitalize">${user.role}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Joined</label>
                            <div class="cyber-input bg-gray-800">${this.formatDate(user.createdAt)}</div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-bold mb-4 text-neon-magenta">Game Statistics</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Games Played</label>
                            <div class="cyber-input bg-gray-800">${user.stats?.gamesPlayed || 0}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Games Won</label>
                            <div class="cyber-input bg-gray-800">${user.stats?.gamesWon || 0}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">ELO Rating</label>
                            <div class="cyber-input bg-gray-800">${user.stats?.elo || 1000}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Win Rate</label>
                            <div class="cyber-input bg-gray-800">
                                ${user.stats?.gamesPlayed ? Math.round((user.stats.gamesWon / user.stats.gamesPlayed) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-4">
                <button class="cyber-button" onclick="document.getElementById('userModal').classList.add('hidden')">
                    Close
                </button>
                <button class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Edit User
                </button>
            </div>
        `
        
        modal.classList.remove('hidden')
    }
    
    editUser(userId) {
        // Implement edit user functionality
        window.technorox?.uiManager?.showInfo('Edit user functionality coming soon!')
    }
    
    deleteUser(userId) {
        // Implement delete user functionality
        if (confirm('Are you sure you want to delete this user?')) {
            window.technorox?.uiManager?.showInfo('Delete user functionality coming soon!')
        }
    }
    
    showError(message) {
        window.technorox?.uiManager?.showError(message)
    }
}

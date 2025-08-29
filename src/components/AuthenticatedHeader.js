export class AuthenticatedHeader {
    constructor(authManager) {
        this.authManager = authManager
        this.element = null
    }

    render() {
        const user = this.authManager.getCurrentUser()
        const profile = this.authManager.getUserProfile()
        
        this.element = document.createElement('header')
        this.element.className = 'bg-dark-900 border-b border-neon-cyan/20 sticky top-0 z-40'
        
        this.element.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center space-x-4">
                        <div class="text-2xl font-cyber font-bold">
                            <span class="neon-text">TECHNOROX</span>
                        </div>
                        <div class="hidden md:block text-sm text-gray-400">
                            ${profile?.role === 'admin' ? 'Admin Panel' : 'Player Dashboard'}
                        </div>
                    </div>
                    
                    <!-- User Menu -->
                    <div class="flex items-center space-x-4">
                        <!-- Rox Chips Balance -->
                        <div id="headerRoxChips" class="rox-chips-header-display">
                            <!-- Rox Chips display will be inserted here -->
                        </div>
                        
                        <!-- Notifications -->
                        <button class="relative p-2 text-gray-400 hover:text-neon-cyan transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.5L7 7h3v5l3.5-3.5h-3z"/>
                            </svg>
                            <span class="absolute -top-1 -right-1 bg-neon-magenta text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                        </button>
                        
                        <!-- User Profile Dropdown -->
                        <div class="relative">
                            <button id="userMenuButton" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                                <div class="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                                    <span class="text-black font-bold text-sm">
                                        ${(profile?.displayName || user?.displayName || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div class="hidden md:block text-left">
                                    <div class="text-white font-medium">${profile?.displayName || user?.displayName || 'User'}</div>
                                    <div class="text-xs text-gray-400 capitalize">${profile?.role || 'player'}</div>
                                </div>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div id="userDropdown" class="hidden absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-gray-700 z-50">
                                <div class="py-2">
                                    <div class="px-4 py-2 border-b border-gray-700">
                                        <div class="text-white font-medium">${profile?.displayName || user?.displayName || 'User'}</div>
                                        <div class="text-xs text-gray-400">${user?.email || 'user@example.com'}</div>
                                    </div>
                                    
                                    <a href="/settings" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        <div class="flex items-center space-x-2">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                            <span>Settings</span>
                                        </div>
                                    </a>
                                    
                                    ${profile?.role === 'admin' ? `
                                        <a href="/player-dashboard" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                            <div class="flex items-center space-x-2">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                                <span>Player View</span>
                                            </div>
                                        </a>
                                    ` : ''}
                                    
                                    <div class="border-t border-gray-700 mt-2 pt-2">
                                        <button id="logoutButton" class="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors">
                                            <div class="flex items-center space-x-2">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                                </svg>
                                                <span>Sign Out</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        
        this.setupEventListeners()
        this.setupRoxChipsDisplay()
        return this.element
    }
    
    setupEventListeners() {
        // User menu dropdown toggle
        const userMenuButton = this.element.querySelector('#userMenuButton')
        const userDropdown = this.element.querySelector('#userDropdown')
        
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation()
            userDropdown.classList.toggle('hidden')
        })
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.add('hidden')
        })
        
        // Logout functionality
        const logoutButton = this.element.querySelector('#logoutButton')
        logoutButton.addEventListener('click', async () => {
            try {
                await this.authManager.logout()
                window.technorox?.router?.navigate('/login')
            } catch (error) {
                console.error('Logout failed:', error)
            }
        })
        
        // Navigation links
        const navLinks = this.element.querySelectorAll('a[href]')
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const href = link.getAttribute('href')
                window.technorox?.router?.navigate(href)
            })
        })
    }
    
    async setupRoxChipsDisplay() {
        try {
            // Import RoxChips components
            const { CompactRoxChipsDisplay } = await import('./RoxChipsDisplay.js')
            const { roxChipsService } = await import('../services/RoxChipsService.js')
            
            // Initialize service if user is authenticated
            const user = this.authManager?.getCurrentUser()
            if (user && !roxChipsService.isInitialized) {
                await roxChipsService.init(user.uid)
            }
            
            // Create and insert Rox Chips display
            const balance = roxChipsService.getRoxChipsBalance()
            const roxChipsDisplay = new CompactRoxChipsDisplay(balance)
            
            const container = this.element.querySelector('#headerRoxChips')
            if (container) {
                container.appendChild(roxChipsDisplay.render())
                
                // Handle clicks to open store
                roxChipsDisplay.element.addEventListener('roxChipsClick', () => {
                    window.technorox?.router?.navigate('/store')
                })
            }
        } catch (error) {
            console.error('Error setting up Rox Chips display:', error)
        }
    }

    updateUserInfo() {
        // Re-render with updated user info
        const parent = this.element.parentNode
        if (parent) {
            const newElement = this.render()
            parent.replaceChild(newElement, this.element)
        }
    }
}

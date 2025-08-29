export class BasePage {
    constructor() {
        this.element = null
        this.isPublic = true
    }
    
    render() {
        this.element = document.createElement('div')
        this.element.className = 'min-h-screen flex flex-col'
        
        // Add header
        const header = this.createHeader()
        this.element.appendChild(header)
        
        // Add main content
        const main = document.createElement('main')
        main.className = 'flex-1'
        main.appendChild(this.createContent())
        this.element.appendChild(main)
        
        // Add footer
        const footer = this.createFooter()
        this.element.appendChild(footer)
        
        return this.element
    }
    
    createHeader() {
        const header = document.createElement('header')
        header.className = 'bg-cyber-dark border-b border-neon-cyan/30 sticky top-0 z-40 backdrop-blur-md'
        
        header.innerHTML = `
            <nav class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <a href="/" data-route="/" class="neon-text text-2xl font-cyber font-bold">
                            TECHNOROX
                        </a>
                        <span class="text-neon-magenta text-sm">TCG</span>
                    </div>
                    
                    <div class="hidden md:flex items-center space-x-6">
                        <a href="/" data-route="/" class="text-white hover:text-neon-cyan transition-colors">Home</a>
                        <a href="/about" data-route="/about" class="text-white hover:text-neon-cyan transition-colors">About</a>
                        <a href="/leaderboard" data-route="/leaderboard" class="text-white hover:text-neon-cyan transition-colors">Leaderboard</a>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        ${this.isAuthenticated() ? this.createAuthenticatedNav() : this.createPublicNav()}
                    </div>
                </div>
                
                <!-- Mobile menu -->
                <div class="md:hidden mt-4 pt-4 border-t border-neon-cyan/20">
                    <div class="flex flex-col space-y-2">
                        <a href="/" data-route="/" class="text-white hover:text-neon-cyan transition-colors py-2">Home</a>
                        <a href="/about" data-route="/about" class="text-white hover:text-neon-cyan transition-colors py-2">About</a>
                        <a href="/leaderboard" data-route="/leaderboard" class="text-white hover:text-neon-cyan transition-colors py-2">Leaderboard</a>
                    </div>
                </div>
            </nav>
        `
        
        return header
    }
    
    createPublicNav() {
        return `
            <a href="/login" data-route="/login" class="text-white hover:text-neon-cyan transition-colors">Login</a>
            <a href="/register" data-route="/register" class="cyber-button">Sign Up</a>
        `
    }
    
    createAuthenticatedNav() {
        const user = window.technorox?.authManager?.getCurrentUser()
        const profile = window.technorox?.authManager?.getUserProfile()
        
        return `
            <div class="flex items-center space-x-4">
                <a href="/dashboard" data-route="/dashboard" class="text-white hover:text-neon-cyan transition-colors">Dashboard</a>
                <a href="/collection" data-route="/collection" class="text-white hover:text-neon-cyan transition-colors">Collection</a>
                <a href="/deck-builder" data-route="/deck-builder" class="text-white hover:text-neon-cyan transition-colors">Deck Builder</a>
                <div class="relative group">
                    <button class="flex items-center space-x-2 text-white hover:text-neon-cyan transition-colors">
                        <span>${profile?.displayName || user?.displayName || 'Player'}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="absolute right-0 mt-2 w-48 cyber-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <a href="/profile" data-route="/profile" class="block px-4 py-2 text-white hover:text-neon-cyan transition-colors">Profile</a>
                        <a href="/settings" data-route="/settings" class="block px-4 py-2 text-white hover:text-neon-cyan transition-colors">Settings</a>
                        ${profile?.role === 'admin' ? '<a href="/admin" data-route="/admin" class="block px-4 py-2 text-neon-magenta hover:text-white transition-colors">Admin</a>' : ''}
                        <button onclick="window.technorox.authManager.logout().then(() => window.technorox.router.navigate('/'))" 
                                class="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 transition-colors">Logout</button>
                    </div>
                </div>
            </div>
        `
    }
    
    createFooter() {
        const footer = document.createElement('footer')
        footer.className = 'bg-cyber-dark border-t border-neon-cyan/30 mt-auto'
        
        footer.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="neon-text font-cyber font-bold text-lg mb-4">TECHNOROX</h3>
                        <p class="text-gray-400 text-sm">
                            The ultimate cyberpunk trading card game. Build your deck, hack the system, dominate the grid.
                        </p>
                    </div>
                    
                    <div>
                        <h4 class="text-white font-semibold mb-4">Game</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="/about" data-route="/about" class="text-gray-400 hover:text-neon-cyan transition-colors">How to Play</a></li>
                            <li><a href="/cards" data-route="/cards" class="text-gray-400 hover:text-neon-cyan transition-colors">Card Database</a></li>
                            <li><a href="/leaderboard" data-route="/leaderboard" class="text-gray-400 hover:text-neon-cyan transition-colors">Leaderboard</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="text-white font-semibold mb-4">Community</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="#" class="text-gray-400 hover:text-neon-cyan transition-colors">Discord</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-neon-cyan transition-colors">Reddit</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-neon-cyan transition-colors">Twitter</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="text-white font-semibold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="#" class="text-gray-400 hover:text-neon-cyan transition-colors">Help Center</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-neon-cyan transition-colors">Contact Us</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-neon-cyan transition-colors">Bug Reports</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="border-t border-neon-cyan/20 mt-8 pt-8 text-center">
                    <p class="text-gray-400 text-sm">
                        © 2024 KAAI TECH LLC. All rights reserved. | 
                        <a href="/privacy-policy" target="_blank" class="hover:text-neon-cyan transition-colors">Privacy Policy</a> | 
                        <a href="/terms-of-service" target="_blank" class="hover:text-neon-cyan transition-colors">Terms of Service</a>
                    </p>
                </div>
            </div>
        `
        
        return footer
    }
    
    createContent() {
        // Override in subclasses
        const content = document.createElement('div')
        content.innerHTML = '<p>Base page content</p>'
        return content
    }
    
    isAuthenticated() {
        return window.technorox?.authManager?.isAuthenticated() || false
    }
    
    init() {
        // Override in subclasses for initialization
    }
    
    destroy() {
        // Override in subclasses for cleanup
        if (this.element) {
            this.element.remove()
        }
    }
}

export class PlayerSidebar {
    constructor(authManager) {
        this.authManager = authManager
        this.element = null
        this.currentPath = window.location.pathname
    }

    render() {
        this.element = document.createElement('aside')
        this.element.className = 'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-dark-800 border-r border-gray-700 z-30 overflow-y-auto'
        
        const profile = this.authManager.getUserProfile()
        const user = this.authManager.getCurrentUser()
        
        this.element.innerHTML = `
            <div class="p-4">
                <!-- Player Profile Section -->
                <div class="mb-6 p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-lg border border-neon-cyan/20">
                    <div class="flex items-center space-x-3 mb-3">
                        <div class="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                            <span class="text-black font-bold text-lg">
                                ${(profile?.displayName || user?.displayName || 'P').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div class="text-white font-medium">${profile?.displayName || user?.displayName || 'Player'}</div>
                            <div class="text-xs text-neon-cyan">${profile?.stats?.rank || 'Bronze'} Rank</div>
                        </div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-dark-700 rounded p-2 text-center">
                            <div class="text-neon-cyan font-bold">${profile?.stats?.gamesWon || 0}</div>
                            <div class="text-gray-400">Wins</div>
                        </div>
                        <div class="bg-dark-700 rounded p-2 text-center">
                            <div class="text-neon-magenta font-bold">${profile?.stats?.elo || 1000}</div>
                            <div class="text-gray-400">ELO</div>
                        </div>
                    </div>
                </div>
                
                <!-- Navigation Menu -->
                <nav class="space-y-2">
                    <!-- Dashboard -->
                    <a href="/player-dashboard" class="nav-item ${this.currentPath === '/player-dashboard' ? 'active' : ''}" data-route="/player-dashboard">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"/>
                        </svg>
                        <span>Dashboard</span>
                    </a>
                    
                    <!-- Game -->
                    <div class="nav-section">
                        <div class="nav-section-title">Play</div>
                        <a href="/game" class="nav-item ${this.currentPath === '/game' ? 'active' : ''}" data-route="/game">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Play Game</span>
                        </a>
                        <a href="/matchmaking" class="nav-item ${this.currentPath === '/matchmaking' ? 'active' : ''}" data-route="/matchmaking">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span>Find Match</span>
                        </a>
                        <a href="/tournaments" class="nav-item ${this.currentPath === '/tournaments' ? 'active' : ''}" data-route="/tournaments">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                            </svg>
                            <span>Tournaments</span>
                        </a>
                    </div>
                    
                    <!-- Collection -->
                    <div class="nav-section">
                        <div class="nav-section-title">Collection</div>
                        <a href="/collection" class="nav-item ${this.currentPath === '/collection' ? 'active' : ''}" data-route="/collection">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span>My Cards</span>
                            <span class="ml-auto bg-neon-cyan text-black text-xs px-2 py-1 rounded-full">
                                ${profile?.collection?.length || 0}
                            </span>
                        </a>
                        <a href="/deck-builder" class="nav-item ${this.currentPath === '/deck-builder' ? 'active' : ''}" data-route="/deck-builder">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span>Deck Builder</span>
                            <span class="ml-auto bg-neon-magenta text-black text-xs px-2 py-1 rounded-full">
                                ${profile?.decks?.length || 0}
                            </span>
                        </a>
                        <a href="/packs" class="nav-item ${this.currentPath === '/packs' ? 'active' : ''}" data-route="/packs">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                            </svg>
                            <span>Card Packs</span>
                        </a>
                    </div>
                    
                    <!-- Social -->
                    <div class="nav-section">
                        <div class="nav-section-title">Social</div>
                        <a href="/leaderboard" class="nav-item ${this.currentPath === '/leaderboard' ? 'active' : ''}" data-route="/leaderboard">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            <span>Leaderboard</span>
                        </a>
                        <a href="/friends" class="nav-item ${this.currentPath === '/friends' ? 'active' : ''}" data-route="/friends">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                            </svg>
                            <span>Friends</span>
                        </a>
                        <a href="/guilds" class="nav-item ${this.currentPath === '/guilds' ? 'active' : ''}" data-route="/guilds">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span>Guilds</span>
                        </a>
                    </div>
                    
                    <!-- Progression -->
                    <div class="nav-section">
                        <div class="nav-section-title">Progression</div>
                        <a href="/missions" class="nav-item ${this.currentPath === '/missions' ? 'active' : ''}" data-route="/missions">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                            </svg>
                            <span>Missions</span>
                        </a>
                        <a href="/store" class="nav-item ${this.currentPath === '/store' ? 'active' : ''}" data-route="/store">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <span>Store</span>
                        </a>
                    </div>
                    
                    <!-- Account -->
                    <div class="nav-section">
                        <div class="nav-section-title">Account</div>
                        <a href="/profile" class="nav-item ${this.currentPath === '/profile' ? 'active' : ''}" data-route="/profile">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <span>Profile</span>
                        </a>
                        <a href="/settings" class="nav-item ${this.currentPath === '/settings' ? 'active' : ''}" data-route="/settings">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>Settings</span>
                        </a>
                    </div>
                </nav>
                
                <!-- Quick Actions -->
                <div class="mt-6 p-4 bg-dark-700 rounded-lg">
                    <div class="text-sm font-medium text-white mb-3">Quick Actions</div>
                    <div class="space-y-2">
                        <button class="w-full bg-neon-cyan text-black text-sm font-medium py-2 px-3 rounded hover:bg-neon-cyan/80 transition-colors">
                            Quick Match
                        </button>
                        <button class="w-full bg-neon-magenta text-black text-sm font-medium py-2 px-3 rounded hover:bg-neon-magenta/80 transition-colors">
                            Open Pack
                        </button>
                    </div>
                </div>
            </div>
        `
        
        this.setupEventListeners()
        this.addStyles()
        return this.element
    }
    
    addStyles() {
        // Add custom styles for the sidebar (same as admin)
        const style = document.createElement('style')
        style.textContent = `
            .nav-item {
                display: flex;
                align-items: center;
                space-x: 0.75rem;
                padding: 0.75rem 1rem;
                color: #9CA3AF;
                text-decoration: none;
                border-radius: 0.5rem;
                transition: all 0.2s;
                margin-bottom: 0.25rem;
            }
            
            .nav-item:hover {
                background-color: rgba(55, 65, 81, 0.5);
                color: #00FFF7;
            }
            
            .nav-item.active {
                background: linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(255, 0, 255, 0.1));
                color: #00FFF7;
                border: 1px solid rgba(0, 255, 247, 0.3);
            }
            
            .nav-item svg {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.75rem;
                flex-shrink: 0;
            }
            
            .nav-section {
                margin-top: 1.5rem;
            }
            
            .nav-section-title {
                font-size: 0.75rem;
                font-weight: 600;
                color: #6B7280;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.5rem;
                padding: 0 1rem;
            }
        `
        
        if (!document.querySelector('#player-sidebar-styles')) {
            style.id = 'player-sidebar-styles'
            document.head.appendChild(style)
        }
    }
    
    setupEventListeners() {
        // Navigation links
        const navLinks = this.element.querySelectorAll('a[data-route]')
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const route = link.getAttribute('data-route')
                
                // Update active state
                this.updateActiveState(route)
                
                // Navigate
                window.technorox?.router?.navigate(route)
            })
        })
        
        // Quick action buttons
        const quickMatchBtn = this.element.querySelector('button:contains("Quick Match")')
        const openPackBtn = this.element.querySelector('button:contains("Open Pack")')
        
        // Quick Match
        this.element.addEventListener('click', (e) => {
            if (e.target.textContent.includes('Quick Match')) {
                window.technorox?.router?.navigate('/matchmaking')
            }
            if (e.target.textContent.includes('Open Pack')) {
                window.technorox?.router?.navigate('/packs')
            }
        })
    }
    
    updateActiveState(currentRoute) {
        this.currentPath = currentRoute
        
        // Remove active class from all items
        const navItems = this.element.querySelectorAll('.nav-item')
        navItems.forEach(item => item.classList.remove('active'))
        
        // Add active class to current item
        const activeItem = this.element.querySelector(`[data-route="${currentRoute}"]`)
        if (activeItem) {
            activeItem.classList.add('active')
        }
    }
}

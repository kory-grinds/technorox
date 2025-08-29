export class AdminSidebar {
    constructor(authManager) {
        this.authManager = authManager
        this.element = null
        this.currentPath = window.location.pathname
    }

    render() {
        this.element = document.createElement('aside')
        this.element.className = 'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-dark-800 border-r border-gray-700 z-30 overflow-y-auto'
        
        const profile = this.authManager.getUserProfile()
        
        this.element.innerHTML = `
            <div class="p-4">
                <!-- Admin Profile Section -->
                <div class="mb-6 p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-lg border border-neon-cyan/20">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                            <span class="text-black font-bold">
                                ${(profile?.displayName || 'A').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div class="text-white font-medium">${profile?.displayName || 'Admin'}</div>
                            <div class="text-xs text-neon-cyan">Administrator</div>
                        </div>
                    </div>
                </div>
                
                <!-- Navigation Menu -->
                <nav class="space-y-2">
                    <!-- Dashboard -->
                    <a href="/admin-dashboard" class="nav-item ${this.currentPath === '/admin-dashboard' ? 'active' : ''}" data-route="/admin-dashboard">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"/>
                        </svg>
                        <span>Admin Dashboard</span>
                    </a>
                    
                    <!-- Card Management -->
                    <div class="nav-section">
                        <div class="nav-section-title">Card Management</div>
                        <a href="/admin" class="nav-item ${this.currentPath === '/admin' ? 'active' : ''}" data-route="/admin">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span>Generate Cards</span>
                        </a>
                        <a href="/admin/card-library" class="nav-item ${this.currentPath === '/admin/card-library' ? 'active' : ''}" data-route="/admin/card-library">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span>Card Library</span>
                        </a>
                    </div>
                    
                    <!-- User Management -->
                    <div class="nav-section">
                        <div class="nav-section-title">User Management</div>
                        <a href="/admin/users" class="nav-item ${this.currentPath === '/admin/users' ? 'active' : ''}" data-route="/admin/users">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                            </svg>
                            <span>Manage Users</span>
                        </a>
                        <a href="/admin/user-roles" class="nav-item ${this.currentPath === '/admin/user-roles' ? 'active' : ''}" data-route="/admin/user-roles">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                            <span>User Roles</span>
                        </a>
                    </div>
                    
                    <!-- Analytics -->
                    <div class="nav-section">
                        <div class="nav-section-title">Analytics</div>
                        <a href="/admin/analytics" class="nav-item ${this.currentPath === '/admin/analytics' ? 'active' : ''}" data-route="/admin/analytics">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            <span>Analytics</span>
                        </a>
                        <a href="/admin/reports" class="nav-item ${this.currentPath === '/admin/reports' ? 'active' : ''}" data-route="/admin/reports">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <span>Reports</span>
                        </a>
                    </div>
                    
                    <!-- Game Management -->
                    <div class="nav-section">
                        <div class="nav-section-title">Game Management</div>
                        <a href="/admin/games" class="nav-item ${this.currentPath === '/admin/games' ? 'active' : ''}" data-route="/admin/games">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Active Games</span>
                        </a>
                        <a href="/admin/tournaments" class="nav-item ${this.currentPath === '/admin/tournaments' ? 'active' : ''}" data-route="/admin/tournaments">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                            </svg>
                            <span>Tournaments</span>
                        </a>
                    </div>
                    
                    <!-- Settings -->
                    <div class="nav-section">
                        <div class="nav-section-title">System</div>
                        <a href="/settings" class="nav-item ${this.currentPath === '/settings' ? 'active' : ''}" data-route="/settings">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>Settings</span>
                        </a>
                        <a href="/admin/system" class="nav-item ${this.currentPath === '/admin/system' ? 'active' : ''}" data-route="/admin/system">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                            </svg>
                            <span>System Status</span>
                        </a>
                    </div>
                </nav>
            </div>
        `
        
        this.setupEventListeners()
        this.addStyles()
        return this.element
    }
    
    addStyles() {
        // Add custom styles for the sidebar
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
        
        if (!document.querySelector('#admin-sidebar-styles')) {
            style.id = 'admin-sidebar-styles'
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

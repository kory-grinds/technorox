import { Router } from './utils/router-debug.js'
import { AuthManager } from './managers/AuthManager.js'
import { GameManager } from './managers/GameManager.js'
import { UIManager } from './managers/UIManager.js'

class App {
    constructor() {
        console.log('App constructor called')
        
        try {
            console.log('Creating Router...')
            this.router = new Router()
            console.log('Router created successfully:', this.router)
            console.log('Router has setAuthManager:', typeof this.router.setAuthManager === 'function')
            
            console.log('Creating AuthManager...')
            this.authManager = new AuthManager()
            
            console.log('Creating GameManager...')
            this.gameManager = new GameManager()
            
            console.log('Creating UIManager...')
            this.uiManager = new UIManager()
            
            console.log('All managers created, calling init...')
            this.init()
        } catch (error) {
            console.error('Error in App constructor:', error)
            console.error('Stack trace:', error.stack)
        }
    }
    
    async init() {
        console.log('App init called')
        
        try {
            // Initialize managers
            console.log('Initializing AuthManager...')
            await this.authManager.init()
            
            console.log('Initializing UIManager...')
            this.uiManager.init()
            
            // Connect auth manager to router
            console.log('Setting AuthManager on router...')
            console.log('Router object:', this.router)
            console.log('setAuthManager method:', this.router.setAuthManager)
            
            if (typeof this.router.setAuthManager === 'function') {
                this.router.setAuthManager(this.authManager)
                console.log('AuthManager set successfully')
            } else {
                console.error('setAuthManager is not a function!', typeof this.router.setAuthManager)
                console.error('Router methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.router)))
            }
            
            // Set up routing
            console.log('Setting up routes...')
            this.setupRoutes()
            
            // Start the router
            console.log('Starting router...')
            this.router.init()
            
            console.log('Technorox TCG initialized successfully')
        } catch (error) {
            console.error('Error in App init:', error)
            console.error('Stack trace:', error.stack)
        }
    }
    
    setupRoutes() {
        console.log('Setting up routes...')
        
        try {
            // Public routes
            this.router.addRoute('/', () => this.loadPage('home'), { isPublic: true })
            this.router.addRoute('/about', () => this.loadPage('about'), { isPublic: true })
            this.router.addRoute('/login', () => this.loadPage('login'), { isPublic: true })
            this.router.addRoute('/register', () => this.loadPage('register'), { isPublic: true })
            
            // Player routes
            this.router.addRoute('/player-dashboard', () => this.loadPage('player-dashboard'), { requiredRole: 'player' })
            this.router.addRoute('/deck-builder', () => this.loadPage('deck-builder'))
            this.router.addRoute('/game', () => this.loadPage('game'))
            this.router.addRoute('/collection', () => this.loadPage('collection'))
            this.router.addRoute('/packs', () => this.loadPage('packs'))
            this.router.addRoute('/leaderboard', () => this.loadPage('leaderboard'))
            this.router.addRoute('/matchmaking', () => this.loadPage('matchmaking'))
            this.router.addRoute('/tournaments', () => this.loadPage('tournaments'))
            this.router.addRoute('/friends', () => this.loadPage('friends'))
            this.router.addRoute('/guilds', () => this.loadPage('guilds'))
            this.router.addRoute('/profile', () => this.loadPage('profile'))
            
            // Admin routes
            this.router.addRoute('/admin-dashboard', () => this.loadPage('admin-dashboard'), { requiredRole: 'admin' })
            this.router.addRoute('/admin', () => this.loadPage('admin'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/users', () => this.loadPage('admin-users'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/analytics', () => this.loadPage('admin-analytics'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/card-library', () => this.loadPage('admin-card-library'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/user-roles', () => this.loadPage('admin-user-roles'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/reports', () => this.loadPage('admin-reports'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/games', () => this.loadPage('admin-games'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/tournaments', () => this.loadPage('admin-tournaments'), { requiredRole: 'admin' })
            this.router.addRoute('/admin/system', () => this.loadPage('admin-system'), { requiredRole: 'admin' })
            
            // Shared authenticated routes
            this.router.addRoute('/settings', () => this.loadPage('settings'))
            this.router.addRoute('/store', () => this.loadPage('store'))
            this.router.addRoute('/missions', () => this.loadPage('missions'))
            this.router.addRoute('/purchase-success', () => this.loadPage('purchase-success'))
            
            // Legacy routes for backward compatibility
            this.router.addRoute('/dashboard', () => {
                const userRole = this.authManager.getUserProfile()?.role
                if (userRole === 'admin') {
                    this.router.navigate('/admin-dashboard')
                } else {
                    this.router.navigate('/player-dashboard')
                }
            })
            
            console.log('Routes set up successfully')
        } catch (error) {
            console.error('Error setting up routes:', error)
        }
    }
    
    async loadPage(pageName) {
        console.log('Loading page:', pageName)
        
        try {
            const { default: PageClass } = await import(`./pages/${pageName}.js`)
            const page = new PageClass()
            this.uiManager.renderPage(page)
            
            // Make deck builder available globally if it's the deck builder page
            if (pageName === 'deck-builder' && this.uiManager.currentPage) {
                window.technorox.deckBuilder = this.uiManager.currentPage
            }
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error)
            this.uiManager.showError('Page not found')
        }
    }
}

export function initializeApp() {
    console.log('Initializing Technorox app...')
    window.technorox = new App()
}

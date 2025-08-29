export class Router {
    constructor() {
        this.routes = new Map()
        this.currentRoute = null
        this.authManager = null
        this.currentLayout = null
    }
    
    setAuthManager(authManager) {
        this.authManager = authManager
        console.log('AuthManager set on router:', !!authManager)
    }
    
    addRoute(path, handler, options = {}) {
        this.routes.set(path, { handler, ...options })
    }
    
    init() {
        // Handle initial route
        this.handleRoute()
        
        // Listen for navigation events
        window.addEventListener('popstate', () => this.handleRoute())
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault()
                const path = e.target.getAttribute('data-route')
                this.navigate(path)
            }
        })
    }
    
    navigate(path) {
        window.history.pushState({}, '', path)
        this.handleRoute()
    }
    
    async handleRoute() {
        const path = window.location.pathname
        const route = this.routes.get(path)
        
        if (route) {
            // Check authentication and role requirements
            if (await this.checkRouteAccess(route, path)) {
                this.currentRoute = path
                await this.setupLayout(route)
                route.handler()
            }
        } else {
            // Try to find a matching route with parameters
            const matchedRoute = this.findMatchingRoute(path)
            if (matchedRoute) {
                if (await this.checkRouteAccess(matchedRoute.route, path)) {
                    this.currentRoute = path
                    await this.setupLayout(matchedRoute.route)
                    matchedRoute.route.handler(matchedRoute.params)
                }
            } else {
                // Default to appropriate home page based on auth status
                this.redirectToDefault()
            }
        }
    }
    
    async checkRouteAccess(route, path) {
        // Public routes don't need authentication
        if (route.isPublic) {
            return true
        }
        
        // Check if user is authenticated
        if (!this.authManager || !this.authManager.isAuthenticated()) {
            this.navigate('/login')
            return false
        }
        
        // Check role requirements
        if (route.requiredRole) {
            const userProfile = this.authManager.getUserProfile()
            if (!userProfile || userProfile.role !== route.requiredRole) {
                // Redirect to appropriate dashboard based on user role
                const defaultRoute = this.authManager.getDefaultRoute ? this.authManager.getDefaultRoute() : '/player-dashboard'
                if (defaultRoute !== path) {
                    this.navigate(defaultRoute)
                    return false
                }
            }
        }
        
        return true
    }
    
    findMatchingRoute(path) {
        // Simple parameter matching for routes like /admin/users/:id
        for (const [routePath, route] of this.routes) {
            if (routePath.includes(':')) {
                const routeRegex = new RegExp('^' + routePath.replace(/:[^/]+/g, '([^/]+)') + '$')
                const match = path.match(routeRegex)
                if (match) {
                    const paramNames = routePath.match(/:[^/]+/g)?.map(p => p.substring(1)) || []
                    const params = {}
                    paramNames.forEach((name, index) => {
                        params[name] = match[index + 1]
                    })
                    return { route, params }
                }
            }
        }
        return null
    }
    
    async setupLayout(route) {
        const isAuthenticated = this.authManager?.isAuthenticated()
        const userProfile = this.authManager?.getUserProfile()
        
        // Determine layout type
        let layoutType = 'public'
        if (isAuthenticated) {
            layoutType = userProfile?.role === 'admin' ? 'admin' : 'player'
        }
        
        // Only change layout if different from current
        if (this.currentLayout !== layoutType) {
            await this.renderLayout(layoutType)
            this.currentLayout = layoutType
        }
    }
    
    async renderLayout(layoutType) {
        const app = document.getElementById('app')
        
        if (layoutType === 'public') {
            // Public layout (existing header/footer)
            app.className = 'min-h-screen bg-dark-900'
        } else {
            // Authenticated layout with sidebar
            app.className = 'min-h-screen bg-dark-900'
            
            // Import and render appropriate components
            if (layoutType === 'admin') {
                const { AuthenticatedHeader } = await import('../components/AuthenticatedHeader.js')
                const { AuthenticatedFooter } = await import('../components/AuthenticatedFooter.js')
                const { AdminSidebar } = await import('../components/AdminSidebar.js')
                
                this.renderAuthenticatedLayout(AuthenticatedHeader, AuthenticatedFooter, AdminSidebar)
            } else if (layoutType === 'player') {
                const { AuthenticatedHeader } = await import('../components/AuthenticatedHeader.js')
                const { AuthenticatedFooter } = await import('../components/AuthenticatedFooter.js')
                const { PlayerSidebar } = await import('../components/PlayerSidebar.js')
                
                this.renderAuthenticatedLayout(AuthenticatedHeader, AuthenticatedFooter, PlayerSidebar)
            }
        }
    }
    
    renderAuthenticatedLayout(HeaderClass, FooterClass, SidebarClass) {
        const app = document.getElementById('app')
        
        // Clear existing layout components
        const existingHeader = document.querySelector('header')
        const existingFooter = document.querySelector('footer')
        const existingSidebar = document.querySelector('aside')
        
        if (existingHeader) existingHeader.remove()
        if (existingFooter) existingFooter.remove()
        if (existingSidebar) existingSidebar.remove()
        
        // Create new layout components
        const header = new HeaderClass(this.authManager)
        const footer = new FooterClass()
        const sidebar = new SidebarClass(this.authManager)
        
        // Insert components
        app.insertBefore(header.render(), app.firstChild)
        app.appendChild(footer.render())
        app.insertBefore(sidebar.render(), app.children[1]) // After header, before content
    }
    
    redirectToDefault() {
        if (this.authManager?.isAuthenticated()) {
            const defaultRoute = this.authManager.getDefaultRoute ? this.authManager.getDefaultRoute() : '/player-dashboard'
            this.navigate(defaultRoute)
        } else {
            this.navigate('/')
        }
    }
    
    getCurrentRoute() {
        return this.currentRoute
    }
}

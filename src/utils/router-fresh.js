export class Router {
    constructor() {
        console.log('🔧 Router constructor called')
        this.routes = new Map()
        this.currentRoute = null
        this.authManager = null
        this.currentLayout = null
        console.log('🔧 Router initialized')
    }
    
    setAuthManager(authManager) {
        console.log('🔧 setAuthManager called with:', authManager)
        this.authManager = authManager
        console.log('🔧 AuthManager set successfully')
    }
    
    addRoute(path, handler, options = {}) {
        this.routes.set(path, { handler, ...options })
    }
    
    init() {
        console.log('🔧 Router init called')
        this.handleRoute()
        
        window.addEventListener('popstate', () => this.handleRoute())
        
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
            if (await this.checkRouteAccess(route, path)) {
                this.currentRoute = path
                await this.setupLayout(route)
                route.handler()
            }
        } else {
            const matchedRoute = this.findMatchingRoute(path)
            if (matchedRoute) {
                if (await this.checkRouteAccess(matchedRoute.route, path)) {
                    this.currentRoute = path
                    await this.setupLayout(matchedRoute.route)
                    matchedRoute.route.handler(matchedRoute.params)
                }
            } else {
                this.redirectToDefault()
            }
        }
    }
    
    async checkRouteAccess(route, path) {
        if (route.isPublic) {
            return true
        }
        
        if (!this.authManager || !this.authManager.isAuthenticated()) {
            this.navigate('/login')
            return false
        }
        
        if (route.requiredRole) {
            const userProfile = this.authManager.getUserProfile()
            if (!userProfile || userProfile.role !== route.requiredRole) {
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
        
        let layoutType = 'public'
        if (isAuthenticated) {
            layoutType = userProfile?.role === 'admin' ? 'admin' : 'player'
        }
        
        if (this.currentLayout !== layoutType) {
            await this.renderLayout(layoutType)
            this.currentLayout = layoutType
        }
    }
    
    async renderLayout(layoutType) {
        const app = document.getElementById('app')
        
        if (layoutType === 'public') {
            app.className = 'min-h-screen bg-dark-900'
        } else {
            app.className = 'min-h-screen bg-dark-900'
            
            if (layoutType === 'admin') {
                try {
                    const { AuthenticatedHeader } = await import('../components/AuthenticatedHeader.js')
                    const { AuthenticatedFooter } = await import('../components/AuthenticatedFooter.js')
                    const { AdminSidebar } = await import('../components/AdminSidebar.js')
                    
                    this.renderAuthenticatedLayout(AuthenticatedHeader, AuthenticatedFooter, AdminSidebar)
                } catch (error) {
                    console.error('Error loading admin layout components:', error)
                }
            } else if (layoutType === 'player') {
                try {
                    const { AuthenticatedHeader } = await import('../components/AuthenticatedHeader.js')
                    const { AuthenticatedFooter } = await import('../components/AuthenticatedFooter.js')
                    const { PlayerSidebar } = await import('../components/PlayerSidebar.js')
                    
                    this.renderAuthenticatedLayout(AuthenticatedHeader, AuthenticatedFooter, PlayerSidebar)
                } catch (error) {
                    console.error('Error loading player layout components:', error)
                }
            }
        }
    }
    
    renderAuthenticatedLayout(HeaderClass, FooterClass, SidebarClass) {
        const app = document.getElementById('app')
        
        const existingHeader = document.querySelector('header')
        const existingFooter = document.querySelector('footer')
        const existingSidebar = document.querySelector('aside')
        
        if (existingHeader) existingHeader.remove()
        if (existingFooter) existingFooter.remove()
        if (existingSidebar) existingSidebar.remove()
        
        const header = new HeaderClass(this.authManager)
        const footer = new FooterClass()
        const sidebar = new SidebarClass(this.authManager)
        
        app.insertBefore(header.render(), app.firstChild)
        app.appendChild(footer.render())
        app.insertBefore(sidebar.render(), app.children[1])
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

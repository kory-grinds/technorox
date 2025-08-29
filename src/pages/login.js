import { BasePage } from './BasePage.js'

export default class LoginPage extends BasePage {
    constructor() {
        super()
        this.isPublic = true
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'min-h-screen flex items-center justify-center py-12 px-4'
        
        content.innerHTML = `
            <div class="max-w-md w-full space-y-8">
                <!-- Header -->
                <div class="text-center">
                    <h1 class="text-4xl font-cyber font-bold mb-2">
                        <span class="neon-text">Access Terminal</span>
                    </h1>
                    <p class="text-gray-400">Enter your credentials to jack into the grid</p>
                </div>
                
                <!-- Login Form -->
                <div class="cyber-card">
                    <form id="loginForm" class="space-y-6">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                required 
                                class="cyber-input w-full"
                                placeholder="user@technorox.com"
                            >
                        </div>
                        
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                required 
                                class="cyber-input w-full"
                                placeholder="••••••••"
                            >
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input 
                                    id="remember" 
                                    name="remember" 
                                    type="checkbox" 
                                    class="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-600 rounded bg-cyber-dark"
                                >
                                <label for="remember" class="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            
                            <div class="text-sm">
                                <a href="#" class="text-neon-cyan hover:text-white transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <button 
                                type="submit" 
                                class="cyber-button w-full"
                                id="loginButton"
                            >
                                <span id="loginButtonText">Initialize Connection</span>
                                <div id="loginSpinner" class="hidden animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full ml-2"></div>
                            </button>
                        </div>
                        
                        <!-- Error Message -->
                        <div id="errorMessage" class="hidden bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm"></div>
                        
                        <!-- Social Login -->
                        <div class="mt-6">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-600"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-2 bg-neon-gray text-gray-400">Or continue with</span>
                                </div>
                            </div>
                            
                            <div class="mt-6 grid grid-cols-2 gap-3">
                                <button 
                                    type="button" 
                                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-cyber-dark text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                                    id="googleLogin"
                                >
                                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span class="ml-2">Google</span>
                                </button>
                                
                                <button 
                                    type="button" 
                                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-cyber-dark text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                                    id="discordLogin"
                                >
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                    </svg>
                                    <span class="ml-2">Discord</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                
                <!-- Sign Up Link -->
                <div class="text-center">
                    <p class="text-gray-400">
                        New to the grid? 
                        <a href="/register" data-route="/register" class="text-neon-cyan hover:text-white transition-colors font-medium">
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
        `
        
        return content
    }
    
    init() {
        this.setupEventListeners()
    }
    
    setupEventListeners() {
        const form = this.element.querySelector('#loginForm')
        const loginButton = this.element.querySelector('#loginButton')
        const loginButtonText = this.element.querySelector('#loginButtonText')
        const loginSpinner = this.element.querySelector('#loginSpinner')
        const errorMessage = this.element.querySelector('#errorMessage')
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const email = form.email.value.trim()
            const password = form.password.value
            
            if (!email || !password) {
                this.showError('Please fill in all fields')
                return
            }
            
            // Show loading state
            loginButton.disabled = true
            loginButtonText.textContent = 'Connecting...'
            loginSpinner.classList.remove('hidden')
            this.hideError()
            
            try {
                const authManager = window.technorox.authManager
                const result = await authManager.login(email, password)
                
                if (result.success) {
                    window.technorox.uiManager.showSuccess('Connection established! Welcome back.')
                    
                    // Redirect to dashboard or intended page
                    const urlParams = new URLSearchParams(window.location.search)
                    const redirect = urlParams.get('redirect') || '/dashboard'
                    window.technorox.router.navigate(redirect)
                } else {
                    this.showError(result.error || 'Login failed. Please try again.')
                }
            } catch (error) {
                console.error('Login error:', error)
                this.showError('Connection failed. Please check your network and try again.')
            } finally {
                // Reset button state
                loginButton.disabled = false
                loginButtonText.textContent = 'Initialize Connection'
                loginSpinner.classList.add('hidden')
            }
        })
        
        // Social login buttons (placeholder functionality)
        this.element.querySelector('#googleLogin').addEventListener('click', () => {
            window.technorox.uiManager.showInfo('Google login coming soon!')
        })
        
        this.element.querySelector('#discordLogin').addEventListener('click', () => {
            window.technorox.uiManager.showInfo('Discord login coming soon!')
        })
    }
    
    showError(message) {
        const errorElement = this.element.querySelector('#errorMessage')
        errorElement.textContent = message
        errorElement.classList.remove('hidden')
    }
    
    hideError() {
        const errorElement = this.element.querySelector('#errorMessage')
        errorElement.classList.add('hidden')
    }
}

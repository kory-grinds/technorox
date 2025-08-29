import { BasePage } from './BasePage.js'

export default class RegisterPage extends BasePage {
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
                        <span class="neon-text">Join the Grid</span>
                    </h1>
                    <p class="text-gray-400">Create your account and enter the cyberpunk arena</p>
                </div>
                
                <!-- Registration Form -->
                <div class="cyber-card">
                    <form id="registerForm" class="space-y-6">
                        <div>
                            <label for="displayName" class="block text-sm font-medium text-gray-300 mb-2">
                                Display Name
                            </label>
                            <input 
                                id="displayName" 
                                name="displayName" 
                                type="text" 
                                required 
                                class="cyber-input w-full"
                                placeholder="CyberWarrior"
                                maxlength="20"
                            >
                            <p class="text-xs text-gray-500 mt-1">This will be your name in the arena</p>
                        </div>
                        
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
                                minlength="6"
                            >
                            <div id="passwordStrength" class="mt-2 text-xs">
                                <div class="flex space-x-1">
                                    <div class="h-1 w-full bg-gray-600 rounded"></div>
                                    <div class="h-1 w-full bg-gray-600 rounded"></div>
                                    <div class="h-1 w-full bg-gray-600 rounded"></div>
                                    <div class="h-1 w-full bg-gray-600 rounded"></div>
                                </div>
                                <p class="text-gray-500 mt-1">Password strength: <span id="strengthText">Enter password</span></p>
                            </div>
                        </div>
                        
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type="password" 
                                required 
                                class="cyber-input w-full"
                                placeholder="••••••••"
                            >
                        </div>
                        
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input 
                                    id="terms" 
                                    name="terms" 
                                    type="checkbox" 
                                    required
                                    class="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-600 rounded bg-cyber-dark"
                                >
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="text-gray-300">
                                    I agree to the 
                                    <a href="/terms-of-service" target="_blank" class="text-neon-cyan hover:text-white transition-colors underline">Terms of Service</a>
                                    and 
                                    <a href="/privacy-policy" target="_blank" class="text-neon-cyan hover:text-white transition-colors underline">Privacy Policy</a>
                                </label>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input 
                                    id="newsletter" 
                                    name="newsletter" 
                                    type="checkbox" 
                                    class="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-600 rounded bg-cyber-dark"
                                >
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="newsletter" class="text-gray-300">
                                    Subscribe to updates about new cards, tournaments, and events
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <button 
                                type="submit" 
                                class="cyber-button w-full"
                                id="registerButton"
                            >
                                <span id="registerButtonText">Initialize Neural Link</span>
                                <div id="registerSpinner" class="hidden animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full ml-2"></div>
                            </button>
                        </div>
                        
                        <!-- Error Message -->
                        <div id="errorMessage" class="hidden bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm"></div>
                        
                        <!-- Social Registration -->
                        <div class="mt-6">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-600"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-2 bg-neon-gray text-gray-400">Or register with</span>
                                </div>
                            </div>
                            
                            <div class="mt-6 grid grid-cols-2 gap-3">
                                <button 
                                    type="button" 
                                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-cyber-dark text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                                    id="googleRegister"
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
                                    id="discordRegister"
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
                
                <!-- Login Link -->
                <div class="text-center">
                    <p class="text-gray-400">
                        Already have an account? 
                        <a href="/login" data-route="/login" class="text-neon-cyan hover:text-white transition-colors font-medium">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        `
        
        return content
    }
    
    init() {
        this.setupEventListeners()
        this.setupPasswordStrength()
    }
    
    setupEventListeners() {
        const form = this.element.querySelector('#registerForm')
        const registerButton = this.element.querySelector('#registerButton')
        const registerButtonText = this.element.querySelector('#registerButtonText')
        const registerSpinner = this.element.querySelector('#registerSpinner')
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const displayName = form.displayName.value.trim()
            const email = form.email.value.trim()
            const password = form.password.value
            const confirmPassword = form.confirmPassword.value
            const terms = form.terms.checked
            const newsletter = form.newsletter.checked
            
            // Validation
            if (!displayName || !email || !password || !confirmPassword) {
                this.showError('Please fill in all required fields')
                return
            }
            
            if (password !== confirmPassword) {
                this.showError('Passwords do not match')
                return
            }
            
            if (password.length < 6) {
                this.showError('Password must be at least 6 characters long')
                return
            }
            
            if (!terms) {
                this.showError('You must agree to the Terms of Service')
                return
            }
            
            // Show loading state
            registerButton.disabled = true
            registerButtonText.textContent = 'Establishing Link...'
            registerSpinner.classList.remove('hidden')
            this.hideError()
            
            try {
                const authManager = window.technorox.authManager
                const result = await authManager.register(email, password, displayName, newsletter)
                
                if (result.success) {
                    window.technorox.uiManager.showSuccess('Neural link established! Welcome to the grid.')
                    
                    // Redirect to dashboard
                    window.technorox.router.navigate('/dashboard')
                } else {
                    this.showError(result.error || 'Registration failed. Please try again.')
                }
            } catch (error) {
                console.error('Registration error:', error)
                this.showError('Connection failed. Please check your network and try again.')
            } finally {
                // Reset button state
                registerButton.disabled = false
                registerButtonText.textContent = 'Initialize Neural Link'
                registerSpinner.classList.add('hidden')
            }
        })
        
        // Social registration buttons (placeholder functionality)
        this.element.querySelector('#googleRegister').addEventListener('click', () => {
            window.technorox.uiManager.showInfo('Google registration coming soon!')
        })
        
        this.element.querySelector('#discordRegister').addEventListener('click', () => {
            window.technorox.uiManager.showInfo('Discord registration coming soon!')
        })
    }
    
    setupPasswordStrength() {
        const passwordInput = this.element.querySelector('#password')
        const strengthBars = this.element.querySelectorAll('#passwordStrength .h-1')
        const strengthText = this.element.querySelector('#strengthText')
        
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value
            const strength = this.calculatePasswordStrength(password)
            
            // Reset all bars
            strengthBars.forEach(bar => {
                bar.className = 'h-1 w-full bg-gray-600 rounded'
            })
            
            // Color bars based on strength
            const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
            const labels = ['Weak', 'Fair', 'Good', 'Strong']
            
            if (password.length === 0) {
                strengthText.textContent = 'Enter password'
                return
            }
            
            for (let i = 0; i < strength; i++) {
                strengthBars[i].className = `h-1 w-full ${colors[strength - 1]} rounded`
            }
            
            strengthText.textContent = labels[strength - 1] || 'Very Weak'
        })
    }
    
    calculatePasswordStrength(password) {
        let strength = 0
        
        if (password.length >= 6) strength++
        if (password.length >= 10) strength++
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        
        return Math.min(strength, 4)
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

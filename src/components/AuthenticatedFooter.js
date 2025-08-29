export class AuthenticatedFooter {
    constructor() {
        this.element = null
    }

    render() {
        this.element = document.createElement('footer')
        this.element.className = 'bg-dark-900 border-t border-gray-800 mt-auto'
        
        this.element.innerHTML = `
            <div class="container mx-auto px-4 py-6">
                <!-- Main Footer Content -->
                <div class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 mb-4">
                    <div class="flex items-center space-x-4 mb-4 md:mb-0">
                        <span>&copy; 2024 KAAI TECH LLC</span>
                        <span class="text-gray-600">|</span>
                        <span class="text-neon-cyan">Technorox TCG v1.0.0</span>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <button class="hover:text-neon-cyan transition-colors" title="Help">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                        
                        <div class="flex items-center space-x-1">
                            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span class="text-xs">Online</span>
                        </div>
                    </div>
                </div>
                
                <!-- Legal Links -->
                <div class="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800">
                    <div class="flex items-center space-x-4 mb-2 md:mb-0">
                        <a href="/terms-of-service" target="_blank" class="hover:text-neon-cyan transition-colors">Terms of Service</a>
                        <span class="text-gray-700">|</span>
                        <a href="/privacy-policy" target="_blank" class="hover:text-neon-cyan transition-colors">Privacy Policy</a>
                        <span class="text-gray-700">|</span>
                        <span>Powered by KAAI TECH LLC</span>
                    </div>
                    
                    <div class="text-gray-600">
                        Secure payments by Stripe
                    </div>
                </div>
            </div>
        `
        
        this.setupEventListeners()
        return this.element
    }
    
    setupEventListeners() {
        // Help button
        const helpButton = this.element.querySelector('button[title="Help"]')
        helpButton.addEventListener('click', () => {
            // Show help modal or navigate to help page
            window.technorox?.uiManager?.showInfo('Help system coming soon!')
        })
    }
}

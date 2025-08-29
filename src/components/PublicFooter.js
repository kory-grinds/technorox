export class PublicFooter {
    constructor() {
        this.element = null
    }

    render() {
        this.element = document.createElement('footer')
        this.element.className = 'bg-dark-900 border-t border-gray-800 mt-auto'
        
        this.element.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <!-- Main Footer Content -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <!-- Brand -->
                    <div class="md:col-span-2">
                        <div class="flex items-center space-x-3 mb-4">
                            <img src="/favicon.svg" alt="Technorox" class="w-8 h-8">
                            <span class="text-2xl font-bold text-neon-cyan">Technorox TCG</span>
                        </div>
                        <p class="text-gray-400 text-sm mb-4 max-w-md">
                            Enter the cyberpunk grid where cybernetic beasts clash in strategic combat. 
                            Build your deck, hack the system, dominate the digital realm.
                        </p>
                        <p class="text-xs text-gray-500">
                            A product of <strong class="text-neon-cyan">KAAI TECH LLC</strong>
                        </p>
                    </div>
                    
                    <!-- Game Links -->
                    <div>
                        <h3 class="text-white font-semibold mb-4">Game</h3>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/register" data-route="/register" class="hover:text-neon-cyan transition-colors">Play Now</a></li>
                            <li><a href="/about" data-route="/about" class="hover:text-neon-cyan transition-colors">About</a></li>
                            <li><a href="/login" data-route="/login" class="hover:text-neon-cyan transition-colors">Login</a></li>
                        </ul>
                    </div>
                    
                    <!-- Support -->
                    <div>
                        <h3 class="text-white font-semibold mb-4">Support</h3>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="mailto:support@technorox.com" class="hover:text-neon-cyan transition-colors">Contact Us</a></li>
                            <li><a href="mailto:support@technorox.com" class="hover:text-neon-cyan transition-colors">Help Center</a></li>
                            <li><a href="mailto:bug-reports@technorox.com" class="hover:text-neon-cyan transition-colors">Report Bug</a></li>
                        </ul>
                    </div>
                </div>
                
                <!-- Legal Links -->
                <div class="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 pt-6 border-t border-gray-800">
                    <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
                        <span>&copy; ${new Date().getFullYear()} KAAI TECH LLC. All rights reserved.</span>
                        <div class="flex items-center space-x-4">
                            <a href="/terms-of-service" target="_blank" class="hover:text-neon-cyan transition-colors">Terms of Service</a>
                            <span class="text-gray-700">|</span>
                            <a href="/privacy-policy" target="_blank" class="hover:text-neon-cyan transition-colors">Privacy Policy</a>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-gray-600">
                        <span>Secure payments by Stripe</span>
                        <span class="text-gray-700">|</span>
                        <span>Powered by Firebase</span>
                    </div>
                </div>
                
                <!-- Additional Legal Notice -->
                <div class="mt-4 pt-4 border-t border-gray-800 text-center">
                    <p class="text-xs text-gray-600">
                        Technorox is a trademark of KAAI TECH LLC. When purchasing Rox Chips or other items, 
                        "KAAI TECH LLC" will appear as the merchant on your payment statements.
                    </p>
                </div>
            </div>
        `
        
        this.setupEventListeners()
        return this.element
    }
    
    setupEventListeners() {
        // Handle internal navigation links
        const navLinks = this.element.querySelectorAll('a[data-route]')
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const route = link.getAttribute('data-route')
                if (window.technorox?.router) {
                    window.technorox.router.navigate(route)
                }
            })
        })
    }
}

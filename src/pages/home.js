import { BasePage } from './BasePage.js'

export default class HomePage extends BasePage {
    constructor() {
        super()
        this.isPublic = true
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'relative'
        
        content.innerHTML = `
            <!-- Hero Section -->
            <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
                <!-- Animated Background -->
                <div class="absolute inset-0 cyber-grid opacity-20"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/20"></div>
                
                <!-- Floating Elements -->
                <div class="absolute top-20 left-10 w-32 h-32 border border-neon-cyan/30 rounded-lg animate-pulse-neon"></div>
                <div class="absolute bottom-20 right-10 w-24 h-24 border border-neon-magenta/30 rounded-full animate-pulse-neon"></div>
                <div class="absolute top-1/2 left-20 w-16 h-16 border border-neon-cyan/20 rotate-45"></div>
                
                <div class="container mx-auto px-4 text-center relative z-10">
                    <h1 class="text-6xl md:text-8xl font-cyber font-bold mb-6">
                        <span class="neon-text animate-glow">TECHNO</span>
                        <span class="text-neon-magenta animate-glow">ROX</span>
                    </h1>
                    
                    <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Enter the cyberpunk grid where cybernetic beasts clash in strategic combat. 
                        Build your deck, hack the system, dominate the digital realm.
                    </p>
                    
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        ${this.isAuthenticated() ? `
                            <a href="/dashboard" data-route="/dashboard" class="cyber-button text-lg px-8 py-4">
                                Enter the Grid
                            </a>
                            <a href="/game" data-route="/game" class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-4 px-8 rounded-lg transition-all duration-300">
                                Quick Match
                            </a>
                        ` : `
                            <a href="/register" data-route="/register" class="cyber-button text-lg px-8 py-4">
                                Join the Grid
                            </a>
                            <a href="/login" data-route="/login" class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-4 px-8 rounded-lg transition-all duration-300">
                                Access Terminal
                            </a>
                        `}
                    </div>
                    
                    <!-- Game Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div class="cyber-card text-center">
                            <div class="neon-text text-3xl font-bold">1,000+</div>
                            <div class="text-gray-400">Active Players</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="neon-text text-3xl font-bold">500+</div>
                            <div class="text-gray-400">Unique Cards</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="neon-text text-3xl font-bold">10K+</div>
                            <div class="text-gray-400">Matches Played</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="neon-text text-3xl font-bold">24/7</div>
                            <div class="text-gray-400">Online</div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Features Section -->
            <section class="py-20 bg-gradient-to-b from-transparent to-cyber-dark/50">
                <div class="container mx-auto px-4">
                    <h2 class="text-4xl font-cyber font-bold text-center mb-16">
                        <span class="neon-text">Game Features</span>
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="cyber-card text-center group hover:scale-105 transition-transform duration-300">
                            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-lg flex items-center justify-center">
                                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-neon-cyan">Data Stream System</h3>
                            <p class="text-gray-400">Dynamic resource management with escalating power levels throughout the match.</p>
                        </div>
                        
                        <div class="cyber-card text-center group hover:scale-105 transition-transform duration-300">
                            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-magenta to-purple-500 rounded-lg flex items-center justify-center">
                                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-neon-magenta">Modular Upgrades</h3>
                            <p class="text-gray-400">Enhance your creatures with cybernetic mods and equipment for tactical advantages.</p>
                        </div>
                        
                        <div class="cyber-card text-center group hover:scale-105 transition-transform duration-300">
                            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-green-400">Competitive Play</h3>
                            <p class="text-gray-400">Ranked matches, tournaments, and leaderboards with seasonal rewards.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Card Types Section -->
            <section class="py-20">
                <div class="container mx-auto px-4">
                    <h2 class="text-4xl font-cyber font-bold text-center mb-16">
                        <span class="neon-text">Card Types</span>
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="cyber-card group hover:border-neon-cyan/60 transition-all duration-300">
                            <div class="h-32 bg-gradient-to-br from-neon-cyan/20 to-blue-500/20 rounded-lg mb-4 flex items-center justify-center">
                                <span class="text-4xl">🐺</span>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-neon-cyan">Creatures</h3>
                            <p class="text-gray-400 text-sm">Cybernetic beasts and AI constructs that battle on the digital battlefield.</p>
                        </div>
                        
                        <div class="cyber-card group hover:border-neon-magenta/60 transition-all duration-300">
                            <div class="h-32 bg-gradient-to-br from-neon-magenta/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                                <span class="text-4xl">⚙️</span>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-neon-magenta">Mod Cards</h3>
                            <p class="text-gray-400 text-sm">Upgrades and enhancements that modify creature abilities and stats.</p>
                        </div>
                        
                        <div class="cyber-card group hover:border-green-400/60 transition-all duration-300">
                            <div class="h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-lg mb-4 flex items-center justify-center">
                                <span class="text-4xl">💾</span>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-green-400">Data Cards</h3>
                            <p class="text-gray-400 text-sm">Hacks, viruses, and protocols that manipulate the game state.</p>
                        </div>
                        
                        <div class="cyber-card group hover:border-yellow-400/60 transition-all duration-300">
                            <div class="h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg mb-4 flex items-center justify-center">
                                <span class="text-4xl">🌐</span>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-yellow-400">Realm Cards</h3>
                            <p class="text-gray-400 text-sm">Environmental effects that change the rules of engagement.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- CTA Section -->
            <section class="py-20 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20">
                <div class="container mx-auto px-4 text-center">
                    <h2 class="text-4xl font-cyber font-bold mb-6">
                        <span class="neon-text">Ready to Jack In?</span>
                    </h2>
                    <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of players in the ultimate cyberpunk card game experience. 
                        Build your deck, master the grid, become a legend.
                    </p>
                    
                    ${!this.isAuthenticated() ? `
                        <a href="/register" data-route="/register" class="cyber-button text-lg px-8 py-4">
                            Start Playing Now
                        </a>
                    ` : `
                        <a href="/game" data-route="/game" class="cyber-button text-lg px-8 py-4">
                            Enter Battle
                        </a>
                    `}
                </div>
            </section>
        `
        
        return content
    }
    
    init() {
        // Add any interactive elements or animations here
        this.animateElements()
    }
    
    animateElements() {
        // Add subtle animations to floating elements
        const floatingElements = this.element.querySelectorAll('.animate-pulse-neon')
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.5}s`
        })
    }
}

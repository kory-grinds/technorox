import { BasePage } from './BasePage.js'

export default class AboutPage extends BasePage {
    constructor() {
        super()
        this.isPublic = true
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'py-12'
        
        content.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Hero Section -->
                <section class="text-center mb-16">
                    <h1 class="text-5xl font-cyber font-bold mb-6">
                        <span class="neon-text">About Technorox</span>
                    </h1>
                    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                        Welcome to the cyberpunk grid where strategy meets style. Learn the rules, 
                        master the mechanics, and dominate the digital battlefield.
                    </p>
                </section>
                
                <!-- Game Overview -->
                <section class="mb-16">
                    <div class="cyber-card">
                        <h2 class="text-3xl font-cyber font-bold mb-6 text-neon-cyan">Game Overview</h2>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-300 mb-4">
                                    Technorox is a strategic trading card game set in a cyberpunk future where 
                                    cybernetic creatures battle for control of the digital realm. Players build 
                                    40-card decks and engage in tactical combat using the innovative Data Stream 
                                    resource system.
                                </p>
                                <p class="text-gray-300 mb-4">
                                    Each match is a battle of wits where players must carefully manage their 
                                    resources, time their plays perfectly, and adapt to their opponent's strategy 
                                    to achieve victory.
                                </p>
                            </div>
                            <div class="cyber-card bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10">
                                <h3 class="text-xl font-bold mb-4 text-neon-magenta">Quick Facts</h3>
                                <ul class="space-y-2 text-gray-300">
                                    <li>• <strong>Players:</strong> 1v1 matches</li>
                                    <li>• <strong>Deck Size:</strong> 40 cards</li>
                                    <li>• <strong>Starting Hand:</strong> 5 cards</li>
                                    <li>• <strong>Starting Life:</strong> 50 Core Integrity</li>
                                    <li>• <strong>Starting Energy:</strong> 3 Data Streams</li>
                                    <li>• <strong>Max Energy:</strong> 10 Data Streams</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- How to Play -->
                <section class="mb-16">
                    <h2 class="text-3xl font-cyber font-bold mb-8 text-center">
                        <span class="neon-text">How to Play</span>
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="cyber-card">
                            <div class="w-12 h-12 bg-neon-cyan rounded-lg flex items-center justify-center mb-4">
                                <span class="text-black font-bold text-xl">1</span>
                            </div>
                            <h3 class="text-xl font-bold mb-3 text-neon-cyan">Build Your Deck</h3>
                            <p class="text-gray-300">
                                Construct a 40-card deck using creatures, mods, data cards, and realms. 
                                Balance offense, defense, and utility to create your perfect strategy.
                            </p>
                        </div>
                        
                        <div class="cyber-card">
                            <div class="w-12 h-12 bg-neon-magenta rounded-lg flex items-center justify-center mb-4">
                                <span class="text-black font-bold text-xl">2</span>
                            </div>
                            <h3 class="text-xl font-bold mb-3 text-neon-magenta">Deploy & Upgrade</h3>
                            <p class="text-gray-300">
                                Summon cybernetic creatures to the battlefield and enhance them with 
                                mod cards to increase their power and grant new abilities.
                            </p>
                        </div>
                        
                        <div class="cyber-card">
                            <div class="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mb-4">
                                <span class="text-black font-bold text-xl">3</span>
                            </div>
                            <h3 class="text-xl font-bold mb-3 text-green-400">Attack & Win</h3>
                            <p class="text-gray-300">
                                Attack your opponent's creatures or strike directly at their Core Integrity. 
                                Reduce it to 0 or force them to deck out to claim victory.
                            </p>
                        </div>
                    </div>
                </section>
                
                <!-- Card Types Detail -->
                <section class="mb-16">
                    <h2 class="text-3xl font-cyber font-bold mb-8 text-center">
                        <span class="neon-text">Card Types</span>
                    </h2>
                    
                    <div class="space-y-8">
                        <div class="cyber-card">
                            <div class="flex items-start gap-6">
                                <div class="w-16 h-16 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="text-2xl">🐺</span>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold mb-3 text-neon-cyan">Creature Cards</h3>
                                    <p class="text-gray-300 mb-4">
                                        The backbone of your army. Creatures have Attack, Defense, and Health values, 
                                        plus mod slots based on their rarity. They can attack opponents directly or 
                                        engage enemy creatures in combat.
                                    </p>
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <strong class="text-neon-cyan">Common:</strong> 1 mod slot
                                        </div>
                                        <div>
                                            <strong class="text-green-400">Uncommon:</strong> 2 mod slots
                                        </div>
                                        <div>
                                            <strong class="text-blue-400">Rare:</strong> 3 mod slots
                                        </div>
                                        <div>
                                            <strong class="text-purple-400">Mythic:</strong> 4 mod slots
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cyber-card">
                            <div class="flex items-start gap-6">
                                <div class="w-16 h-16 bg-gradient-to-br from-neon-magenta to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="text-2xl">⚙️</span>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold mb-3 text-neon-magenta">Mod Cards</h3>
                                    <p class="text-gray-300 mb-4">
                                        Upgrade your creatures with cybernetic enhancements. Mods can boost stats, 
                                        grant new abilities, or provide ongoing effects. Each creature can only 
                                        equip mods up to their slot limit.
                                    </p>
                                    <div class="text-sm text-gray-400">
                                        <strong>Types:</strong> Weapons, Armor, Enhancements, Utilities
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cyber-card">
                            <div class="flex items-start gap-6">
                                <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="text-2xl">💾</span>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold mb-3 text-green-400">Data Cards</h3>
                                    <p class="text-gray-300 mb-4">
                                        Instant effects that manipulate the battlefield, draw cards, deal damage, 
                                        or disrupt your opponent's strategy. These cards are consumed when played 
                                        and go directly to the graveyard.
                                    </p>
                                    <div class="text-sm text-gray-400">
                                        <strong>Types:</strong> Hacks, Viruses, Firewalls, Protocols
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cyber-card">
                            <div class="flex items-start gap-6">
                                <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="text-2xl">🌐</span>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold mb-3 text-yellow-400">Realm Cards</h3>
                                    <p class="text-gray-300 mb-4">
                                        Environmental effects that remain in play and affect both players. 
                                        Realms can change fundamental game rules, provide ongoing benefits, 
                                        or create new strategic opportunities.
                                    </p>
                                    <div class="text-sm text-gray-400">
                                        <strong>Note:</strong> Only one Realm can be active at a time
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Data Stream System -->
                <section class="mb-16">
                    <div class="cyber-card">
                        <h2 class="text-3xl font-cyber font-bold mb-6 text-neon-cyan">Data Stream System</h2>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-300 mb-4">
                                    Data Streams are your primary resource for playing cards. Unlike traditional 
                                    mana systems, Data Streams automatically increase each turn, creating an 
                                    escalating power curve that keeps games dynamic and exciting.
                                </p>
                                <ul class="space-y-2 text-gray-300">
                                    <li>• Start with 3 Data Streams</li>
                                    <li>• Gain +1 maximum each turn (up to 10)</li>
                                    <li>• Refill to maximum at turn start</li>
                                    <li>• Spend to play cards and abilities</li>
                                </ul>
                            </div>
                            <div class="cyber-card bg-gradient-to-br from-neon-cyan/10 to-blue-500/10">
                                <h3 class="text-xl font-bold mb-4 text-neon-cyan">Turn Progression</h3>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span>Turn 1-3:</span>
                                        <span class="text-neon-cyan">Early Game (3-5 streams)</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Turn 4-6:</span>
                                        <span class="text-yellow-400">Mid Game (6-8 streams)</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Turn 7+:</span>
                                        <span class="text-red-400">Late Game (9-10 streams)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Win Conditions -->
                <section class="mb-16">
                    <div class="cyber-card">
                        <h2 class="text-3xl font-cyber font-bold mb-6 text-center">
                            <span class="neon-text">Victory Conditions</span>
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span class="text-3xl">💥</span>
                                </div>
                                <h3 class="text-xl font-bold mb-3 text-red-400">Core Destruction</h3>
                                <p class="text-gray-300">
                                    Reduce your opponent's Core Integrity from 50 to 0 through direct attacks 
                                    and damage effects. The most common path to victory.
                                </p>
                            </div>
                            
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span class="text-3xl">📚</span>
                                </div>
                                <h3 class="text-xl font-bold mb-3 text-blue-400">Deck Depletion</h3>
                                <p class="text-gray-300">
                                    Force your opponent to run out of cards to draw. When a player cannot 
                                    draw a card at the start of their turn, they lose immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Getting Started -->
                <section class="text-center">
                    <div class="cyber-card">
                        <h2 class="text-3xl font-cyber font-bold mb-6">
                            <span class="neon-text">Ready to Begin?</span>
                        </h2>
                        <p class="text-xl text-gray-300 mb-8">
                            Master the grid, build your legend, become the ultimate cyber warrior.
                        </p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            ${!this.isAuthenticated() ? `
                                <a href="/register" data-route="/register" class="cyber-button">
                                    Create Account
                                </a>
                                <a href="/login" data-route="/login" class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
                                    Login
                                </a>
                            ` : `
                                <a href="/deck-builder" data-route="/deck-builder" class="cyber-button">
                                    Build Your Deck
                                </a>
                                <a href="/game" data-route="/game" class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
                                    Start Playing
                                </a>
                            `}
                        </div>
                    </div>
                </section>
            </div>
        `
        
        return content
    }
}

import { BasePage } from './BasePage.js'

export default class PacksPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.availablePacks = []
        this.openingPack = false
        this.revealedCards = []
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'py-8'
        
        content.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Header -->
                <section class="mb-8">
                    <div class="cyber-card">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 class="text-3xl font-cyber font-bold mb-2">
                                    <span class="neon-text">Card Packs</span>
                                </h1>
                                <p class="text-gray-400">Expand your collection with new cards and powerful upgrades</p>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-neon-cyan" id="playerCredits">1,250</div>
                                    <div class="text-sm text-gray-400">Credits</div>
                                </div>
                                <div class="w-12 h-12 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-full flex items-center justify-center">
                                    <span class="text-black text-xl">💰</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Pack Store -->
                <section class="mb-8">
                    <h2 class="text-2xl font-cyber font-bold mb-6 text-neon-cyan">Available Packs</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="packStore">
                        <!-- Packs will be populated by JavaScript -->
                    </div>
                </section>
                
                <!-- Pack Opening Area -->
                <section id="packOpeningArea" class="hidden">
                    <div class="cyber-card text-center">
                        <h2 class="text-2xl font-cyber font-bold mb-6 text-neon-magenta">Opening Pack</h2>
                        
                        <!-- Pack Animation Container -->
                        <div class="relative mb-8" id="packAnimationContainer">
                            <div id="packImage" class="w-48 h-64 mx-auto bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-xl border-4 border-neon-cyan shadow-neon cursor-pointer transition-all duration-300 hover:scale-105">
                                <div class="flex flex-col items-center justify-center h-full">
                                    <div class="text-6xl mb-4">📦</div>
                                    <div class="text-white font-cyber font-bold">CLICK TO OPEN</div>
                                </div>
                            </div>
                            
                            <!-- Opening Animation Effects -->
                            <div id="openingEffects" class="absolute inset-0 pointer-events-none hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan opacity-50 animate-pulse"></div>
                                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div class="w-32 h-32 border-4 border-neon-cyan rounded-full animate-spin"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Card Reveal Area -->
                        <div id="cardRevealArea" class="hidden">
                            <h3 class="text-xl font-bold mb-6 text-neon-cyan">Pack Contents</h3>
                            <div id="revealedCards" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                <!-- Revealed cards will appear here -->
                            </div>
                            
                            <div class="flex justify-center space-x-4">
                                <button id="addToCollectionBtn" class="cyber-button">
                                    Add to Collection
                                </button>
                                <button id="openAnotherBtn" class="bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
                                    Open Another Pack
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Recent Packs -->
                <section class="mb-8">
                    <h2 class="text-2xl font-cyber font-bold mb-6 text-green-400">Recent Openings</h2>
                    
                    <div class="cyber-card">
                        <div id="recentPacks" class="space-y-4">
                            <!-- Recent pack openings will be shown here -->
                        </div>
                        
                        <div id="noRecentPacks" class="text-center py-8 text-gray-400">
                            <div class="text-4xl mb-4">📦</div>
                            <p>No recent pack openings. Purchase your first pack above!</p>
                        </div>
                    </div>
                </section>
            </div>
            
            <!-- Pack Purchase Modal -->
            <div id="purchaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden backdrop-blur-sm">
                <div class="cyber-card max-w-md w-full mx-4">
                    <h3 class="text-xl font-cyber font-bold mb-4 text-neon-cyan" id="modalPackName">Starter Pack</h3>
                    
                    <div class="mb-6">
                        <div class="w-32 h-40 mx-auto bg-gradient-to-br from-neon-cyan to-blue-500 rounded-lg mb-4" id="modalPackImage">
                            <div class="flex items-center justify-center h-full text-4xl">📦</div>
                        </div>
                        
                        <div class="text-center">
                            <div class="text-2xl font-bold text-neon-cyan mb-2" id="modalPackPrice">100 Credits</div>
                            <div class="text-sm text-gray-400" id="modalPackDescription">Contains 5 cards with guaranteed rare</div>
                        </div>
                    </div>
                    
                    <div class="flex justify-center space-x-4">
                        <button id="cancelPurchase" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button id="confirmPurchase" class="cyber-button">
                            Purchase Pack
                        </button>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    init() {
        this.loadPackStore()
        this.setupEventListeners()
        this.loadRecentPacks()
    }
    
    setupEventListeners() {
        // Pack purchase buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('purchase-pack-btn')) {
                const packId = e.target.dataset.packId
                this.showPurchaseModal(packId)
            }
        })
        
        // Purchase modal
        this.element.querySelector('#cancelPurchase').addEventListener('click', () => {
            this.hidePurchaseModal()
        })
        
        this.element.querySelector('#confirmPurchase').addEventListener('click', () => {
            this.purchasePack()
        })
        
        // Pack opening
        this.element.querySelector('#packImage').addEventListener('click', () => {
            if (!this.openingPack) {
                this.openPack()
            }
        })
        
        // Post-opening actions
        this.element.querySelector('#addToCollectionBtn').addEventListener('click', () => {
            this.addCardsToCollection()
        })
        
        this.element.querySelector('#openAnotherBtn').addEventListener('click', () => {
            this.resetPackOpening()
        })
    }
    
    loadPackStore() {
        const packStore = this.element.querySelector('#packStore')
        
        // Mock pack data - replace with actual data from Firebase
        this.availablePacks = [
            {
                id: 'starter_pack',
                name: 'Starter Pack',
                description: 'Perfect for new players. Contains 5 cards with guaranteed uncommon.',
                price: 100,
                cardCount: 5,
                guaranteedRarity: 'uncommon',
                image: '📦',
                color: 'from-neon-cyan to-blue-500'
            },
            {
                id: 'booster_pack',
                name: 'Booster Pack',
                description: 'Standard pack with 8 cards and guaranteed rare.',
                price: 200,
                cardCount: 8,
                guaranteedRarity: 'rare',
                image: '🎁',
                color: 'from-neon-magenta to-purple-500'
            },
            {
                id: 'premium_pack',
                name: 'Premium Pack',
                description: 'High-value pack with 12 cards and guaranteed mythic.',
                price: 500,
                cardCount: 12,
                guaranteedRarity: 'mythic',
                image: '💎',
                color: 'from-yellow-400 to-orange-500'
            }
        ]
        
        packStore.innerHTML = this.availablePacks.map(pack => `
            <div class="cyber-card group hover:scale-105 transition-all duration-300">
                <div class="w-full h-48 bg-gradient-to-br ${pack.color} rounded-lg mb-4 flex items-center justify-center text-6xl">
                    ${pack.image}
                </div>
                
                <h3 class="text-xl font-bold mb-2 text-white">${pack.name}</h3>
                <p class="text-gray-400 text-sm mb-4">${pack.description}</p>
                
                <div class="flex justify-between items-center mb-4">
                    <div class="text-lg font-bold text-neon-cyan">${pack.price} Credits</div>
                    <div class="text-sm text-gray-400">${pack.cardCount} cards</div>
                </div>
                
                <div class="mb-4">
                    <div class="text-xs text-gray-500 mb-1">Guaranteed:</div>
                    <span class="px-2 py-1 rounded text-xs font-medium ${this.getRarityColor(pack.guaranteedRarity)}">
                        ${pack.guaranteedRarity.toUpperCase()}
                    </span>
                </div>
                
                <button class="cyber-button w-full purchase-pack-btn" data-pack-id="${pack.id}">
                    Purchase Pack
                </button>
            </div>
        `).join('')
    }
    
    getRarityColor(rarity) {
        const colors = {
            'common': 'bg-gray-600 text-gray-300',
            'uncommon': 'bg-green-600 text-green-300',
            'rare': 'bg-blue-600 text-blue-300',
            'mythic': 'bg-purple-600 text-purple-300'
        }
        return colors[rarity] || colors.common
    }
    
    showPurchaseModal(packId) {
        const pack = this.availablePacks.find(p => p.id === packId)
        if (!pack) return
        
        const modal = this.element.querySelector('#purchaseModal')
        const modalPackName = this.element.querySelector('#modalPackName')
        const modalPackPrice = this.element.querySelector('#modalPackPrice')
        const modalPackDescription = this.element.querySelector('#modalPackDescription')
        const modalPackImage = this.element.querySelector('#modalPackImage')
        
        modalPackName.textContent = pack.name
        modalPackPrice.textContent = `${pack.price} Credits`
        modalPackDescription.textContent = pack.description
        modalPackImage.innerHTML = `<div class="flex items-center justify-center h-full text-4xl">${pack.image}</div>`
        modalPackImage.className = `w-32 h-40 mx-auto bg-gradient-to-br ${pack.color} rounded-lg mb-4`
        
        modal.dataset.packId = packId
        modal.classList.remove('hidden')
    }
    
    hidePurchaseModal() {
        this.element.querySelector('#purchaseModal').classList.add('hidden')
    }
    
    async purchasePack() {
        const modal = this.element.querySelector('#purchaseModal')
        const packId = modal.dataset.packId
        const pack = this.availablePacks.find(p => p.id === packId)
        
        console.log('💰 Purchasing pack:', packId, pack?.name)
        
        if (!pack) {
            console.error('❌ Pack not found:', packId)
            return
        }
        
        // Check if player has enough credits
        const playerCredits = parseInt(this.element.querySelector('#playerCredits').textContent.replace(',', ''))
        
        console.log('💳 Player credits:', playerCredits, 'Pack price:', pack.price)
        
        if (playerCredits < pack.price) {
            window.technorox.uiManager.showError('Not enough credits!')
            return
        }
        
        try {
            // Deduct credits
            const newCredits = playerCredits - pack.price
            this.element.querySelector('#playerCredits').textContent = newCredits.toLocaleString()
            
            // Hide modal and show pack opening area
            this.hidePurchaseModal()
            this.showPackOpening(pack)
            
            window.technorox.uiManager.showSuccess(`Purchased ${pack.name}!`)
            
        } catch (error) {
            console.error('Error purchasing pack:', error)
            window.technorox.uiManager.showError('Failed to purchase pack')
        }
    }
    
    showPackOpening(pack) {
        const packOpeningArea = this.element.querySelector('#packOpeningArea')
        const packImage = this.element.querySelector('#packImage')
        
        // Update pack image
        packImage.className = `w-48 h-64 mx-auto bg-gradient-to-br ${pack.color} rounded-xl border-4 border-neon-cyan shadow-neon cursor-pointer transition-all duration-300 hover:scale-105`
        packImage.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <div class="text-6xl mb-4">${pack.image}</div>
                <div class="text-white font-cyber font-bold">${pack.name}</div>
                <div class="text-sm text-gray-300 mt-2">CLICK TO OPEN</div>
            </div>
        `
        
        // Store pack data for opening
        this.currentPack = pack
        
        // Show pack opening area
        packOpeningArea.classList.remove('hidden')
        
        // Scroll to pack opening area
        packOpeningArea.scrollIntoView({ behavior: 'smooth' })
    }
    
    async openPack() {
        if (this.openingPack) return
        
        console.log('🎁 Opening pack:', this.currentPack?.name)
        this.openingPack = true
        const packImage = this.element.querySelector('#packImage')
        const openingEffects = this.element.querySelector('#openingEffects')
        const cardRevealArea = this.element.querySelector('#cardRevealArea')
        
        // Show opening effects
        openingEffects.classList.remove('hidden')
        packImage.style.cursor = 'default'
        
        // Generate pack contents
        const cards = this.generatePackContents(this.currentPack)
        this.revealedCards = cards
        console.log('📦 Generated cards:', cards.map(c => `${c.name} (${c.rarity})`))
        
        // Animate pack opening
        console.log('🎬 Starting pack opening animation...')
        await this.animatePackOpening()
        console.log('✅ Pack opening animation complete')
        
        // Hide effects and show cards
        openingEffects.classList.add('hidden')
        packImage.classList.add('hidden')
        
        // Reveal cards one by one
        console.log('🃏 Starting card reveal...')
        await this.revealCards(cards)
        console.log('✨ Card reveal complete')
        
        cardRevealArea.classList.remove('hidden')
        this.openingPack = false
    }
    
    generatePackContents(pack) {
        const cards = []
        const rarities = ['common', 'uncommon', 'rare', 'mythic']
        const cardTypes = ['creature', 'mod', 'data', 'realm']
        
        // Generate guaranteed rarity card first
        cards.push(this.generateCard(pack.guaranteedRarity, true))
        
        // Generate remaining cards
        for (let i = 1; i < pack.cardCount; i++) {
            let rarity = this.getRandomRarity()
            // Ensure we don't get too many high rarity cards
            if (rarity === 'mythic' && Math.random() > 0.1) rarity = 'rare'
            if (rarity === 'rare' && Math.random() > 0.3) rarity = 'uncommon'
            
            cards.push(this.generateCard(rarity))
        }
        
        return cards
    }
    
    generateCard(rarity, isGuaranteed = false) {
        const cardTypes = ['creature', 'mod', 'data']
        const type = cardTypes[Math.floor(Math.random() * cardTypes.length)]
        
        const creatures = ['Cyber Wolf', 'Neural Drone', 'Data Phantom', 'Quantum Beast', 'Neon Stalker']
        const mods = ['Neural Implant', 'Cyber Armor', 'Data Link', 'Power Core', 'Stealth Module']
        const dataCards = ['System Hack', 'Virus Upload', 'Firewall', 'Data Mine', 'Neural Storm']
        
        let name, cost, stats = {}
        
        switch (type) {
            case 'creature':
                name = creatures[Math.floor(Math.random() * creatures.length)]
                cost = Math.floor(Math.random() * 8) + 1
                stats = {
                    attack: Math.floor(Math.random() * 6) + 1,
                    defense: Math.floor(Math.random() * 6) + 1,
                    health: Math.floor(Math.random() * 8) + 2
                }
                break
            case 'mod':
                name = mods[Math.floor(Math.random() * mods.length)]
                cost = Math.floor(Math.random() * 5) + 1
                break
            case 'data':
                name = dataCards[Math.floor(Math.random() * dataCards.length)]
                cost = Math.floor(Math.random() * 6) + 1
                break
        }
        
        const card = {
            id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${name} ${isGuaranteed ? '★' : ''}`,
            type,
            rarity,
            cost,
            ...stats,
            artworkUrl: this.generateArtworkUrl(type, rarity),
            isNew: true,
            isGuaranteed
        }
        
        console.log('🎴 Generated card:', card)
        return card
    }
    
    generateArtworkUrl(type, rarity) {
        // Placeholder artwork URLs - replace with actual artwork generation
        const baseUrl = 'https://via.placeholder.com/200x280'
        const colors = {
            common: 'CCCCCC',
            uncommon: '00FF00',
            rare: '0066FF',
            mythic: 'FF00FF'
        }
        return `${baseUrl}/${colors[rarity]}/FFFFFF?text=${type.toUpperCase()}`
    }
    
    getRandomRarity() {
        const rand = Math.random()
        if (rand < 0.6) return 'common'
        if (rand < 0.85) return 'uncommon'
        if (rand < 0.97) return 'rare'
        return 'mythic'
    }
    
    async animatePackOpening() {
        return new Promise(resolve => {
            const packImage = this.element.querySelector('#packImage')
            const openingEffects = this.element.querySelector('#openingEffects')
            
            console.log('🎬 Pack image element:', packImage)
            console.log('✨ Opening effects element:', openingEffects)
            
            // Add shake animation with CSS class
            packImage.classList.add('animate-shake')
            
            // Add some visual effects
            openingEffects.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4 animate-bounce">✨</div>
                    <div class="text-neon-cyan font-cyber text-xl mb-2">Opening Pack...</div>
                    <div class="text-neon-magenta text-sm">Get ready for your cards!</div>
                </div>
            `
            
            setTimeout(() => {
                packImage.classList.remove('animate-shake')
                console.log('🎬 Animation complete, resolving...')
                resolve()
            }, 3000) // Increased to 3 seconds for better visibility
        })
    }
    
    async revealCards(cards) {
        const revealedCardsContainer = this.element.querySelector('#revealedCards')
        revealedCardsContainer.innerHTML = ''
        
        for (let i = 0; i < cards.length; i++) {
            await new Promise(async (resolve) => {
                setTimeout(async () => {
                    const card = cards[i]
                    console.log(`🎴 Revealing card ${i + 1}/${cards.length}:`, card.name)
                    
                    const cardElement = await this.createCardElement(card)
                    
                    if (cardElement) {
                        revealedCardsContainer.appendChild(cardElement)
                        
                        // Add reveal animation
                        cardElement.style.opacity = '0'
                        cardElement.style.transform = 'scale(0.8) rotateY(180deg)'
                        
                        setTimeout(() => {
                            cardElement.style.transition = 'all 0.5s ease-out'
                            cardElement.style.opacity = '1'
                            cardElement.style.transform = 'scale(1) rotateY(0deg)'
                        }, 100)
                        
                        // Play sound effect for rare+ cards
                        if (card.rarity === 'rare' || card.rarity === 'mythic') {
                            this.playRarityRevealEffect(cardElement, card.rarity)
                        }
                        
                        console.log(`✅ Card ${i + 1} revealed successfully`)
                    } else {
                        console.error(`❌ Failed to create card element for ${card.name}`)
                    }
                    
                    resolve()
                }, i * 500) // Stagger card reveals
            })
        }
    }
    
    async createCardElement(card) {
        console.log('🃏 Creating card element for:', card.name, card.rarity)
        
        try {
            // Import Card component dynamically
            const { Card } = await import('../components/Card.js')
            
            const cardComponent = new Card(card, {
                size: 'normal',
                clickable: true,
                showBack: true // Start with card back for reveal effect
            })
            
            const cardElement = cardComponent.render()
            cardElement.dataset.rarity = card.rarity
            
            // Add reveal animation class
            cardElement.classList.add('card-reveal')
            
            // Auto-flip after a delay for reveal effect
            setTimeout(() => {
                cardComponent.flip()
            }, 500)
            
            console.log('✅ Card element created successfully')
            return cardElement
        } catch (error) {
            console.error('❌ Error creating card element:', error)
            // Fall back to simple card element
        }
        
        // Fallback for immediate return
        const cardElement = document.createElement('div')
        cardElement.className = `relative bg-gradient-to-br from-cyber-dark to-cyber-light rounded-lg border-2 ${this.getRarityBorderColor(card.rarity)} p-3 hover:scale-105 transition-all duration-300`
        
        cardElement.innerHTML = `
            <div class="text-center">
                <div class="w-full h-32 bg-gradient-to-br ${this.getTypeColor(card.type)} rounded mb-2 flex items-center justify-center">
                    <img src="${card.artworkUrl}" alt="${card.name}" class="w-full h-full object-cover rounded" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="hidden w-full h-full items-center justify-center text-2xl">
                        ${this.getTypeEmoji(card.type)}
                    </div>
                </div>
                
                <h4 class="font-bold text-white text-sm mb-1">${card.name}</h4>
                <div class="text-xs text-gray-400 mb-2">${card.type.toUpperCase()}</div>
                
                <div class="flex justify-between items-center text-xs">
                    <span class="px-1 py-0.5 rounded ${this.getRarityColor(card.rarity)}">${card.rarity.toUpperCase()}</span>
                    <span class="text-neon-cyan font-bold">${card.cost}</span>
                </div>
                
                ${card.type === 'creature' ? `
                    <div class="flex justify-between mt-2 text-xs">
                        <span class="text-red-400">${card.attack}⚔️</span>
                        <span class="text-blue-400">${card.defense}🛡️</span>
                        <span class="text-green-400">${card.health}❤️</span>
                    </div>
                ` : ''}
                
                ${card.isNew ? '<div class="absolute top-1 right-1 bg-neon-cyan text-black text-xs px-1 rounded">NEW</div>' : ''}
                ${card.isGuaranteed ? '<div class="absolute top-1 left-1 text-yellow-400 text-sm">★</div>' : ''}
            </div>
        `
        
        return cardElement
    }
    
    getRarityBorderColor(rarity) {
        const colors = {
            'common': 'border-gray-500',
            'uncommon': 'border-green-500',
            'rare': 'border-blue-500',
            'mythic': 'border-purple-500'
        }
        return colors[rarity] || colors.common
    }
    
    getTypeColor(type) {
        const colors = {
            'creature': 'from-neon-cyan/20 to-blue-500/20',
            'mod': 'from-neon-magenta/20 to-purple-500/20',
            'data': 'from-green-400/20 to-emerald-500/20',
            'realm': 'from-yellow-400/20 to-orange-500/20'
        }
        return colors[type] || colors.creature
    }
    
    getTypeEmoji(type) {
        const emojis = {
            'creature': '🐺',
            'mod': '⚙️',
            'data': '💾',
            'realm': '🌐'
        }
        return emojis[type] || '❓'
    }
    
    playRarityRevealEffect(cardElement, rarity) {
        // Add special effects for rare cards
        const effect = document.createElement('div')
        effect.className = `absolute inset-0 pointer-events-none ${rarity === 'mythic' ? 'bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30' : 'bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30'} animate-pulse rounded-lg`
        
        cardElement.appendChild(effect)
        
        setTimeout(() => {
            effect.remove()
        }, 2000)
    }
    
    async addCardsToCollection() {
        try {
            // Add cards to player's collection in Firebase
            // For now, just show success message
            window.technorox.uiManager.showSuccess(`Added ${this.revealedCards.length} cards to your collection!`)
            
            // Add to recent packs
            this.addToRecentPacks()
            
            // Reset the pack opening area
            this.resetPackOpening()
            
        } catch (error) {
            console.error('Error adding cards to collection:', error)
            window.technorox.uiManager.showError('Failed to add cards to collection')
        }
    }
    
    addToRecentPacks() {
        const recentPacksContainer = this.element.querySelector('#recentPacks')
        const noRecentPacks = this.element.querySelector('#noRecentPacks')
        
        // Hide "no recent packs" message
        noRecentPacks.classList.add('hidden')
        
        // Create recent pack entry
        const recentPackElement = document.createElement('div')
        recentPackElement.className = 'flex items-center justify-between p-3 rounded-lg border border-gray-700'
        
        const rareCounts = this.revealedCards.reduce((acc, card) => {
            acc[card.rarity] = (acc[card.rarity] || 0) + 1
            return acc
        }, {})
        
        recentPackElement.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br ${this.currentPack.color} rounded-lg flex items-center justify-center">
                    ${this.currentPack.image}
                </div>
                <div>
                    <div class="font-medium text-white">${this.currentPack.name}</div>
                    <div class="text-sm text-gray-400">${new Date().toLocaleString()}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-sm text-gray-300">${this.revealedCards.length} cards</div>
                <div class="text-xs text-gray-500">
                    ${Object.entries(rareCounts).map(([rarity, count]) => 
                        `${count} ${rarity}`
                    ).join(', ')}
                </div>
            </div>
        `
        
        // Add to top of recent packs
        recentPacksContainer.insertBefore(recentPackElement, recentPacksContainer.firstChild)
    }
    
    resetPackOpening() {
        const packOpeningArea = this.element.querySelector('#packOpeningArea')
        const packImage = this.element.querySelector('#packImage')
        const cardRevealArea = this.element.querySelector('#cardRevealArea')
        
        // Hide pack opening area
        packOpeningArea.classList.add('hidden')
        
        // Reset pack image
        packImage.classList.remove('hidden')
        cardRevealArea.classList.add('hidden')
        
        // Clear revealed cards
        this.revealedCards = []
        this.currentPack = null
        this.openingPack = false
    }
    
    loadRecentPacks() {
        // Load recent pack openings from storage/database
        // For now, show empty state
        const noRecentPacks = this.element.querySelector('#noRecentPacks')
        noRecentPacks.classList.remove('hidden')
    }
}

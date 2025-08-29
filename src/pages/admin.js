import { BasePage } from './BasePage.js'
import { CardGenerationService } from '../services/CardGenerationService.js'
import { Card } from '../components/Card.js'
import { firebaseService } from '../services/FirebaseService.js'

export default class AdminPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.cardGenerator = new CardGenerationService()
        this.generatedCards = []
        this.isGenerating = false
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'py-8'
        
        content.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Header -->
                <section class="mb-8">
                    <div class="cyber-card">
                        <h1 class="text-3xl font-cyber font-bold mb-4">
                            <span class="neon-text">Admin Panel</span>
                        </h1>
                        <p class="text-gray-400">Manage cards, generate new content, and oversee the Technorox universe</p>
                    </div>
                </section>
                
                <!-- Quick Stats -->
                <section class="mb-8">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-neon-cyan mb-2" id="totalCardsCount">0</div>
                            <div class="text-sm text-gray-400">Total Cards</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-neon-magenta mb-2" id="generatedTodayCount">0</div>
                            <div class="text-sm text-gray-400">Generated Today</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-green-400 mb-2" id="activePlayersCount">1,247</div>
                            <div class="text-sm text-gray-400">Active Players</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-yellow-400 mb-2" id="pendingReviewCount">3</div>
                            <div class="text-sm text-gray-400">Pending Review</div>
                        </div>
                    </div>
                </section>
                
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <!-- Card Generation Panel -->
                    <div class="xl:col-span-2">
                        <div class="cyber-card">
                            <h2 class="text-2xl font-cyber font-bold mb-6 text-neon-cyan">AI Card Generation</h2>
                            
                            <!-- Generation Controls -->
                            <div class="mb-6">
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <button id="generateCreatureBtn" class="cyber-button">
                                        Generate Creature
                                    </button>
                                    <button id="generateModBtn" class="cyber-button">
                                        Generate Mod
                                    </button>
                                    <button id="generateDataBtn" class="cyber-button">
                                        Generate Data
                                    </button>
                                    <button id="generateRealmBtn" class="cyber-button">
                                        Generate Realm
                                    </button>
                                </div>
                                
                                <div class="flex items-center space-x-4">
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Batch Size</label>
                                        <input type="number" id="batchSize" min="1" max="20" value="5" class="cyber-input w-full">
                                    </div>
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Target Rarity</label>
                                        <select id="targetRarity" class="cyber-input w-full">
                                            <option value="random">Random</option>
                                            <option value="Common">Common</option>
                                            <option value="Uncommon">Uncommon</option>
                                            <option value="Rare">Rare</option>
                                            <option value="Mythic">Mythic</option>
                                        </select>
                                    </div>
                                    <div class="pt-6">
                                        <button id="generateBatchBtn" class="bg-neon-magenta hover:bg-neon-magenta/80 text-black font-bold py-2 px-4 rounded-lg transition-colors">
                                            Generate Batch
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Generation Status -->
                            <div id="generationStatus" class="hidden mb-6">
                                <div class="bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg p-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="animate-spin w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full"></div>
                                        <div>
                                            <div class="font-medium text-neon-cyan">Generating Cards...</div>
                                            <div class="text-sm text-gray-400" id="generationProgress">Initializing AI...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Generated Cards Preview -->
                            <div id="generatedCardsSection" class="hidden">
                                <h3 class="text-lg font-bold mb-4 text-neon-magenta">Generated Cards</h3>
                                <div id="generatedCardsGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                    <!-- Generated cards will appear here -->
                                </div>
                                
                                <div class="flex justify-center space-x-4">
                                    <button id="approveAllBtn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                        Approve All
                                    </button>
                                    <button id="rejectAllBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                        Reject All
                                    </button>
                                    <button id="regenerateBtn" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Management Panel -->
                    <div>
                        <div class="space-y-6">
                            <!-- Card Database -->
                            <div class="cyber-card">
                                <h3 class="text-lg font-bold mb-4 text-neon-cyan">Card Database</h3>
                                
                                <div class="space-y-3">
                                    <button class="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300">
                                        <div class="flex items-center justify-between">
                                            <span class="text-white">Browse All Cards</span>
                                            <span class="text-neon-cyan">→</span>
                                        </div>
                                    </button>
                                    
                                    <button class="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300">
                                        <div class="flex items-center justify-between">
                                            <span class="text-white">Pending Approval</span>
                                            <span class="bg-yellow-500 text-black text-xs px-2 py-1 rounded">3</span>
                                        </div>
                                    </button>
                                    
                                    <button class="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300">
                                        <div class="flex items-center justify-between">
                                            <span class="text-white">Duplicate Check</span>
                                            <span class="text-neon-cyan">→</span>
                                        </div>
                                    </button>
                                    
                                    <button class="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300">
                                        <div class="flex items-center justify-between">
                                            <span class="text-white">Balance Analysis</span>
                                            <span class="text-neon-cyan">→</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- AI Settings -->
                            <div class="cyber-card">
                                <h3 class="text-lg font-bold mb-4 text-neon-magenta">AI Configuration</h3>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Creativity Level</label>
                                        <input type="range" id="creativitySlider" min="0" max="1" step="0.1" value="0.8" class="w-full">
                                        <div class="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Conservative</span>
                                            <span>Creative</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-300 mb-2">Power Level Target</label>
                                        <select class="cyber-input w-full">
                                            <option>Balanced</option>
                                            <option>Slightly Underpowered</option>
                                            <option>Slightly Overpowered</option>
                                        </select>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <input type="checkbox" id="enableArtGeneration" checked class="mr-2">
                                        <label for="enableArtGeneration" class="text-sm text-gray-300">Auto-generate artwork</label>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <input type="checkbox" id="enableDuplicateCheck" checked class="mr-2">
                                        <label for="enableDuplicateCheck" class="text-sm text-gray-300">Check for duplicates</label>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Quick Actions -->
                            <div class="cyber-card">
                                <h3 class="text-lg font-bold mb-4 text-green-400">Quick Actions</h3>
                                
                                <div class="space-y-2">
                                    <button class="w-full cyber-button text-sm py-2">
                                        Export Card Database
                                    </button>
                                    <button class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                                        Import Cards
                                    </button>
                                    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                                        Generate Report
                                    </button>
                                    <button class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                                        Clear Cache
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Card Detail Modal -->
            <div id="cardDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden backdrop-blur-sm">
                <div class="cyber-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-cyber font-bold text-neon-cyan">Card Details</h3>
                        <button id="closeCardDetailModal" class="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Card Preview -->
                        <div>
                            <div id="modalCardPreview" class="flex justify-center mb-4">
                                <!-- Card component will be inserted here -->
                            </div>
                            
                            <div class="space-y-2">
                                <button id="approveCardBtn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Approve Card
                                </button>
                                <button id="rejectCardBtn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Reject Card
                                </button>
                                <button id="regenerateCardBtn" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Regenerate
                                </button>
                            </div>
                        </div>
                        
                        <!-- Card Data -->
                        <div>
                            <div class="space-y-4" id="modalCardData">
                                <!-- Card data will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    init() {
        this.setupEventListeners()
        this.loadStats()
    }
    
    setupEventListeners() {
        // Single card generation
        this.element.querySelector('#generateCreatureBtn').addEventListener('click', () => {
            this.generateSingleCard('creature')
        })
        
        this.element.querySelector('#generateModBtn').addEventListener('click', () => {
            this.generateSingleCard('mod')
        })
        
        this.element.querySelector('#generateDataBtn').addEventListener('click', () => {
            this.generateSingleCard('data')
        })
        
        this.element.querySelector('#generateRealmBtn').addEventListener('click', () => {
            this.generateSingleCard('realm')
        })
        
        // Batch generation
        this.element.querySelector('#generateBatchBtn').addEventListener('click', () => {
            this.generateBatch()
        })
        
        // Card management
        this.element.querySelector('#approveAllBtn').addEventListener('click', () => {
            this.approveAllCards()
        })
        
        this.element.querySelector('#rejectAllBtn').addEventListener('click', () => {
            this.rejectAllCards()
        })
        
        this.element.querySelector('#regenerateBtn').addEventListener('click', () => {
            this.regenerateCards()
        })
        
        // Modal
        this.element.querySelector('#closeCardDetailModal').addEventListener('click', () => {
            this.hideCardDetailModal()
        })
    }
    
    async generateSingleCard(type) {
        if (this.isGenerating) return
        
        this.isGenerating = true
        this.showGenerationStatus(`Generating ${type} card...`)
        
        try {
            let card
            
            switch (type) {
                case 'creature':
                    card = await this.cardGenerator.generateCreatureCard()
                    break
                case 'mod':
                    card = await this.cardGenerator.generateModCard()
                    break
                case 'data':
                    card = await this.cardGenerator.generateDataCard()
                    break
                case 'realm':
                    card = await this.cardGenerator.generateRealmCard()
                    break
            }
            
            // Generate artwork if enabled
            if (this.element.querySelector('#enableArtGeneration').checked) {
                this.updateGenerationStatus('Generating artwork...')
                card.image_url = await this.cardGenerator.generateArtwork(card.image_prompt, card.id)
            }
            
            this.generatedCards = [card]
            this.displayGeneratedCards()
            
            window.technorox.uiManager.showSuccess(`Generated ${type} card: ${card.name}`)
            
        } catch (error) {
            console.error('Error generating card:', error)
            window.technorox.uiManager.showError(`Failed to generate ${type} card: ${error.message}`)
        } finally {
            this.isGenerating = false
            this.hideGenerationStatus()
        }
    }
    
    async generateBatch() {
        if (this.isGenerating) return
        
        const batchSize = parseInt(this.element.querySelector('#batchSize').value)
        if (batchSize < 1 || batchSize > 20) {
            window.technorox.uiManager.showError('Batch size must be between 1 and 20')
            return
        }
        
        this.isGenerating = true
        this.showGenerationStatus(`Generating batch of ${batchSize} cards...`)
        
        try {
            const cards = await this.cardGenerator.generateCardSet(batchSize)
            
            // Generate artwork for each card if enabled
            if (this.element.querySelector('#enableArtGeneration').checked) {
                for (let i = 0; i < cards.length; i++) {
                    this.updateGenerationStatus(`Generating artwork ${i + 1}/${cards.length}...`)
                    cards[i].image_url = await this.cardGenerator.generateArtwork(cards[i].image_prompt, cards[i].id)
                }
            }
            
            this.generatedCards = cards
            this.displayGeneratedCards()
            
            window.technorox.uiManager.showSuccess(`Generated ${cards.length} cards successfully`)
            
        } catch (error) {
            console.error('Error generating batch:', error)
            window.technorox.uiManager.showError(`Failed to generate batch: ${error.message}`)
        } finally {
            this.isGenerating = false
            this.hideGenerationStatus()
        }
    }
    
    displayGeneratedCards() {
        const grid = this.element.querySelector('#generatedCardsGrid')
        const section = this.element.querySelector('#generatedCardsSection')
        
        grid.innerHTML = ''
        
        this.generatedCards.forEach((cardData, index) => {
            const cardContainer = document.createElement('div')
            cardContainer.className = 'relative'
            
            const card = new Card(cardData, { 
                size: 'normal',
                clickable: true,
                showBack: false
            })
            
            const cardElement = card.render()
            cardElement.dataset.rarity = cardData.rarity
            
            // Add click handler to show details
            cardElement.addEventListener('click', () => {
                this.showCardDetail(cardData, index)
            })
            
            cardContainer.appendChild(cardElement)
            grid.appendChild(cardContainer)
        })
        
        section.classList.remove('hidden')
    }
    
    showCardDetail(cardData, index) {
        const modal = this.element.querySelector('#cardDetailModal')
        const preview = this.element.querySelector('#modalCardPreview')
        const dataContainer = this.element.querySelector('#modalCardData')
        
        // Create card preview
        preview.innerHTML = ''
        const card = new Card(cardData, { 
            size: 'large',
            clickable: true,
            showBack: false
        })
        preview.appendChild(card.render())
        
        // Display card data
        dataContainer.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <div class="cyber-input bg-gray-800">${cardData.name}</div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <div class="cyber-input bg-gray-800">${cardData.cardType}</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Rarity</label>
                        <div class="cyber-input bg-gray-800">${cardData.rarity}</div>
                    </div>
                </div>
                
                ${cardData.faction ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Faction</label>
                        <div class="cyber-input bg-gray-800">${cardData.faction}</div>
                    </div>
                ` : ''}
                
                ${cardData.cost !== undefined ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Cost</label>
                        <div class="cyber-input bg-gray-800">${cardData.cost} Data Streams</div>
                    </div>
                ` : ''}
                
                ${cardData.attack !== undefined ? `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Attack</label>
                            <div class="cyber-input bg-gray-800">${cardData.attack}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Defense</label>
                            <div class="cyber-input bg-gray-800">${cardData.defense}</div>
                        </div>
                    </div>
                ` : ''}
                
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Ability/Effect</label>
                    <div class="cyber-input bg-gray-800 min-h-[60px]">${cardData.ability || cardData.effect}</div>
                </div>
                
                ${cardData.flavor_text ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Flavor Text</label>
                        <div class="cyber-input bg-gray-800 italic">"${cardData.flavor_text}"</div>
                    </div>
                ` : ''}
                
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">AI Art Prompt</label>
                    <div class="cyber-input bg-gray-800 text-sm text-gray-400 min-h-[80px]">${cardData.image_prompt}</div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Card ID</label>
                        <div class="font-mono">${cardData.id}</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Generated</label>
                        <div>${new Date(cardData.createdAt).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `
        
        modal.classList.remove('hidden')
    }
    
    hideCardDetailModal() {
        this.element.querySelector('#cardDetailModal').classList.add('hidden')
    }
    
    showGenerationStatus(message) {
        const status = this.element.querySelector('#generationStatus')
        const progress = this.element.querySelector('#generationProgress')
        
        progress.textContent = message
        status.classList.remove('hidden')
    }
    
    updateGenerationStatus(message) {
        const progress = this.element.querySelector('#generationProgress')
        progress.textContent = message
    }
    
    hideGenerationStatus() {
        const status = this.element.querySelector('#generationStatus')
        status.classList.add('hidden')
    }
    
    async approveAllCards() {
        if (this.generatedCards.length === 0) return
        
        try {
            // Save cards to database - mock implementation
            for (const card of this.generatedCards) {
                await this.saveCardToDatabase(card)
            }
            
            window.technorox.uiManager.showSuccess(`Approved and saved ${this.generatedCards.length} cards`)
            
            // Clear generated cards
            this.generatedCards = []
            this.element.querySelector('#generatedCardsSection').classList.add('hidden')
            
            // Update stats
            this.loadStats()
            
        } catch (error) {
            console.error('Error approving cards:', error)
            window.technorox.uiManager.showError('Failed to approve cards')
        }
    }
    
    async rejectAllCards() {
        if (this.generatedCards.length === 0) return
        
        this.generatedCards = []
        this.element.querySelector('#generatedCardsSection').classList.add('hidden')
        
        window.technorox.uiManager.showInfo('Rejected all generated cards')
    }
    
    async regenerateCards() {
        if (this.generatedCards.length === 0) return
        
        const cardCount = this.generatedCards.length
        this.generatedCards = []
        this.element.querySelector('#generatedCardsSection').classList.add('hidden')
        
        // Regenerate the same number of cards
        this.element.querySelector('#batchSize').value = cardCount
        this.generateBatch()
    }
    
    async saveCardToDatabase(card) {
        try {
            // Save card to Firestore using CardGenerationService
            const result = await this.cardGenerator.saveCardToFirestore(card)
            
            if (result.success) {
                console.log('Saved card to Firestore:', card.name, 'ID:', result.id)
                
                // Log analytics event for card approval
                firebaseService.logGameEvent('card_approved', {
                    cardId: result.id,
                    cardName: card.name,
                    cardType: card.cardType,
                    rarity: card.rarity,
                    approvedBy: firebaseService.getCurrentUser()?.uid || 'admin'
                })
                
                return result
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error('Error saving card to database:', error)
            throw error
        }
    }
    
    async loadStats() {
        try {
            if (firebaseService.isReady()) {
                // Load real stats from Firebase
                const [cardsResult, pendingResult, usersResult] = await Promise.all([
                    firebaseService.getCollection('cards'),
                    firebaseService.getCollection('cards', { 
                        where: [['status', '==', 'pending_approval']] 
                    }),
                    firebaseService.getCollection('users')
                ])

                // Update total cards count
                if (cardsResult.success) {
                    this.element.querySelector('#totalCardsCount').textContent = cardsResult.data.length.toLocaleString()
                }

                // Update pending review count
                if (pendingResult.success) {
                    this.element.querySelector('#pendingReviewCount').textContent = pendingResult.data.length
                }

                // Update active players count
                if (usersResult.success) {
                    this.element.querySelector('#activePlayersCount').textContent = usersResult.data.length.toLocaleString()
                }

                // Calculate cards generated today
                if (cardsResult.success) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    
                    const todayCards = cardsResult.data.filter(card => {
                        const cardDate = new Date(card.createdAt)
                        return cardDate >= today
                    })
                    
                    this.element.querySelector('#generatedTodayCount').textContent = todayCards.length
                }

            } else {
                // Fallback to mock stats when Firebase is not available
                this.element.querySelector('#totalCardsCount').textContent = '0'
                this.element.querySelector('#generatedTodayCount').textContent = '0'
                this.element.querySelector('#activePlayersCount').textContent = '1'
                this.element.querySelector('#pendingReviewCount').textContent = '0'
            }
        } catch (error) {
            console.error('Error loading stats:', error)
            // Show error stats
            this.element.querySelector('#totalCardsCount').textContent = 'Error'
            this.element.querySelector('#generatedTodayCount').textContent = 'Error'
            this.element.querySelector('#activePlayersCount').textContent = 'Error'
            this.element.querySelector('#pendingReviewCount').textContent = 'Error'
        }
    }
}

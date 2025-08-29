import { BasePage } from './BasePage.js'

export default class DeckBuilderPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.collection = []
        this.filteredCollection = []
        this.currentDeck = {
            id: null,
            name: 'New Deck',
            cards: [],
            isValid: false
        }
        this.currentFilters = {
            type: 'all',
            rarity: 'all',
            faction: 'all',
            search: '',
            cost: 'all'
        }
        this.draggedCard = null
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'py-8'
        
        content.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Header -->
                <section class="mb-8">
                    <div class="cyber-card">
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h1 class="text-3xl font-cyber font-bold mb-2">
                                    <span class="neon-text">Deck Builder</span>
                                </h1>
                                <p class="text-gray-400">Construct your perfect 40-card deck for cyberpunk combat</p>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <button id="loadDeckBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Load Deck
                                </button>
                                <button id="saveDeckBtn" class="cyber-button">
                                    Save Deck
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <!-- Collection Panel -->
                    <div class="xl:col-span-2">
                        <div class="cyber-card">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-xl font-cyber font-bold text-neon-cyan">Card Collection</h2>
                                <div class="text-sm text-gray-400">
                                    Showing <span id="collectionCount">0</span> cards
                                </div>
                            </div>
                            
                            <!-- Collection Filters -->
                            <div class="mb-6">
                                <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                    <!-- Search -->
                                    <div class="col-span-2">
                                        <input 
                                            type="text" 
                                            id="collectionSearch" 
                                            placeholder="Search cards..." 
                                            class="cyber-input w-full"
                                        >
                                    </div>
                                    
                                    <!-- Type Filter -->
                                    <select id="typeFilter" class="cyber-input">
                                        <option value="all">All Types</option>
                                        <option value="creature">Creatures</option>
                                        <option value="mod">Mods</option>
                                        <option value="data">Data</option>
                                        <option value="realm">Realms</option>
                                    </select>
                                    
                                    <!-- Rarity Filter -->
                                    <select id="rarityFilter" class="cyber-input">
                                        <option value="all">All Rarities</option>
                                        <option value="common">Common</option>
                                        <option value="uncommon">Uncommon</option>
                                        <option value="rare">Rare</option>
                                        <option value="mythic">Mythic</option>
                                    </select>
                                    
                                    <!-- Cost Filter -->
                                    <select id="costFilter" class="cyber-input">
                                        <option value="all">All Costs</option>
                                        <option value="0-2">0-2</option>
                                        <option value="3-5">3-5</option>
                                        <option value="6-8">6-8</option>
                                        <option value="9+">9+</option>
                                    </select>
                                </div>
                                
                                <!-- Quick Filters -->
                                <div class="flex flex-wrap gap-2">
                                    <button class="filter-btn" id="clearFiltersBtn">Clear All</button>
                                    <button class="filter-btn" id="ownedOnlyBtn">Owned Only</button>
                                    <button class="filter-btn" id="notInDeckBtn">Not in Deck</button>
                                </div>
                            </div>
                            
                            <!-- Collection Grid -->
                            <div id="collectionGrid" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
                                <!-- Collection cards will be populated here -->
                            </div>
                            
                            <!-- Loading State -->
                            <div id="collectionLoading" class="text-center py-8">
                                <div class="animate-spin w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p class="text-gray-400">Loading collection...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Deck Panel -->
                    <div>
                        <div class="cyber-card">
                            <!-- Deck Header -->
                            <div class="mb-6">
                                <div class="flex items-center justify-between mb-4">
                                    <input 
                                        type="text" 
                                        id="deckName" 
                                        value="New Deck"
                                        class="cyber-input text-lg font-bold bg-transparent border-none p-0 focus:bg-cyber-dark focus:px-2"
                                    >
                                    <button id="deckOptionsBtn" class="text-gray-400 hover:text-white">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                        </svg>
                                    </button>
                                </div>
                                
                                <!-- Deck Stats -->
                                <div class="grid grid-cols-2 gap-4 mb-4">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold" id="deckCardCount">0</div>
                                        <div class="text-sm text-gray-400">Cards</div>
                                        <div class="text-xs" id="deckValidation">0/40</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold" id="avgCost">0.0</div>
                                        <div class="text-sm text-gray-400">Avg Cost</div>
                                    </div>
                                </div>
                                
                                <!-- Mana Curve -->
                                <div class="mb-4">
                                    <div class="text-sm text-gray-400 mb-2">Cost Curve</div>
                                    <div class="flex items-end space-x-1 h-16" id="manaCurve">
                                        <!-- Mana curve bars will be generated here -->
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Deck List -->
                            <div class="mb-6">
                                <h3 class="text-lg font-bold text-neon-magenta mb-4">Deck List</h3>
                                
                                <!-- Drop Zone -->
                                <div id="deckDropZone" class="border-2 border-dashed border-neon-cyan/30 rounded-lg p-4 mb-4 min-h-[100px] transition-all duration-300">
                                    <div class="text-center text-gray-400">
                                        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        <p class="text-sm">Drag cards here to add to deck</p>
                                    </div>
                                </div>
                                
                                <!-- Deck Cards by Type -->
                                <div id="deckCardsList" class="space-y-4">
                                    <div id="creatureSection" class="hidden">
                                        <h4 class="text-sm font-bold text-neon-cyan mb-2">Creatures (<span class="creature-count">0</span>)</h4>
                                        <div class="creature-cards space-y-1"></div>
                                    </div>
                                    
                                    <div id="modSection" class="hidden">
                                        <h4 class="text-sm font-bold text-neon-magenta mb-2">Mods (<span class="mod-count">0</span>)</h4>
                                        <div class="mod-cards space-y-1"></div>
                                    </div>
                                    
                                    <div id="dataSection" class="hidden">
                                        <h4 class="text-sm font-bold text-green-400 mb-2">Data (<span class="data-count">0</span>)</h4>
                                        <div class="data-cards space-y-1"></div>
                                    </div>
                                    
                                    <div id="realmSection" class="hidden">
                                        <h4 class="text-sm font-bold text-yellow-400 mb-2">Realms (<span class="realm-count">0</span>)</h4>
                                        <div class="realm-cards space-y-1"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Deck Actions -->
                            <div class="space-y-2">
                                <button id="validateDeckBtn" class="cyber-button w-full">
                                    Validate Deck
                                </button>
                                <button id="clearDeckBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">
                                    Clear Deck
                                </button>
                                <button id="exportDeckBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">
                                    Export Deck
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Save Deck Modal -->
            <div id="saveDeckModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden backdrop-blur-sm">
                <div class="cyber-card max-w-md w-full mx-4">
                    <h3 class="text-xl font-cyber font-bold mb-4 text-neon-cyan">Save Deck</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Deck Name</label>
                            <input type="text" id="saveDeckName" class="cyber-input w-full" placeholder="Enter deck name">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                            <textarea id="saveDeckDescription" class="cyber-input w-full h-20 resize-none" placeholder="Describe your deck strategy..."></textarea>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="checkbox" id="makePublic" class="mr-2">
                            <label for="makePublic" class="text-sm text-gray-300">Make deck public</label>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-4 mt-6">
                        <button id="cancelSave" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button id="confirmSave" class="cyber-button">
                            Save Deck
                        </button>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    init() {
        this.setupEventListeners()
        this.loadCollection()
        this.updateDeckStats()
    }
    
    setupEventListeners() {
        // Collection filters
        this.element.querySelector('#collectionSearch').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase()
            this.applyFilters()
        })
        
        this.element.querySelector('#typeFilter').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value
            this.applyFilters()
        })
        
        this.element.querySelector('#rarityFilter').addEventListener('change', (e) => {
            this.currentFilters.rarity = e.target.value
            this.applyFilters()
        })
        
        this.element.querySelector('#costFilter').addEventListener('change', (e) => {
            this.currentFilters.cost = e.target.value
            this.applyFilters()
        })
        
        // Quick filters
        this.element.querySelector('#clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters()
        })
        
        this.element.querySelector('#notInDeckBtn').addEventListener('click', () => {
            this.filterNotInDeck()
        })
        
        // Deck actions
        this.element.querySelector('#saveDeckBtn').addEventListener('click', () => {
            this.showSaveDeckModal()
        })
        
        this.element.querySelector('#clearDeckBtn').addEventListener('click', () => {
            this.clearDeck()
        })
        
        this.element.querySelector('#validateDeckBtn').addEventListener('click', () => {
            this.validateDeck()
        })
        
        // Drag and drop
        this.setupDragAndDrop()
        
        // Save modal
        this.element.querySelector('#cancelSave').addEventListener('click', () => {
            this.hideSaveDeckModal()
        })
        
        this.element.querySelector('#confirmSave').addEventListener('click', () => {
            this.saveDeck()
        })
        
        // Deck name editing
        this.element.querySelector('#deckName').addEventListener('change', (e) => {
            this.currentDeck.name = e.target.value
        })
    }
    
    setupDragAndDrop() {
        const dropZone = this.element.querySelector('#deckDropZone')
        
        // Drop zone events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault()
            dropZone.classList.add('border-neon-cyan', 'bg-neon-cyan/10')
        })
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault()
            dropZone.classList.remove('border-neon-cyan', 'bg-neon-cyan/10')
        })
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault()
            dropZone.classList.remove('border-neon-cyan', 'bg-neon-cyan/10')
            
            console.log('Drop event: Adding', this.draggedCard?.name)
            
            if (this.draggedCard) {
                console.log('About to call addCardToDeck...')
                this.addCardToDeck(this.draggedCard)
                console.log('addCardToDeck completed')
                // Don't reset draggedCard immediately to allow multiple drops
                setTimeout(() => {
                    this.draggedCard = null
                    console.log('draggedCard reset to null')
                }, 100)
            } else {
                console.error('NO DRAGGED CARD FOUND!')
            }
        })
    }
    
    async loadCollection() {
        const loading = this.element.querySelector('#collectionLoading')
        const grid = this.element.querySelector('#collectionGrid')
        
        loading.classList.remove('hidden')
        grid.classList.add('hidden')
        
        try {
            // Mock collection data - replace with actual Firebase query
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            this.collection = this.generateMockCollection()
            this.applyFilters()
            
            loading.classList.add('hidden')
            grid.classList.remove('hidden')
            
        } catch (error) {
            console.error('Error loading collection:', error)
            window.technorox.uiManager.showError('Failed to load collection')
        }
    }
    
    generateMockCollection() {
        // Use the same mock data as collection page
        const collection = []
        const cardNames = {
            creature: ['Cyber Wolf', 'Neural Drone', 'Data Phantom', 'Quantum Beast', 'Neon Stalker'],
            mod: ['Neural Implant', 'Cyber Armor', 'Data Link', 'Power Core', 'Stealth Module'],
            data: ['System Hack', 'Virus Upload', 'Firewall', 'Data Mine', 'Neural Storm'],
            realm: ['Cyber Grid', 'Neural Network', 'Quantum Field']
        }
        
        const rarities = ['common', 'uncommon', 'rare', 'mythic']
        let cardId = 1
        
        Object.entries(cardNames).forEach(([type, names]) => {
            names.forEach(name => {
                rarities.forEach(rarity => {
                    const count = rarity === 'common' ? 4 : rarity === 'uncommon' ? 3 : 2
                    
                    for (let i = 0; i < count; i++) {
                        collection.push({
                            id: `card_${cardId++}`,
                            name,
                            type,
                            rarity,
                            cost: Math.floor(Math.random() * 8) + 1,
                            attack: type === 'creature' ? Math.floor(Math.random() * 6) + 1 : null,
                            defense: type === 'creature' ? Math.floor(Math.random() * 6) + 1 : null,
                            health: type === 'creature' ? Math.floor(Math.random() * 8) + 2 : null,
                            artworkUrl: `https://via.placeholder.com/120x168/${this.getRarityColor(rarity).replace('#', '')}/FFFFFF?text=${name.replace(' ', '+')}`
                        })
                    }
                })
            })
        })
        
        return collection
    }
    
    getRarityColor(rarity) {
        const colors = {
            'common': '#9CA3AF',
            'uncommon': '#10B981',
            'rare': '#3B82F6',
            'mythic': '#8B5CF6'
        }
        return colors[rarity] || colors.common
    }
    
    applyFilters() {
        let filtered = [...this.collection]
        
        // Apply filters
        if (this.currentFilters.type !== 'all') {
            filtered = filtered.filter(card => card.type === this.currentFilters.type)
        }
        
        if (this.currentFilters.rarity !== 'all') {
            filtered = filtered.filter(card => card.rarity === this.currentFilters.rarity)
        }
        
        if (this.currentFilters.cost !== 'all') {
            const [min, max] = this.parseCostRange(this.currentFilters.cost)
            filtered = filtered.filter(card => card.cost >= min && (max === null || card.cost <= max))
        }
        
        if (this.currentFilters.search) {
            filtered = filtered.filter(card => 
                card.name.toLowerCase().includes(this.currentFilters.search)
            )
        }
        
        this.filteredCollection = filtered
        this.renderCollection()
    }
    
    parseCostRange(range) {
        switch (range) {
            case '0-2': return [0, 2]
            case '3-5': return [3, 5]
            case '6-8': return [6, 8]
            case '9+': return [9, null]
            default: return [0, null]
        }
    }
    
    renderCollection() {
        const grid = this.element.querySelector('#collectionGrid')
        const count = this.element.querySelector('#collectionCount')
        
        count.textContent = this.filteredCollection.length
        
        grid.innerHTML = this.filteredCollection.map(card => `
            <div class="collection-card relative bg-gradient-to-br from-cyber-dark to-cyber-light rounded-lg border border-gray-600 hover:border-neon-cyan/60 p-2 cursor-grab transition-all duration-300" 
                 draggable="true" 
                 data-card-id="${card.id}">
                <div class="w-full h-20 bg-gradient-to-br ${this.getTypeColorClass(card.type)} rounded mb-2 overflow-hidden">
                    <img src="${card.artworkUrl}" alt="${card.name}" class="w-full h-full object-cover" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="hidden w-full h-full items-center justify-center text-lg">
                        ${this.getTypeEmoji(card.type)}
                    </div>
                </div>
                
                <div class="text-xs">
                    <div class="font-bold text-white truncate mb-1">${card.name}</div>
                    <div class="flex justify-between items-center">
                        <span class="px-1 py-0.5 rounded text-xs ${this.getRarityColorClass(card.rarity)}">${card.rarity[0].toUpperCase()}</span>
                        <span class="text-neon-cyan font-bold">${card.cost}</span>
                    </div>
                    ${card.type === 'creature' ? `
                        <div class="flex justify-between text-xs mt-1">
                            <span class="text-red-400">${card.attack}</span>
                            <span class="text-blue-400">${card.defense}</span>
                            <span class="text-green-400">${card.health}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Card count in deck -->
                <div class="absolute top-1 right-1 bg-neon-cyan text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold card-count" style="display: none;">
                    0
                </div>
            </div>
        `).join('')
        
        // Add drag event listeners using event delegation
        this.setupCollectionEventListeners(grid)
        
        this.updateCardCounts()
    }
    
    setupCollectionEventListeners(grid) {
        // Remove existing listeners to prevent duplicates
        grid.removeEventListener('dragstart', this.handleDragStart)
        grid.removeEventListener('dragend', this.handleDragEnd)
        grid.removeEventListener('dblclick', this.handleDoubleClick)
        
        // Use event delegation for better performance and reliability
        this.handleDragStart = (e) => {
            if (e.target.classList.contains('collection-card')) {
                const cardId = e.target.dataset.cardId
                this.draggedCard = this.collection.find(card => card.id === cardId)
                e.target.style.opacity = '0.5'
                console.log('Drag started - Card ID:', cardId)
                console.log('Dragging card:', this.draggedCard?.name)
                console.log('Collection size:', this.collection.length)
            }
        }
        
        this.handleDragEnd = (e) => {
            if (e.target.classList.contains('collection-card')) {
                e.target.style.opacity = '1'
            }
        }
        
        this.handleDoubleClick = (e) => {
            if (e.target.classList.contains('collection-card')) {
                const cardId = e.target.dataset.cardId
                const card = this.collection.find(card => card.id === cardId)
                if (card) {
                    this.addCardToDeck(card)
                }
            }
        }
        
        // Add event listeners with delegation
        grid.addEventListener('dragstart', this.handleDragStart)
        grid.addEventListener('dragend', this.handleDragEnd)
        grid.addEventListener('dblclick', this.handleDoubleClick)
    }
    
    addCardToDeck(card) {
        console.log('Adding card:', card.name)
        
        if (!card) {
            console.error('No card provided to addCardToDeck')
            return
        }
        
        // Check deck size limit
        if (this.currentDeck.cards.length >= 40) {
            window.technorox.uiManager.showError('Deck cannot exceed 40 cards')
            return
        }
        
        // Check card limit (max 4 of any card)
        const cardCount = this.currentDeck.cards.filter(c => c.name === card.name).length
        console.log(`Current count of ${card.name}:`, cardCount)
        
        if (cardCount >= 4) {
            window.technorox.uiManager.showError(`Cannot have more than 4 copies of ${card.name}`)
            return
        }
        
        // Cards can be added successfully
        
        // Add card to deck with unique ID for deck
        const deckCard = {
            ...card,
            deckId: `${card.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
        
        this.currentDeck.cards.push(deckCard)
        console.log('Card added to deck. New deck size:', this.currentDeck.cards.length)
        
        this.updateDeckDisplay()
        this.updateDeckStats()
        this.updateCardCounts()
        
        window.technorox.uiManager.showSuccess(`Added ${card.name} to deck (${cardCount + 1}/4)`)
    }
    
    removeCardFromDeck(cardId) {
        // Try to find by deckId first, then by regular id
        let index = this.currentDeck.cards.findIndex(card => card.deckId === cardId)
        if (index === -1) {
            index = this.currentDeck.cards.findIndex(card => card.id === cardId)
        }
        
        if (index !== -1) {
            const removedCard = this.currentDeck.cards.splice(index, 1)[0]
            console.log('Removed card from deck:', removedCard.name)
            
            this.updateDeckDisplay()
            this.updateDeckStats()
            this.updateCardCounts()
            
            window.technorox.uiManager.showSuccess(`Removed ${removedCard.name} from deck`)
        }
    }
    
    removeOneCardByName(cardName) {
        const index = this.currentDeck.cards.findIndex(card => card.name === cardName)
        if (index !== -1) {
            const removedCard = this.currentDeck.cards.splice(index, 1)[0]
            console.log('Removed one copy of card from deck:', removedCard.name)
            
            this.updateDeckDisplay()
            this.updateDeckStats()
            this.updateCardCounts()
            
            const remainingCount = this.currentDeck.cards.filter(c => c.name === cardName).length
            window.technorox.uiManager.showSuccess(`Removed ${cardName} from deck (${remainingCount} remaining)`)
        }
    }
    
    updateDeckDisplay() {
        const deckCardsList = this.element.querySelector('#deckCardsList')
        const dropZone = this.element.querySelector('#deckDropZone')
        
        // Always show drop zone for adding more cards
        dropZone.classList.remove('hidden')
        
        // Group identical cards
        const cardGroups = this.currentDeck.cards.reduce((acc, card) => {
            const key = card.name
            if (!acc[key]) {
                acc[key] = { card, count: 0 }
            }
            acc[key].count++
            return acc
        }, {})
        
        // Simple list of all cards
        deckCardsList.innerHTML = Object.values(cardGroups).map(group => `
            <div class="flex items-center justify-between p-2 rounded border border-gray-700 hover:border-gray-600 transition-colors">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-10 bg-gradient-to-br ${this.getTypeColorClass(group.card.type)} rounded flex items-center justify-center text-xs font-bold text-white">
                        ${group.card.cost}
                    </div>
                    <div>
                        <div class="text-sm font-medium text-white">${group.card.name}</div>
                        <div class="text-xs text-gray-400">${group.card.type.toUpperCase()} • ${group.card.rarity.toUpperCase()}</div>
                    </div>
                </div>
                
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-bold text-neon-cyan">${group.count}x</span>
                    <button class="text-red-400 hover:text-red-300 text-sm" onclick="window.technorox.deckBuilder.removeOneCardByName('${group.card.name}')">
                        ×
                    </button>
                </div>
            </div>
        `).join('')
        
        // Show message if deck is empty
        if (this.currentDeck.cards.length === 0) {
            deckCardsList.innerHTML = '<div class="text-center text-gray-500 py-4">No cards in deck yet</div>'
        }
    }
    
    updateDeckStats() {
        const cardCount = this.currentDeck.cards.length
        const avgCost = cardCount > 0 ? 
            (this.currentDeck.cards.reduce((sum, card) => sum + card.cost, 0) / cardCount).toFixed(1) : 
            '0.0'
        
        this.element.querySelector('#deckCardCount').textContent = cardCount
        this.element.querySelector('#deckValidation').textContent = `${cardCount}/40`
        this.element.querySelector('#avgCost').textContent = avgCost
        
        // Update validation color
        const validation = this.element.querySelector('#deckValidation')
        if (cardCount === 40) {
            validation.className = 'text-xs text-green-400'
        } else if (cardCount > 40) {
            validation.className = 'text-xs text-red-400'
        } else {
            validation.className = 'text-xs text-yellow-400'
        }
        
        // Update mana curve
        this.updateManaCurve()
    }
    
    updateManaCurve() {
        const manaCurve = this.element.querySelector('#manaCurve')
        const costCounts = new Array(10).fill(0)
        
        this.currentDeck.cards.forEach(card => {
            const cost = Math.min(card.cost, 9)
            costCounts[cost]++
        })
        
        const maxCount = Math.max(...costCounts, 1)
        
        manaCurve.innerHTML = costCounts.map((count, cost) => `
            <div class="flex flex-col items-center">
                <div class="bg-neon-cyan rounded-t w-4 transition-all duration-300" 
                     style="height: ${(count / maxCount) * 48}px; min-height: ${count > 0 ? '4px' : '0'}"></div>
                <div class="text-xs text-gray-400 mt-1">${cost === 9 ? '9+' : cost}</div>
                <div class="text-xs text-neon-cyan font-bold">${count}</div>
            </div>
        `).join('')
    }
    
    updateCardCounts() {
        // Update card count indicators in collection
        const cardCounts = this.currentDeck.cards.reduce((acc, card) => {
            acc[card.name] = (acc[card.name] || 0) + 1
            return acc
        }, {})
        
        this.element.querySelectorAll('.collection-card').forEach(cardElement => {
            const cardId = cardElement.dataset.cardId
            const card = this.collection.find(c => c.id === cardId)
            const countElement = cardElement.querySelector('.card-count')
            const count = cardCounts[card.name] || 0
            
            if (count > 0) {
                countElement.textContent = count
                countElement.style.display = 'flex'
                cardElement.style.opacity = count >= 4 ? '0.5' : '1'
            } else {
                countElement.style.display = 'none'
                cardElement.style.opacity = '1'
            }
        })
    }
    
    validateDeck() {
        const errors = []
        const cardCount = this.currentDeck.cards.length
        
        if (cardCount !== 40) {
            errors.push(`Deck must contain exactly 40 cards (current: ${cardCount})`)
        }
        
        // Check card limits
        const cardCounts = this.currentDeck.cards.reduce((acc, card) => {
            acc[card.name] = (acc[card.name] || 0) + 1
            return acc
        }, {})
        
        Object.entries(cardCounts).forEach(([cardName, count]) => {
            if (count > 4) {
                errors.push(`Too many copies of "${cardName}" (max 4, found ${count})`)
            }
        })
        
        if (errors.length === 0) {
            window.technorox.uiManager.showSuccess('Deck is valid!')
            this.currentDeck.isValid = true
        } else {
            window.technorox.uiManager.showError(`Deck validation failed:\n${errors.join('\n')}`)
            this.currentDeck.isValid = false
        }
        
        return errors.length === 0
    }
    
    clearDeck() {
        if (this.currentDeck.cards.length === 0) return
        
        const modal = window.technorox.uiManager.createModal(`
            <div class="text-center">
                <h3 class="text-xl font-bold text-red-400 mb-4">Clear Deck?</h3>
                <p class="text-gray-300 mb-6">This will remove all cards from your current deck. This action cannot be undone.</p>
                <div class="flex justify-center space-x-4">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onclick="this.closest('.fixed').remove(); window.technorox.deckBuilder.confirmClearDeck()" 
                            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Clear Deck
                    </button>
                </div>
            </div>
        `)
    }
    
    confirmClearDeck() {
        this.currentDeck.cards = []
        this.updateDeckDisplay()
        this.updateDeckStats()
        this.updateCardCounts()
        window.technorox.uiManager.showSuccess('Deck cleared')
    }
    
    showSaveDeckModal() {
        const modal = this.element.querySelector('#saveDeckModal')
        const nameInput = this.element.querySelector('#saveDeckName')
        
        nameInput.value = this.currentDeck.name
        modal.classList.remove('hidden')
    }
    
    hideSaveDeckModal() {
        this.element.querySelector('#saveDeckModal').classList.add('hidden')
    }
    
    async saveDeck() {
        const name = this.element.querySelector('#saveDeckName').value.trim()
        const description = this.element.querySelector('#saveDeckDescription').value.trim()
        const isPublic = this.element.querySelector('#makePublic').checked
        
        if (!name) {
            window.technorox.uiManager.showError('Please enter a deck name')
            return
        }
        
        if (!this.validateDeck()) {
            window.technorox.uiManager.showError('Cannot save invalid deck')
            return
        }
        
        try {
            // Save deck to Firebase - mock for now
            const deckData = {
                name,
                description,
                isPublic,
                cards: this.currentDeck.cards,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            // Mock save
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            this.currentDeck.name = name
            this.element.querySelector('#deckName').value = name
            
            this.hideSaveDeckModal()
            window.technorox.uiManager.showSuccess(`Deck "${name}" saved successfully!`)
            
        } catch (error) {
            console.error('Error saving deck:', error)
            window.technorox.uiManager.showError('Failed to save deck')
        }
    }
    
    clearFilters() {
        this.currentFilters = {
            type: 'all',
            rarity: 'all',
            faction: 'all',
            search: '',
            cost: 'all'
        }
        
        // Reset UI
        this.element.querySelector('#collectionSearch').value = ''
        this.element.querySelector('#typeFilter').value = 'all'
        this.element.querySelector('#rarityFilter').value = 'all'
        this.element.querySelector('#costFilter').value = 'all'
        
        this.applyFilters()
    }
    
    filterNotInDeck() {
        const deckCardNames = new Set(this.currentDeck.cards.map(card => card.name))
        this.filteredCollection = this.collection.filter(card => !deckCardNames.has(card.name))
        this.renderCollection()
    }
    
    // Helper methods
    getTypeColorClass(type) {
        const classes = {
            'creature': 'from-neon-cyan/20 to-blue-500/20',
            'mod': 'from-neon-magenta/20 to-purple-500/20',
            'data': 'from-green-400/20 to-emerald-500/20',
            'realm': 'from-yellow-400/20 to-orange-500/20'
        }
        return classes[type] || classes.creature
    }
    
    getRarityColorClass(rarity) {
        const classes = {
            'common': 'bg-gray-600 text-gray-300',
            'uncommon': 'bg-green-600 text-green-300',
            'rare': 'bg-blue-600 text-blue-300',
            'mythic': 'bg-purple-600 text-purple-300'
        }
        return classes[rarity] || classes.common
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
}

// Make deck builder available globally for event handlers
window.technorox = window.technorox || {}
window.technorox.deckBuilder = null

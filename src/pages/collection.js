import { BasePage } from './BasePage.js'
import { CraftingService } from '../services/CraftingService.js'

export default class CollectionPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.collection = []
        this.filteredCollection = []
        this.currentFilters = {
            type: 'all',
            rarity: 'all',
            faction: 'all',
            search: ''
        }
        this.sortBy = 'name'
        this.viewMode = 'grid'
        this.craftingService = new CraftingService()
        this.selectedCards = new Set() // For bulk operations
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
                                    <span class="neon-text">Card Collection</span>
                                </h1>
                                <p class="text-gray-400">Manage and view your cybernetic arsenal</p>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <!-- Cyber Dust Balance -->
                                <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-3 border border-purple-500/30">
                                    <div class="flex items-center space-x-2">
                                        <div class="text-xl">✨</div>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-purple-300" id="cyberDustBalance">0</div>
                                            <div class="text-xs text-gray-400">Cyber Dust</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-neon-cyan" id="totalCards">0</div>
                                    <div class="text-sm text-gray-400">Total Cards</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-neon-magenta" id="uniqueCards">0</div>
                                    <div class="text-sm text-gray-400">Unique Cards</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Filters and Controls -->
                <section class="mb-8">
                    <div class="cyber-card">
                        <!-- Search and View Controls -->
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                            <div class="flex-1 max-w-md">
                                <div class="relative">
                                    <input 
                                        type="text" 
                                        id="searchInput" 
                                        placeholder="Search cards..." 
                                        class="cyber-input w-full pl-10"
                                    >
                                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <!-- Sort Dropdown -->
                                <select id="sortSelect" class="cyber-input">
                                    <option value="name">Name</option>
                                    <option value="rarity">Rarity</option>
                                    <option value="type">Type</option>
                                    <option value="cost">Cost</option>
                                    <option value="recent">Recently Added</option>
                                </select>
                                
                                <!-- View Mode Toggle -->
                                <div class="flex border border-gray-600 rounded-lg overflow-hidden">
                                    <button id="gridViewBtn" class="px-3 py-2 bg-neon-cyan/20 text-neon-cyan">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                        </svg>
                                    </button>
                                    <button id="listViewBtn" class="px-3 py-2 bg-cyber-dark text-gray-400 hover:text-white transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Filter Tabs -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <!-- Type Filter -->
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Card Type</label>
                                <div class="space-y-2">
                                    <button class="filter-btn w-full active" data-filter="type" data-value="all">All Types</button>
                                    <button class="filter-btn w-full" data-filter="type" data-value="creature">Creatures</button>
                                    <button class="filter-btn w-full" data-filter="type" data-value="mod">Mods</button>
                                    <button class="filter-btn w-full" data-filter="type" data-value="data">Data</button>
                                    <button class="filter-btn w-full" data-filter="type" data-value="realm">Realms</button>
                                </div>
                            </div>
                            
                            <!-- Rarity Filter -->
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
                                <div class="space-y-2">
                                    <button class="filter-btn w-full active" data-filter="rarity" data-value="all">All Rarities</button>
                                    <button class="filter-btn w-full" data-filter="rarity" data-value="common">Common</button>
                                    <button class="filter-btn w-full" data-filter="rarity" data-value="uncommon">Uncommon</button>
                                    <button class="filter-btn w-full" data-filter="rarity" data-value="rare">Rare</button>
                                    <button class="filter-btn w-full" data-filter="rarity" data-value="mythic">Mythic</button>
                                </div>
                            </div>
                            
                            <!-- Faction Filter -->
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Faction</label>
                                <div class="space-y-2">
                                    <button class="filter-btn w-full active" data-filter="faction" data-value="all">All Factions</button>
                                    <button class="filter-btn w-full" data-filter="faction" data-value="cyber">Cyber</button>
                                    <button class="filter-btn w-full" data-filter="faction" data-value="neural">Neural</button>
                                    <button class="filter-btn w-full" data-filter="faction" data-value="quantum">Quantum</button>
                                    <button class="filter-btn w-full" data-filter="faction" data-value="void">Void</button>
                                </div>
                            </div>
                            
                            <!-- Quick Filters -->
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Quick Filters</label>
                                <div class="space-y-2">
                                    <button class="filter-btn w-full" id="newCardsFilter">New Cards</button>
                                    <button class="filter-btn w-full" id="duplicatesFilter">Duplicates</button>
                                    <button class="filter-btn w-full" id="missingFilter">Missing Cards</button>
                                    <button class="filter-btn w-full" id="favoriteFilter">Favorites</button>
                                    <button class="filter-btn w-full" id="clearFiltersBtn">Clear All</button>
                                </div>
                            </div>
                            
                            <!-- Crafting Actions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Crafting</label>
                                <div class="space-y-2">
                                    <button class="cyber-button-secondary w-full text-sm" id="bulkScrapBtn">
                                        🔨 Bulk Scrap
                                    </button>
                                    <button class="cyber-button w-full text-sm" id="craftCardsBtn">
                                        ⚡ Craft Cards
                                    </button>
                                    <button class="filter-btn w-full text-sm" id="scrapRecommendationsBtn">
                                        💡 Scrap Tips
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Collection Stats -->
                <section class="mb-8">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-gray-300 mb-1" id="commonCount">0</div>
                            <div class="text-sm text-gray-400">Common</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-green-400 mb-1" id="uncommonCount">0</div>
                            <div class="text-sm text-gray-400">Uncommon</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-blue-400 mb-1" id="rareCount">0</div>
                            <div class="text-sm text-gray-400">Rare</div>
                        </div>
                        <div class="cyber-card text-center">
                            <div class="text-2xl font-bold text-purple-400 mb-1" id="mythicCount">0</div>
                            <div class="text-sm text-gray-400">Mythic</div>
                        </div>
                    </div>
                </section>
                
                <!-- Collection Grid/List -->
                <section>
                    <div class="cyber-card">
                        <!-- Results Header -->
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-cyber font-bold text-neon-cyan">
                                Cards (<span id="filteredCount">0</span>)
                            </h2>
                            
                            <div class="flex items-center space-x-4">
                                <button id="selectAllBtn" class="text-sm text-neon-cyan hover:text-white transition-colors">
                                    Select All
                                </button>
                                <button id="bulkActionsBtn" class="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50" disabled>
                                    Bulk Actions
                                </button>
                            </div>
                        </div>
                        
                        <!-- Collection Display -->
                        <div id="collectionContainer">
                            <!-- Grid View -->
                            <div id="gridView" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                <!-- Cards will be populated here -->
                            </div>
                            
                            <!-- List View -->
                            <div id="listView" class="hidden space-y-2">
                                <!-- Cards will be populated here -->
                            </div>
                        </div>
                        
                        <!-- Empty State -->
                        <div id="emptyState" class="hidden text-center py-12">
                            <div class="w-20 h-20 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-gray-300">No Cards Found</h3>
                            <p class="text-gray-400 mb-4">No cards match your current filters.</p>
                            <button id="clearFiltersFromEmpty" class="cyber-button">Clear Filters</button>
                        </div>
                        
                        <!-- Loading State -->
                        <div id="loadingState" class="text-center py-12">
                            <div class="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p class="text-gray-400">Loading your collection...</p>
                        </div>
                    </div>
                </section>
            </div>
            
            <!-- Card Detail Modal -->
            <div id="cardDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden backdrop-blur-sm">
                <div class="cyber-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-2xl font-cyber font-bold text-neon-cyan" id="modalCardName">Card Name</h3>
                        <button id="closeCardModal" class="text-gray-400 hover:text-white text-2xl">×</button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Card Image -->
                        <div>
                            <div class="w-full h-80 bg-gradient-to-br from-cyber-dark to-cyber-light rounded-lg border-2 border-neon-cyan/30 mb-4" id="modalCardImage">
                                <!-- Card artwork will be displayed here -->
                            </div>
                            
                            <div class="flex justify-center space-x-2">
                                <button class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors" id="favoriteCardBtn">
                                    ⭐ Favorite
                                </button>
                                <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors" id="addToDeckBtn">
                                    + Add to Deck
                                </button>
                            </div>
                        </div>
                        
                        <!-- Card Details -->
                        <div>
                            <div class="space-y-4" id="modalCardDetails">
                                <!-- Card details will be populated here -->
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
        this.loadCollection()
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = this.element.querySelector('#searchInput')
        searchInput.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase()
            this.applyFilters()
        })
        
        // Sort dropdown
        const sortSelect = this.element.querySelector('#sortSelect')
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value
            this.applyFilters()
        })
        
        // View mode toggle
        this.element.querySelector('#gridViewBtn').addEventListener('click', () => {
            this.setViewMode('grid')
        })
        
        this.element.querySelector('#listViewBtn').addEventListener('click', () => {
            this.setViewMode('list')
        })
        
        // Filter buttons
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn') && e.target.dataset.filter) {
                this.handleFilterClick(e.target)
            }
        })
        
        // Quick filters
        this.element.querySelector('#newCardsFilter').addEventListener('click', () => {
            this.applyQuickFilter('new')
        })
        
        this.element.querySelector('#duplicatesFilter').addEventListener('click', () => {
            this.applyQuickFilter('duplicates')
        })
        
        this.element.querySelector('#clearFiltersBtn').addEventListener('click', () => {
            this.clearAllFilters()
        })
        
        this.element.querySelector('#clearFiltersFromEmpty').addEventListener('click', () => {
            this.clearAllFilters()
        })
        
        // Crafting buttons
        this.element.querySelector('#bulkScrapBtn').addEventListener('click', () => {
            this.showBulkScrapModal()
        })
        
        this.element.querySelector('#craftCardsBtn').addEventListener('click', () => {
            this.showCraftingModal()
        })
        
        this.element.querySelector('#scrapRecommendationsBtn').addEventListener('click', () => {
            this.showScrapRecommendations()
        })
        
        // Card detail modal
        this.element.querySelector('#closeCardModal').addEventListener('click', () => {
            this.hideCardModal()
        })
        
        // Card clicks
        this.element.addEventListener('click', (e) => {
            if (e.target.closest('.collection-card')) {
                const cardId = e.target.closest('.collection-card').dataset.cardId
                this.showCardDetail(cardId)
            }
        })
    }
    
    async loadCollection() {
        const loadingState = this.element.querySelector('#loadingState')
        const collectionContainer = this.element.querySelector('#collectionContainer')
        
        loadingState.classList.remove('hidden')
        collectionContainer.classList.add('hidden')
        
        try {
            // Mock collection data - replace with Firebase query
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            this.collection = this.generateMockCollection()
            this.updateCollectionStats()
            this.updateCyberDustDisplay()
            this.applyFilters()
            
            loadingState.classList.add('hidden')
            collectionContainer.classList.remove('hidden')
            
        } catch (error) {
            console.error('Error loading collection:', error)
            window.technorox.uiManager.showError('Failed to load collection')
        }
    }
    
    generateMockCollection() {
        const collection = []
        const cardNames = {
            creature: ['Cyber Wolf', 'Neural Drone', 'Data Phantom', 'Quantum Beast', 'Neon Stalker', 'Void Hunter', 'Chrome Serpent'],
            mod: ['Neural Implant', 'Cyber Armor', 'Data Link', 'Power Core', 'Stealth Module', 'Quantum Processor'],
            data: ['System Hack', 'Virus Upload', 'Firewall', 'Data Mine', 'Neural Storm', 'Code Injection'],
            realm: ['Cyber Grid', 'Neural Network', 'Quantum Field', 'Data Stream', 'Void Space']
        }
        
        const factions = ['cyber', 'neural', 'quantum', 'void']
        const rarities = ['common', 'uncommon', 'rare', 'mythic']
        
        let cardId = 1
        
        // Generate cards for each type
        Object.entries(cardNames).forEach(([type, names]) => {
            names.forEach(name => {
                rarities.forEach(rarity => {
                    const count = rarity === 'common' ? 4 : rarity === 'uncommon' ? 3 : rarity === 'rare' ? 2 : 1
                    
                    for (let i = 0; i < count; i++) {
                        collection.push({
                            id: `card_${cardId++}`,
                            name,
                            type,
                            rarity,
                            faction: factions[Math.floor(Math.random() * factions.length)],
                            cost: Math.floor(Math.random() * 8) + 1,
                            attack: type === 'creature' ? Math.floor(Math.random() * 6) + 1 : null,
                            defense: type === 'creature' ? Math.floor(Math.random() * 6) + 1 : null,
                            health: type === 'creature' ? Math.floor(Math.random() * 8) + 2 : null,
                            artworkUrl: `https://via.placeholder.com/200x280/${this.getRarityColor(rarity).replace('#', '')}/FFFFFF?text=${name.replace(' ', '+')}`,
                            description: this.generateCardDescription(type, name),
                            isNew: Math.random() > 0.8,
                            isFavorite: Math.random() > 0.9,
                            addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
                        })
                    }
                })
            })
        })
        
        return collection
    }
    
    generateCardDescription(type, name) {
        const descriptions = {
            creature: `A powerful ${name.toLowerCase()} that dominates the digital battlefield with its cybernetic enhancements.`,
            mod: `Advanced ${name.toLowerCase()} that enhances your creatures with cutting-edge technology.`,
            data: `Sophisticated ${name.toLowerCase()} program that manipulates the data streams of the cyber grid.`,
            realm: `Environmental effect that transforms the battlefield into a ${name.toLowerCase()}.`
        }
        return descriptions[type] || 'A mysterious card from the cyber realm.'
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
    
    updateCollectionStats() {
        const totalCards = this.collection.length
        const uniqueCards = new Set(this.collection.map(card => card.name)).size
        
        this.element.querySelector('#totalCards').textContent = totalCards
        this.element.querySelector('#uniqueCards').textContent = uniqueCards
        
        // Update rarity counts
        const rarityCounts = this.collection.reduce((acc, card) => {
            acc[card.rarity] = (acc[card.rarity] || 0) + 1
            return acc
        }, {})
        
        this.element.querySelector('#commonCount').textContent = rarityCounts.common || 0
        this.element.querySelector('#uncommonCount').textContent = rarityCounts.uncommon || 0
        this.element.querySelector('#rareCount').textContent = rarityCounts.rare || 0
        this.element.querySelector('#mythicCount').textContent = rarityCounts.mythic || 0
    }
    
    handleFilterClick(button) {
        const filterType = button.dataset.filter
        const filterValue = button.dataset.value
        
        // Update active state
        const filterGroup = this.element.querySelectorAll(`[data-filter="${filterType}"]`)
        filterGroup.forEach(btn => btn.classList.remove('active'))
        button.classList.add('active')
        
        // Update filter
        this.currentFilters[filterType] = filterValue
        this.applyFilters()
    }
    
    applyQuickFilter(filterType) {
        switch (filterType) {
            case 'new':
                this.filteredCollection = this.collection.filter(card => card.isNew)
                break
            case 'duplicates':
                const cardCounts = {}
                this.collection.forEach(card => {
                    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1
                })
                this.filteredCollection = this.collection.filter(card => cardCounts[card.name] > 1)
                break
        }
        
        this.renderCollection()
    }
    
    applyFilters() {
        let filtered = [...this.collection]
        
        // Apply type filter
        if (this.currentFilters.type !== 'all') {
            filtered = filtered.filter(card => card.type === this.currentFilters.type)
        }
        
        // Apply rarity filter
        if (this.currentFilters.rarity !== 'all') {
            filtered = filtered.filter(card => card.rarity === this.currentFilters.rarity)
        }
        
        // Apply faction filter
        if (this.currentFilters.faction !== 'all') {
            filtered = filtered.filter(card => card.faction === this.currentFilters.faction)
        }
        
        // Apply search filter
        if (this.currentFilters.search) {
            filtered = filtered.filter(card => 
                card.name.toLowerCase().includes(this.currentFilters.search) ||
                card.description.toLowerCase().includes(this.currentFilters.search)
            )
        }
        
        // Sort results
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'rarity':
                    const rarityOrder = { common: 0, uncommon: 1, rare: 2, mythic: 3 }
                    return rarityOrder[b.rarity] - rarityOrder[a.rarity]
                case 'type':
                    return a.type.localeCompare(b.type)
                case 'cost':
                    return a.cost - b.cost
                case 'recent':
                    return new Date(b.addedAt) - new Date(a.addedAt)
                default:
                    return 0
            }
        })
        
        this.filteredCollection = filtered
        this.renderCollection()
    }
    
    renderCollection() {
        const gridView = this.element.querySelector('#gridView')
        const listView = this.element.querySelector('#listView')
        const emptyState = this.element.querySelector('#emptyState')
        const filteredCount = this.element.querySelector('#filteredCount')
        
        filteredCount.textContent = this.filteredCollection.length
        
        if (this.filteredCollection.length === 0) {
            gridView.classList.add('hidden')
            listView.classList.add('hidden')
            emptyState.classList.remove('hidden')
            return
        }
        
        emptyState.classList.add('hidden')
        
        if (this.viewMode === 'grid') {
            gridView.classList.remove('hidden')
            listView.classList.add('hidden')
            this.renderGridView()
        } else {
            gridView.classList.add('hidden')
            listView.classList.remove('hidden')
            this.renderListView()
        }
    }
    
    renderGridView() {
        const gridView = this.element.querySelector('#gridView')
        
        gridView.innerHTML = this.filteredCollection.map(card => `
            <div class="collection-card relative bg-gradient-to-br from-cyber-dark to-cyber-light rounded-lg border-2 ${this.getRarityBorderClass(card.rarity)} p-3 hover:scale-105 transition-all duration-300 cursor-pointer" data-card-id="${card.id}">
                <div class="relative">
                    <div class="w-full h-32 bg-gradient-to-br ${this.getTypeColorClass(card.type)} rounded mb-2 overflow-hidden">
                        <img src="${card.artworkUrl}" alt="${card.name}" class="w-full h-full object-cover" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="hidden w-full h-full items-center justify-center text-2xl">
                            ${this.getTypeEmoji(card.type)}
                        </div>
                    </div>
                    
                    ${card.isNew ? '<div class="absolute top-1 right-1 bg-neon-cyan text-black text-xs px-1 rounded">NEW</div>' : ''}
                    ${card.isFavorite ? '<div class="absolute top-1 left-1 text-yellow-400 text-sm">⭐</div>' : ''}
                </div>
                
                <h4 class="font-bold text-white text-sm mb-1 truncate">${card.name}</h4>
                <div class="text-xs text-gray-400 mb-2">${card.type.toUpperCase()}</div>
                
                <div class="flex justify-between items-center text-xs mb-2">
                    <span class="px-1 py-0.5 rounded ${this.getRarityColorClass(card.rarity)}">${card.rarity.toUpperCase()}</span>
                    <span class="text-neon-cyan font-bold">${card.cost}</span>
                </div>
                
                ${card.type === 'creature' ? `
                    <div class="flex justify-between text-xs">
                        <span class="text-red-400">${card.attack}⚔️</span>
                        <span class="text-blue-400">${card.defense}🛡️</span>
                        <span class="text-green-400">${card.health}❤️</span>
                    </div>
                ` : ''}
            </div>
        `).join('')
    }
    
    renderListView() {
        const listView = this.element.querySelector('#listView')
        
        listView.innerHTML = this.filteredCollection.map(card => `
            <div class="collection-card flex items-center p-3 rounded-lg border border-gray-700 hover:border-neon-cyan/60 hover:bg-cyber-light/30 transition-all duration-300 cursor-pointer" data-card-id="${card.id}">
                <div class="w-16 h-20 bg-gradient-to-br ${this.getTypeColorClass(card.type)} rounded mr-4 flex-shrink-0 overflow-hidden">
                    <img src="${card.artworkUrl}" alt="${card.name}" class="w-full h-full object-cover" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="hidden w-full h-full items-center justify-center text-lg">
                        ${this.getTypeEmoji(card.type)}
                    </div>
                </div>
                
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-white">${card.name}</h4>
                        <div class="flex items-center space-x-2">
                            ${card.isFavorite ? '<span class="text-yellow-400 text-sm">⭐</span>' : ''}
                            ${card.isNew ? '<span class="bg-neon-cyan text-black text-xs px-2 py-1 rounded">NEW</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center space-x-4">
                            <span class="text-gray-400">${card.type.toUpperCase()}</span>
                            <span class="px-2 py-1 rounded text-xs ${this.getRarityColorClass(card.rarity)}">${card.rarity.toUpperCase()}</span>
                            <span class="text-neon-cyan font-bold">${card.cost} ⚡</span>
                        </div>
                        
                        ${card.type === 'creature' ? `
                            <div class="flex items-center space-x-2 text-xs">
                                <span class="text-red-400">${card.attack}⚔️</span>
                                <span class="text-blue-400">${card.defense}🛡️</span>
                                <span class="text-green-400">${card.health}❤️</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('')
    }
    
    getRarityBorderClass(rarity) {
        const classes = {
            'common': 'border-gray-500',
            'uncommon': 'border-green-500',
            'rare': 'border-blue-500',
            'mythic': 'border-purple-500'
        }
        return classes[rarity] || classes.common
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
    
    getTypeColorClass(type) {
        const classes = {
            'creature': 'from-neon-cyan/20 to-blue-500/20',
            'mod': 'from-neon-magenta/20 to-purple-500/20',
            'data': 'from-green-400/20 to-emerald-500/20',
            'realm': 'from-yellow-400/20 to-orange-500/20'
        }
        return classes[type] || classes.creature
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
    
    setViewMode(mode) {
        this.viewMode = mode
        
        const gridBtn = this.element.querySelector('#gridViewBtn')
        const listBtn = this.element.querySelector('#listViewBtn')
        
        if (mode === 'grid') {
            gridBtn.classList.add('bg-neon-cyan/20', 'text-neon-cyan')
            gridBtn.classList.remove('bg-cyber-dark', 'text-gray-400')
            listBtn.classList.remove('bg-neon-cyan/20', 'text-neon-cyan')
            listBtn.classList.add('bg-cyber-dark', 'text-gray-400')
        } else {
            listBtn.classList.add('bg-neon-cyan/20', 'text-neon-cyan')
            listBtn.classList.remove('bg-cyber-dark', 'text-gray-400')
            gridBtn.classList.remove('bg-neon-cyan/20', 'text-neon-cyan')
            gridBtn.classList.add('bg-cyber-dark', 'text-gray-400')
        }
        
        this.renderCollection()
    }
    
    clearAllFilters() {
        this.currentFilters = {
            type: 'all',
            rarity: 'all',
            faction: 'all',
            search: ''
        }
        
        // Reset UI
        this.element.querySelector('#searchInput').value = ''
        this.element.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active')
            if (btn.dataset.value === 'all') {
                btn.classList.add('active')
            }
        })
        
        this.applyFilters()
    }
    
    showCardDetail(cardId) {
        const card = this.collection.find(c => c.id === cardId)
        if (!card) return
        
        const modal = this.element.querySelector('#cardDetailModal')
        const modalCardName = this.element.querySelector('#modalCardName')
        const modalCardImage = this.element.querySelector('#modalCardImage')
        const modalCardDetails = this.element.querySelector('#modalCardDetails')
        
        modalCardName.textContent = card.name
        
        modalCardImage.innerHTML = `
            <img src="${card.artworkUrl}" alt="${card.name}" class="w-full h-full object-cover rounded-lg" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="hidden w-full h-full items-center justify-center text-6xl">
                ${this.getTypeEmoji(card.type)}
            </div>
        `
        
        modalCardDetails.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-400">Type:</span>
                    <span class="text-white font-medium">${card.type.toUpperCase()}</span>
                </div>
                
                <div class="flex justify-between">
                    <span class="text-gray-400">Rarity:</span>
                    <span class="px-2 py-1 rounded text-sm ${this.getRarityColorClass(card.rarity)}">${card.rarity.toUpperCase()}</span>
                </div>
                
                <div class="flex justify-between">
                    <span class="text-gray-400">Faction:</span>
                    <span class="text-white font-medium">${card.faction.toUpperCase()}</span>
                </div>
                
                <div class="flex justify-between">
                    <span class="text-gray-400">Cost:</span>
                    <span class="text-neon-cyan font-bold">${card.cost} ⚡</span>
                </div>
                
                ${card.type === 'creature' ? `
                    <div class="flex justify-between">
                        <span class="text-gray-400">Attack:</span>
                        <span class="text-red-400 font-bold">${card.attack} ⚔️</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span class="text-gray-400">Defense:</span>
                        <span class="text-blue-400 font-bold">${card.defense} 🛡️</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span class="text-gray-400">Health:</span>
                        <span class="text-green-400 font-bold">${card.health} ❤️</span>
                    </div>
                ` : ''}
                
                <div class="pt-3 border-t border-gray-700">
                    <span class="text-gray-400 block mb-2">Description:</span>
                    <p class="text-gray-300 text-sm leading-relaxed">${card.description}</p>
                </div>
                
                <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Added:</span>
                    <span class="text-gray-300">${card.addedAt.toLocaleDateString()}</span>
                </div>
            </div>
        `
        
        modal.classList.remove('hidden')
    }
    
    hideCardModal() {
        this.element.querySelector('#cardDetailModal').classList.add('hidden')
    }
    
    // Crafting System Methods
    
    async updateCyberDustDisplay() {
        const balance = await this.craftingService.getCyberDust()
        const dustElement = this.element.querySelector('#cyberDustBalance')
        if (dustElement) {
            dustElement.textContent = balance.toLocaleString()
        }
    }
    
    showBulkScrapModal() {
        // Create and show bulk scrap modal
        const modal = document.createElement('div')
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50'
        modal.innerHTML = `
            <div class="bg-cyber-dark border-2 border-neon-cyan rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-cyber font-bold text-neon-cyan">Bulk Scrap Cards</h2>
                    <button class="text-gray-400 hover:text-white text-2xl" id="closeBulkScrapModal">&times;</button>
                </div>
                
                <div class="mb-4">
                    <p class="text-gray-300 mb-4">Select cards to scrap for Cyber Dust. You'll get:</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
                        <div class="bg-gray-600/20 p-2 rounded">Common: 5 dust</div>
                        <div class="bg-green-600/20 p-2 rounded">Uncommon: 20 dust</div>
                        <div class="bg-blue-600/20 p-2 rounded">Rare: 100 dust</div>
                        <div class="bg-purple-600/20 p-2 rounded">Mythic: 400 dust</div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-300">Quick Actions:</span>
                        <div class="space-x-2">
                            <button class="cyber-button-secondary text-xs" id="selectDuplicatesBtn">Select Duplicates</button>
                            <button class="cyber-button-secondary text-xs" id="selectCommonsBtn">Select Commons</button>
                            <button class="cyber-button-secondary text-xs" id="clearSelectionBtn">Clear Selection</button>
                        </div>
                    </div>
                </div>
                
                <div id="scrapCardsList" class="max-h-60 overflow-y-auto mb-4 border border-gray-600 rounded p-2">
                    <!-- Cards will be populated here -->
                </div>
                
                <div class="flex justify-between items-center">
                    <div class="text-lg">
                        <span class="text-gray-300">Total Dust: </span>
                        <span class="text-purple-300 font-bold" id="totalScrapDust">0</span>
                    </div>
                    <div class="space-x-2">
                        <button class="cyber-button-secondary" id="cancelBulkScrap">Cancel</button>
                        <button class="cyber-button" id="confirmBulkScrap">Scrap Selected</button>
                    </div>
                </div>
            </div>
        `
        
        document.body.appendChild(modal)
        this.populateScrapCardsList(modal)
        this.setupBulkScrapEventListeners(modal)
    }
    
    showCraftingModal() {
        // Navigate to crafting page or show crafting modal
        window.technorox.router.navigate('/crafting')
    }
    
    showScrapRecommendations() {
        const recommendations = this.craftingService.getScrapRecommendations(this.collection)
        
        if (recommendations.length === 0) {
            window.technorox.uiManager.showInfo('No scrap recommendations at this time.')
            return
        }
        
        const modal = document.createElement('div')
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50'
        modal.innerHTML = `
            <div class="bg-cyber-dark border-2 border-neon-cyan rounded-lg p-6 max-w-lg w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-cyber font-bold text-neon-cyan">Scrap Recommendations</h2>
                    <button class="text-gray-400 hover:text-white text-2xl" id="closeRecommendationsModal">&times;</button>
                </div>
                
                <div class="space-y-4">
                    ${recommendations.map(rec => `
                        <div class="bg-gray-800/50 p-3 rounded">
                            <div class="text-sm text-gray-300 mb-2">${rec.reason}</div>
                            <div class="text-purple-300 font-bold">Potential: ${rec.dustValue} Cyber Dust</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-4 text-center">
                    <button class="cyber-button" id="openBulkScrapFromRec">Open Bulk Scrap</button>
                </div>
            </div>
        `
        
        document.body.appendChild(modal)
        
        modal.querySelector('#closeRecommendationsModal').addEventListener('click', () => {
            document.body.removeChild(modal)
        })
        
        modal.querySelector('#openBulkScrapFromRec').addEventListener('click', () => {
            document.body.removeChild(modal)
            this.showBulkScrapModal()
        })
    }
    
    getTypeColorClass(type) {
        const colors = {
            'creature': 'from-neon-cyan to-blue-500',
            'mod': 'from-neon-magenta to-purple-500',
            'data': 'from-green-400 to-emerald-500',
            'realm': 'from-yellow-400 to-orange-500'
        }
        return colors[type] || colors.creature
    }
    
    populateScrapCardsList(modal) {
        const container = modal.querySelector('#scrapCardsList')
        const cards = this.collection.filter(card => !card.isProtected) // Don't allow scrapping protected cards
        
        container.innerHTML = cards.map(card => `
            <div class="flex items-center justify-between p-2 border-b border-gray-700 hover:bg-gray-800/50">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" class="scrap-card-checkbox" data-card-id="${card.id}" data-dust="${this.craftingService.getScrapValue(card.rarity)}">
                    <div class="w-8 h-10 bg-gradient-to-br ${this.getTypeColorClass(card.type)} rounded flex items-center justify-center text-xs font-bold text-white">
                        ${card.cost}
                    </div>
                    <div>
                        <div class="text-sm font-medium text-white">${card.name}</div>
                        <div class="text-xs text-gray-400">${card.type.toUpperCase()} • ${card.rarity.toUpperCase()}</div>
                    </div>
                </div>
                <div class="text-purple-300 font-bold text-sm">
                    ${this.craftingService.getScrapValue(card.rarity)} dust
                </div>
            </div>
        `).join('')
        
        this.updateScrapTotal(modal)
    }
    
    setupBulkScrapEventListeners(modal) {
        // Close modal
        modal.querySelector('#closeBulkScrapModal').addEventListener('click', () => {
            document.body.removeChild(modal)
        })
        
        modal.querySelector('#cancelBulkScrap').addEventListener('click', () => {
            document.body.removeChild(modal)
        })
        
        // Quick selection buttons
        modal.querySelector('#selectDuplicatesBtn').addEventListener('click', () => {
            this.selectDuplicateCards(modal)
        })
        
        modal.querySelector('#selectCommonsBtn').addEventListener('click', () => {
            this.selectCardsByRarity(modal, 'common')
        })
        
        modal.querySelector('#clearSelectionBtn').addEventListener('click', () => {
            modal.querySelectorAll('.scrap-card-checkbox').forEach(cb => cb.checked = false)
            this.updateScrapTotal(modal)
        })
        
        // Checkbox changes
        modal.addEventListener('change', (e) => {
            if (e.target.classList.contains('scrap-card-checkbox')) {
                this.updateScrapTotal(modal)
            }
        })
        
        // Confirm scrap
        modal.querySelector('#confirmBulkScrap').addEventListener('click', () => {
            this.executeBulkScrap(modal)
        })
    }
    
    selectDuplicateCards(modal) {
        const cardCounts = {}
        this.collection.forEach(card => {
            cardCounts[card.name] = (cardCounts[card.name] || 0) + 1
        })
        
        modal.querySelectorAll('.scrap-card-checkbox').forEach(checkbox => {
            const cardId = checkbox.dataset.cardId
            const card = this.collection.find(c => c.id === cardId)
            if (card && cardCounts[card.name] > 1) {
                checkbox.checked = true
            }
        })
        
        this.updateScrapTotal(modal)
    }
    
    selectCardsByRarity(modal, rarity) {
        modal.querySelectorAll('.scrap-card-checkbox').forEach(checkbox => {
            const cardId = checkbox.dataset.cardId
            const card = this.collection.find(c => c.id === cardId)
            if (card && card.rarity === rarity) {
                checkbox.checked = true
            }
        })
        
        this.updateScrapTotal(modal)
    }
    
    updateScrapTotal(modal) {
        const checkedBoxes = modal.querySelectorAll('.scrap-card-checkbox:checked')
        const total = Array.from(checkedBoxes).reduce((sum, cb) => sum + parseInt(cb.dataset.dust), 0)
        modal.querySelector('#totalScrapDust').textContent = total.toLocaleString()
    }
    
    async executeBulkScrap(modal) {
        const checkedBoxes = modal.querySelectorAll('.scrap-card-checkbox:checked')
        const cardIds = Array.from(checkedBoxes).map(cb => cb.dataset.cardId)
        
        if (cardIds.length === 0) {
            window.technorox.uiManager.showError('No cards selected for scrapping')
            return
        }
        
        const cardsToScrap = this.collection.filter(card => cardIds.includes(card.id))
        
        try {
            const result = await this.craftingService.scrapCards(cardsToScrap)
            
            if (result.success) {
                // Remove scrapped cards from collection
                this.collection = this.collection.filter(card => !cardIds.includes(card.id))
                
                // Update displays
                this.updateCollectionStats()
                this.updateCyberDustDisplay()
                this.applyFilters()
                
                window.technorox.uiManager.showSuccess(result.message)
                document.body.removeChild(modal)
            }
        } catch (error) {
            console.error('Error scrapping cards:', error)
            window.technorox.uiManager.showError('Failed to scrap cards')
        }
    }
}

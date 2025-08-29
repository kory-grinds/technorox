export class Card {
    constructor(cardData, options = {}) {
        this.cardData = cardData
        this.options = {
            showBack: false,
            clickable: true,
            draggable: false,
            size: 'normal', // small, normal, large
            ...options
        }
        this.element = null
        this.isFlipped = this.options.showBack
        this.isFlipping = false
    }
    
    render() {
        this.element = document.createElement('div')
        this.element.className = this.getCardClasses()
        
        // Create card container with 3D flip effect
        this.element.innerHTML = `
            <div class="card-inner">
                <!-- Card Front -->
                <div class="card-front">
                    ${this.renderCardFront()}
                </div>
                
                <!-- Card Back -->
                <div class="card-back">
                    ${this.renderCardBack()}
                </div>
            </div>
        `
        
        this.setupEventListeners()
        return this.element
    }
    
    getCardClasses() {
        const sizeClasses = {
            small: 'w-20 h-28',
            normal: 'w-32 h-44', 
            large: 'w-48 h-64'
        }
        
        let classes = `card-container ${sizeClasses[this.options.size]} relative cursor-pointer`
        
        if (this.options.draggable) {
            classes += ' draggable'
        }
        
        if (this.isFlipped) {
            classes += ' flipped'
        }
        
        return classes
    }
    
    renderCardFront() {
        if (!this.cardData) return this.renderEmptyCard()
        
        // Support both 'type' and 'cardType' for compatibility
        const cardType = this.cardData.cardType || this.cardData.type
        
        switch (cardType) {
            case 'creature':
                return this.renderCreatureCard()
            case 'mod':
                return this.renderModCard()
            case 'data':
                return this.renderDataCard()
            case 'realm':
                return this.renderRealmCard()
            default:
                return this.renderGenericCard()
        }
    }
    
    renderCreatureCard() {
        const card = this.cardData
        return `
            <div class="card-content h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border-2 ${this.getRarityBorder(card.rarity)} overflow-hidden">
                <!-- Header -->
                <div class="card-header bg-gradient-to-r from-neon-cyan to-neon-magenta p-2">
                    <div class="flex justify-between items-center">
                        <h3 class="font-cyber font-bold text-black text-sm truncate">${card.name}</h3>
                        <div class="cost-badge bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ${card.cost}
                        </div>
                    </div>
                    <div class="text-xs text-black/80 mt-1">${card.type} • ${card.faction}</div>
                </div>
                
                <!-- Artwork -->
                <div class="card-artwork relative h-24 bg-gradient-to-br ${this.getTypeGradient(card.cardType || card.type)} overflow-hidden">
                    ${card.image_url ? `
                        <img src="${card.image_url}" alt="${card.name}" class="w-full h-full object-cover">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            ${this.getTypeEmoji(card.cardType || card.type)}
                        </div>
                    `}
                    
                    <!-- Rarity Gem -->
                    <div class="absolute top-1 right-1 w-4 h-4 ${this.getRarityGem(card.rarity)} rounded-full border border-white/50"></div>
                </div>
                
                <!-- Stats -->
                <div class="card-stats bg-gray-800/90 p-2">
                    <div class="flex justify-between items-center mb-2">
                        <div class="stat-box bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                            ${card.attack}
                        </div>
                        <div class="stat-box bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                            ${card.defense}
                        </div>
                    </div>
                    
                    <!-- Ability -->
                    <div class="ability-text text-xs text-gray-300 leading-tight">
                        ${card.ability || card.effect}
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="card-footer bg-gray-900 p-1">
                    <div class="text-xs text-gray-500 italic text-center truncate">
                        "${card.flavor_text || ''}"
                    </div>
                </div>
            </div>
        `
    }
    
    renderModCard() {
        const card = this.cardData
        return `
            <div class="card-content h-full bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border-2 ${this.getRarityBorder(card.rarity)} overflow-hidden">
                <!-- Header -->
                <div class="card-header bg-gradient-to-r from-neon-magenta to-purple-500 p-2">
                    <div class="flex justify-between items-center">
                        <h3 class="font-cyber font-bold text-white text-sm truncate">${card.name}</h3>
                        <div class="cost-badge bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ${card.cost}
                        </div>
                    </div>
                    <div class="text-xs text-white/80 mt-1">MOD CARD</div>
                </div>
                
                <!-- Artwork -->
                <div class="card-artwork relative h-24 bg-gradient-to-br from-purple-600/20 to-pink-500/20 overflow-hidden">
                    ${card.image_url ? `
                        <img src="${card.image_url}" alt="${card.name}" class="w-full h-full object-cover">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            ⚙️
                        </div>
                    `}
                    
                    <div class="absolute top-1 right-1 w-4 h-4 ${this.getRarityGem(card.rarity)} rounded-full border border-white/50"></div>
                </div>
                
                <!-- Effect -->
                <div class="card-effect bg-purple-800/90 p-2 flex-1">
                    <div class="text-xs text-gray-200 leading-tight">
                        ${card.effect}
                    </div>
                </div>
            </div>
        `
    }
    
    renderDataCard() {
        const card = this.cardData
        return `
            <div class="card-content h-full bg-gradient-to-br from-green-900 to-green-800 rounded-lg border-2 ${this.getRarityBorder(card.rarity)} overflow-hidden">
                <!-- Header -->
                <div class="card-header bg-gradient-to-r from-green-400 to-emerald-500 p-2">
                    <div class="flex justify-between items-center">
                        <h3 class="font-cyber font-bold text-black text-sm truncate">${card.name}</h3>
                        <div class="cost-badge bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ${card.cost}
                        </div>
                    </div>
                    <div class="text-xs text-black/80 mt-1">DATA CARD</div>
                </div>
                
                <!-- Artwork -->
                <div class="card-artwork relative h-24 bg-gradient-to-br from-green-600/20 to-cyan-500/20 overflow-hidden">
                    ${card.image_url ? `
                        <img src="${card.image_url}" alt="${card.name}" class="w-full h-full object-cover">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            💾
                        </div>
                    `}
                    
                    <div class="absolute top-1 right-1 w-4 h-4 ${this.getRarityGem(card.rarity)} rounded-full border border-white/50"></div>
                </div>
                
                <!-- Effect -->
                <div class="card-effect bg-green-800/90 p-2 flex-1">
                    <div class="text-xs text-gray-200 leading-tight">
                        ${card.effect}
                    </div>
                </div>
            </div>
        `
    }
    
    renderRealmCard() {
        const card = this.cardData
        return `
            <div class="card-content h-full bg-gradient-to-br from-yellow-900 to-orange-800 rounded-lg border-2 ${this.getRarityBorder(card.rarity)} overflow-hidden">
                <!-- Header -->
                <div class="card-header bg-gradient-to-r from-yellow-400 to-orange-500 p-2">
                    <div class="flex justify-between items-center">
                        <h3 class="font-cyber font-bold text-black text-sm truncate">${card.name}</h3>
                    </div>
                    <div class="text-xs text-black/80 mt-1">REALM CARD</div>
                </div>
                
                <!-- Artwork -->
                <div class="card-artwork relative h-24 bg-gradient-to-br from-yellow-600/20 to-orange-500/20 overflow-hidden">
                    ${card.image_url ? `
                        <img src="${card.image_url}" alt="${card.name}" class="w-full h-full object-cover">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            🌐
                        </div>
                    `}
                    
                    <div class="absolute top-1 right-1 w-4 h-4 ${this.getRarityGem(card.rarity)} rounded-full border border-white/50"></div>
                </div>
                
                <!-- Effect -->
                <div class="card-effect bg-yellow-800/90 p-2 flex-1">
                    <div class="text-xs text-gray-200 leading-tight">
                        ${card.effect}
                    </div>
                </div>
            </div>
        `
    }
    
    renderGenericCard() {
        const card = this.cardData
        return `
            <div class="card-content h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border-2 ${this.getRarityBorder(card.rarity)} overflow-hidden">
                <!-- Header -->
                <div class="card-header bg-gradient-to-r from-neon-cyan to-neon-magenta p-2">
                    <div class="flex justify-between items-center">
                        <h3 class="font-cyber font-bold text-black text-sm truncate">${card.name}</h3>
                        <div class="cost-badge bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ${card.cost || 0}
                        </div>
                    </div>
                    <div class="text-xs text-black/80 mt-1">${(card.type || card.cardType || 'UNKNOWN').toUpperCase()}</div>
                </div>
                
                <!-- Artwork -->
                <div class="card-artwork relative h-24 bg-gradient-to-br from-gray-600/20 to-gray-500/20 overflow-hidden">
                    ${card.image_url ? `
                        <img src="${card.image_url}" alt="${card.name}" class="w-full h-full object-cover">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            ❓
                        </div>
                    `}
                    
                    <div class="absolute top-1 right-1 w-4 h-4 ${this.getRarityGem(card.rarity)} rounded-full border border-white/50"></div>
                </div>
                
                <!-- Effect/Description -->
                <div class="card-effect bg-gray-800/90 p-2 flex-1">
                    <div class="text-xs text-gray-200 leading-tight">
                        ${card.effect || card.ability || card.description || 'No description available'}
                    </div>
                </div>
            </div>
        `
    }
    
    renderCardBack() {
        return `
            <div class="card-back-content h-full bg-gradient-to-br from-neon-purple to-cyber-dark rounded-lg border-2 border-neon-cyan overflow-hidden relative">
                <!-- Animated Background -->
                <div class="absolute inset-0 cyber-grid opacity-20"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
                
                <!-- Central Logo -->
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                        <!-- Hexagonal Frame -->
                        <div class="relative w-16 h-16 mb-2">
                            <div class="absolute inset-0 border-2 border-neon-cyan transform rotate-0 hexagon"></div>
                            <div class="absolute inset-1 border border-neon-magenta transform rotate-0 hexagon"></div>
                            
                            <!-- Wolf Logo -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <svg class="w-8 h-8 text-neon-magenta" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                                </svg>
                            </div>
                        </div>
                        
                        <!-- Game Title -->
                        <div class="font-cyber font-bold text-neon-cyan text-xs tracking-wider">
                            NEON
                        </div>
                        <div class="font-cyber font-bold text-neon-cyan text-xs tracking-wider">
                            APEX
                        </div>
                    </div>
                </div>
                
                <!-- Corner Accents -->
                <div class="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-neon-cyan"></div>
                <div class="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-neon-cyan"></div>
                <div class="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-neon-cyan"></div>
                <div class="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-neon-cyan"></div>
                
                <!-- Circuit Lines -->
                <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-50"></div>
                <div class="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-50"></div>
            </div>
        `
    }
    
    renderEmptyCard() {
        return `
            <div class="card-content h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                <div class="text-center text-gray-500">
                    <div class="text-2xl mb-2">📄</div>
                    <div class="text-xs">Empty Slot</div>
                </div>
            </div>
        `
    }
    
    setupEventListeners() {
        if (this.options.clickable) {
            this.element.addEventListener('click', () => {
                this.flip()
            })
        }
        
        if (this.options.draggable) {
            this.element.draggable = true
            this.element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(this.cardData))
            })
        }
    }
    
    flip() {
        if (this.isFlipping) return
        
        this.isFlipping = true
        this.isFlipped = !this.isFlipped
        
        if (this.isFlipped) {
            this.element.classList.add('flipped')
        } else {
            this.element.classList.remove('flipped')
        }
        
        // Reset flipping state after animation
        setTimeout(() => {
            this.isFlipping = false
        }, 600)
        
        // Emit flip event
        this.element.dispatchEvent(new CustomEvent('cardFlip', {
            detail: { 
                card: this.cardData, 
                isFlipped: this.isFlipped 
            }
        }))
    }
    
    getRarityBorder(rarity) {
        const borders = {
            'Common': 'border-gray-500',
            'Uncommon': 'border-green-500',
            'Rare': 'border-blue-500',
            'Mythic': 'border-purple-500'
        }
        return borders[rarity] || borders.Common
    }
    
    getRarityGem(rarity) {
        const gems = {
            'Common': 'bg-gray-500',
            'Uncommon': 'bg-green-500',
            'Rare': 'bg-blue-500',
            'Mythic': 'bg-purple-500'
        }
        return gems[rarity] || gems.Common
    }
    
    getTypeGradient(type) {
        const gradients = {
            'creature': 'from-neon-cyan/20 to-blue-500/20',
            'mod': 'from-neon-magenta/20 to-purple-500/20',
            'data': 'from-green-400/20 to-emerald-500/20',
            'realm': 'from-yellow-400/20 to-orange-500/20'
        }
        return gradients[type] || gradients.creature
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
    
    updateCard(newCardData) {
        this.cardData = newCardData
        if (this.element) {
            const newElement = this.render()
            this.element.replaceWith(newElement)
        }
    }
    
    destroy() {
        if (this.element) {
            this.element.remove()
        }
    }
}

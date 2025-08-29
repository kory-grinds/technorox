import { BasePage } from './BasePage.js'
import { ROX_CHIPS_BUNDLES, STORE_ITEMS, RoxChipsUtils } from '../data/roxChipsSchema.js'
import { RoxChipsDisplay } from '../components/RoxChipsDisplay.js'
import { roxChipsService } from '../services/RoxChipsService.js'

export default class StorePage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.currentCategory = 'packs'
        this.roxChipsDisplay = null
        this.userBalance = 0
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900'
        
        content.innerHTML = `
            <div class="p-8">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-cyber font-bold mb-2">
                            <span class="neon-text">Rox Chips Store</span>
                        </h1>
                        <p class="text-gray-400">Purchase card packs, cosmetics, and more with Rox Chips</p>
                    </div>
                    
                    <!-- Balance Display -->
                    <div id="balanceContainer" class="flex items-center space-x-4">
                        <!-- Rox Chips display will be inserted here -->
                    </div>
                </div>
                
                <!-- Store Navigation -->
                <div class="cyber-card mb-8">
                    <div class="flex items-center space-x-1 overflow-x-auto">
                        <button class="store-nav-btn active" data-category="packs">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                            Card Packs
                        </button>
                        <button class="store-nav-btn" data-category="cosmetics">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                            </svg>
                            Cosmetics
                        </button>
                        <button class="store-nav-btn" data-category="battlepass">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                            </svg>
                            Battle Pass
                        </button>
                        <button class="store-nav-btn" data-category="bundles">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                            </svg>
                            Buy Rox Chips
                        </button>
                    </div>
                </div>
                
                <!-- Store Content -->
                <div id="storeContent">
                    <!-- Content will be dynamically loaded here -->
                </div>
                
                <!-- Purchase Modal -->
                <div id="purchaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden backdrop-blur-sm">
                    <div class="cyber-card max-w-md w-full mx-4">
                        <div class="flex justify-between items-start mb-6">
                            <h3 class="text-2xl font-cyber font-bold text-neon-cyan">Confirm Purchase</h3>
                            <button id="closePurchaseModal" class="text-gray-400 hover:text-white text-2xl">×</button>
                        </div>
                        
                        <div id="purchaseModalContent">
                            <!-- Purchase details will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.initializeRoxChipsService()
        this.setupRoxChipsDisplay()
        this.setupEventListeners()
        this.renderStoreContent()
        this.addStyles()
    }
    
    async initializeRoxChipsService() {
        const authManager = window.technorox?.authManager
        const user = authManager?.getCurrentUser()
        
        if (user) {
            await roxChipsService.init(user.uid)
            this.userBalance = roxChipsService.getRoxChipsBalance()
        }
    }
    
    setupRoxChipsDisplay() {
        const balanceContainer = this.element.querySelector('#balanceContainer')
        
        // Create Rox Chips display
        this.roxChipsDisplay = new RoxChipsDisplay(this.userBalance, {
            size: 'large',
            clickable: true,
            animated: true
        })
        
        balanceContainer.appendChild(this.roxChipsDisplay.render())
        
        // Handle clicks to buy more chips
        this.roxChipsDisplay.element.addEventListener('roxChipsClick', () => {
            this.showCategory('bundles')
        })
    }
    
    setupEventListeners() {
        // Category navigation
        const navButtons = this.element.querySelectorAll('.store-nav-btn')
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category
                this.showCategory(category)
                
                // Update active state
                navButtons.forEach(btn => btn.classList.remove('active'))
                button.classList.add('active')
            })
        })
        
        // Purchase modal
        this.element.querySelector('#closePurchaseModal').addEventListener('click', () => {
            this.hidePurchaseModal()
        })
        
        // Close modal on backdrop click
        this.element.querySelector('#purchaseModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hidePurchaseModal()
            }
        })
    }
    
    renderStoreContent() {
        this.showCategory(this.currentCategory)
    }
    
    showCategory(category) {
        this.currentCategory = category
        const contentContainer = this.element.querySelector('#storeContent')
        
        switch (category) {
            case 'packs':
                contentContainer.innerHTML = this.renderCardPacks()
                break
            case 'cosmetics':
                contentContainer.innerHTML = this.renderCosmetics()
                break
            case 'battlepass':
                contentContainer.innerHTML = this.renderBattlePass()
                break
            case 'bundles':
                contentContainer.innerHTML = this.renderRoxChipsBundles()
                break
        }
        
        this.setupCategoryEventListeners()
    }
    
    renderCardPacks() {
        const packs = RoxChipsUtils.getItemsByCategory('packs')
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${packs.map(pack => `
                    <div class="store-item-card" data-item-id="${pack.id}">
                        <div class="store-item-header">
                            <div class="store-item-icon">${pack.icon}</div>
                            <h3 class="store-item-title">${pack.name}</h3>
                        </div>
                        
                        <div class="store-item-description">
                            ${pack.description}
                        </div>
                        
                        <div class="store-item-contents">
                            <div class="text-sm text-gray-400 mb-2">Contains:</div>
                            <div class="flex items-center space-x-2 text-sm">
                                <span class="text-neon-cyan">${pack.contents.cardCount} cards</span>
                                <span class="text-gray-500">•</span>
                                <span class="text-neon-magenta">Guaranteed ${pack.contents.guaranteedRarity}</span>
                            </div>
                        </div>
                        
                        <div class="store-item-footer">
                            <div class="store-item-price">
                                <span class="price-amount">${pack.price}</span>
                                <span class="price-currency">Rox Chips</span>
                            </div>
                            <button class="store-buy-btn" data-item-id="${pack.id}">
                                ${this.userBalance >= pack.price ? 'Buy Now' : 'Insufficient Chips'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }
    
    renderCosmetics() {
        const cosmetics = RoxChipsUtils.getItemsByCategory('cosmetics')
        
        return `
            <div class="mb-6">
                <div class="flex space-x-4 mb-4">
                    <button class="cosmetic-filter-btn active" data-filter="all">All</button>
                    <button class="cosmetic-filter-btn" data-filter="cardbacks">Card Backs</button>
                    <button class="cosmetic-filter-btn" data-filter="avatars">Avatars</button>
                    <button class="cosmetic-filter-btn" data-filter="boards">Board Skins</button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${cosmetics.map(item => `
                    <div class="cosmetic-item-card" data-item-id="${item.id}" data-subcategory="${item.subcategory}">
                        <div class="cosmetic-item-preview">
                            ${item.preview ? `<img src="${item.preview}" alt="${item.name}" class="w-full h-32 object-cover rounded-lg">` : `
                                <div class="cosmetic-placeholder">
                                    <span class="text-4xl">${item.icon}</span>
                                </div>
                            `}
                        </div>
                        
                        <div class="cosmetic-item-info">
                            <h3 class="cosmetic-item-title">${item.name}</h3>
                            <p class="cosmetic-item-description">${item.description}</p>
                            
                            <div class="cosmetic-item-footer">
                                <div class="cosmetic-item-price">
                                    <span class="price-amount">${item.price}</span>
                                    <span class="price-currency">Rox Chips</span>
                                </div>
                                <button class="cosmetic-buy-btn" data-item-id="${item.id}">
                                    ${roxChipsService.hasItem(item.id) ? 'Owned' : (this.userBalance >= item.price ? 'Buy' : 'Insufficient')}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }
    
    renderBattlePass() {
        const battlePass = STORE_ITEMS.seasonalBattlePass
        
        return `
            <div class="max-w-4xl mx-auto">
                <div class="battle-pass-card">
                    <div class="battle-pass-header">
                        <div class="battle-pass-icon">${battlePass.icon}</div>
                        <div>
                            <h2 class="text-2xl font-bold text-neon-cyan">${battlePass.name}</h2>
                            <p class="text-gray-400">${battlePass.description}</p>
                        </div>
                        <div class="battle-pass-price">
                            <span class="text-3xl font-bold text-neon-magenta">${battlePass.price}</span>
                            <span class="text-gray-400">Rox Chips</span>
                        </div>
                    </div>
                    
                    <div class="battle-pass-features">
                        <div class="feature-grid">
                            <div class="feature-item">
                                <span class="feature-icon">🎁</span>
                                <span class="feature-text">${battlePass.rewards} Exclusive Rewards</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">⏰</span>
                                <span class="feature-text">${battlePass.duration} Days Duration</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">✨</span>
                                <span class="feature-text">Exclusive Cosmetics</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🏆</span>
                                <span class="feature-text">Premium Rewards Track</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="battle-pass-footer">
                        <button class="battle-pass-buy-btn" data-item-id="${battlePass.id}">
                            ${this.userBalance >= battlePass.price ? 'Purchase Battle Pass' : 'Insufficient Rox Chips'}
                        </button>
                    </div>
                </div>
            </div>
        `
    }
    
    renderRoxChipsBundles() {
        const bundles = Object.values(ROX_CHIPS_BUNDLES)
        
        return `
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-neon-cyan mb-2">Purchase Rox Chips</h2>
                    <p class="text-gray-400">Get more Rox Chips to unlock cards, cosmetics, and premium content</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${bundles.map(bundle => `
                        <div class="bundle-card ${bundle.popular ? 'popular' : ''}" data-bundle-id="${bundle.id}">
                            ${bundle.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                            
                            <div class="bundle-header">
                                <div class="bundle-icon">${bundle.icon}</div>
                                <h3 class="bundle-title">${bundle.name}</h3>
                                <p class="bundle-description">${bundle.description}</p>
                            </div>
                            
                            <div class="bundle-content">
                                <div class="bundle-price">
                                    <span class="price-usd">$${bundle.priceUSD}</span>
                                </div>
                                
                                <div class="bundle-chips">
                                    <div class="base-chips">
                                        <span class="chips-amount">${bundle.roxChips}</span>
                                        <span class="chips-label">Base Chips</span>
                                    </div>
                                    
                                    ${bundle.bonusChips > 0 ? `
                                        <div class="bonus-chips">
                                            <span class="bonus-amount">+${bundle.bonusChips}</span>
                                            <span class="bonus-label">${bundle.bonusPercentage}% Bonus</span>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="total-chips">
                                        <span class="total-amount">${bundle.totalChips}</span>
                                        <span class="total-label">Total Rox Chips</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bundle-footer">
                                <button class="bundle-buy-btn" data-bundle-id="${bundle.id}">
                                    Purchase Now
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-8 text-center text-sm text-gray-400">
                    <p>Secure payments powered by Stripe • All purchases are final</p>
                    <p>Rox Chips are virtual currency and cannot be exchanged for real money</p>
                </div>
            </div>
        `
    }
    
    setupCategoryEventListeners() {
        // Store item purchase buttons
        const buyButtons = this.element.querySelectorAll('.store-buy-btn, .cosmetic-buy-btn, .battle-pass-buy-btn')
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId
                this.showPurchaseModal(itemId)
            })
        })
        
        // Bundle purchase buttons
        const bundleButtons = this.element.querySelectorAll('.bundle-buy-btn')
        bundleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bundleId = e.target.dataset.bundleId
                this.purchaseRoxChipsBundle(bundleId)
            })
        })
        
        // Cosmetic filters
        const filterButtons = this.element.querySelectorAll('.cosmetic-filter-btn')
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter
                this.filterCosmetics(filter)
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'))
                e.target.classList.add('active')
            })
        })
    }
    
    showPurchaseModal(itemId) {
        const item = RoxChipsUtils.getStoreItem(itemId)
        if (!item) return
        
        const modal = this.element.querySelector('#purchaseModal')
        const content = this.element.querySelector('#purchaseModalContent')
        
        content.innerHTML = `
            <div class="purchase-item-info">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="purchase-item-icon">${item.icon}</div>
                    <div>
                        <h4 class="text-lg font-bold text-white">${item.name}</h4>
                        <p class="text-gray-400">${item.description}</p>
                    </div>
                </div>
                
                <div class="purchase-details">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-gray-300">Price:</span>
                        <span class="text-neon-cyan font-bold">${item.price} Rox Chips</span>
                    </div>
                    
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-gray-300">Your Balance:</span>
                        <span class="text-white font-bold">${RoxChipsUtils.formatRoxChips(this.userBalance)} Rox Chips</span>
                    </div>
                    
                    ${this.userBalance < item.price ? `
                        <div class="insufficient-funds-warning">
                            <p class="text-red-400 text-sm mb-4">
                                You need ${item.price - this.userBalance} more Rox Chips to purchase this item.
                            </p>
                            <button class="w-full bg-neon-magenta text-black font-bold py-2 px-4 rounded-lg hover:bg-neon-magenta/80 transition-colors" onclick="this.closest('#purchaseModal').classList.add('hidden'); document.querySelector('[data-category=\"bundles\"]').click();">
                                Buy More Rox Chips
                            </button>
                        </div>
                    ` : `
                        <div class="purchase-actions">
                            <button id="confirmPurchase" class="w-full bg-neon-cyan text-black font-bold py-3 px-4 rounded-lg hover:bg-neon-cyan/80 transition-colors" data-item-id="${itemId}">
                                Confirm Purchase
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `
        
        // Setup confirm purchase button
        const confirmButton = content.querySelector('#confirmPurchase')
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                this.confirmItemPurchase(itemId)
            })
        }
        
        modal.classList.remove('hidden')
    }
    
    hidePurchaseModal() {
        this.element.querySelector('#purchaseModal').classList.add('hidden')
    }
    
    async confirmItemPurchase(itemId) {
        try {
            const success = await roxChipsService.purchaseStoreItem(itemId)
            
            if (success) {
                // Update balance display
                this.userBalance = roxChipsService.getRoxChipsBalance()
                this.roxChipsDisplay.updateBalance(this.userBalance)
                
                // Show success message
                window.technorox?.uiManager?.showSuccess('Purchase successful!')
                
                // Hide modal and refresh content
                this.hidePurchaseModal()
                this.renderStoreContent()
            } else {
                window.technorox?.uiManager?.showError('Purchase failed. Please try again.')
            }
        } catch (error) {
            console.error('Purchase error:', error)
            window.technorox?.uiManager?.showError(error.message || 'Purchase failed')
        }
    }
    
    async purchaseRoxChipsBundle(bundleId) {
        try {
            // Create Stripe checkout session
            const session = await roxChipsService.createStripeCheckoutSession(bundleId)
            
            if (session.url) {
                // Redirect to Stripe checkout
                window.location.href = session.url
            } else {
                throw new Error('Failed to create checkout session')
            }
        } catch (error) {
            console.error('Bundle purchase error:', error)
            window.technorox?.uiManager?.showError('Failed to start purchase process. Please try again.')
        }
    }
    
    filterCosmetics(filter) {
        const cosmeticCards = this.element.querySelectorAll('.cosmetic-item-card')
        
        cosmeticCards.forEach(card => {
            if (filter === 'all' || card.dataset.subcategory === filter) {
                card.style.display = 'block'
            } else {
                card.style.display = 'none'
            }
        })
    }
    
    addStyles() {
        const style = document.createElement('style')
        style.textContent = `
            .store-nav-btn {
                display: flex;
                align-items: center;
                space-x: 0.5rem;
                padding: 0.75rem 1rem;
                background: rgba(55, 65, 81, 0.5);
                border: 1px solid transparent;
                border-radius: 0.5rem;
                color: #9CA3AF;
                font-weight: 500;
                transition: all 0.2s;
                white-space: nowrap;
            }
            
            .store-nav-btn:hover {
                background: rgba(55, 65, 81, 0.8);
                color: #00FFF7;
            }
            
            .store-nav-btn.active {
                background: linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(255, 0, 255, 0.1));
                border-color: rgba(0, 255, 247, 0.3);
                color: #00FFF7;
            }
            
            .store-nav-btn svg {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.5rem;
            }
            
            .store-item-card, .cosmetic-item-card {
                background: linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8));
                border: 1px solid rgba(75, 85, 99, 0.3);
                border-radius: 0.75rem;
                padding: 1.5rem;
                transition: all 0.3s;
            }
            
            .store-item-card:hover, .cosmetic-item-card:hover {
                border-color: rgba(0, 255, 247, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            
            .store-item-header {
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .store-item-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }
            
            .store-item-title {
                font-size: 1.25rem;
                font-weight: bold;
                color: white;
                margin-bottom: 0.5rem;
            }
            
            .store-item-description {
                color: #9CA3AF;
                font-size: 0.875rem;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .store-item-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
            }
            
            .store-item-price {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            
            .price-amount {
                font-size: 1.25rem;
                font-weight: bold;
                color: #00FFF7;
            }
            
            .price-currency {
                font-size: 0.75rem;
                color: #9CA3AF;
            }
            
            .store-buy-btn, .cosmetic-buy-btn, .battle-pass-buy-btn {
                background: linear-gradient(135deg, #00FFF7, #FF00FF);
                color: black;
                font-weight: bold;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .store-buy-btn:hover, .cosmetic-buy-btn:hover, .battle-pass-buy-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 255, 247, 0.3);
            }
            
            .bundle-card {
                background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.9));
                border: 2px solid rgba(75, 85, 99, 0.3);
                border-radius: 1rem;
                padding: 2rem;
                position: relative;
                transition: all 0.3s;
            }
            
            .bundle-card.popular {
                border-color: rgba(255, 0, 255, 0.5);
                box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
            }
            
            .popular-badge {
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #FF00FF, #00FFF7);
                color: black;
                font-weight: bold;
                font-size: 0.75rem;
                padding: 0.25rem 1rem;
                border-radius: 1rem;
            }
            
            .bundle-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }
            
            .bundle-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }
            
            .bundle-title {
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                margin-bottom: 0.5rem;
            }
            
            .bundle-description {
                color: #9CA3AF;
                font-size: 0.875rem;
            }
            
            .bundle-price {
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .price-usd {
                font-size: 2.5rem;
                font-weight: bold;
                color: #10B981;
            }
            
            .bundle-chips {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 0.5rem;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .base-chips, .bonus-chips, .total-chips {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .total-chips {
                border-top: 1px solid rgba(75, 85, 99, 0.5);
                padding-top: 0.5rem;
                margin-bottom: 0;
                font-weight: bold;
            }
            
            .chips-amount, .total-amount {
                color: #00FFF7;
                font-weight: bold;
            }
            
            .bonus-amount {
                color: #10B981;
                font-weight: bold;
            }
            
            .bundle-buy-btn {
                width: 100%;
                background: linear-gradient(135deg, #10B981, #059669);
                color: white;
                font-weight: bold;
                padding: 0.75rem;
                border-radius: 0.5rem;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .bundle-buy-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }
            
            .cosmetic-filter-btn {
                padding: 0.5rem 1rem;
                background: rgba(55, 65, 81, 0.5);
                border: 1px solid transparent;
                border-radius: 0.5rem;
                color: #9CA3AF;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .cosmetic-filter-btn:hover {
                background: rgba(55, 65, 81, 0.8);
                color: #00FFF7;
            }
            
            .cosmetic-filter-btn.active {
                background: rgba(0, 255, 247, 0.1);
                border-color: rgba(0, 255, 247, 0.3);
                color: #00FFF7;
            }
            
            .cosmetic-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 8rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .battle-pass-card {
                background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.9));
                border: 2px solid rgba(255, 215, 0, 0.3);
                border-radius: 1rem;
                padding: 2rem;
            }
            
            .battle-pass-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2rem;
            }
            
            .battle-pass-icon {
                font-size: 4rem;
                margin-right: 1rem;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                space-x: 0.5rem;
                padding: 1rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 0.5rem;
            }
            
            .feature-icon {
                font-size: 1.5rem;
                margin-right: 0.5rem;
            }
        `
        
        if (!document.querySelector('#store-styles')) {
            style.id = 'store-styles'
            document.head.appendChild(style)
        }
    }
}

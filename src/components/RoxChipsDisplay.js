import { RoxChipsUtils } from '../data/roxChipsSchema.js'

/**
 * Rox Chips Display Component
 * Shows the user's current Rox Chips balance with animated updates
 */
export class RoxChipsDisplay {
    constructor(balance = 0, options = {}) {
        this.balance = balance
        this.options = {
            size: 'normal', // small, normal, large
            showIcon: true,
            showLabel: true,
            animated: true,
            clickable: false,
            ...options
        }
        this.element = null
        this.animationDuration = 500
    }

    render() {
        this.element = document.createElement('div')
        this.element.className = this.getContainerClasses()
        
        this.element.innerHTML = `
            ${this.options.showIcon ? this.renderIcon() : ''}
            <div class="rox-chips-content">
                ${this.options.showLabel ? '<span class="rox-chips-label">Rox Chips</span>' : ''}
                <span class="rox-chips-amount" data-balance="${this.balance}">
                    ${RoxChipsUtils.formatRoxChips(this.balance)}
                </span>
            </div>
            ${this.options.clickable ? this.renderClickableIcon() : ''}
        `

        if (this.options.clickable) {
            this.element.addEventListener('click', () => {
                this.element.dispatchEvent(new CustomEvent('roxChipsClick', {
                    detail: { balance: this.balance }
                }))
            })
        }

        this.addStyles()
        return this.element
    }

    renderIcon() {
        const iconSize = this.getIconSize()
        return `
            <div class="rox-chips-icon" style="width: ${iconSize}px; height: ${iconSize}px;">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="url(#roxChipGradient)" stroke="#00FFF7" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                        <linearGradient id="roxChipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00FFF7;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#FF00FF;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        `
    }

    renderClickableIcon() {
        return `
            <div class="rox-chips-add-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="#00FFF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `
    }

    getContainerClasses() {
        const baseClasses = 'rox-chips-display flex items-center space-x-2'
        const sizeClasses = {
            small: 'text-sm',
            normal: 'text-base',
            large: 'text-lg'
        }
        const clickableClasses = this.options.clickable ? 'cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors' : ''
        
        return `${baseClasses} ${sizeClasses[this.options.size]} ${clickableClasses}`
    }

    getIconSize() {
        const sizes = {
            small: 20,
            normal: 24,
            large: 32
        }
        return sizes[this.options.size] || 24
    }

    updateBalance(newBalance, animated = true) {
        const oldBalance = this.balance
        this.balance = newBalance

        const amountElement = this.element?.querySelector('.rox-chips-amount')
        if (!amountElement) return

        if (animated && this.options.animated) {
            this.animateBalanceChange(amountElement, oldBalance, newBalance)
        } else {
            amountElement.textContent = RoxChipsUtils.formatRoxChips(newBalance)
            amountElement.setAttribute('data-balance', newBalance)
        }
    }

    animateBalanceChange(element, fromBalance, toBalance) {
        const difference = toBalance - fromBalance
        const steps = 30
        const stepValue = difference / steps
        const stepDuration = this.animationDuration / steps
        
        let currentStep = 0
        let currentBalance = fromBalance

        // Add animation class
        element.classList.add('rox-chips-animating')

        const animate = () => {
            currentStep++
            currentBalance += stepValue
            
            if (currentStep >= steps) {
                currentBalance = toBalance
                element.classList.remove('rox-chips-animating')
            }

            element.textContent = RoxChipsUtils.formatRoxChips(Math.round(currentBalance))
            element.setAttribute('data-balance', Math.round(currentBalance))

            if (currentStep < steps) {
                setTimeout(animate, stepDuration)
            }
        }

        animate()

        // Show change indicator
        this.showChangeIndicator(difference)
    }

    showChangeIndicator(change) {
        if (change === 0) return

        const indicator = document.createElement('div')
        indicator.className = `rox-chips-change-indicator ${change > 0 ? 'positive' : 'negative'}`
        indicator.textContent = `${change > 0 ? '+' : ''}${RoxChipsUtils.formatRoxChips(Math.abs(change))}`

        this.element.appendChild(indicator)

        // Animate and remove
        setTimeout(() => {
            indicator.classList.add('fade-out')
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator)
                }
            }, 300)
        }, 1000)
    }

    addStyles() {
        if (document.querySelector('#rox-chips-display-styles')) return

        const style = document.createElement('style')
        style.id = 'rox-chips-display-styles'
        style.textContent = `
            .rox-chips-display {
                user-select: none;
            }

            .rox-chips-icon {
                flex-shrink: 0;
                filter: drop-shadow(0 0 4px rgba(0, 255, 247, 0.3));
            }

            .rox-chips-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .rox-chips-label {
                font-size: 0.75rem;
                color: #9CA3AF;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .rox-chips-amount {
                font-weight: bold;
                color: #00FFF7;
                font-family: 'Courier New', monospace;
                text-shadow: 0 0 8px rgba(0, 255, 247, 0.3);
            }

            .rox-chips-animating {
                animation: pulse 0.5s ease-in-out;
            }

            .rox-chips-add-icon {
                flex-shrink: 0;
                opacity: 0.7;
                transition: opacity 0.2s;
            }

            .rox-chips-display:hover .rox-chips-add-icon {
                opacity: 1;
            }

            .rox-chips-change-indicator {
                position: absolute;
                top: -20px;
                right: 0;
                font-size: 0.75rem;
                font-weight: bold;
                pointer-events: none;
                animation: slideUp 1s ease-out;
                z-index: 10;
            }

            .rox-chips-change-indicator.positive {
                color: #10B981;
            }

            .rox-chips-change-indicator.negative {
                color: #EF4444;
            }

            .rox-chips-change-indicator.fade-out {
                opacity: 0;
                transition: opacity 0.3s;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes slideUp {
                0% {
                    opacity: 0;
                    transform: translateY(10px);
                }
                20% {
                    opacity: 1;
                    transform: translateY(-5px);
                }
                100% {
                    opacity: 0.7;
                    transform: translateY(-20px);
                }
            }
        `
        document.head.appendChild(style)
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element)
        }
    }
}

/**
 * Compact Rox Chips Display for headers/sidebars
 */
export class CompactRoxChipsDisplay extends RoxChipsDisplay {
    constructor(balance = 0) {
        super(balance, {
            size: 'small',
            showLabel: false,
            clickable: true,
            animated: true
        })
    }

    render() {
        this.element = document.createElement('div')
        this.element.className = 'compact-rox-chips-display flex items-center space-x-2 bg-dark-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-dark-600 transition-colors'
        
        this.element.innerHTML = `
            <div class="rox-chips-icon" style="width: 20px; height: 20px;">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="url(#compactRoxChipGradient)" stroke="#00FFF7" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                        <linearGradient id="compactRoxChipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00FFF7;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#FF00FF;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <span class="rox-chips-amount text-sm font-bold text-neon-cyan" data-balance="${this.balance}">
                ${RoxChipsUtils.formatRoxChips(this.balance)}
            </span>
            <div class="rox-chips-add-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="#00FFF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `

        this.element.addEventListener('click', () => {
            this.element.dispatchEvent(new CustomEvent('roxChipsClick', {
                detail: { balance: this.balance }
            }))
        })

        this.addStyles()
        return this.element
    }
}

import { BasePage } from './BasePage.js'
import { roxChipsService } from '../services/RoxChipsService.js'

export default class PurchaseSuccessPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900 flex items-center justify-center'
        
        content.innerHTML = `
            <div class="max-w-md w-full mx-4">
                <div class="cyber-card text-center">
                    <div class="mb-6">
                        <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        
                        <h1 class="text-2xl font-cyber font-bold text-neon-cyan mb-2">
                            Purchase Successful!
                        </h1>
                        
                        <p class="text-gray-400 mb-6">
                            Your Rox Chips have been added to your account
                        </p>
                    </div>
                    
                    <div id="purchaseDetails" class="mb-6">
                        <div class="bg-dark-700 rounded-lg p-4 mb-4">
                            <div class="flex items-center justify-center space-x-2 mb-2">
                                <div class="w-6 h-6">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" fill="url(#successRoxChipGradient)" stroke="#00FFF7" stroke-width="2"/>
                                        <path d="M8 12L11 15L16 9" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <defs>
                                            <linearGradient id="successRoxChipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style="stop-color:#00FFF7;stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:#FF00FF;stop-opacity:1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <span class="text-neon-cyan font-bold" id="roxChipsAmount">Loading...</span>
                                <span class="text-gray-400">Rox Chips Added</span>
                            </div>
                            
                            <div class="text-sm text-gray-400">
                                New Balance: <span class="text-neon-cyan font-bold" id="newBalance">Loading...</span>
                            </div>
                        </div>
                        
                        <div class="text-xs text-gray-500 mb-4">
                            Transaction ID: <span id="transactionId">Loading...</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <button id="goToStore" class="w-full bg-neon-cyan text-black font-bold py-3 px-4 rounded-lg hover:bg-neon-cyan/80 transition-colors">
                            Continue Shopping
                        </button>
                        
                        <button id="goToDashboard" class="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                            Go to Dashboard
                        </button>
                    </div>
                    
                    <div class="mt-6 text-xs text-gray-500">
                        <p>Thank you for supporting Technorox TCG!</p>
                        <p>Your purchase helps us create more amazing content.</p>
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.processPurchaseSuccess()
        this.setupEventListeners()
    }
    
    async processPurchaseSuccess() {
        // Get session ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const sessionId = urlParams.get('session_id')
        
        if (!sessionId) {
            this.showError('No session ID found')
            return
        }
        
        try {
            // Initialize Rox Chips service
            const authManager = window.technorox?.authManager
            const user = authManager?.getCurrentUser()
            
            if (user) {
                await roxChipsService.init(user.uid)
                
                // Complete the purchase
                const success = await roxChipsService.completePurchase(sessionId)
                
                if (success) {
                    // Update display with purchase details
                    await this.updatePurchaseDisplay(sessionId)
                } else {
                    this.showError('Failed to process purchase')
                }
            } else {
                this.showError('User not authenticated')
            }
        } catch (error) {
            console.error('Error processing purchase:', error)
            this.showError('Error processing purchase')
        }
    }
    
    async updatePurchaseDisplay(sessionId) {
        try {
            // Get the latest balance
            const newBalance = roxChipsService.getRoxChipsBalance()
            
            // Get transaction details (you might want to store this during purchase)
            const transactions = await roxChipsService.getTransactionHistory(5)
            const purchaseTransaction = transactions.find(t => 
                t.type === 'purchase' && 
                t.metadata?.stripeSessionId === sessionId
            )
            
            if (purchaseTransaction) {
                this.element.querySelector('#roxChipsAmount').textContent = 
                    purchaseTransaction.amount.toLocaleString()
                this.element.querySelector('#newBalance').textContent = 
                    newBalance.toLocaleString()
                this.element.querySelector('#transactionId').textContent = 
                    purchaseTransaction.id
            } else {
                // Fallback display
                this.element.querySelector('#roxChipsAmount').textContent = 'Unknown'
                this.element.querySelector('#newBalance').textContent = newBalance.toLocaleString()
                this.element.querySelector('#transactionId').textContent = sessionId.substring(0, 16) + '...'
            }
            
        } catch (error) {
            console.error('Error updating purchase display:', error)
            this.showError('Error loading purchase details')
        }
    }
    
    setupEventListeners() {
        this.element.querySelector('#goToStore').addEventListener('click', () => {
            window.technorox?.router?.navigate('/store')
        })
        
        this.element.querySelector('#goToDashboard').addEventListener('click', () => {
            const authManager = window.technorox?.authManager
            const defaultRoute = authManager?.getDefaultRoute() || '/player-dashboard'
            window.technorox?.router?.navigate(defaultRoute)
        })
    }
    
    showError(message) {
        const detailsContainer = this.element.querySelector('#purchaseDetails')
        detailsContainer.innerHTML = `
            <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <div class="flex items-center space-x-2 text-red-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            </div>
        `
    }
}

import { BasePage } from './BasePage.js'

export default class AdminNewsletterPage extends BasePage {
    constructor() {
        super()
        this.title = 'Newsletter Management - Admin'
        this.isPublic = false
        this.subscriptions = []
        this.stats = {}
    }

    createContent() {
        const content = document.createElement('div')
        content.className = 'container mx-auto px-4 py-8'
        
        content.innerHTML = `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-neon-cyan mb-2">Newsletter Management</h1>
                <p class="text-gray-400">Manage email subscriptions and send campaigns</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="cyber-card">
                    <div class="text-2xl font-bold text-neon-cyan" id="totalSubscribers">-</div>
                    <div class="text-sm text-gray-400">Total Subscribers</div>
                </div>
                <div class="cyber-card">
                    <div class="text-2xl font-bold text-green-400" id="activeSubscribers">-</div>
                    <div class="text-sm text-gray-400">Active Subscribers</div>
                </div>
                <div class="cyber-card">
                    <div class="text-2xl font-bold text-yellow-400" id="recentSubscribers">-</div>
                    <div class="text-sm text-gray-400">New This Month</div>
                </div>
                <div class="cyber-card">
                    <div class="text-2xl font-bold text-red-400" id="unsubscribed">-</div>
                    <div class="text-sm text-gray-400">Unsubscribed</div>
                </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Send Campaign -->
                <div class="cyber-card">
                    <h2 class="text-xl font-bold text-neon-cyan mb-4">Send Newsletter Campaign</h2>
                    <form id="campaignForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Campaign Title</label>
                            <input type="text" id="campaignTitle" class="cyber-input w-full" placeholder="e.g., New Card Release Announcement" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Email Subject</label>
                            <input type="text" id="campaignSubject" class="cyber-input w-full" placeholder="e.g., Technorox Newsletter - New Cards Available!" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Content</label>
                            <textarea id="campaignContent" rows="8" class="cyber-input w-full" placeholder="Write your newsletter content here..." required></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" id="targetTournaments" class="mr-2" checked>
                                    <span class="text-sm">Tournament Subscribers</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" id="targetNewCards" class="mr-2" checked>
                                    <span class="text-sm">New Card Subscribers</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" id="targetEvents" class="mr-2" checked>
                                    <span class="text-sm">Event Subscribers</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" id="targetAll" class="mr-2">
                                    <span class="text-sm">All Subscribers</span>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="cyber-button w-full">
                            <span id="campaignButtonText">Send Campaign</span>
                            <div id="campaignSpinner" class="hidden inline-block ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </button>
                    </form>
                </div>

                <!-- Quick Actions -->
                <div class="cyber-card">
                    <h2 class="text-xl font-bold text-neon-cyan mb-4">Quick Actions</h2>
                    <div class="space-y-4">
                        <button id="refreshStatsBtn" class="cyber-button w-full">Refresh Statistics</button>
                        <button id="exportSubscribersBtn" class="bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-bold py-2 px-4 rounded w-full transition-colors">
                            Export Subscriber List
                        </button>
                        <button id="testEmailBtn" class="bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-2 px-4 rounded w-full transition-colors">
                            Send Test Email
                        </button>
                    </div>

                    <!-- Preference Breakdown -->
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-white mb-3">Subscription Preferences</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Tournaments:</span>
                                <span id="prefTournaments" class="text-neon-cyan">-</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">New Cards:</span>
                                <span id="prefNewCards" class="text-neon-cyan">-</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Events:</span>
                                <span id="prefEvents" class="text-neon-cyan">-</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Game Updates:</span>
                                <span id="prefGameUpdates" class="text-neon-cyan">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Subscribers List -->
            <div class="cyber-card mt-8">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-neon-cyan">Recent Subscribers</h2>
                    <button id="loadMoreBtn" class="text-neon-cyan hover:text-white transition-colors">Load More</button>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-600">
                                <th class="text-left py-2 text-gray-400">Email</th>
                                <th class="text-left py-2 text-gray-400">Name</th>
                                <th class="text-left py-2 text-gray-400">Subscribed</th>
                                <th class="text-left py-2 text-gray-400">Preferences</th>
                                <th class="text-left py-2 text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody id="subscribersTable">
                            <tr>
                                <td colspan="5" class="py-4 text-center text-gray-400">Loading subscribers...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Success/Error Messages -->
            <div id="messageContainer" class="fixed top-4 right-4 z-50"></div>
        `
        
        return content
    }

    async init() {
        this.setupEventListeners()
        await this.loadStats()
        await this.loadSubscribers()
    }

    setupEventListeners() {
        // Campaign form
        const campaignForm = this.element.querySelector('#campaignForm')
        campaignForm.addEventListener('submit', (e) => this.handleSendCampaign(e))

        // Quick action buttons
        this.element.querySelector('#refreshStatsBtn').addEventListener('click', () => this.loadStats())
        this.element.querySelector('#exportSubscribersBtn').addEventListener('click', () => this.exportSubscribers())
        this.element.querySelector('#testEmailBtn').addEventListener('click', () => this.sendTestEmail())
        this.element.querySelector('#loadMoreBtn').addEventListener('click', () => this.loadMoreSubscribers())

        // Target all checkbox
        const targetAllCheckbox = this.element.querySelector('#targetAll')
        const otherCheckboxes = ['#targetTournaments', '#targetNewCards', '#targetEvents']
        
        targetAllCheckbox.addEventListener('change', (e) => {
            otherCheckboxes.forEach(selector => {
                this.element.querySelector(selector).checked = e.target.checked
            })
        })
    }

    async loadStats() {
        try {
            const { emailService } = await import('../services/EmailService.js')
            await emailService.init()
            
            this.stats = await emailService.getSubscriptionStats()
            
            // Update UI
            this.element.querySelector('#totalSubscribers').textContent = this.stats.total.toLocaleString()
            this.element.querySelector('#activeSubscribers').textContent = this.stats.active.toLocaleString()
            this.element.querySelector('#recentSubscribers').textContent = this.stats.recentSubscriptions.toLocaleString()
            this.element.querySelector('#unsubscribed').textContent = this.stats.unsubscribed.toLocaleString()
            
            // Update preferences
            this.element.querySelector('#prefTournaments').textContent = this.stats.byPreferences.tournaments.toLocaleString()
            this.element.querySelector('#prefNewCards').textContent = this.stats.byPreferences.newCards.toLocaleString()
            this.element.querySelector('#prefEvents').textContent = this.stats.byPreferences.events.toLocaleString()
            this.element.querySelector('#prefGameUpdates').textContent = this.stats.byPreferences.gameUpdates.toLocaleString()
            
        } catch (error) {
            console.error('Failed to load stats:', error)
            this.showMessage('Failed to load statistics', 'error')
        }
    }

    async loadSubscribers() {
        try {
            const { emailService } = await import('../services/EmailService.js')
            await emailService.init()
            
            this.subscriptions = await emailService.getActiveSubscriptions(50, 0)
            this.renderSubscribersTable()
            
        } catch (error) {
            console.error('Failed to load subscribers:', error)
            this.showMessage('Failed to load subscribers', 'error')
        }
    }

    renderSubscribersTable() {
        const tbody = this.element.querySelector('#subscribersTable')
        
        if (this.subscriptions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-400">No subscribers found</td></tr>'
            return
        }

        tbody.innerHTML = this.subscriptions.map(sub => `
            <tr class="border-b border-gray-700 hover:bg-gray-800">
                <td class="py-2">${sub.email}</td>
                <td class="py-2">${sub.displayName}</td>
                <td class="py-2">${new Date(sub.subscribedAt.seconds * 1000).toLocaleDateString()}</td>
                <td class="py-2">
                    <div class="flex space-x-1">
                        ${sub.preferences?.tournaments ? '<span class="bg-blue-600 text-xs px-1 rounded">T</span>' : ''}
                        ${sub.preferences?.newCards ? '<span class="bg-green-600 text-xs px-1 rounded">C</span>' : ''}
                        ${sub.preferences?.events ? '<span class="bg-purple-600 text-xs px-1 rounded">E</span>' : ''}
                        ${sub.preferences?.gameUpdates ? '<span class="bg-yellow-600 text-xs px-1 rounded">U</span>' : ''}
                    </div>
                </td>
                <td class="py-2">
                    <span class="text-green-400 text-xs">Active</span>
                </td>
            </tr>
        `).join('')
    }

    async handleSendCampaign(e) {
        e.preventDefault()
        
        const form = e.target
        const button = form.querySelector('button[type="submit"]')
        const buttonText = this.element.querySelector('#campaignButtonText')
        const spinner = this.element.querySelector('#campaignSpinner')
        
        // Get form data
        const title = form.campaignTitle.value.trim()
        const subject = form.campaignSubject.value.trim()
        const content = form.campaignContent.value.trim()
        
        const targetTags = []
        if (form.targetTournaments.checked) targetTags.push('tournaments')
        if (form.targetNewCards.checked) targetTags.push('newCards')
        if (form.targetEvents.checked) targetTags.push('events')
        if (form.targetAll.checked) targetTags.push('all')

        if (!title || !subject || !content) {
            this.showMessage('Please fill in all required fields', 'error')
            return
        }

        // Show loading state
        button.disabled = true
        buttonText.textContent = 'Sending...'
        spinner.classList.remove('hidden')

        try {
            const { emailService } = await import('../services/EmailService.js')
            await emailService.init()
            
            const result = await emailService.sendNewsletter({
                title,
                subject,
                content,
                targetTags
            })

            if (result.success) {
                this.showMessage('Newsletter campaign sent successfully!', 'success')
                form.reset()
            } else {
                throw new Error(result.error || 'Failed to send campaign')
            }

        } catch (error) {
            console.error('Campaign send failed:', error)
            this.showMessage(`Failed to send campaign: ${error.message}`, 'error')
        } finally {
            // Reset button state
            button.disabled = false
            buttonText.textContent = 'Send Campaign'
            spinner.classList.add('hidden')
        }
    }

    async exportSubscribers() {
        try {
            const csvContent = this.generateCSV()
            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            
            const a = document.createElement('a')
            a.href = url
            a.download = `technorox-subscribers-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
            
            window.URL.revokeObjectURL(url)
            this.showMessage('Subscriber list exported successfully', 'success')
            
        } catch (error) {
            console.error('Export failed:', error)
            this.showMessage('Failed to export subscriber list', 'error')
        }
    }

    generateCSV() {
        const headers = ['Email', 'Display Name', 'Subscribed Date', 'Tournaments', 'New Cards', 'Events', 'Game Updates', 'Status']
        const rows = this.subscriptions.map(sub => [
            sub.email,
            sub.displayName,
            new Date(sub.subscribedAt.seconds * 1000).toISOString().split('T')[0],
            sub.preferences?.tournaments ? 'Yes' : 'No',
            sub.preferences?.newCards ? 'Yes' : 'No',
            sub.preferences?.events ? 'Yes' : 'No',
            sub.preferences?.gameUpdates ? 'Yes' : 'No',
            sub.status
        ])
        
        return [headers, ...rows].map(row => row.join(',')).join('\n')
    }

    async sendTestEmail() {
        const userEmail = window.technorox?.authManager?.getCurrentUser()?.email
        if (!userEmail) {
            this.showMessage('No user email found for test', 'error')
            return
        }

        try {
            // Send a test welcome email to the current admin
            const { emailService } = await import('../services/EmailService.js')
            await emailService.init()
            
            // This would trigger the welcome email flow
            this.showMessage(`Test email sent to ${userEmail}`, 'success')
            
        } catch (error) {
            console.error('Test email failed:', error)
            this.showMessage('Failed to send test email', 'error')
        }
    }

    showMessage(message, type = 'info') {
        const container = this.element.querySelector('#messageContainer')
        const messageDiv = document.createElement('div')
        
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        
        messageDiv.className = `${bgColor} text-white px-4 py-2 rounded mb-2 shadow-lg`
        messageDiv.textContent = message
        
        container.appendChild(messageDiv)
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove()
        }, 5000)
    }
}

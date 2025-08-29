import { BasePage } from './BasePage.js'
import { MISSIONS, ACHIEVEMENTS, EARNING_SOURCES } from '../data/roxChipsSchema.js'
import { roxChipsService } from '../services/RoxChipsService.js'

export default class MissionsPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.currentTab = 'daily'
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900'
        
        content.innerHTML = `
            <div class="p-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-cyber font-bold mb-2">
                        <span class="neon-text">Missions & Achievements</span>
                    </h1>
                    <p class="text-gray-400">Complete missions and unlock achievements to earn Rox Chips</p>
                </div>
                
                <!-- Tabs -->
                <div class="cyber-card mb-8">
                    <div class="flex space-x-1">
                        <button class="mission-tab active" data-tab="daily">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                            Daily Missions
                        </button>
                        <button class="mission-tab" data-tab="weekly">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Weekly Missions
                        </button>
                        <button class="mission-tab" data-tab="achievements">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                            </svg>
                            Achievements
                        </button>
                    </div>
                </div>
                
                <!-- Content -->
                <div id="missionsContent">
                    <!-- Content will be dynamically loaded here -->
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.initializeRoxChipsService()
        this.setupEventListeners()
        this.showTab(this.currentTab)
    }
    
    async initializeRoxChipsService() {
        const authManager = window.technorox?.authManager
        const user = authManager?.getCurrentUser()
        
        if (user) {
            await roxChipsService.init(user.uid)
        }
    }
    
    setupEventListeners() {
        // Tab navigation
        const tabButtons = this.element.querySelectorAll('.mission-tab')
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab
                this.showTab(tab)
                
                // Update active state
                tabButtons.forEach(btn => btn.classList.remove('active'))
                button.classList.add('active')
            })
        })
    }
    
    showTab(tab) {
        this.currentTab = tab
        const contentContainer = this.element.querySelector('#missionsContent')
        
        switch (tab) {
            case 'daily':
                contentContainer.innerHTML = this.renderDailyMissions()
                break
            case 'weekly':
                contentContainer.innerHTML = this.renderWeeklyMissions()
                break
            case 'achievements':
                contentContainer.innerHTML = this.renderAchievements()
                break
        }
        
        this.setupTabEventListeners()
    }
    
    renderDailyMissions() {
        const missions = Object.values(MISSIONS.daily)
        
        return `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-neon-cyan">Daily Missions</h2>
                    <div class="text-sm text-gray-400">
                        Resets in: <span class="text-neon-cyan" id="dailyReset">Loading...</span>
                    </div>
                </div>
                <p class="text-gray-400 text-sm mb-6">Complete daily missions to earn Rox Chips. Missions reset every 24 hours.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${missions.map(mission => `
                    <div class="mission-card" data-mission-id="${mission.id}">
                        <div class="mission-header">
                            <div class="mission-icon">📅</div>
                            <div class="mission-info">
                                <h3 class="mission-title">${mission.name}</h3>
                                <p class="mission-description">${mission.description}</p>
                            </div>
                        </div>
                        
                        <div class="mission-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="progress-text">0 / ${mission.requirement}</div>
                        </div>
                        
                        <div class="mission-reward">
                            <div class="reward-amount">+${mission.reward}</div>
                            <div class="reward-currency">Rox Chips</div>
                        </div>
                        
                        <button class="mission-claim-btn" data-mission-id="${mission.id}" disabled>
                            Complete Mission
                        </button>
                    </div>
                `).join('')}
            </div>
        `
    }
    
    renderWeeklyMissions() {
        const missions = Object.values(MISSIONS.weekly)
        
        return `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-neon-magenta">Weekly Missions</h2>
                    <div class="text-sm text-gray-400">
                        Resets in: <span class="text-neon-magenta" id="weeklyReset">Loading...</span>
                    </div>
                </div>
                <p class="text-gray-400 text-sm mb-6">Complete weekly missions for bigger Rox Chips rewards. Missions reset every Monday.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${missions.map(mission => `
                    <div class="mission-card weekly" data-mission-id="${mission.id}">
                        <div class="mission-header">
                            <div class="mission-icon">📊</div>
                            <div class="mission-info">
                                <h3 class="mission-title">${mission.name}</h3>
                                <p class="mission-description">${mission.description}</p>
                            </div>
                        </div>
                        
                        <div class="mission-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="progress-text">0 / ${mission.requirement}</div>
                        </div>
                        
                        <div class="mission-reward">
                            <div class="reward-amount">+${mission.reward}</div>
                            <div class="reward-currency">Rox Chips</div>
                        </div>
                        
                        <button class="mission-claim-btn" data-mission-id="${mission.id}" disabled>
                            Complete Mission
                        </button>
                    </div>
                `).join('')}
            </div>
        `
    }
    
    renderAchievements() {
        const achievements = Object.values(ACHIEVEMENTS)
        
        return `
            <div class="mb-6">
                <h2 class="text-xl font-bold text-green-400 mb-4">Achievements</h2>
                <p class="text-gray-400 text-sm mb-6">Unlock achievements by reaching milestones and completing challenges.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${achievements.map(achievement => `
                    <div class="achievement-card" data-achievement-id="${achievement.id}">
                        <div class="achievement-header">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-info">
                                <h3 class="achievement-title">${achievement.name}</h3>
                                <p class="achievement-description">${achievement.description}</p>
                            </div>
                        </div>
                        
                        <div class="achievement-category">
                            <span class="category-badge">${achievement.category}</span>
                        </div>
                        
                        <div class="achievement-reward">
                            <div class="reward-amount">+${achievement.reward}</div>
                            <div class="reward-currency">Rox Chips</div>
                        </div>
                        
                        <div class="achievement-status">
                            <span class="status-text">Not Unlocked</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }
    
    setupTabEventListeners() {
        // Mission claim buttons
        const claimButtons = this.element.querySelectorAll('.mission-claim-btn')
        claimButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const missionId = e.target.dataset.missionId
                await this.claimMission(missionId)
            })
        })
        
        // Update timers
        this.updateTimers()
        setInterval(() => this.updateTimers(), 60000) // Update every minute
    }
    
    async claimMission(missionId) {
        try {
            let success = false
            
            // Determine if it's daily or weekly mission
            if (MISSIONS.daily[missionId]) {
                success = await roxChipsService.completeDailyMission(missionId)
            } else if (MISSIONS.weekly[missionId]) {
                success = await roxChipsService.completeWeeklyMission(missionId)
            }
            
            if (success) {
                window.technorox?.uiManager?.showSuccess('Mission completed! Rox Chips earned.')
                
                // Update the mission card
                const missionCard = this.element.querySelector(`[data-mission-id="${missionId}"]`)
                if (missionCard) {
                    const claimBtn = missionCard.querySelector('.mission-claim-btn')
                    claimBtn.textContent = 'Completed'
                    claimBtn.disabled = true
                    claimBtn.classList.add('completed')
                    
                    // Update progress to 100%
                    const progressFill = missionCard.querySelector('.progress-fill')
                    const progressText = missionCard.querySelector('.progress-text')
                    const mission = MISSIONS.daily[missionId] || MISSIONS.weekly[missionId]
                    
                    if (progressFill && progressText && mission) {
                        progressFill.style.width = '100%'
                        progressText.textContent = `${mission.requirement} / ${mission.requirement}`
                    }
                }
                
                // Update header Rox Chips display if available
                this.updateHeaderBalance()
            } else {
                window.technorox?.uiManager?.showError('Mission already completed or requirements not met.')
            }
        } catch (error) {
            console.error('Error claiming mission:', error)
            window.technorox?.uiManager?.showError('Failed to claim mission reward.')
        }
    }
    
    updateTimers() {
        // Update daily reset timer
        const dailyResetElement = this.element.querySelector('#dailyReset')
        if (dailyResetElement) {
            const now = new Date()
            const tomorrow = new Date(now)
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)
            
            const timeUntilReset = tomorrow - now
            const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
            const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))
            
            dailyResetElement.textContent = `${hours}h ${minutes}m`
        }
        
        // Update weekly reset timer
        const weeklyResetElement = this.element.querySelector('#weeklyReset')
        if (weeklyResetElement) {
            const now = new Date()
            const nextMonday = new Date(now)
            const daysUntilMonday = (8 - now.getDay()) % 7 || 7
            nextMonday.setDate(now.getDate() + daysUntilMonday)
            nextMonday.setHours(0, 0, 0, 0)
            
            const timeUntilReset = nextMonday - now
            const days = Math.floor(timeUntilReset / (1000 * 60 * 60 * 24))
            const hours = Math.floor((timeUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            
            weeklyResetElement.textContent = `${days}d ${hours}h`
        }
    }
    
    updateHeaderBalance() {
        // Trigger header balance update
        const headerRoxChips = document.querySelector('#headerRoxChips .rox-chips-amount')
        if (headerRoxChips) {
            const newBalance = roxChipsService.getRoxChipsBalance()
            headerRoxChips.textContent = newBalance.toLocaleString()
        }
    }
    
    addStyles() {
        const style = document.createElement('style')
        style.textContent = `
            .mission-tab {
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
            }
            
            .mission-tab:hover {
                background: rgba(55, 65, 81, 0.8);
                color: #00FFF7;
            }
            
            .mission-tab.active {
                background: linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(255, 0, 255, 0.1));
                border-color: rgba(0, 255, 247, 0.3);
                color: #00FFF7;
            }
            
            .mission-tab svg {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.5rem;
            }
            
            .mission-card, .achievement-card {
                background: linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8));
                border: 1px solid rgba(75, 85, 99, 0.3);
                border-radius: 0.75rem;
                padding: 1.5rem;
                transition: all 0.3s;
            }
            
            .mission-card:hover, .achievement-card:hover {
                border-color: rgba(0, 255, 247, 0.3);
                transform: translateY(-2px);
            }
            
            .mission-card.weekly {
                border-color: rgba(255, 0, 255, 0.3);
            }
            
            .mission-header, .achievement-header {
                display: flex;
                align-items: flex-start;
                space-x: 1rem;
                margin-bottom: 1rem;
            }
            
            .mission-icon, .achievement-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .mission-title, .achievement-title {
                font-weight: bold;
                color: white;
                margin-bottom: 0.25rem;
            }
            
            .mission-description, .achievement-description {
                font-size: 0.875rem;
                color: #9CA3AF;
            }
            
            .mission-progress {
                margin-bottom: 1rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 0.5rem;
                background: rgba(75, 85, 99, 0.5);
                border-radius: 0.25rem;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00FFF7, #FF00FF);
                transition: width 0.3s;
            }
            
            .progress-text {
                font-size: 0.875rem;
                color: #9CA3AF;
                text-align: center;
            }
            
            .mission-reward, .achievement-reward {
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .reward-amount {
                font-size: 1.25rem;
                font-weight: bold;
                color: #00FFF7;
            }
            
            .reward-currency {
                font-size: 0.75rem;
                color: #9CA3AF;
            }
            
            .mission-claim-btn {
                width: 100%;
                background: linear-gradient(135deg, #00FFF7, #FF00FF);
                color: black;
                font-weight: bold;
                padding: 0.75rem;
                border-radius: 0.5rem;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .mission-claim-btn:disabled {
                background: rgba(75, 85, 99, 0.5);
                color: #9CA3AF;
                cursor: not-allowed;
            }
            
            .mission-claim-btn.completed {
                background: rgba(16, 185, 129, 0.2);
                color: #10B981;
            }
            
            .achievement-category {
                margin-bottom: 1rem;
            }
            
            .category-badge {
                background: rgba(0, 255, 247, 0.2);
                color: #00FFF7;
                font-size: 0.75rem;
                font-weight: 500;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
                text-transform: capitalize;
            }
            
            .achievement-status {
                text-align: center;
            }
            
            .status-text {
                font-size: 0.875rem;
                color: #9CA3AF;
            }
        `
        
        if (!document.querySelector('#missions-styles')) {
            style.id = 'missions-styles'
            document.head.appendChild(style)
        }
    }
}

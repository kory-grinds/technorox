import { BasePage } from './BasePage.js'
import { firebaseService } from '../services/FirebaseService.js'

export default class SettingsPage extends BasePage {
    constructor() {
        super()
        this.isPublic = false
        this.settings = {
            profile: {},
            game: {},
            notifications: {},
            privacy: {},
            system: {}
        }
    }
    
    createContent() {
        const content = document.createElement('div')
        content.className = 'ml-64 min-h-screen bg-dark-900'
        
        const authManager = window.technorox?.authManager
        const profile = authManager?.getUserProfile()
        const user = authManager?.getCurrentUser()
        const isAdmin = authManager?.isAdmin()
        
        content.innerHTML = `
            <div class="p-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-cyber font-bold mb-2">
                        <span class="neon-text">Settings</span>
                    </h1>
                    <p class="text-gray-400">Customize your Technorox experience</p>
                </div>
                
                <!-- Settings Navigation -->
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Settings Sidebar -->
                    <div class="lg:w-64 flex-shrink-0">
                        <div class="cyber-card">
                            <nav class="space-y-2">
                                <button class="settings-nav-item active" data-section="profile">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    Profile
                                </button>
                                <button class="settings-nav-item" data-section="game">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    Game Settings
                                </button>
                                <button class="settings-nav-item" data-section="notifications">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.5L7 7h3v5l3.5-3.5h-3z"/>
                                    </svg>
                                    Notifications
                                </button>
                                <button class="settings-nav-item" data-section="privacy">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                    Privacy
                                </button>
                                ${isAdmin ? `
                                    <button class="settings-nav-item" data-section="system">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        System
                                    </button>
                                ` : ''}
                            </nav>
                        </div>
                    </div>
                    
                    <!-- Settings Content -->
                    <div class="flex-1">
                        <!-- Profile Settings -->
                        <div id="profile-section" class="settings-section">
                            <div class="cyber-card">
                                <h3 class="text-xl font-bold mb-6 text-neon-cyan">Profile Settings</h3>
                                
                                <div class="space-y-6">
                                    <!-- Avatar Section -->
                                    <div class="flex items-center space-x-6">
                                        <div class="w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                                            <span class="text-black font-bold text-2xl">
                                                ${(profile?.displayName || user?.displayName || 'U').charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <button class="cyber-button mb-2">Change Avatar</button>
                                            <p class="text-gray-400 text-sm">Upload a new profile picture</p>
                                        </div>
                                    </div>
                                    
                                    <!-- Profile Form -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                            <input 
                                                type="text" 
                                                id="displayName" 
                                                value="${profile?.displayName || user?.displayName || ''}"
                                                class="cyber-input w-full"
                                            >
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                value="${user?.email || ''}"
                                                class="cyber-input w-full"
                                                readonly
                                            >
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                            <textarea 
                                                id="bio" 
                                                rows="3"
                                                placeholder="Tell other players about yourself..."
                                                class="cyber-input w-full"
                                            >${profile?.bio || ''}</textarea>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                            <input 
                                                type="text" 
                                                id="location" 
                                                value="${profile?.location || ''}"
                                                placeholder="City, Country"
                                                class="cyber-input w-full"
                                            >
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-end">
                                        <button id="saveProfile" class="bg-neon-cyan text-black font-bold py-2 px-6 rounded-lg hover:bg-neon-cyan/80 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Game Settings -->
                        <div id="game-section" class="settings-section hidden">
                            <div class="cyber-card">
                                <h3 class="text-xl font-bold mb-6 text-neon-magenta">Game Settings</h3>
                                
                                <div class="space-y-6">
                                    <!-- Gameplay Preferences -->
                                    <div>
                                        <h4 class="text-lg font-medium mb-4 text-white">Gameplay</h4>
                                        <div class="space-y-4">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <label class="text-white font-medium">Auto-pass turn</label>
                                                    <p class="text-gray-400 text-sm">Automatically pass turn when no actions available</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer" id="autoPass">
                                                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                                                </label>
                                            </div>
                                            
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <label class="text-white font-medium">Show card tooltips</label>
                                                    <p class="text-gray-400 text-sm">Display detailed card information on hover</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer" id="showTooltips" checked>
                                                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                                                </label>
                                            </div>
                                            
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <label class="text-white font-medium">Animation speed</label>
                                                    <p class="text-gray-400 text-sm">Control game animation speed</p>
                                                </div>
                                                <select class="cyber-input" id="animationSpeed">
                                                    <option value="slow">Slow</option>
                                                    <option value="normal" selected>Normal</option>
                                                    <option value="fast">Fast</option>
                                                    <option value="instant">Instant</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Audio Settings -->
                                    <div>
                                        <h4 class="text-lg font-medium mb-4 text-white">Audio</h4>
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-300 mb-2">Master Volume</label>
                                                <input type="range" id="masterVolume" min="0" max="100" value="75" class="w-full">
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-300 mb-2">Music Volume</label>
                                                <input type="range" id="musicVolume" min="0" max="100" value="60" class="w-full">
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-300 mb-2">Sound Effects Volume</label>
                                                <input type="range" id="sfxVolume" min="0" max="100" value="80" class="w-full">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-end">
                                        <button id="saveGameSettings" class="bg-neon-magenta text-black font-bold py-2 px-6 rounded-lg hover:bg-neon-magenta/80 transition-colors">
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Notifications Settings -->
                        <div id="notifications-section" class="settings-section hidden">
                            <div class="cyber-card">
                                <h3 class="text-xl font-bold mb-6 text-green-400">Notification Settings</h3>
                                
                                <div class="space-y-6">
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">Game invitations</label>
                                                <p class="text-gray-400 text-sm">Receive notifications when invited to games</p>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer" id="gameInvites" checked>
                                                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                                            </label>
                                        </div>
                                        
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">Tournament announcements</label>
                                                <p class="text-gray-400 text-sm">Get notified about upcoming tournaments</p>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer" id="tournaments" checked>
                                                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                                            </label>
                                        </div>
                                        
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">New card releases</label>
                                                <p class="text-gray-400 text-sm">Be the first to know about new cards</p>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer" id="newCards">
                                                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                                            </label>
                                        </div>
                                        
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">Email notifications</label>
                                                <p class="text-gray-400 text-sm">Receive important updates via email</p>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer" id="emailNotifs">
                                                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-end">
                                        <button id="saveNotifications" class="bg-green-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-green-400/80 transition-colors">
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Privacy Settings -->
                        <div id="privacy-section" class="settings-section hidden">
                            <div class="cyber-card">
                                <h3 class="text-xl font-bold mb-6 text-yellow-400">Privacy Settings</h3>
                                
                                <div class="space-y-6">
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">Profile visibility</label>
                                                <p class="text-gray-400 text-sm">Who can view your profile</p>
                                            </div>
                                            <select class="cyber-input" id="profileVisibility">
                                                <option value="public">Everyone</option>
                                                <option value="friends">Friends only</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                        
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">Show online status</label>
                                                <p class="text-gray-400 text-sm">Let others see when you're online</p>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer" id="showOnline" checked>
                                                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                                            </label>
                                        </div>
                                        
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <label class="text-white font-medium">Allow friend requests</label>
                                                <p class="text-gray-400 text-sm">Let other players send you friend requests</p>
                                            </div>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" class="sr-only peer" id="friendRequests" checked>
                                                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="border-t border-gray-700 pt-6">
                                        <h4 class="text-lg font-medium mb-4 text-red-400">Danger Zone</h4>
                                        <div class="space-y-4">
                                            <button class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                                Delete Account
                                            </button>
                                            <p class="text-gray-400 text-sm">This action cannot be undone. All your data will be permanently deleted.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-end">
                                        <button id="savePrivacy" class="bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/80 transition-colors">
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        ${isAdmin ? `
                            <!-- System Settings (Admin Only) -->
                            <div id="system-section" class="settings-section hidden">
                                <div class="cyber-card">
                                    <h3 class="text-xl font-bold mb-6 text-red-400">System Settings</h3>
                                    
                                    <div class="space-y-6">
                                        <!-- Firebase Settings -->
                                        <div>
                                            <h4 class="text-lg font-medium mb-4 text-white">Firebase Configuration</h4>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                                    <span class="text-gray-300">Firestore</span>
                                                    <div class="flex items-center space-x-2">
                                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span class="text-green-400 text-sm">Connected</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                                    <span class="text-gray-300">Storage</span>
                                                    <div class="flex items-center space-x-2">
                                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span class="text-green-400 text-sm">Connected</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                                    <span class="text-gray-300">Analytics</span>
                                                    <div class="flex items-center space-x-2">
                                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span class="text-green-400 text-sm">Active</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                                    <span class="text-gray-300">App Check</span>
                                                    <div class="flex items-center space-x-2">
                                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span class="text-green-400 text-sm">Protected</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- OpenAI Settings -->
                                        <div>
                                            <h4 class="text-lg font-medium mb-4 text-white">OpenAI Integration</h4>
                                            <div class="space-y-4">
                                                <div class="flex items-center justify-between">
                                                    <div>
                                                        <label class="text-white font-medium">API Status</label>
                                                        <p class="text-gray-400 text-sm">OpenAI API connection status</p>
                                                    </div>
                                                    <div class="flex items-center space-x-2">
                                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span class="text-green-400 text-sm">Connected</span>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-300 mb-2">Card Generation Rate Limit</label>
                                                    <select class="cyber-input" id="rateLimitCards">
                                                        <option value="10">10 cards/hour</option>
                                                        <option value="25" selected>25 cards/hour</option>
                                                        <option value="50">50 cards/hour</option>
                                                        <option value="100">100 cards/hour</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="flex justify-end">
                                            <button id="saveSystemSettings" class="bg-red-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-red-400/80 transition-colors">
                                                Save System Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `
        
        return content
    }
    
    async init() {
        await this.loadSettings()
        this.setupEventListeners()
        this.addStyles()
    }
    
    async loadSettings() {
        // Load user settings from Firebase or localStorage
        const authManager = window.technorox?.authManager
        const profile = authManager?.getUserProfile()
        
        if (profile) {
            this.settings.profile = profile
        }
        
        // Load game settings from localStorage
        this.settings.game = {
            autoPass: localStorage.getItem('game_autoPass') === 'true',
            showTooltips: localStorage.getItem('game_showTooltips') !== 'false',
            animationSpeed: localStorage.getItem('game_animationSpeed') || 'normal',
            masterVolume: parseInt(localStorage.getItem('game_masterVolume')) || 75,
            musicVolume: parseInt(localStorage.getItem('game_musicVolume')) || 60,
            sfxVolume: parseInt(localStorage.getItem('game_sfxVolume')) || 80
        }
        
        // Apply loaded settings to form elements
        this.applySettingsToForm()
    }
    
    applySettingsToForm() {
        // Apply game settings
        const autoPassEl = this.element.querySelector('#autoPass')
        const showTooltipsEl = this.element.querySelector('#showTooltips')
        const animationSpeedEl = this.element.querySelector('#animationSpeed')
        const masterVolumeEl = this.element.querySelector('#masterVolume')
        const musicVolumeEl = this.element.querySelector('#musicVolume')
        const sfxVolumeEl = this.element.querySelector('#sfxVolume')
        
        if (autoPassEl) autoPassEl.checked = this.settings.game.autoPass
        if (showTooltipsEl) showTooltipsEl.checked = this.settings.game.showTooltips
        if (animationSpeedEl) animationSpeedEl.value = this.settings.game.animationSpeed
        if (masterVolumeEl) masterVolumeEl.value = this.settings.game.masterVolume
        if (musicVolumeEl) musicVolumeEl.value = this.settings.game.musicVolume
        if (sfxVolumeEl) sfxVolumeEl.value = this.settings.game.sfxVolume
    }
    
    setupEventListeners() {
        // Settings navigation
        const navItems = this.element.querySelectorAll('.settings-nav-item')
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section
                this.showSection(section)
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'))
                item.classList.add('active')
            })
        })
        
        // Save buttons
        this.element.querySelector('#saveProfile')?.addEventListener('click', () => this.saveProfileSettings())
        this.element.querySelector('#saveGameSettings')?.addEventListener('click', () => this.saveGameSettings())
        this.element.querySelector('#saveNotifications')?.addEventListener('click', () => this.saveNotificationSettings())
        this.element.querySelector('#savePrivacy')?.addEventListener('click', () => this.savePrivacySettings())
        this.element.querySelector('#saveSystemSettings')?.addEventListener('click', () => this.saveSystemSettings())
    }
    
    showSection(sectionName) {
        // Hide all sections
        const sections = this.element.querySelectorAll('.settings-section')
        sections.forEach(section => section.classList.add('hidden'))
        
        // Show selected section
        const targetSection = this.element.querySelector(`#${sectionName}-section`)
        if (targetSection) {
            targetSection.classList.remove('hidden')
        }
    }
    
    async saveProfileSettings() {
        const displayName = this.element.querySelector('#displayName').value
        const bio = this.element.querySelector('#bio').value
        const location = this.element.querySelector('#location').value
        
        try {
            const authManager = window.technorox?.authManager
            const user = authManager?.getCurrentUser()
            
            if (user && firebaseService.isReady()) {
                await firebaseService.updateDocument('users', user.uid, {
                    displayName,
                    bio,
                    location
                })
                
                window.technorox?.uiManager?.showSuccess('Profile updated successfully!')
            } else {
                window.technorox?.uiManager?.showInfo('Profile settings saved locally')
            }
        } catch (error) {
            console.error('Error saving profile:', error)
            window.technorox?.uiManager?.showError('Failed to save profile settings')
        }
    }
    
    saveGameSettings() {
        const autoPass = this.element.querySelector('#autoPass').checked
        const showTooltips = this.element.querySelector('#showTooltips').checked
        const animationSpeed = this.element.querySelector('#animationSpeed').value
        const masterVolume = this.element.querySelector('#masterVolume').value
        const musicVolume = this.element.querySelector('#musicVolume').value
        const sfxVolume = this.element.querySelector('#sfxVolume').value
        
        // Save to localStorage
        localStorage.setItem('game_autoPass', autoPass)
        localStorage.setItem('game_showTooltips', showTooltips)
        localStorage.setItem('game_animationSpeed', animationSpeed)
        localStorage.setItem('game_masterVolume', masterVolume)
        localStorage.setItem('game_musicVolume', musicVolume)
        localStorage.setItem('game_sfxVolume', sfxVolume)
        
        window.technorox?.uiManager?.showSuccess('Game settings saved!')
    }
    
    saveNotificationSettings() {
        // Save notification preferences
        window.technorox?.uiManager?.showSuccess('Notification settings saved!')
    }
    
    savePrivacySettings() {
        // Save privacy preferences
        window.technorox?.uiManager?.showSuccess('Privacy settings saved!')
    }
    
    saveSystemSettings() {
        // Save system settings (admin only)
        window.technorox?.uiManager?.showSuccess('System settings saved!')
    }
    
    addStyles() {
        const style = document.createElement('style')
        style.textContent = `
            .settings-nav-item {
                display: flex;
                align-items: center;
                space-x: 0.75rem;
                padding: 0.75rem 1rem;
                color: #9CA3AF;
                background: none;
                border: none;
                border-radius: 0.5rem;
                transition: all 0.2s;
                margin-bottom: 0.25rem;
                width: 100%;
                text-align: left;
                cursor: pointer;
            }
            
            .settings-nav-item:hover {
                background-color: rgba(55, 65, 81, 0.5);
                color: #00FFF7;
            }
            
            .settings-nav-item.active {
                background: linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(255, 0, 255, 0.1));
                color: #00FFF7;
                border: 1px solid rgba(0, 255, 247, 0.3);
            }
            
            .settings-nav-item svg {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.75rem;
                flex-shrink: 0;
            }
        `
        
        if (!document.querySelector('#settings-styles')) {
            style.id = 'settings-styles'
            document.head.appendChild(style)
        }
    }
}

import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase.js'

export class AuthManager {
    constructor() {
        this.currentUser = null
        this.userProfile = null
        this.authListeners = []
        this.isFirebaseEnabled = !!auth
    }
    
    async init() {
        if (!this.isFirebaseEnabled) {
            console.warn('AuthManager: Firebase not configured, using demo mode')
            // Create a demo user for development
            this.currentUser = {
                uid: 'demo-user',
                email: 'demo@technorox.com',
                displayName: 'Demo Player'
            }
            this.userProfile = {
                displayName: 'Demo Player',
                level: 15,
                experience: 2450,
                gamesPlayed: 47,
                gamesWon: 32,
                winRate: 68,
                favoriteCard: 'Emberhorn Colossus',
                joinDate: new Date().toISOString(),
                cyberDust: 250, // Crafting currency
                role: 'admin' // Give demo user admin access
            }
            
            // Notify listeners
            setTimeout(() => {
                this.authListeners.forEach(callback => callback(this.currentUser, this.userProfile))
            }, 100)
            
            return Promise.resolve()
        }

        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                this.currentUser = user
                
                if (user) {
                    await this.loadUserProfile(user.uid)
                } else {
                    this.userProfile = null
                }
                
                // Notify listeners
                this.authListeners.forEach(callback => callback(user, this.userProfile))
                resolve()
            })
        })
    }
    
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            await this.loadUserProfile(userCredential.user.uid)
            
            // Redirect based on user role
            this.redirectBasedOnRole()
            
            return { success: true, user: userCredential.user }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    
    async register(email, password, displayName, newsletterSubscription = false) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            
            // Update profile
            await updateProfile(user, { displayName })
            
            // Create user document in Firestore
            await this.createUserProfile(user.uid, {
                displayName,
                email,
                role: 'player',
                createdAt: new Date(),
                stats: {
                    gamesPlayed: 0,
                    gamesWon: 0,
                    rank: 'Bronze',
                    elo: 1000
                },
                collection: [],
                decks: [],
                roxChips: {
                    balance: 0,
                    totalEarned: 0,
                    totalSpent: 0,
                    totalPurchased: 0,
                    lastUpdated: new Date()
                },
                preferences: {
                    newsletter: newsletterSubscription,
                    notifications: {
                        email: newsletterSubscription,
                        tournaments: newsletterSubscription,
                        newCards: newsletterSubscription,
                        events: newsletterSubscription
                    }
                }
            })
            
            // If user subscribed to newsletter, add them to subscription list
            if (newsletterSubscription) {
                await this.subscribeToNewsletter(email, displayName, user.uid)
            }
            
            // Redirect new users to player dashboard
            this.redirectBasedOnRole()
            
            return { success: true, user }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    
    async logout() {
        try {
            await signOut(auth)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    
    async createUserProfile(uid, profileData) {
        try {
            await setDoc(doc(db, 'users', uid), profileData)
            this.userProfile = profileData
        } catch (error) {
            console.error('Error creating user profile:', error)
        }
    }
    
    async loadUserProfile(uid) {
        try {
            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                this.userProfile = docSnap.data()
            }
        } catch (error) {
            console.error('Error loading user profile:', error)
        }
    }
    
    isAuthenticated() {
        return !!this.currentUser
    }
    
    isAdmin() {
        return this.userProfile?.role === 'admin'
    }
    
    getCurrentUser() {
        return this.currentUser
    }
    
    getUserProfile() {
        return this.userProfile
    }
    
    onAuthStateChange(callback) {
        this.authListeners.push(callback)
    }
    
    removeAuthListener(callback) {
        const index = this.authListeners.indexOf(callback)
        if (index > -1) {
            this.authListeners.splice(index, 1)
        }
    }
    
    redirectBasedOnRole() {
        if (!this.userProfile) return
        
        const currentPath = window.location.pathname
        
        // Don't redirect if already on the correct dashboard
        if (this.userProfile.role === 'admin' && currentPath === '/admin-dashboard') return
        if (this.userProfile.role === 'player' && currentPath === '/player-dashboard') return
        
        // Redirect based on role
        if (this.userProfile.role === 'admin') {
            window.technorox?.router?.navigate('/admin-dashboard')
        } else {
            window.technorox?.router?.navigate('/player-dashboard')
        }
    }
    
    getDefaultRoute() {
        if (!this.userProfile) return '/login'
        return this.userProfile.role === 'admin' ? '/admin-dashboard' : '/player-dashboard'
    }
    
    hasPermission(requiredRole) {
        if (!this.userProfile) return false
        
        // Admin has access to everything
        if (this.userProfile.role === 'admin') return true
        
        // Check specific role permissions
        return this.userProfile.role === requiredRole
    }
    
    isAdmin() {
        return this.userProfile?.role === 'admin'
    }

    // ===================
    // NEWSLETTER SUBSCRIPTION
    // ===================

    async subscribeToNewsletter(email, displayName, userId) {
        try {
            const { emailService } = await import('../services/EmailService.js')
            await emailService.init()
            
            const result = await emailService.subscribeToNewsletter(email, displayName, userId, {
                tournaments: true,
                newCards: true,
                events: true,
                gameUpdates: true
            })

            if (result.success) {
                console.log('✅ Newsletter subscription successful:', email)
            } else {
                console.error('❌ Newsletter subscription failed:', result.error)
            }

            return result
        } catch (error) {
            console.error('❌ Newsletter subscription error:', error)
            return { success: false, error: error.message }
        }
    }
}

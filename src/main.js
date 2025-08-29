import './styles/main.css'
import { initializeApp } from './app.js'
import { initializeFirebase } from './config/firebase.js'
import { firebaseService } from './services/FirebaseService.js'
import { IntegrationTest } from './utils/IntegrationTest.js'

// Initialize Firebase (optional for development)
const firebaseEnabled = initializeFirebase()
if (firebaseEnabled) {
    console.log('🔥 Firebase services enabled')
    // Initialize Firebase service
    firebaseService.init().then(() => {
        console.log('🔥 Firebase service initialized')
    }).catch(error => {
        console.error('Firebase service initialization failed:', error)
    })
} else {
    console.log('🎮 Running in demo mode - Firebase disabled')
}

// Register Service Worker for PWA support (only in production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            console.log('Service Worker registered successfully:', registration.scope)
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        showUpdateAvailable()
                    }
                })
            })
        } catch (error) {
            console.error('Service Worker registration failed:', error)
        }
    })
} else if (import.meta.env.DEV) {
    console.log('🔧 Service Worker disabled in development mode')
    
    // Unregister any existing service workers in development
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister()
                console.log('🧹 Unregistered existing service worker')
            })
        })
    }
}

// Show update notification
function showUpdateAvailable() {
    if (window.technorox?.uiManager) {
        const updateNotification = window.technorox.uiManager.showNotification(
            'A new version is available! Refresh to update.',
            'info',
            0 // Don't auto-dismiss
        )
        
        // Add refresh button to notification
        setTimeout(() => {
            const notification = document.querySelector(`[data-notification-id="${updateNotification}"]`)
            if (notification) {
                const refreshBtn = document.createElement('button')
                refreshBtn.textContent = 'Refresh'
                refreshBtn.className = 'ml-2 px-2 py-1 bg-neon-cyan text-black rounded text-sm hover:bg-white transition-colors'
                refreshBtn.onclick = () => window.location.reload()
                notification.appendChild(refreshBtn)
            }
        }, 100)
    }
}

// Initialize the main application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp()
    
    // Run integration tests in development mode
    if (import.meta.env.DEV) {
        console.log('🧪 Development mode detected - integration tests available')
        console.log('   Run IntegrationTest.quickTest() in console to test all services')
        
        // Auto-run basic connectivity test after a short delay
        setTimeout(async () => {
            try {
                const tester = new IntegrationTest()
                await tester.testFirebaseServices()
            } catch (error) {
                console.warn('Quick connectivity test failed:', error)
            }
        }, 2000)
    }
})

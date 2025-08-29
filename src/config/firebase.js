import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: "AIzaSyAurRuwrHAuig1jGIO-m-RZT51BnMwXQAU",
  authDomain: "technorox-tcg.firebaseapp.com",
  projectId: "technorox-tcg",
  storageBucket: "technorox-tcg.firebasestorage.app",
  messagingSenderId: "715329943130",
  appId: "1:715329943130:web:2f78d37adc341561174a63",
  measurementId: "G-2M8YLQJVH4"
}

let app
let auth
let db
let storage
let analytics = null
let appCheck

// Check if Firebase config is available
const isFirebaseConfigured = firebaseConfig.apiKey && 
                            firebaseConfig.authDomain && 
                            firebaseConfig.projectId

export function initializeFirebase() {
  if (!isFirebaseConfigured) {
    console.warn('Firebase configuration not found. Running in development mode without Firebase.')
    console.info('To enable Firebase features, add your Firebase config to .env file')
    return false
  }

  try {
    // Initialize Firebase App
    app = initializeApp(firebaseConfig)
    console.log('Firebase app initialized')
    
    // Initialize core Firebase services
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    console.log('Firebase core services initialized')
    
    // Initialize Analytics (only in browser environment and with measurementId)
    if (firebaseConfig.measurementId && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      try {
        analytics = getAnalytics(app)
        console.log('Firebase Analytics initialized successfully')
      } catch (analyticsError) {
        console.warn('Firebase Analytics initialization failed:', analyticsError.message)
        console.warn('This is normal in development environment')
        analytics = null
      }
    } else {
      console.log('Firebase Analytics skipped (development environment)')
      analytics = null
    }
    
    // Initialize App Check (you'll need to configure reCAPTCHA site key in Firebase Console)
    // For development, you can use debug tokens
    if (typeof window !== 'undefined') {
      try {
        // Use reCAPTCHA site key from environment variables
        const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
        
        if (import.meta.env.PROD && recaptchaSiteKey && recaptchaSiteKey !== 'your-recaptcha-site-key-here') {
          appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(recaptchaSiteKey),
            isTokenAutoRefreshEnabled: true
          })
          console.log('App Check: Initialized with reCAPTCHA v3')
        } else {
          // In development, App Check will use debug tokens if configured
          console.log('App Check: Running in development mode. Configure debug tokens in Firebase Console if needed.')
          console.log('To enable App Check in production, set VITE_RECAPTCHA_SITE_KEY in your .env file')
        }
      } catch (appCheckError) {
        console.warn('App Check initialization failed:', appCheckError)
      }
    }
    
    console.log('Firebase initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing Firebase:', error)
    return false
  }
}

// Export functions to get Firebase services (safer than direct exports)
export function getFirebaseAuth() { return auth }
export function getFirebaseDB() { return db }
export function getFirebaseStorage() { return storage }
export function getFirebaseAnalytics() { return analytics }
export function getFirebaseAppCheck() { return appCheck }

// Legacy exports for backward compatibility
export { auth, db, storage, analytics, appCheck }
export default app

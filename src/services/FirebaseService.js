import { 
  auth, 
  db, 
  storage, 
  analytics, 
  appCheck,
  initializeFirebase 
} from '../config/firebase.js'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage'
import { logEvent } from 'firebase/analytics'

/**
 * Firebase Service - Centralized service for all Firebase operations
 * Provides easy-to-use methods for Firestore, Storage, and Analytics
 */
export class FirebaseService {
  constructor() {
    this.isInitialized = false
  }

  /**
   * Initialize Firebase services
   */
  async init() {
    this.isInitialized = await initializeFirebase()
    
    // Test connection only if Firebase is initialized and user is authenticated
    if (this.isInitialized && this.getCurrentUser()) {
      try {
        // Simple test to verify Firebase connection
        await this.getCollection('users', { limit: 1 })
        console.log('Firebase connection verified')
      } catch (error) {
        console.warn('Firebase connection test failed:', error.message)
        // Don't fail initialization, just log the warning
      }
    }
    
    return this.isInitialized
  }

  /**
   * Check if Firebase is properly initialized
   */
  isReady() {
    return this.isInitialized && !!auth && !!db
  }

  // ===================
  // FIRESTORE METHODS
  // ===================

  /**
   * Create a new document in a collection
   */
  async createDocument(collectionName, data) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Update an existing document
   */
  async updateDocument(collectionName, docId, data) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName, docId) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      await deleteDoc(doc(db, collectionName, docId))
      return { success: true }
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument(collectionName, docId) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      const docSnap = await getDoc(doc(db, collectionName, docId))
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
      } else {
        return { success: false, error: 'Document not found' }
      }
    } catch (error) {
      console.error(`Error getting document ${docId} from ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get all documents from a collection
   */
  async getCollection(collectionName, queryOptions = {}) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      let q = collection(db, collectionName)
      
      // Apply query filters
      if (queryOptions.where) {
        queryOptions.where.forEach(([field, operator, value]) => {
          q = query(q, where(field, operator, value))
        })
      }
      
      if (queryOptions.orderBy) {
        const [field, direction = 'asc'] = queryOptions.orderBy
        q = query(q, orderBy(field, direction))
      }
      
      if (queryOptions.limit) {
        q = query(q, limit(queryOptions.limit))
      }
      
      const querySnapshot = await getDocs(q)
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      
      return { success: true, data: documents }
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Listen to real-time updates on a document
   */
  subscribeToDocument(collectionName, docId, callback) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    return onSnapshot(doc(db, collectionName, docId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() })
      } else {
        callback(null)
      }
    })
  }

  /**
   * Listen to real-time updates on a collection
   */
  subscribeToCollection(collectionName, callback, queryOptions = {}) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    let q = collection(db, collectionName)
    
    // Apply query filters
    if (queryOptions.where) {
      queryOptions.where.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value))
      })
    }
    
    if (queryOptions.orderBy) {
      const [field, direction = 'asc'] = queryOptions.orderBy
      q = query(q, orderBy(field, direction))
    }
    
    if (queryOptions.limit) {
      q = query(q, limit(queryOptions.limit))
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      callback(documents)
    })
  }

  // ===================
  // STORAGE METHODS
  // ===================

  /**
   * Upload a file to Firebase Storage
   */
  async uploadFile(path, file, metadata = {}) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return { 
        success: true, 
        downloadURL, 
        path: snapshot.ref.fullPath,
        size: snapshot.metadata.size
      }
    } catch (error) {
      console.error(`Error uploading file to ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete a file from Firebase Storage
   */
  async deleteFile(path) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      await deleteObject(ref(storage, path))
      return { success: true }
    } catch (error) {
      console.error(`Error deleting file ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get download URL for a file
   */
  async getFileURL(path) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      const url = await getDownloadURL(ref(storage, path))
      return { success: true, url }
    } catch (error) {
      console.error(`Error getting URL for ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * List all files in a storage directory
   */
  async listFiles(path) {
    if (!this.isReady()) throw new Error('Firebase not initialized')
    
    try {
      const listRef = ref(storage, path)
      const result = await listAll(listRef)
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef)
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          }
        })
      )
      
      return { success: true, files }
    } catch (error) {
      console.error(`Error listing files in ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  // ===================
  // ANALYTICS METHODS
  // ===================

  /**
   * Log a custom event to Firebase Analytics
   */
  logAnalyticsEvent(eventName, parameters = {}) {
    if (analytics && typeof window !== 'undefined') {
      try {
        logEvent(analytics, eventName, parameters)
      } catch (error) {
        console.warn('Error logging analytics event:', error)
      }
    }
  }

  /**
   * Log game-specific events
   */
  logGameEvent(eventType, data = {}) {
    this.logAnalyticsEvent(`game_${eventType}`, {
      ...data,
      timestamp: Date.now()
    })
  }

  /**
   * Log user interaction events
   */
  logUserEvent(eventType, data = {}) {
    this.logAnalyticsEvent(`user_${eventType}`, {
      ...data,
      timestamp: Date.now()
    })
  }

  // ===================
  // UTILITY METHODS
  // ===================

  /**
   * Get server timestamp
   */
  getServerTimestamp() {
    return serverTimestamp()
  }

  /**
   * Get current timestamp
   */
  getCurrentTimestamp() {
    return new Date()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!auth?.currentUser
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth?.currentUser
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService()
export default firebaseService

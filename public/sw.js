// Technorox TCG Service Worker
const CACHE_NAME = 'technorox-v1.0.0'
const STATIC_CACHE = 'technorox-static-v1'
const DYNAMIC_CACHE = 'technorox-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/styles/main.css',
  '/favicon.svg',
  '/manifest.json',
  // Add other critical assets
]

// Assets to cache on first request
const DYNAMIC_ASSETS = [
  '/src/pages/',
  '/src/managers/',
  '/src/game/',
  '/src/data/',
  '/src/utils/'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip external requests (Firebase, APIs, etc.)
  if (url.origin !== location.origin) {
    return
  }
  
  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request))
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkFirst(request))
  } else if (isGameAsset(request.url)) {
    event.respondWith(staleWhileRevalidate(request))
  } else {
    event.respondWith(cacheFirst(request))
  }
})

// Cache strategies
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network first fallback to cache:', request.url)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response('Offline - Network unavailable', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  })
  
  return cachedResponse || fetchPromise
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/src/styles/') || 
         url.includes('/favicon') ||
         url.includes('/manifest.json') ||
         url.endsWith('.css') ||
         url.endsWith('.js') && !url.includes('/api/')
}

function isAPIRequest(url) {
  return url.includes('/api/') || 
         url.includes('firebase') ||
         url.includes('openai')
}

function isGameAsset(url) {
  return url.includes('/src/game/') ||
         url.includes('/src/pages/') ||
         url.includes('/src/managers/')
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'game-action') {
    event.waitUntil(syncGameActions())
  } else if (event.tag === 'card-collection') {
    event.waitUntil(syncCardCollection())
  }
})

async function syncGameActions() {
  try {
    // Sync any pending game actions when back online
    const pendingActions = await getStoredGameActions()
    
    for (const action of pendingActions) {
      try {
        await fetch('/api/game/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action)
        })
        
        // Remove from local storage after successful sync
        await removeStoredGameAction(action.id)
      } catch (error) {
        console.error('Failed to sync game action:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

async function syncCardCollection() {
  try {
    // Sync card collection updates
    const pendingUpdates = await getStoredCollectionUpdates()
    
    for (const update of pendingUpdates) {
      try {
        await fetch('/api/collection/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        })
        
        await removeStoredCollectionUpdate(update.id)
      } catch (error) {
        console.error('Failed to sync collection update:', error)
      }
    }
  } catch (error) {
    console.error('Collection sync failed:', error)
  }
}

// IndexedDB helpers for offline storage
async function getStoredGameActions() {
  // Implementation would use IndexedDB to store offline actions
  return []
}

async function removeStoredGameAction(actionId) {
  // Remove action from IndexedDB after sync
}

async function getStoredCollectionUpdates() {
  // Get pending collection updates from IndexedDB
  return []
}

async function removeStoredCollectionUpdate(updateId) {
  // Remove update from IndexedDB after sync
}

// Push notifications for game events
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received')
  
  if (!event.data) {
    return
  }
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/icons/badge-96.png',
    image: data.image,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      action: data.action
    },
    actions: [
      {
        action: 'open',
        title: 'Open Game',
        icon: '/icons/play-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/close-icon.png'
      }
    ],
    requireInteraction: data.requireInteraction || false,
    silent: false,
    tag: data.tag || 'technorox-notification'
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  const action = event.action
  const data = event.notification.data
  
  if (action === 'dismiss') {
    return
  }
  
  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === data.url && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(data.url || '/')
        }
      })
  )
})

// Handle notification close
self.addEventListener('notificationclose', event => {
  console.log('Service Worker: Notification closed')
  
  // Track notification dismissal analytics if needed
  const data = event.notification.data
  if (data && data.action === 'track_dismissal') {
    // Send analytics event
  }
})

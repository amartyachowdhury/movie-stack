// Movie Stack Service Worker
const CACHE_NAME = 'movie-stack-v1';
const STATIC_CACHE = 'movie-stack-static-v1';
const DYNAMIC_CACHE = 'movie-stack-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

const API_CACHE_PATTERNS = [
  /\/api\/movies\/popular/,
  /\/api\/movies\/search/,
  /\/api\/movies\/\d+/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets');
      // Use addAll with error handling for individual failures
      return Promise.allSettled(
        STATIC_ASSETS.map(url => 
          cache.add(url).catch(error => {
            console.warn(`Failed to cache ${url}:`, error);
            return null;
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.allSettled(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName).catch(error => {
              console.warn(`Failed to delete cache ${cacheName}:`, error);
              return null;
            });
          }
          return Promise.resolve();
        })
      );
    }).catch(error => {
      console.error('Error during cache cleanup:', error);
    })
  );
  
  // Claim clients with error handling
  try {
    self.clients.claim();
  } catch (error) {
    console.warn('Failed to claim clients:', error);
  }
});

// Enhanced fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Always let API requests pass through to network
  if (request.url.includes('/api/') || 
      request.url.includes('localhost:5001') ||
      request.url.includes('localhost:3000/api/')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then((response) => response || fetch(request))
    );
    return;
  }
  
  // For other requests, use network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for static content
        if (response.status === 200 && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending offline actions
    const pendingActions = await getPendingActions();
    for (const action of pendingActions) {
      await syncAction(action);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getPendingActions() {
  // Get pending actions from IndexedDB
  return [];
}

async function syncAction(action) {
  // Sync individual action
  console.log('Syncing action:', action);
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New movie recommendations available!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Recommendations',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Movie Stack', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/?tab=recommendations')
    );
  }
});

// Message handling to prevent message channel errors
self.addEventListener('message', (event) => {
  // Handle messages from the main thread
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Always respond to prevent message channel errors
  if (event.ports && event.ports.length > 0) {
    event.ports[0].postMessage({ status: 'received' });
  }
});

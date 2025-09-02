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

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with cache-first strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Return cached response
            return response;
          }
          
          // Fetch from network and cache
          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // Return offline fallback for API requests
            return new Response(
              JSON.stringify({ 
                error: 'No internet connection',
                message: 'Please check your connection and try again'
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        });
      })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Handle navigation requests with network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache successful navigation responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Return cached navigation response if available
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Return offline page
          return caches.match('/');
        });
      })
    );
    return;
  }

  // Default: network-first strategy
  event.respondWith(
    fetch(request).catch((error) => {
      console.warn('Fetch failed, trying cache:', error);
      return caches.match(request).catch((cacheError) => {
        console.error('Cache match also failed:', cacheError);
        // Return a basic offline response
        return new Response('Offline - Please check your connection', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
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

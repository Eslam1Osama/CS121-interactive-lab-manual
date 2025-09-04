const CACHE_NAME = 'cs121-labs-v1.0.0';
const STATIC_CACHE = 'cs121-static-v1.0.0';
const DYNAMIC_CACHE = 'cs121-dynamic-v1.0.0';
const IMAGE_CACHE = 'cs121-images-v1.0.0';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/js/platformPreloader.js',
    '/media/site.webmanifest',
    '/media/browserconfig.xml',
    '/sitemap.xml',
    '/robots.txt'
];

// Critical scripts only - others loaded dynamically
const CRITICAL_SCRIPTS = [
    '/lab3-modal.js',
    '/lab4-modal.js'
];

// Logo and branding assets
const BRAND_ASSETS = [
    '/media/favicon-16x16.png',
    '/media/favicon-32x32.png',
    '/media/favicon-48x48.png',
    '/media/apple-touch-icon.png',
    '/media/favicon.svg'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Enterprise-level install event with comprehensive error handling
self.addEventListener('install', function(event) {
    event.waitUntil(
        Promise.all([
            // Cache static files (HTML, CSS, JS)
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(STATIC_FILES).catch(error => {
                    console.warn('Failed to cache static files:', error);
                });
            }),
            // Cache critical scripts only
            caches.open(DYNAMIC_CACHE).then(cache => {
                return cache.addAll(CRITICAL_SCRIPTS).catch(error => {
                    console.warn('Failed to cache critical scripts:', error);
                });
            }),
            // Cache brand assets separately
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.addAll(BRAND_ASSETS).catch(error => {
                    console.warn('Failed to cache brand assets:', error);
                });
            })
        ]).then(() => {
            return self.skipWaiting();
        }).catch(function(error) {
            // Silent error handling for production
            console.warn('Service Worker installation failed:', error);
        })
    );
});

// Enhanced activate event - clean up old caches
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        }).catch(function(error) {
            console.warn('Service Worker activation failed:', error);
        })
    );
});

// Enterprise-level fetch event with comprehensive filtering and error handling
self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip unsupported URL schemes to prevent cache errors
    if (url.protocol === 'chrome-extension:' || 
        url.protocol === 'moz-extension:' ||
        url.protocol === 'ms-browser-extension:' ||
        url.protocol === 'data:' || 
        url.protocol === 'blob:' ||
        url.protocol === 'file:') {
        return;
    }
    
    // Add null checks for request headers
    const acceptHeader = request.headers ? request.headers.get('accept') : null;
    
    // Handle navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    // Cache the response if it's valid
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE)
                            .then(function(cache) {
                                cache.put(request, responseClone);
                            })
                            .catch(function(error) {
                                console.warn('Failed to cache navigation response:', error);
                            });
                    }
                    return response;
                })
                .catch(function() {
                    // Return offline page if network fails
                    return caches.match('/offline.html');
                })
        );
        return;
    }
    
    // Handle static assets with enhanced error handling
    if (request.destination === 'image' || 
        request.destination === 'script' || 
        request.destination === 'style' ||
        request.destination === 'font') {
        
        event.respondWith(
            caches.match(request)
                .then(function(response) {
                    // Return cached version if available
                    if (response) {
                        return response;
                    }
                    
                    // Fetch from network and cache
                    return fetch(request)
                        .then(function(networkResponse) {
                            // Check if we received a valid response
                            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                                return networkResponse;
                            }
                            
                            // Clone the response for caching
                            const responseToCache = networkResponse.clone();
                            
                            // Determine appropriate cache
                            let targetCache = DYNAMIC_CACHE;
                            if (request.destination === 'image') {
                                targetCache = IMAGE_CACHE;
                            } else if (request.destination === 'script') {
                                targetCache = DYNAMIC_CACHE;
                            }
                            
                            // Cache the response
                            caches.open(targetCache)
                                .then(function(cache) {
                                    cache.put(request, responseToCache);
                                })
                                .catch(function(error) {
                                    console.warn('Failed to cache asset:', error);
                                });
                            
                            return networkResponse;
                        })
                        .catch(function(error) {
                            // Return fallback for images
                            if (request.destination === 'image') {
                                return caches.match('/media/favicon-32x32.png');
                            }
                            
                            return new Response('', {
                                status: 404,
                                statusText: 'Not Found'
                            });
                        });
                })
        );
        return;
    }
    
    // Handle external API requests with proper error handling
    if (url.hostname === 'docs.google.com' || 
        url.hostname === 'forms.gle' ||
        url.hostname === 'script.google.com' ||
        url.hostname === 'cdnjs.cloudflare.com') {
        
        event.respondWith(
            fetch(request)
                .catch(function(error) {
                    console.warn('External resource failed:', error);
                    return new Response('', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                })
        );
        return;
    }
    
    // Default strategy: network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then(function(response) {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(function(cache) {
                            cache.put(request, responseClone);
                        })
                        .catch(function(error) {
                            console.warn('Failed to cache response:', error);
                        });
                }
                return response;
            })
            .catch(function() {
                // Fallback to cache
                return caches.match(request);
            })
    );
});

// Enhanced error handling for unhandled promise rejections
self.addEventListener('unhandledrejection', function(event) {
    console.warn('Unhandled promise rejection in service worker:', event.reason);
    event.preventDefault();
});

// Background sync for offline functionality
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle any pending background tasks
    return Promise.resolve();
}

// Push notification handling (enterprise-ready)
self.addEventListener('push', function(event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body || 'CS121 Lab Manual Update',
                icon: '/media/apple-touch-icon.png',
                badge: '/media/favicon-32x32.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                },
                actions: [
                    {
                        action: 'explore',
                        title: 'Open Lab Manual',
                        icon: '/media/favicon-32x32.png'
                    },
                    {
                        action: 'close',
                        title: 'Close',
                        icon: '/media/favicon-32x32.png'
                    }
                ]
            };
            
            event.waitUntil(
                self.registration.showNotification('CS121 Lab Manual', options)
            );
        } catch (error) {
            console.warn('Failed to parse push notification data:', error);
        }
    }
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
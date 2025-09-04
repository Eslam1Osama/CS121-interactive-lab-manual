const CACHE_PREFIX = 'cs121-labs';
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${CACHE_VERSION}`;

const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/js/platformPreloader.js',
    '/media/site.webmanifest',
    '/media/browserconfig.xml',
    '/sitemap.xml',
    '/robots.txt',
    // Icons for PWA and fallbacks
    '/media/favicon-16x16.png',
    '/media/favicon-32x32.png',
    '/media/favicon-48x48.png',
    '/media/favicon.svg',
    '/media/apple-touch-icon.png'
];

// Critical scripts only - others loaded dynamically
const CRITICAL_SCRIPTS = [
    '/lab3-modal.js',
    '/lab4-modal.js'
];

// Large images for optimization
const LARGE_IMAGES = [
    '/media/74175_D_FlipFlop.png',
    '/media/JK_Simulation.png',
    '/media/D_Simulation.png',
    '/media/Decoder_2_4.png',
    '/media/74283_4_bit_Full_Adder.png'
];

const IMAGE_FILES = [
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

// Install event - cache static files with multiple cache strategies
self.addEventListener('install', function(event) {
    event.waitUntil(
        Promise.all([
            // Cache static files (HTML, CSS, JS)
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(STATIC_FILES);
            }),
            // Cache critical scripts only
            caches.open(DYNAMIC_CACHE).then(cache => {
                return cache.addAll(CRITICAL_SCRIPTS);
            }),
            // Cache images separately
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.addAll(IMAGE_FILES);
            })
        ]).then(() => {
            return self.skipWaiting();
        }).catch(function(error) {
            // Silent error handling for production
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (!cacheName.includes(CACHE_VERSION)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip chrome-extension URLs to prevent cache errors
    if (url.protocol === 'chrome-extension:' || url.hostname.endsWith('chrome') || url.hostname.endsWith('chromium')) {
        return;
    }
    
    // Skip data URLs
    if (url.protocol === 'data:') {
        return;
    }
    
    // Skip blob URLs
    if (url.protocol === 'blob:') {
        return;
    }
    
    // Handle navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    // Cache the response if it's valid
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(request, responseClone);
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
    
    // Handle static assets
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
                            
                            // Clone the response
                            const responseToCache = networkResponse.clone();
                            
                            // Cache the response
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(request, responseToCache);
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
    
    // Handle API requests (Google Forms, etc.)
    if (url.hostname === 'docs.google.com' || 
        url.hostname === 'forms.gle' ||
        url.hostname === 'script.google.com') {
        
        event.respondWith(
            fetch(request)
                .catch(function(error) {
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
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(request, responseClone);
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

// Background sync for offline form submissions
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle any pending background tasks
    return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'CS121 Lab Manual Update',
            icon: '/media/favicon-48x48.png',
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

// Error handling for unhandled promise rejections
self.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
});

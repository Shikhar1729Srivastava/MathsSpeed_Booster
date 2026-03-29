const CACHE_NAME = 'math-master-v1';
// List all files you want to work offline
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/calculator.png',
    '/correct.mp3',
    '/wrong.mp3'
];

// Install Event: Save files to the cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch Event: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached file if found, otherwise try the network
            return response || fetch(event.request);
        })
    );
});

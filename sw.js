/**
 * Jeevan Setu - Progressive Web App (PWA) Service Worker
 * Automatic Cache Purge Engine v10.0
 */

const CACHE_NAME = 'jeevan-setu-v10';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/config.js',
  './js/weather-api.js',
  './js/geocoding-api.js',
  './js/ai-assistant.js',
  './js/osrm-routing-api.js',
  './js/gis-map.js',
  './js/ai-prediction.js',
  './js/fleet-tracker.js',
  './js/incident-reporter.js',
  './js/alerts-manager.js',
  './js/app.js'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event - Auto Purge Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Purging old PWA cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

/**
 * Service Worker for Jeevan Setu - NER Logistics AI Platform
 * Version: v2.0 (Forces Cache Bust for New Jeevan Setu UI)
 */

const CACHE_NAME = 'jeevan-setu-ner-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/config.js',
  './js/i18n.js',
  './js/weather-api.js',
  './js/gis-map.js',
  './js/ai-prediction.js',
  './js/fleet-tracker.js',
  './js/incident-reporter.js',
  './js/alerts-manager.js',
  './js/app.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching Jeevan Setu v2 assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event (Purge old v1 caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Purging old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('tile.opentopomap.org') || event.request.url.includes('basemaps.cartocdn.com') || event.request.url.includes('open-meteo.com')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

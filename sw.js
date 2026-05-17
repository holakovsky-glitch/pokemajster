// Vybrané slová - Service Worker v8.58
const CACHE_VERSION = 'v8.58';
const CACHE_NAME = `poke-edu-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './data/vybrane_slova.js',
  './data/gen1_sk.js',
  './data/gen2_sk.js',
  './data/gen3_sk.js',
  './data/gen4_sk.js',
  './data/gen5_sk.js',
  './data/gen6_sk.js',
  './data/gen7_sk.js',
  './data/gen8_sk.js',
  './data/gen9_sk.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key.startsWith('poke-edu-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  
  // Pre index.html a data vždy skús sieť najprv - zaručí aktualizáciu z GitHubu
  if (req.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname.includes('/data/')) {
    event.respondWith(
      fetch(req).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return response;
      }).catch(() => caches.match(req))
    );
    return;
  }
  
  // Ostatné súbory - cache first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return response;
    }))
  );
});

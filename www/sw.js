// Offline cache for the web version (Home Screen app). Bump VERSION when www/ changes.
const VERSION = 'buhar-v1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-512.png', 'privacy.html', 'fonts/fonts.css',
  ...['Baloo2', 'Nunito'].flatMap(f => [600, 700, 800].flatMap(w => [`fonts/${f}-${w}-latin.woff2`, `fonts/${f}-${w}-latin-ext.woff2`])),
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first so updates show up when online; fall back to the cache when offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});

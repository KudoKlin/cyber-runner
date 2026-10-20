const CACHE_NAME = 'cyber-runner-v5'; // ← ИЗМЕНИЛ ВЕРСИЮ С v1 НА v5
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Кэш открыт');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // ← ДОБАВИЛ: Принудительно активируем новый SW
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Удаляю старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // ← ДОБАВИЛ: Берём контроль над всеми вкладками
});
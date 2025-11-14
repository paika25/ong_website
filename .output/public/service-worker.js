// Minimal stub service worker to avoid router 404 warnings
self.addEventListener('install', (event) => {
  // skipWaiting();
});

self.addEventListener('activate', (event) => {
  // clients.claim();
});

// optional fetch handler
self.addEventListener('fetch', (event) => {
  // You can customize caching here if needed
});

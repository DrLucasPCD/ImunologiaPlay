// Service Worker básico: cache-first para assets estáticos
const CACHE = "imunoplay-v1";
const ASSETS = [
  "./",
  "./Index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-maskable.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((resp) => {
        const copy = resp.clone();
        if (request.method === "GET" && resp.ok && new URL(request.url).origin === location.origin) {
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return resp;
      }).catch(() => caches.match("./Index.html"));
    })
  );
});
const CACHE = 'ai-news-v1';
const PRECACHE = ['/', '/bookmarks'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Only cache GET navigation requests; pass everything else through
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Badge count (persisted in IndexedDB-lite via a simple key in cacheStorage) ─

async function getBadgeCount() {
  const cache = await caches.open('ai-news-badge');
  const res = await cache.match('count');
  return res ? parseInt(await res.text(), 10) || 0 : 0;
}

async function setBadgeCount(n) {
  const cache = await caches.open('ai-news-badge');
  await cache.put('count', new Response(String(n)));
  if ('setAppBadge' in self.navigator) {
    n > 0 ? self.navigator.setAppBadge(n) : self.navigator.clearAppBadge();
  }
}

// ── Push notifications ────────────────────────────────────────────────────────

self.addEventListener('push', (e) => {
  if (!e.data) return;
  const { title, body, url } = e.data.json();
  e.waitUntil(
    getBadgeCount().then((count) => {
      const next = count + 1;
      return Promise.all([
        setBadgeCount(next),
        self.registration.showNotification(title, {
          body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          data: { url },
        }),
      ]);
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const target = e.notification.data?.url ?? '/';
  e.waitUntil(
    Promise.all([
      setBadgeCount(0),
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
        const existing = list.find((c) => c.url === target && 'focus' in c);
        return existing ? existing.focus() : clients.openWindow(target);
      }),
    ])
  );
});

// Clear badge when any app window is focused
self.addEventListener('message', (e) => {
  if (e.data === 'clear-badge') setBadgeCount(0);
});

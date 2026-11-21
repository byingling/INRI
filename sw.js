const CACHE_NAME = 'inri-v60';
// The full Bible text lives in its own cache so app updates don't re-download it
const DATA_CACHE = 'inri-data-v1';
const KEEP = [CACHE_NAME, DATA_CACHE, 'inri-settings'];
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/content.js',
  './js/daily-depth.js',
  './js/prayers.js',
  './js/calendar.js',
  './js/places.js',
  './js/atmosphere.js',
  './js/narration.js',
  './js/memorize.js',
  './js/walk.js',
  './js/library.js',
  './js/storage.js',
  './js/bible-plus.js',
  './js/plans-plus.js',
  './js/prayer-list.js',
  './js/reminders.js',
  './manifest.json',
  './icons/splash-inri.jpg',
  './icons/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => KEEP.indexOf(k) === -1).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (event.request.method !== 'GET') return;
  // Network-first for the Bible API
  if (url.includes('api.midvash.com')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  // Full KJV: cache-first in the long-lived data cache
  if (url.includes('/data/kjv.json')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(cache => cache.match(event.request).then(hit => hit || fetch(event.request).then(res => {
        if (res.ok) cache.put(event.request, res.clone());
        return res;
      })))
    );
    return;
  }
  // App shell: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok && url.startsWith(self.location.origin)) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }))
  );
});

// ---------- Daily reminder notification ----------
function localKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

async function maybeRemind() {
  const cache = await caches.open('inri-settings');
  const res = await cache.match('reminder.json');
  if (!res) return;
  const r = await res.json();
  if (!r.notify) return;
  const now = new Date();
  const [h, m] = (r.time || '06:30').split(':').map(Number);
  const due = new Date(now); due.setHours(h, m, 0, 0);
  if (now < due) return;
  const shown = await cache.match('last-reminder');
  const today = localKey(now);
  if (shown && (await shown.text()) === today) return;
  await self.registration.showNotification('INRI — Daily Walk', {
    body: 'Take a few minutes with God: the verse of the day, reflection and prayer. Tap to begin.',
    icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'inri-daily', data: { url: './?walk=1' }
  });
  await cache.put('last-reminder', new Response(today));
}

self.addEventListener('periodicsync', event => {
  if (event.tag === 'inri-daily-reminder') event.waitUntil(maybeRemind());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) { c.postMessage({ type: 'open-walk' }); return c.focus(); }
      }
      return self.clients.openWindow(target);
    })
  );
});

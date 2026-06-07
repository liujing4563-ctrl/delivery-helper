const CACHE_NAME = 'delivery-helper-v10';
const OFFLINE_URL = '/offline';

// 预缓存的关键页面
const PRECACHE_URLS = [
  '/',
  '/calculator',
  '/guide',
  '/evidence',
  '/regulations',
  '/legal-aid',
  '/injury-insurance',
  '/social-insurance',
  '/chat',
  '/news',
  '/disclaimer',
  '/privacy',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
];

// 安装：预缓存关键页面
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 请求策略：网络优先，离线时返回缓存
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  // API 请求不缓存
  if (requestUrl.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 缓存成功的页面请求
        if (response.ok && event.request.mode === 'navigate') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // 离线时：导航请求返回缓存的页面或离线页面
        if (event.request.mode === 'navigate') {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        }
        // 其他请求尝试缓存
        return caches.match(event.request);
      })
  );
});

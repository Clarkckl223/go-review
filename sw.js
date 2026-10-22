// 围棋复盘本：离线可用。网页本身「先上网拿最新，没网才用缓存」，所以你上传新版后会自动更新。
const CACHE = 'go-review-v1';
const AI_CACHE = 'go-review-ai-v1'; // AI 模型和 TensorFlow.js：下载一次就一直用
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== AI_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isAi = (url.origin === location.origin && url.pathname.includes('/katago/')) || req.url.startsWith('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@') || req.url.startsWith('https://cdn.jsdelivr.net/npm/onnxruntime-web@');
  if (isAi) {
    e.respondWith(caches.open(AI_CACHE).then(c => c.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok) c.put(req, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // 字体和 Firebase 程序：有缓存就先用缓存（Google Drive、数据库的请求不经过这里）
  if (/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com\/firebasejs\/)/.test(req.url)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    })));
  }
});

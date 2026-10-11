/* SA Tax Consultant – service worker.
   Bump VERSION whenever you change sw.js, the icons or the manifest.
   index.html itself is fetched network-first, so a new upload reaches phones on the next launch. */
const VERSION = '1.5.0';
const SHELL = 'satc-shell-' + VERSION;
const RUNTIME = 'satc-runtime-v1';   // fonts + OCR engine from CDNs
const SHARE = 'satc-share';          // files shared into the app from other apps
const SHELL_FILES = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png', './icons/shortcut-96.png'];
const CDN = /^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|tessdata\.projectnaptha\.com)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)));
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('satc-shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method === 'POST' && url.origin === location.origin && url.pathname.endsWith('/share-target')) {
    e.respondWith(receiveShare(req)); return;
  }
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') { e.respondWith(navigate(e)); return; }
  if (url.origin === location.origin) { e.respondWith(cacheFirst(req, SHELL)); return; }
  if (CDN.test(url.hostname)) { e.respondWith(cacheFirst(req, RUNTIME)); }
});

// Network first (fresh app when online), cached copy after 3.5 s or when offline.
function navigate(e) {
  const net = fetch(e.request).then(async res => {
    if (res.ok && res.type === 'basic') { const c = await caches.open(SHELL); await c.put('./index.html', res.clone()); }
    return res;
  });
  e.waitUntil(net.catch(() => {}));
  const timeout = new Promise(r => setTimeout(() => r(null), 3500));
  return Promise.race([net.catch(() => null), timeout]).then(async res =>
    res || (await caches.match('./index.html', { ignoreSearch: true })) || net);
}

async function cacheFirst(req, name) {
  const c = await caches.open(name);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') c.put(req, res.clone()).catch(() => {});
  return res;
}

// Android "Share → SA Tax": keep the files for the page, then open the app.
async function receiveShare(req) {
  let n = 0;
  try {
    const fd = await req.formData();
    const files = fd.getAll('files').filter(f => f && typeof f !== 'string');
    const c = await caches.open(SHARE);
    for (const k of await c.keys()) await c.delete(k);
    for (const f of files) {
      await c.put(new Request('./__shared/' + (n++)), new Response(f, { headers: {
        'Content-Type': f.type || 'application/octet-stream',
        'X-Name': encodeURIComponent(f.name || ('shared-file-' + n)) } }));
    }
  } catch (err) { /* fall through: the page reports "nothing received" */ }
  return Response.redirect(new URL('./?shared=' + n, self.registration.scope).href, 303);
}

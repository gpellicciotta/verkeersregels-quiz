// Service Worker for Verkeersregels Quiz PWA
const CACHE_NAME = "verkeersquiz-v3.1.1-pre";

const PRECACHE_ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/app.js",
  "data/questions.json",
  "CHANGELOG.md",
  "favicon.ico",
  "assets/favicon.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-192.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon.png",
  "assets/signs/A11.svg",
  "assets/signs/A13.svg",
  "assets/signs/A14.svg",
  "assets/signs/A15.svg",
  "assets/signs/A17.svg",
  "assets/signs/A19.svg",
  "assets/signs/A1a.svg",
  "assets/signs/A1b.svg",
  "assets/signs/A1c.svg",
  "assets/signs/A1d.svg",
  "assets/signs/A21.svg",
  "assets/signs/A23.svg",
  "assets/signs/A25.svg",
  "assets/signs/A27.svg",
  "assets/signs/A29.svg",
  "assets/signs/A3.svg",
  "assets/signs/A31.svg",
  "assets/signs/A33.svg",
  "assets/signs/A35.svg",
  "assets/signs/A37.svg",
  "assets/signs/A39.svg",
  "assets/signs/A41.svg",
  "assets/signs/A43.svg",
  "assets/signs/A45.svg",
  "assets/signs/A47.svg",
  "assets/signs/A49.svg",
  "assets/signs/A5.svg",
  "assets/signs/A50.svg",
  "assets/signs/A51.svg",
  "assets/signs/A7a.svg",
  "assets/signs/A7b.svg",
  "assets/signs/A7c.svg",
  "assets/signs/A9.svg",
  "assets/signs/B1.svg",
  "assets/signs/B11.svg",
  "assets/signs/B13.svg",
  "assets/signs/B15.svg",
  "assets/signs/B17.svg",
  "assets/signs/B19.svg",
  "assets/signs/B21.svg",
  "assets/signs/B22.svg",
  "assets/signs/B23.svg",
  "assets/signs/B3.svg",
  "assets/signs/B5.svg",
  "assets/signs/B7.svg",
  "assets/signs/B9.svg",
  "assets/signs/C1.svg",
  "assets/signs/C11.svg",
  "assets/signs/C13.svg",
  "assets/signs/C15.svg",
  "assets/signs/C17.svg",
  "assets/signs/C19.svg",
  "assets/signs/C21.svg",
  "assets/signs/C22.svg",
  "assets/signs/C23.svg",
  "assets/signs/C24a.svg",
  "assets/signs/C24b.svg",
  "assets/signs/C24c.svg",
  "assets/signs/C25.svg",
  "assets/signs/C27.svg",
  "assets/signs/C29.svg",
  "assets/signs/C3.svg",
  "assets/signs/C31a.svg",
  "assets/signs/C31b.svg",
  "assets/signs/C33.svg",
  "assets/signs/C35.svg",
  "assets/signs/C37.svg",
  "assets/signs/C39.svg",
  "assets/signs/C41.svg",
  "assets/signs/C43-70.svg",
  "assets/signs/C43.svg",
  "assets/signs/C45.svg",
  "assets/signs/C46.svg",
  "assets/signs/C47.svg",
  "assets/signs/C5.svg",
  "assets/signs/C6.svg",
  "assets/signs/C7.svg",
  "assets/signs/C9.svg",
  "assets/signs/D10.svg",
  "assets/signs/D11.svg",
  "assets/signs/D13.svg",
  "assets/signs/D1a.svg",
  "assets/signs/D1b.svg",
  "assets/signs/D1c.svg",
  "assets/signs/D1d.svg",
  "assets/signs/D1e.svg",
  "assets/signs/D3.svg",
  "assets/signs/D4.svg",
  "assets/signs/D5.svg",
  "assets/signs/D7.svg",
  "assets/signs/D9.svg",
  "assets/signs/E1.svg",
  "assets/signs/E11.svg",
  "assets/signs/E3.svg",
  "assets/signs/E5.svg",
  "assets/signs/E7.svg",
  "assets/signs/E9a.svg",
  "assets/signs/E9b.svg",
  "assets/signs/E9c.svg",
  "assets/signs/E9d.svg",
  "assets/signs/E9e.svg",
  "assets/signs/E9f.svg",
  "assets/signs/E9g.svg",
  "assets/signs/E9h.svg",
  "assets/signs/E9i.svg",
  "assets/signs/E9j.svg",
  "assets/signs/F101a.svg",
  "assets/signs/F101b.svg",
  "assets/signs/F101c.svg",
  "assets/signs/F103.svg",
  "assets/signs/F105.svg",
  "assets/signs/F11.svg",
  "assets/signs/F111.svg",
  "assets/signs/F113.svg",
  "assets/signs/F117.svg",
  "assets/signs/F118.svg",
  "assets/signs/F119.svg",
  "assets/signs/F120.svg",
  "assets/signs/F12a.svg",
  "assets/signs/F12b.svg",
  "assets/signs/F13.svg",
  "assets/signs/F14.svg",
  "assets/signs/F15.svg",
  "assets/signs/F17.svg",
  "assets/signs/F18.svg",
  "assets/signs/F19.svg",
  "assets/signs/F1a.svg",
  "assets/signs/F1b.svg",
  "assets/signs/F21.svg",
  "assets/signs/F23a.svg",
  "assets/signs/F23b.svg",
  "assets/signs/F23c.svg",
  "assets/signs/F23d.svg",
  "assets/signs/F25.svg",
  "assets/signs/F27.svg",
  "assets/signs/F29.svg",
  "assets/signs/F31.svg",
  "assets/signs/F33a.svg",
  "assets/signs/F33b.svg",
  "assets/signs/F33c.svg",
  "assets/signs/F34a.svg",
  "assets/signs/F35.svg",
  "assets/signs/F37.svg",
  "assets/signs/F39.svg",
  "assets/signs/F3a.svg",
  "assets/signs/F3b.svg",
  "assets/signs/F41.svg",
  "assets/signs/F43.svg",
  "assets/signs/F45.svg",
  "assets/signs/F45b.svg",
  "assets/signs/F47.svg",
  "assets/signs/F49.svg",
  "assets/signs/F4a.svg",
  "assets/signs/F4b.svg",
  "assets/signs/F5.svg",
  "assets/signs/F50.svg",
  "assets/signs/F50bis.svg",
  "assets/signs/F51.svg",
  "assets/signs/F52.svg",
  "assets/signs/F52bis.svg",
  "assets/signs/F53.svg",
  "assets/signs/F55.svg",
  "assets/signs/F56.svg",
  "assets/signs/F57.svg",
  "assets/signs/F59.svg",
  "assets/signs/F60.svg",
  "assets/signs/F61.svg",
  "assets/signs/F62.svg",
  "assets/signs/F63.svg",
  "assets/signs/F65.svg",
  "assets/signs/F67.svg",
  "assets/signs/F69.svg",
  "assets/signs/F7.svg",
  "assets/signs/F71.svg",
  "assets/signs/F73.svg",
  "assets/signs/F75.svg",
  "assets/signs/F77.svg",
  "assets/signs/F79.svg",
  "assets/signs/F8.svg",
  "assets/signs/F81.svg",
  "assets/signs/F83.svg",
  "assets/signs/F85.svg",
  "assets/signs/F87.svg",
  "assets/signs/F89.svg",
  "assets/signs/F9.svg",
  "assets/signs/F91.svg",
  "assets/signs/F93.svg",
  "assets/signs/F95.svg",
  "assets/signs/F97.svg",
  "assets/signs/F98.svg",
  "assets/signs/F99a.svg",
  "assets/signs/F99b.svg",
  "assets/signs/F99c.svg",
  "assets/situations/sit-01-b5-stop.jpg",
  "assets/situations/sit-02-b17-voorrang-rechts.jpg",
  "assets/situations/sit-03-b1-haaientanden.jpg",
  "assets/situations/sit-04-b22-rechtsaf-rood.jpg",
  "assets/situations/sit-05-f49-zebrapad-fietser.jpg",
  "assets/situations/sit-06-b19-smalle-doorgang.jpg",
  "assets/situations/sit-07-kruispunt-drie-fietsers.jpg",
  "assets/situations/sit-08-licht-boven-bord.jpg",
  "assets/situations/sit-09-fietszone-f111.jpg",
  "assets/situations/sit-10-politieagent-halt.jpg",
  "assets/situations/sit-11-plaats-geen-fietspad.jpg",
  "assets/situations/sit-12-step-trottoir.jpg",
  "assets/situations/sit-13-bebouwde-kom-naast-elkaar.jpg",
  "assets/situations/sit-14-fietspad-d7-enkelrichting.jpg",
  "assets/situations/sit-15-kind-voetpad.jpg",
  "assets/situations/sit-16-voetganger-links-rijbaan.jpg",
  "assets/situations/sit-17-b9-voorrangsweg.jpg",
  "assets/situations/sit-18-b21-voorrang-tegenliggers.jpg",
  "assets/situations/sit-19-f19-beperkt-eenrichting.jpg",
  "assets/situations/sit-20-f4a-zone-30.jpg",
  "assets/situations/sit-21-rotonde-voorrang.jpg",
  "assets/situations/sit-22-overweg-slagbomen.jpg",
  "assets/situations/sit-23-voorsorteren-pijlen.jpg",
  "assets/situations/sit-24-fietssuggestiestrook.jpg",
  "assets/situations/sit-25-erf-woonerf-f12a.jpg",
  "assets/situations/sit-26-prioritair-voertuig.jpg",
  "assets/situations/sit-27-doorlopende-witte-streep.jpg",
  "assets/situations/sit-28-parkeren-trottoir-verbod.jpg",
  "assets/situations/sit-29-busstrook-f17.jpg",
  "assets/situations/sit-30-blindengeleidehond-oversteken.jpg",
  "assets/situations/sit-31-rechtsaf-fietser-voorrang.jpg",
  "assets/situations/sit-32-knipperlicht-beweegbare-brug.jpg",
  "assets/situations/sit-33-geel-knipperlicht-kruispunt.jpg",
  "assets/situations/sit-34-fietsopstelvak-f107.jpg",
  "assets/situations/sit-35-schoolstraat-c3.jpg",
  "assets/situations/sit-36-spitsstrook-matrixbord.jpg",
  "assets/situations/sit-37-tram-halte-uitstappen.jpg",
  "assets/situations/sit-38-bevoegd-persoon-arm-omhoog.jpg",
  "assets/situations/sit-39-afstand-inhalen-fietser.jpg",
  "assets/situations/sit-40-reddingsstrook-file.jpg",
];

// Install: precache all core assets and all traffic sign illustrations
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge any obsolete caches and claim existing clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: serve cached assets offline with cache-first and runtime fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Ignore cross-origin API calls (such as Google Apps Script or external docs)
  if (url.origin !== self.location.origin) {
    return;
  }

  // For navigation requests: try network first, fallback to cached index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match("index.html") || caches.match("./"))
    );
    return;
  }

  // For static assets: cache-first with network fallback and dynamic caching
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

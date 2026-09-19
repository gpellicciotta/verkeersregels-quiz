"""Generate sw.js with all precached assets."""

from pathlib import Path
import os

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
SIGNS_DIR = WORKTREE_ROOT / "assets" / "signs"
SITUATIONS_DIR = WORKTREE_ROOT / "assets" / "situations"
SW_PATH = WORKTREE_ROOT / "sw.js"

signs = sorted([f"assets/signs/{f}" for f in os.listdir(SIGNS_DIR) if f.endswith(".svg")])
situations = sorted([f"assets/situations/{f}" for f in os.listdir(SITUATIONS_DIR) if f.endswith(".jpg")]) if SITUATIONS_DIR.exists() else []

core_assets = [
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
]

all_assets = core_assets + signs + situations

sw_template = f"""// Service Worker for Verkeersregels Quiz PWA
const CACHE_NAME = "verkeersquiz-v2.0.3";

const PRECACHE_ASSETS = [
{chr(10).join(f'  "{a}",' for a in all_assets)}
];

// Install: precache all core assets and all traffic sign illustrations
self.addEventListener("install", (event) => {{
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
}});

// Activate: purge any obsolete caches and claim existing clients
self.addEventListener("activate", (event) => {{
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {{
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }})
      .then(() => self.clients.claim())
  );
}});

// Fetch: serve cached assets offline with cache-first and runtime fallback
self.addEventListener("fetch", (event) => {{
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {{
    return;
  }}

  const url = new URL(request.url);

  // Ignore cross-origin API calls (such as Google Apps Script or external docs)
  if (url.origin !== self.location.origin) {{
    return;
  }}

  // For navigation requests: try network first, fallback to cached index.html
  if (request.mode === "navigate") {{
    event.respondWith(
      fetch(request)
        .catch(() => caches.match("index.html") || caches.match("./"))
    );
    return;
  }}

  // For static assets: cache-first with network fallback and dynamic caching
  event.respondWith(
    caches.match(request).then((cachedResponse) => {{
      if (cachedResponse) {{
        return cachedResponse;
      }}
      return fetch(request).then((networkResponse) => {{
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {{
          return networkResponse;
        }}
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {{
          cache.put(request, responseToCache);
        }});
        return networkResponse;
      }});
    }})
  );
}});
"""

with open(SW_PATH, "w", encoding="utf-8") as f:
    f.write(sw_template)

print(f"Generated sw.js with {len(all_assets)} precached assets.")


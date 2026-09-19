#!/usr/bin/env python3
"""Generate service worker (sw.js) with all precached assets.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/generate_sw.py generate
  python scripts/generate_sw.py --version
  python scripts/generate_sw.py --help
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Add scripts directory to path to import _cli_common when run directly
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from _cli_common import build_action_parser, get_project_version, print_help, print_version

PROG = "generate_sw"
DESCRIPTION = "Generates sw.js precaching all core application assets, traffic signs, and situation photos."
ACTIONS = ["generate", "version", "help"]
DEFAULT_ACTION = "generate"
EXIT_CODES = [
    (0, "Success (sw.js generated successfully)"),
    (1, "Asset directories missing or write error"),
]

REPO_ROOT = SCRIPTS_DIR.parent
SIGNS_DIR = REPO_ROOT / "assets" / "signs"
SITUATIONS_DIR = REPO_ROOT / "assets" / "situations"
SW_PATH = REPO_ROOT / "sw.js"


def build_sw_content(version: str) -> str:
    """Generates the full sw.js content with dynamic version cache name and asset paths."""
    signs = sorted([f"assets/signs/{f}" for f in os.listdir(SIGNS_DIR) if f.endswith(".svg")]) if SIGNS_DIR.exists() else []
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
    cache_name = f"verkeersquiz-v{version}"

    formatted_assets = "\n".join(f'  "{a}",' for a in all_assets)

    return f"""// Service Worker for Verkeersregels Quiz PWA
const CACHE_NAME = "{cache_name}";

const PRECACHE_ASSETS = [
{formatted_assets}
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
""", len(all_assets)


def generate(version: str, verbose: bool = False) -> int:
    """Writes the updated sw.js file."""
    try:
        content, count = build_sw_content(version)
        SW_PATH.write_text(content, encoding="utf-8")
        if verbose:
            print(f"Target: {SW_PATH}")
            print(f"Cache name: verkeersquiz-v{version}")
            print(f"Precached assets: {count}")
        print(f"Generated sw.js with {count} precached assets (version v{version}).")
        return 0
    except OSError as exc:
        print(f"[!] Failed to write sw.js: {exc}", file=sys.stderr)
        return 1


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    args = parser.parse_args()

    if args.version or args.action == "version":
        print_version(PROG, version)
        return 0

    if args.help or args.action == "help":
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    return generate(version, verbose=args.verbose)


if __name__ == "__main__":
    sys.exit(main())

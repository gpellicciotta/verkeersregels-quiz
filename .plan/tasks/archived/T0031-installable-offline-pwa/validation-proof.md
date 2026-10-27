### Changes Made

- `manifest.webmanifest`: declared standalone PWA metadata, theme colors, and icons.
- `assets/favicon.svg`: replaced straight arrow with playful D5 roundabout sign.
- `assets/icons/`: generated full set of standard, maskable, and touch icons.
- `sw.js`: pre-cached 206 local assets (all 193 sign SVGs and core files) with cache-first and navigation fallbacks.
- `js/app.js`: added service worker registration, install prompt handling, offline indicator updates, and offline FIFO report queue.
- `index.html`: added PWA head links, `#offline-indicator` banner, and `#btn-install` button.
- `css/style.css`: styled offline indicator banner, install button, and standalone display mode.
- `tests/test_pwa.py`: automated test suite for manifest validity, icon sizes, and pre-cache coverage.
- `docs/requirements.md` & `CHANGELOG.md`: documented PWA installation and offline capabilities.

### Visual Validation

- [T0031-view-before.png](T0031-view-before.png): baseline desktop view with v2.0.0 start screen.
- [T0031-view-after.png](T0031-view-after.png): updated desktop view with D5 favicon and PWA integration.
- [T0031-view-result.png](T0031-view-result.png): full quiz flow showing perfect offline rendering of signs and scores.

### Verification Results

- `python -m unittest discover -s tests -v`: 15 of 15 tests passed cleanly with zero warnings.
- `node scratch/test_queue.js`: verified offline queue buffering, 50-item eviction, and FIFO drain.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0031-installable-offline-pwa.md`: 0 violations.
- `python ../dev-guidelines/scripts/lint-markdown.py tasks/T0031-installable-offline-pwa.md docs/requirements.md CHANGELOG.md`: 0 violations.

### Changes Made
- `index.html`: Added `#btn-share` round button in `.result-actions` and `#share-toast` notification element.
- `js/share.js`: Implemented `getSharePayload`, `copyToClipboard`, `showShareFeedback`, and `handleShare`.
- `js/dom.js`: Cached `btnShare` and `shareToast` DOM element references.
- `js/app.js`: Imported `handleShare` and bound click event listener to `el.btnShare`.
- `sw.js`: Added `"js/share.js"` to `PRECACHE_ASSETS` for complete offline PWA caching.
- `css/style.css`: Added styles for `.result-btn-round.btn-copied` and `.share-toast` (including error state).
- `data/strings.nl.json` & `data/strings.en.json`: Added localized strings for share button, titles, copy toasts, and templates.
- `tests/test_result_share.py`: Created automated regression test suite covering markup, modules, precaching, and i18n parity.

### Automated Verification
```bash
python -m pytest tests/
```
Result: 79 passed in 0.49s.

### Visual Validation Evidence
- Baseline start screen: [T0038-view-before.png](T0038-view-before.png)
- Desktop results screen with share button: [T0038-view-after.png](T0038-view-after.png)
- Result screen with copied toast feedback: [T0038-view-copied.png](T0038-view-copied.png)
- Mobile responsive results layout: [T0038-view-mobile.png](T0038-view-mobile.png)

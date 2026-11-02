### Changes Made

- `js/app.js`: `registerServiceWorker()` now listens for `controllerchange` and
  reloads once (loop-guarded), and calls `reg.update()` on an hourly interval
  and whenever the tab becomes visible again.
- `tests/test_sw_update.py`: new suite covering SW activation flags and the
  app-side reload/polling behavior.
- `CHANGELOG.md`, `docs/requirements.md`: documented the auto-activation behavior.

### Automated Verification

```bash
python -m unittest discover -s tests -v
```

Result: 58 passed (0 failed).

This project's existing test suite validates JS behavior via static source
assertions (no Selenium/Playwright dependency is present), so the new test
follows that same convention. No visual/DOM changes were made, so no
before/after screenshots apply; a local server smoke check confirmed
`index.html`, `js/app.js`, and `sw.js` still serve with HTTP 200 after the change.

### Changes Made

- `js/app.js`: added `PREFS_STORAGE_KEY`, `getStoredPreferences`, `setStoredPreferences`,
  `applyStoredPreferences`; persisted name/config/mode at their respective write points;
  called `applyStoredPreferences()` at startup before the initial `setStartMode` call;
  exported the three new functions on `window`.
- `tests/test_preferences_persistence.py`: new suite covering storage helpers, query-param
  precedence, write points, and startup ordering.
- `CHANGELOG.md`: added a `FrontEnd` bullet under `v3.1.1-pre`.

### Automated Verification

```bash
python -m pytest tests/ -q
```

Result: 55 passed (0 failed).

This project's existing test suite validates JS behavior via static source assertions
(no Selenium/Playwright dependency is present), so the new test follows that same
convention. No visual/DOM changes were made, so no before/after screenshots apply;
a local server smoke check confirmed `index.html` and `js/app.js` still serve with
HTTP 200 after the change.

### Changes Made

- `index.html`: unified `#modal-config` into three always-visible sections (`config-section-general`,
  `config-section-quiz`, `config-section-carousel`), each with a `.config-section-title` heading; added
  `#config-name`, `#config-language`, `#config-theme`, `#config-theme-color`; the pre-paint theme script now
  reads `localStorage` as a fallback layer between query params and the `system`/`blue` defaults.
- `css/style.css`: added `.config-section-title`, `.config-section + .config-section` divider, `.config-input`.
- `js/params.js`: added `getThemeQueryOverride()` / `getThemeColorQueryOverride()`.
- `js/preferences.js`: `applyStoredPreferences()` restores theme/theme-color from storage unless overridden
  by a query param.
- `js/dom.js`: registered the four new General-section element refs.
- `js/config-modal.js`: rewritten to always read/write all three sections; saving applies the theme
  immediately and re-runs the language-switch pipeline when the language selection changed.
- `data/strings.{nl,fr,de,it,en}.json`: new/renamed `config.*` keys, kept in parity across all five files.
- `tests/`: extended `test_preferences_persistence.py`, added `test_unified_settings.py`, updated two
  hardcoded-title assertions in `test_i18n.py` and `test_minimal_start_screen.py`.

### Visual Validation

Verified locally with a static HTTP server (`http.server`, HTTP 200) driven by Playwright, viewport 480x900/1100:

- Unified dialog shows "ALGEMEEN" (name/language/theme/color), then "ENKEL VOOR DE QUIZ", then
  "ENKEL VOOR DE CARROUSEL", each separated by a divider — both mode-specific sections visible regardless
  of the current start-screen mode.
- Changing name, theme, theme color, quiz count, and carousel delay and clicking "Opslaan" immediately
  re-themes the page and persists every field to `localStorage.verkeersquiz_preferences`.
- Reloading the page with no query parameters restores the saved name, theme, and theme color.

![Before (old per-mode dialog)](T0065-view-config-before.png)

![After (unified dialog)](T0065-view-config-after.png)

![After, scrolled to show all three sections](T0065-view-config-after-full.png)

### Automated Checks

- `python -m pytest tests/ -q`: 125 passed, 8 subtests passed.
- Manual Playwright smoke test: save → localStorage assertions → reload → restored-state assertions, all
  passed; no console/page errors.

### Review Tier

Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and visual verification
all passed, so this task integrates directly per the coordination protocol.

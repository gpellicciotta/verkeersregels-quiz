### Changes Made
- `js/config-view.js`: added `previewTheme` function, recorded `initialThemeSetting` and `initialThemeColor` on `openConfigView`, reverted them in `closeConfigView`, and updated them on `saveConfig`.
- `js/app.js`: wired `previewTheme` to `change` events on `el.configTheme` and `el.configThemeColor`, and exposed `previewTheme` on `window`.
- `tests/test_theme_and_color.py`: added unit test cases validating `previewTheme`, event listener bindings, and initial state revert.
- `tests/theme-preview-browser.cjs`: automated end-to-end browser verification of instant preview, close button revert, escape key revert, save persistence, and visual captures.
- `docs/requirements.md`: documented settings view instant theme preview and dismissal revert requirements.
- `CHANGELOG.md`: documented deliverable under `v3.5.1-pre`.

### Visual Validation
- Baseline Start Screen: ![Baseline View](T0073-view-before.png)
- Settings Modal: ![Settings Modal](T0073-config-before.png)
- Instant Dark + Red Preview: ![Dark + Red Preview](T0073-preview-dark-red.png)
- Reverted Start Screen: ![Reverted View](T0073-close-reverted.png)
- Saved Dark + Yellow Screen: ![Saved View](T0073-view-after.png)

### Test Verification
- All 157 pytest tests passed (`pytest` exited with code 0).
- Playwright browser test suite `tests/theme-preview-browser.cjs` passed with 0 page errors.

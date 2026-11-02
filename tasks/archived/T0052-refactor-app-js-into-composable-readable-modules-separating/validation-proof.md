### Changes Made

- `js/`: split the former single 1918-line `app.js` into `config.js`, `dom.js`,
  `state.js`, `params.js`, `utils.js`, `theme.js`, `preferences.js`,
  `report-queue.js`, `sheet.js`, `changelog.js`, `report-modal.js`,
  `screens.js`, `quiz.js`, `ui-mode.js`, `carousel.js`, `config-modal.js`,
  `pwa.js`, and a composition-root `app.js`.
- `index.html`: script tag changed to `type="module"`.
- `scripts/generate-sw.py`, `sw.js`: precache list now includes all JS modules.
- `tests/*.py`: 9 files updated to read all `js/*.js` files instead of only `app.js`.
- `docs/requirements.md`, `docs/devops.md`, `README.md`,
  `google-apps-script/Code.gs`, `CHANGELOG.md`: documentation updated to match.

### Automated Verification

```bash
python -m pytest tests/ -q
```

Result: 58 passed (0 failed).

### Manual/Visual Verification

No user-facing UI or layout changed, so no before/after screenshots apply.
Instead, a headless Chromium session (Playwright, installed to a scratch
directory and removed afterward) drove the app served over a local HTTP
server and confirmed, with zero console errors:

- Start screen renders title and question-count description.
- Starting a quiz renders the first question and progress indicator.
- `?view=about` shows the About screen with loaded changelog content.
- `?mode=carousel` renders a sign card and responds to `ArrowRight`.
- The configuration modal opens and closes via Save.

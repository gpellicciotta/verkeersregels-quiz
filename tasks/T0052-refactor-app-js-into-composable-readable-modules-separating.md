---
id: T0052
owner: "@claude"
needs: []
branch: task/T0052-refactor-app-js-into-composable-readable-modules-separating
worktree: ./work/T0052-refactor-app-js-into-composable-readable-modules-separating
status: completed
started: 2026-09-21
ended: 2026-09-21
---

# T0052: Refactor app.js into Composable, Readable Modules Separating State, Storage, and UI

## Goals

`js/app.js` had grown to 1918 lines mixing DOM references, quiz/carousel/config
state, localStorage persistence, network reporting, and UI wiring in one file,
making it hard to read or extend safely. Split it into focused native ES
modules under `js/` that separate state (`state.js`, `dom.js`), storage
(`preferences.js`, `report-queue.js`, `sheet.js`), and UI concerns (`quiz.js`,
`carousel.js`, `screens.js`, `ui-mode.js`, `config-modal.js`, `report-modal.js`,
`changelog.js`, `theme.js`, `pwa.js`), composed by a slim `app.js` entry point,
without changing any user-facing behavior.

## Task Execution Steps

- [x] **[Read]**      Reviewed the full 1918-line `js/app.js` and every test file asserting against its source text.
- [x] **[Decided]**    Split into 18 ES modules by concern (state/dom/storage/UI), keeping `app.js` as the composition root wiring event listeners and the init sequence.
- [x] **[Implement]**  Moved each function/constant into its target module with imports/exports, preserving exact code bodies.
- [x] **[Implement]**  Switched `index.html` to `<script type="module">` and updated `scripts/generate-sw.py` to precache all `js/*.js` files.
- [x] **[Verify]**     Updated static-source tests to scan all `js/*.js` files and ran the full suite plus a live headless-browser smoke test.
- [x] **[Doc]**        Updated `docs/requirements.md`, `docs/devops.md`, `README.md`, and `Code.gs` references from `js/app.js` to the correct module, and logged the changelog entry.

## Execution Log

- [2026-09-21] **[Decided]**
  Claimed task T0052; the existing test suite asserts against `js/app.js`
  source text via `Path.read_text()` + `assertIn`, so tests were updated to
  concatenate all `js/*.js` files rather than a single file, preserving intent.

- [2026-09-21] **[Implement]**
  Split `js/app.js` into `config.js`, `dom.js`, `state.js`, `params.js`,
  `utils.js`, `theme.js`, `preferences.js`, `report-queue.js`, `sheet.js`,
  `changelog.js`, `report-modal.js`, `screens.js`, `quiz.js`, `ui-mode.js`,
  `carousel.js`, `config-modal.js`, `pwa.js`, and a slim `app.js` composition
  root wiring event listeners, `checkAutoStart()`, and the startup sequence.
  - `allQuestions` became a live ES-module binding (`state.js`) with a
    `setAllQuestions()` setter, since importers cannot reassign an imported
    binding directly.
  - Two intentional module cycles (`screens.js` <-> `carousel.js`,
    `quiz.js` <-> `ui-mode.js`) are safe because all cross-cycle exports are
    hoisted `function` declarations only invoked from later event handlers.

- [2026-09-21] **[Implement]**
  Changed `index.html` to `<script type="module" src="js/app.js">` and updated
  `scripts/generate-sw.py` to glob `js/*.js` into `PRECACHE_ASSETS` instead of
  a hardcoded single file; regenerated `sw.js` (264 precached assets).

- [2026-09-21] **[Verify]**
  Updated the 9 test files that read `js/app.js` source text to instead
  concatenate all `js/*.js` files, keeping every existing assertion string
  unchanged. Ran `python -m pytest tests/ -q`: 58 passed.
  - Installed Playwright/Chromium in a scratch directory and drove the served
    app headlessly: start screen, quiz start + question render, `?view=about`
    changelog load, `?mode=carousel` navigation, and the config modal all
    worked with zero console errors.

- [2026-09-21] **[Doc]**
  Added a module-structure bullet to `docs/requirements.md`, repointed
  `CONFIG.SHEET_SECRET`/`SHEET_WEBAPP_URL` references in `docs/devops.md`,
  `docs/requirements.md`, `README.md`, and `google-apps-script/Code.gs` from
  `js/app.js` to `js/config.js`, and logged a `DevEx` bullet under
  `v3.1.1-pre` in `CHANGELOG.md`.

- [2026-09-21] **[Complete]**
  `js/app.js` is now an 18-module ES-module tree separating state, storage,
  and UI, with identical runtime behavior confirmed via automated tests and a
  live headless-browser walkthrough.

## Walkthrough & Validation

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

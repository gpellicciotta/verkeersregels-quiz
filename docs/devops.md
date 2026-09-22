# DevOps and Operations

Practical guidance on development environment setup, testing, validation, deployment, and operations for Verkeersregels Quiz.

---

## Prerequisites and Environment
- **Python**: Python 3.10 or higher (for test suites, linters, and dev scripts).
- **Node.js**: Node.js 22 or higher for executable service worker lifecycle regression tests.
- **Git**: Git 2.30 or higher supporting worktree isolation (`git worktree`).
- **Web Browser**: Any standard modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- **Static HTTP Server**: Python built-in `http.server` or any local static web server.

---

## Local Development and Setup
### Initial Bootstrap
To verify dependencies, validate repository structure, and execute the automated test suite in one step:

```bash
python scripts/bootstrap-dev-environment.py
```

### Running the Local Web Server
Because the quiz fetches `data/questions.json` and `CHANGELOG.md` via JavaScript `fetch()`, files must be served over HTTP rather than opened directly as `file://` to prevent browser CORS restrictions.

Start a local HTTP server from the repository root:

```bash
python -m http.server 8000
```

Open your browser and navigate to `http://localhost:8000`.

### Development URL Testing Hooks
The application includes URL query parameters to speed up development and visual testing:
- `http://localhost:8000/?autostart=1`: starts quiz round immediately without entering a player name.
- `http://localhost:8000/?autotest=results`: runs through all questions with perfect answers and opens results.
- `http://localhost:8000/?autotest=results-mixed`: runs through all questions with alternating answers to test imperfect scores.
- `http://localhost:8000/?view=about` (alias: `?about=1`): opens the dedicated full-window About view on load.
- `http://localhost:8000/?mode=carousel`: launches the traffic sign carousel view.
- `http://localhost:8000/?mode=carousel&delay=5` (alias: `?d=5`): configures carousel slide duration in seconds (default 8).
- `http://localhost:8000/?mode=carousel&pause=1`: pauses the carousel immediately on load.
- `http://localhost:8000/?q=10` (alias: `?quantity=10`): overrides the number of questions per round.
- `http://localhost:8000/?since=2021`: filters the question pool to regulations amended in or after 2021.
- `http://localhost:8000/?lang=fr`: forces the interface language (`nl`, `fr`, `de`, `en`; default `nl`).

---

## Testing and Quality Assurance
### Running Automated Unit Tests
Run the full test suite verifying question schemas, sign assets, UX layout, and PWA configuration:

```bash
python -m unittest discover -s tests -v
```

The test suite consists of 32 tests across five test modules:
- `tests/test_quiz_data.py`: verifies 304 questions, schemas, IDs, option counts, `since` years, authoritative URLs, and SVG assets.
- `tests/test_pwa.py`: verifies manifest integrity, icon dimensions, corner transparency, and service worker precaching completeness.
- `tests/test_sw_update.py`: executes lifecycle tests in Node and verifies asset fingerprints and startup ordering.
- `tests/test_ux_layout.py`: verifies desktop two-panel split, mobile floating action button, hidden option collapsing, and pill links.
- `tests/test_sign_carousel.py`: verifies carousel markup, timing controls, pause overlay, and keyboard navigation.
- `tests/test_about_view.py`: verifies About screen markup, version tag, sources presentation, start screen cleanup, and navigation.

### Quiz Cancellation Browser Checks
Install the optional browser test dependency locally, then run the review server in a separate terminal:

```bash
npm install --no-save --package-lock=false playwright
python -m http.server 8062 --bind 127.0.0.1
```

With Google Chrome installed, run:

```bash
node tests/quiz-cancel-browser.cjs
```

The test checks desktop and mobile cancellation, keyboard focus, dismissal paths, state reset, preferences, translations, and normal completion.
External requests are intercepted to prevent test scores from reaching Google Sheets.
Set `QUIZ_TEST_URL` to use a different local server address.
Use `--screenshots` to refresh task screenshots; `--baseline` captures the UI before implementation.

### Report Issue Browser Checks
With the review server from the previous section running, run:

```bash
node tests/report-issue-browser.cjs
```

The test checks the report button and its per-screen default context on the start,
quiz, carousel, result, and about screens, and from the settings modal.
External requests are intercepted to prevent test submissions from reaching Google Sheets.
Set `QUIZ_TEST_URL` to use a different local server address.
Use `--screenshots` to refresh task screenshots.

### Markdown and Task File Linting
Markdown documents and task files are validated using dev-guidelines tooling:

```bash
python ../dev-guidelines/scripts/lint-markdown.py LICENSE.md docs/index.md docs/requirements.md docs/devops.md CHANGELOG.md README.md TODO.md
python ../dev-guidelines/scripts/lint-taskfile.py TODO.md
```

---

## DevOps and Asset Tooling
All developer utilities live in `scripts/` and adhere strictly to CLI guidelines with `--version`, `--help`, `--verbose`, `--debug`, and `--log-file`:
- `scripts/bootstrap-dev-environment.py`: verifies environment readiness, repository structure, and runs test suites.
- `scripts/deploy-to-production.py`: verifies preconditions, then finalizes `CHANGELOG.md`, regenerates translated changelogs and `sw.js`, commits, and tags a release.
- `scripts/generate-sw.py`: dynamically scans all assets and writes `sw.js` with versioned cache keys and 227 precached assets.
- `scripts/translate-markdown.py`: translates `CHANGELOG.md` into `CHANGELOG.<lang>.md` overlays for the About view, chunking by heading and paragraph via Google Translate.
- `scripts/generate-pwa-icons.py`: renders transparent PNG and ICO icons via headless Chrome and Pillow.
- `scripts/fetch-belgian-signs.py`: downloads, verifies, and rate-limits Belgian traffic sign SVGs from Wikimedia Commons.

---

## Deployment to GitHub Pages
### Hosting Architecture
The quiz is hosted as a static web site on GitHub Pages directly from the `main` branch root. No build compilation or asset bundling is required.

### Installed App Updates
Service worker registration starts before language loading and does not depend on the window load event.
Visible, online clients check at startup, every minute, and on focus, page restoration, visibility restoration, or reconnection.
Checks bypass the browser's worker HTTP cache; installation downloads fresh assets before activating and reloading existing clients.
The initial installation does not reload the page.
Automatic reloads restart an active quiz; saved preferences remain intact.
Offline or suspended apps update after reconnecting or resuming, subject to browser scheduling and hosting propagation.
Older installations must first discover this release using their existing update behavior; closing and reopening may be necessary.

Every deployment must regenerate `sw.js`; the release script already does this.
Its cache key includes an asset-content fingerprint, so regenerated deployments detect changes even with an unchanged version.
Changing files without regenerating the worker does not trigger an update.

See the [update failure analysis](issues/pwa-update-stalls.md) for reproduction, browser verification, and screenshots.

### Deployment Pre-flight Checks
Before releasing, dry-run the release script to verify preconditions without changing anything:

```bash
python scripts/deploy-to-production.py deploy --dry-run
```

This verifies:
1. The git working tree has no uncommitted changes (`git status --porcelain`).
2. `CHANGELOG.md` has an active in-development version (a top heading ending in `-pre`).
3. All automated unit tests in `tests/` pass cleanly.
4. All project documentation passes markdown linting.

### Production Release Procedure
1. Ensure the working tree is clean and you are on the branch to release from (usually `main`).
2. Run the release script for real:
   ```bash
   python scripts/deploy-to-production.py deploy
   ```
   This re-runs the pre-flight checks above, then automatically:
   - Finalizes the active `-pre` heading in `CHANGELOG.md` to `[released: {{date}}]`.
   - Regenerates `CHANGELOG.en.md`, `CHANGELOG.fr.md`, `CHANGELOG.de.md`, and `CHANGELOG.it.md` (`scripts/translate-markdown.py generate --all`).
   - Regenerates service worker precache assets (`scripts/generate-sw.py generate`).
   - Commits `CHANGELOG.md`, its translated overlays, and `sw.js` with the message `Released v{{version}}.`.
   - Creates the local version tag (e.g. `git tag v3.0.0`).
3. Push the branch and tag printed by the script:
   ```bash
   git push origin main v3.0.0
   ```
4. GitHub Pages deploys the updated `main` branch automatically within about 2 minutes.
5. Add the next `-pre` heading to `CHANGELOG.md` for ongoing development and commit it.

By default the script only prints the step 3 push command; it never pushes on its own.
Pass `--push` to have it push immediately after tagging instead:

```bash
python scripts/deploy-to-production.py deploy --push
```

Passing `--push` on the command line **is** the explicit confirmation to publish — only use
it when you're ready for GitHub Pages to go live within minutes. `--dry-run` and `--push`
cannot be combined.

---

## Google Apps Script Operations
### Endpoint Configuration
Score logging and error reporting are handled by an external Google Apps Script Web App:
- Script source code is maintained in `google-apps-script/Code.gs`.
- The Web App URL is configured in `CONFIG.SHEET_WEBAPP_URL` in `js/config.js`.
- If `CONFIG.SHEET_WEBAPP_URL` is set to `null` or empty, client-side logging is disabled and the quiz operates in standalone offline mode.

### Abuse Mitigation Write Key
- The shared secret `CONFIG.SHEET_SECRET` is defined in `js/config.js` and verified in `Code.gs`.
- It acts as an abuse mitigation write key to prevent automated scrapers and bots from posting garbage entries to the Google Sheet.
- When updating the secret, change `SHARED_SECRET` in `Code.gs` and republish a new deployment revision of the Web App, then update `CONFIG.SHEET_SECRET` in `js/config.js`.

### Daily Summary Email
- `Code.gs` reads the `Resultaten` and `Meldingen` sheets and emails a summary via `sendDailySummaryEmail`.
- Two Apps Script time-driven triggers call `sendDailySummaryEmail` daily at 07:00 and 19:00 UTC.
- One-time setup in the deployed Apps Script project (not run automatically on code push):
  1. Paste the updated `Code.gs` into the Apps Script editor and save.
  2. Set `SUMMARY_EMAIL_TO` in the editor to the real recipient address; keep the checked-in
     placeholder (`PUT_YOUR_EMAIL_HERE@example.com`) in source control since `Code.gs` is public.
  3. Run `createDailySummaryTriggers` once from the editor to install the two triggers.
     Re-running it is safe: it first removes any existing `sendDailySummaryEmail` triggers.
  4. Authorize the script's Gmail/MailApp permission when prompted on first run.
- The pure aggregation logic (`buildSummaryEmail_`) is unit tested under Node; see
  `tests/gas-summary.test.cjs` and `tests/test_gas_summary.py`.

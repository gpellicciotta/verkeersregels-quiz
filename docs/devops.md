# DevOps and Operations

Practical guidance on development environment setup, testing, validation, deployment, and operations for Verkeersregels Quiz.

---

## Prerequisites and Environment

- **Python**: Python 3.10 or higher (for test suites, linters, and dev scripts).
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
- `http://localhost:8000/?mode=carousel&speed=5`: configures carousel slide duration in seconds.
- `http://localhost:8000/?mode=carousel&pause=1`: pauses the carousel immediately on load.
- `http://localhost:8000/?q=10` (alias: `?quantity=10`): overrides the number of questions per round.
- `http://localhost:8000/?since=2021`: filters the question pool to regulations amended in or after 2021.

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
- `tests/test_ux_layout.py`: verifies desktop two-panel split, mobile floating action button, hidden option collapsing, and pill links.
- `tests/test_sign_carousel.py`: verifies carousel markup, timing controls, pause overlay, and keyboard navigation.
- `tests/test_about_view.py`: verifies About screen markup, version tag, sources presentation, start screen cleanup, and navigation.

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
- `scripts/deploy-to-production.py`: verifies clean working tree, finalized release version, tests, and documentation linting.
- `scripts/generate-sw.py`: dynamically scans all assets and writes `sw.js` with versioned cache keys and 227 precached assets.
- `scripts/generate-pwa-icons.py`: renders transparent PNG and ICO icons via headless Chrome and Pillow.
- `scripts/fetch-belgian-signs.py`: downloads, verifies, and rate-limits Belgian traffic sign SVGs from Wikimedia Commons.

---

## Deployment to GitHub Pages

### Hosting Architecture

The quiz is hosted as a static web site on GitHub Pages directly from the `main` branch root. No build compilation or asset bundling is required.

### Deployment Pre-flight Checks

Before deploying a release to production, run the pre-flight verification script:

```bash
python scripts/deploy-to-production.py deploy --dry-run
```

This verifies:

1. The git working tree has no uncommitted changes (`git status --porcelain`).
2. The current version in `CHANGELOG.md` is a finalized release (does not end with `-pre`).
3. All automated unit tests in `tests/` pass cleanly.
4. All project documentation passes markdown linting.

### Production Release Procedure

1. Finalize the active version heading in `CHANGELOG.md`.
2. Regenerate service worker precache assets via `python scripts/generate-sw.py generate`.
3. Run automated tests and linters locally.
4. Commit all changes to the task branch and merge into `main`.
5. Create the version tag (e.g. `git tag v3.0.0`).
6. After explicit user confirmation, push `main` and tags to GitHub:
   ```bash
   git push origin main --tags
   ```
7. GitHub Pages deploys the updated `main` branch automatically.

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

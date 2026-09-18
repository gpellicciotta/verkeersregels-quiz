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

Open your browser and navigate to:

```text
http://localhost:8000
```

### Development URL Testing Hooks

The application includes URL query parameters to speed up development and visual testing:

- `http://localhost:8000/?autostart=1`: starts round immediately without entering a player name.
- `http://localhost:8000/?autotest=results`: runs through all 20 questions with perfect answers and opens results.
- `http://localhost:8000/?autotest=results-mixed`: runs through all questions with alternating answers to test imperfect scores.
- `http://localhost:8000/?modal=changelog`: automatically opens the changelog modal on page load.
- `http://localhost:8000/?since=2021`: filters the question pool to regulations amended in or after 2021.

---

## Testing and Quality Assurance

### Running Automated Unit Tests

Run the test suite verifying question schemas, sign assets, and legal metadata:

```bash
python -m unittest discover tests
# or run specifically:
python -m unittest tests.test_quiz_data
```

The test suite automatically verifies:

- Total count of 63 questions in `data/questions.json`.
- Non-empty, unique, kebab-case question IDs.
- Required fields (`id`, `type`, `category`, `question`, `options`, `correctIndex`, `explanation`).
- Option counts (`>= 2`) and valid `correctIndex` within range.
- Valid integer `since` years within the modern traffic legislation era (1968–2026).
- Existence and XML parsing validity of all sign SVG files.
- Absence of unshown sign references in question prompts.

### Markdown and Task File Linting

Markdown and task file formatting can be validated using the dev-guidelines tooling:

```bash
python C:\Dev-Projects\dev-guidelines\scripts\lint-markdown.py LICENSE.md docs/index.md docs/requirements.md docs/devops.md CHANGELOG.md tasks/T0003-release-v1-0-0.md
python C:\Dev-Projects\dev-guidelines\scripts\lint-taskfile.py tasks/T0003-release-v1-0-0.md
```

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
2. The current version in `js/app.js` is a finalized release (does not end with `-pre`).
3. All automated unit tests in `tests/` pass cleanly.

### Production Release Procedure

1. Finalize the active version string in `js/app.js`, `index.html`, and `CHANGELOG.md`.
2. Run automated tests and linters locally.
3. Commit all changes to the task branch and merge into `main`.
4. Create the version tag (e.g. `git tag v1.0.0`).
5. After explicit confirmation, push `main` and tags to GitHub:
   ```bash
   git push origin main --tags
   ```
6. GitHub Pages deploys the updated `main` branch automatically.

---

## Google Apps Script Operations

### Endpoint Configuration

Score logging and error reporting are handled by an external Google Apps Script Web App:

- Script source code is maintained in `google-apps-script/Code.gs`.
- The Web App URL is configured in `CONFIG.SHEET_WEBAPP_URL` in `js/app.js`.
- If `CONFIG.SHEET_WEBAPP_URL` is set to `null` or empty, client-side logging is disabled and the quiz operates in standalone offline mode.

### Abuse Mitigation Write Key

- The shared secret `CONFIG.SHEET_SECRET` is defined in `js/app.js` and verified in `Code.gs`.
- It acts as an abuse mitigation write key to prevent automated scrapers and bots from posting garbage entries to the Google Sheet.
- When updating the secret, change `SHARED_SECRET` in `Code.gs` and republish a new deployment revision of the Web App, then update `CONFIG.SHEET_SECRET` in `js/app.js`.

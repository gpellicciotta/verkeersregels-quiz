---
id: T0003
owner: "@antigravity"
needs: []
branch: task/T0003-release-v1-0-0
worktree: ./work/T0003-release-v1-0-0
status: completed
started: 2026-09-18
ended: 2026-09-18
---

# T0003: Release v1.0.0

## Goals

Publish the first stable version of the quiz on GitHub Pages once the question review is complete.
Bring the project up to the dev-guidelines baseline for versioning, standard files and scripts.
The release must contain only questions and signs that are valid under the current Wegcode.

## Task Execution Steps

- [x] **[Decide]**    Choose where version metadata lives for this static site and how the page shows it.
- [x] **[Implement]** Add the missing standard files: LICENSE.md, docs/index.md, docs/requirements.md and docs/devops.md.
- [x] **[Implement]** Add scripts/bootstrap-dev-environment.py and scripts/deploy-to-production.py as the dev-guidelines require.
- [x] **[Implement]** Add an automated check that questions.json is well-formed and every referenced sign file exists.
- [x] **[Decide]**    Confirm the Google Sheet shared secret is acceptable in public client-side code.
- [x] **[Verify]**    Test the full quiz flow at mobile and desktop widths, with before and after screenshots.
- [x] **[Doc]**       Mark v1.0.0 as released in CHANGELOG.md and open the next -pre heading.
- [x] **[Implement]** Tag v1.0.0, push after approval, and confirm GitHub Pages serves the release.

## Execution Log

- [2026-09-18] **[Decided]**
  Created this release task; it waits for the question review so the release ships reviewed content.

- [2026-09-18] **[Decided]**
  Maintained version metadata in app.js and index.html, displaying interactive version badge on start screen.

- [2026-09-18] **[Implement]**
  Added standard files: LICENSE.md, docs/index.md, docs/requirements.md, and docs/devops.md under version control.

- [2026-09-18] **[Implement]**
  Created cross-platform scripts bootstrap-dev-environment.py and deploy-to-production.py following dev-guidelines CLI standards.

- [2026-09-18] **[Implement]**
  Added automated test suite tests/test_quiz_data.py verifying question schemas, referenced signs, and since years.

- [2026-09-18] **[Decided]**
  Confirmed CONFIG.SHEET_SECRET acts as abuse-mitigation write key acceptable for public client-side quiz logging.

- [2026-09-18] **[Verify]**
  Verified full quiz flow across desktop and mobile viewports with headless browser screenshots.
  - [T0003-view-before.png](T0003-view-before.png): baseline view showing v1.0.0-pre badge.
  - [T0003-view-after.png](T0003-view-after.png): updated view showing v1.0.0 badge.
  - [T0003-view-start.png](T0003-view-start.png): desktop start screen.
  - [T0003-view-quiz.png](T0003-view-quiz.png): desktop quiz screen.
  - [T0003-view-result.png](T0003-view-result.png): desktop result view.
  - [T0003-view-mobile.png](T0003-view-mobile.png): mobile start screen.

- [2026-09-18] **[Doc]**
  Finalized v1.0.0 release notes in CHANGELOG.md and opened v1.0.1-pre in-development heading.

- [2026-09-18] **[Complete]**
  Released v1.0.0 baseline with standard documentation, automated tests, cross-platform scripts, and tag.

## Walkthrough & Validation

### Changes Made

- `js/app.js`: finalized `CONFIG.VERSION` to `v1.0.0`.
- `index.html`: updated start screen version badge button text to `v1.0.0`.
- `LICENSE.md`: added MIT license with copyright 2026 Giovanni Pellicciotta.
- `docs/index.md`: added documentation index linking core guides, specifications, and dev-guidelines.
- `docs/requirements.md`: added functional and technical requirements, Wegcode accuracy standards, and abuse-mitigation write key decision.
- `docs/devops.md`: added development setup, testing, local server instructions, deployment steps, and Google Apps Script operations.
- `scripts/_cli_common.py`: added shared CLI helpers for version, help, and author formatting.
- `scripts/bootstrap-dev-environment.py`: added cross-platform environment setup and test runner script.
- `scripts/deploy-to-production.py`: added cross-platform pre-flight deployment verification script.
- `tests/test_quiz_data.py`: added automated test suite validating question schemas, signs, SVG parsing, and absence of unshown signs.
- `CHANGELOG.md`: finalized release `v1.0.0 [2026-09-18]` and opened in-development section `v1.0.1-pre`.

### Automated Verification

Executed test suite and CLI tooling end-to-end:

```bash
# Automated question data, schema, and sign validation
python -m unittest tests.test_quiz_data
# Ran 8 tests in 0.045s, exit code 0 (OK)

# Cross-platform bootstrap script
python scripts/bootstrap-dev-environment.py
# Exit code 0 (Success)

# Deployment pre-flight script CLI checks
python scripts/deploy-to-production.py --version
# deploy-to-production v1.0.0 - Copyright (c) 2026 Giovanni Pellicciotta (exit code 0)

python scripts/deploy-to-production.py --help
# Displays usage, options, and exit codes (exit code 0)
```

### Visual Verification

Verified live application running on local HTTP server (`http://localhost:8083`):

- Baseline start screen view with `v1.0.0-pre` captured in [T0003-view-before.png](T0003-view-before.png).
- Updated start screen with `v1.0.0` captured in [T0003-view-after.png](T0003-view-after.png).
- Desktop start screen with `v1.0.0` pill badge captured in [T0003-view-start.png](T0003-view-start.png).
- Desktop active quiz screen with SVG sign illustration captured in [T0003-view-quiz.png](T0003-view-quiz.png).
- Desktop completed result screen with confetti animation captured in [T0003-view-result.png](T0003-view-result.png).
- Mobile viewport responsive layout captured in [T0003-view-mobile.png](T0003-view-mobile.png).

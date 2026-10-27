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

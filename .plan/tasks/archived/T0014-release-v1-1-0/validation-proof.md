### Changes Made

- `js/app.js`: updated `CONFIG.VERSION` to `v1.1.0`.
- `index.html`: updated start screen version badge button text to `v1.1.0`.
- `CHANGELOG.md`: finalized `## v1.1.0 [2026-09-18]` and opened `## v1.1.1-pre`.
- `tasks/T0014-view-before.png`: baseline start screen screenshot showing `v1.0.0` version badge.
- `tasks/T0014-view-after.png`: updated start screen screenshot showing `v1.1.0` version badge.
- `tasks/T0014-release-v1-1-0.md`: documented release steps, verification evidence, and completion log.

### Visual Validation

Visual checks on the start screen confirmed the version badge transition:

- Baseline start screen view with `v1.0.0` captured in [T0014-view-before.png](T0014-view-before.png).
- Updated start screen view with `v1.1.0` captured in [T0014-view-after.png](T0014-view-after.png).
- Local web server returned HTTP 200 for all quiz assets.

![Baseline Start Screen with v1.0.0](T0014-view-before.png)

![Updated Start Screen with v1.1.0](T0014-view-after.png)

### Automated Verification

Executed test suite and CLI tooling end-to-end:

```bash
# Automated question data, schema, and sign validation
python -m pytest tests/
# 9 passed in 0.09s, exit code 0

# Cross-platform bootstrap script
python scripts/bootstrap-dev-environment.py
# Exit code 0 (Success)

# Deployment pre-flight script CLI checks
python scripts/deploy-to-production.py --version
# deploy-to-production v1.1.0 - Copyright (c) 2026 Giovanni Pellicciotta (exit code 0)

python scripts/deploy-to-production.py --help
# Displays usage, options, and exit codes (exit code 0)

# Taskfile and markdown linters
python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0014-release-v1-1-0.md
python ../dev-guidelines/scripts/lint-markdown.py CHANGELOG.md tasks/T0014-release-v1-1-0.md
```

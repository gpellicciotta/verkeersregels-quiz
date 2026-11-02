### Changes Made

- `js/app.js`:
  - Refactored `submitErrorReport(targetQuestion, remark)` to capture the exact question snapshot and execute background `fetch` with `.catch(console.error)`.
  - Refactored `handleReportSubmit(e)` to synchronously close the modal (`closeReportModal()`) immediately upon submission, eliminating all UI lag.

### Verification Results

- `python -m unittest discover -s tests -v`: 9 of 9 tests passed cleanly.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0027-asynchronous-error-reporting-zero-lag.md`: 0 violations.
- `python ../dev-guidelines/scripts/lint-markdown.py tasks/T0027-asynchronous-error-reporting-zero-lag.md`: 0 violations.

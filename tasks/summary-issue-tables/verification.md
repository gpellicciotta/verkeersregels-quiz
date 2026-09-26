# Summary Issue Table Verification

Direct user request implemented in the primary checkout without allocating a backlog task.

## Behavior
Recent reports now use date, reporter, question, and remark columns in the HTML email.
Frequently reported questions use question and report-count columns, retaining the existing ranking and latest-three fallback.
Missing fields receive readable placeholders; all submitted text is escaped before rendering.
Empty tables retain their headers and show `(geen)`.

## Visual Verification
Inspected desktop and mobile screenshots before and after implementation using synthetic reports.
Both layouts show actual email content, readable tables, correct row order, and unchanged player statistics.
- Desktop: [before](before-1000.png) and [after](after-1000.png).
- Mobile: [before](before-375.png) and [after](after-375.png).
- Saved HTML: [before](before.html) and [after](after.html).

## Execution Evidence
- `node tests/gas-summary-browser.cjs --issues --baseline`: PID 25040; exit 0; desktop and mobile passed.
- `node tests/gas-summary-browser.cjs --issues`: PID 27820; exit 0; desktop and mobile passed.
- Browser output confirmed HTTP 200, visible email, no overflow, and no browser errors at both widths.
- `node --test tests/gas-summary.test.cjs`: exit 0; all 21 tests passed.
- `python -m unittest tests.test_gas_summary tests.test_js_jsdoc`: exit 0; all seven checks passed.
- Initial test failures came from extra arguments in three new test calls; correcting those calls resolved the failures.

Tests cover sorting, frequency counts, unique-question fallback, HTML escaping, empty tables, and missing fields.
The review server remains available on port 8062, PID 10328, at `/tasks/summary-issue-tables/after.html`.
Browser validation used headless Chrome; no live email was sent and no Apps Script deployment was changed.

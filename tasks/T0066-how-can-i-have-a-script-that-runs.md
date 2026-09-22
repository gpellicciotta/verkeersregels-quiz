---
id: T0066
owner: "@claude"
needs: []
branch: task/T0066-how-can-i-have-a-script-that-runs
worktree: ./work/T0066-how-can-i-have-a-script-that-runs
status: completed
started: 2026-09-22
ended: 2026-09-22
---

# T0066: Daily Summary Email of Quiz Results and Reported Issues

## Goals
Add a script that runs automatically at 07:00 and 19:00 UTC every day, reads the
`Resultaten` and `Meldingen` sheets, and emails a summary covering total and 24h/7d play
counts, average questions/duration/score, issue counts, the 3 latest issues, the 3
most-reported question contexts, and 24h/7d stats for the `Noah`/`Noahp` players. The
sheets already live behind the existing Google Apps Script Web App (`google-apps-script/Code.gs`),
so the scheduling and mailing should live there too rather than adding new infrastructure,
credentials, or a hosting requirement.

## Task Execution Steps
- [x] **[Read]**      Inspect `Code.gs`, `js/sheet.js`, `js/report-queue.js`, and the `docs/` for the existing sheet schema.
- [x] **[Decide]**    Pick Apps Script time-driven triggers + `MailApp` over a new external cron/service.
- [x] **[Implement]** Add `sendDailySummaryEmail`, `buildSummaryEmail_`, and `createDailySummaryTriggers` to `Code.gs`.
- [x] **[Implement]** Extract the sheet-header constants so `doPost` and the summary reader share one source.
- [x] **[Verify]**    Unit test the pure aggregation and trigger setup under Node; run the full pytest suite.
- [x] **[Doc]**       Document the one-time trigger setup and recipient configuration in `docs/devops.md`.
- [x] **[Doc]**       Add the feature to `docs/requirements.md` and record a `CHANGELOG.md` entry.

## Execution Log
- [2026-09-22] **[Decided]**
  Claimed T0066 to add a twice-daily (07:00/19:00 UTC) summary email built from the existing `Resultaten`/`Meldingen` sheets.

- [2026-09-22] **[Read]**
  Confirmed `Resultaten` only receives non-anonymous plays (`js/sheet.js` skips submission without
  `state.playerName`), so no extra filtering is needed. `Meldingen`'s "context" is the reported
  question, optionally omitted via the report-error dialog's toggle.

- [2026-09-22] **[Decided]**
  Used Apps Script time-driven triggers + `MailApp` inside `Code.gs`, not a new Python/cron
  script: the sheets are already Apps Script-owned, and this static-site project has no server
  to host an external scheduler on.

- [2026-09-22] **[Decided]**
  Kept `SUMMARY_EMAIL_TO` as a checked-in placeholder (`PUT_YOUR_EMAIL_HERE@example.com`) rather
  than a real address, since `Code.gs` is public source code and an email address is private data.
  Documented setting the real address directly in the deployed Apps Script project in `docs/devops.md`.

- [2026-09-22] **[Implement]**
  `Code.gs`: added the summary pipeline — headers, `readSheetRows_`, row mappers, pure
  `buildSummaryEmail_`, `sendDailySummaryEmail`, and idempotent `createDailySummaryTriggers`;
  `doPost` now shares the header constants.

- [2026-09-22] **[Verify]**
  Added `tests/gas-summary.test.cjs` (9 `node --test` cases covering windowing, averages, context
  ranking, and `Noah`/`Noahp` tracking) and `tests/test_gas_summary.py` running it plus two source
  guards. `python -m pytest -q`: 128 passed, 8 subtests passed.

- [2026-09-22] **[Doc]**
  Documented the one-time Apps Script editor setup in `docs/devops.md`, added a "Daily Summary
  Email" bullet list to `docs/requirements.md`, and recorded a `BackEnd` bullet in `CHANGELOG.md`.

- [2026-09-22] **[Complete]**
  `Code.gs` now emails a results/issues summary at 07:00 and 19:00 UTC daily once
  `createDailySummaryTriggers` is run once in the deployed Apps Script project.

## Walkthrough & Validation

### Changes Made
- `google-apps-script/Code.gs`: added the daily summary email (see Execution Log for the full
  function list); `doPost` behavior for `Resultaten`/`Meldingen` writes is unchanged.
- `tests/gas-summary.test.cjs`, `tests/test_gas_summary.py`: new automated coverage (see above).
- `docs/devops.md`, `docs/requirements.md`, `CHANGELOG.md`: documented the new operational feature.

### Automated Checks
- `node --test tests/gas-summary.test.cjs`: 9/9 passed.
- `python -m pytest -q`: 128 passed, 8 subtests passed.

### Manual/Visual Validation
Not applicable: this is a backend-only Apps Script change with no UI surface. The email body
format was validated through the automated `node --test` fixtures above (regex-matched exact
line output for each summary section) rather than a live send, since sending requires the
deployed Apps Script project's authorized Gmail scope, which is outside this repository.

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and
documentation all passed, so this task integrates directly per the coordination protocol.

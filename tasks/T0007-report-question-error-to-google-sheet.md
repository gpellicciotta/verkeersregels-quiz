---
id: T0007
owner: "@antigravity"
needs: []
branch: task/T0007-report-question-error-to-google-sheet
worktree: ./work/T0007-report-question-error-to-google-sheet
status: active
started: 2026-09-18
ended: —
---

# T0007: Report Question Error to Google Sheet

## Goals

Enable players to report errors or ambiguities directly from any quiz question screen.
Store question error reports in a dedicated Meldingen tab in the Google Sheet.
Explain the error reporting button and icon on the quiz start page.
Provide a clean, unobtrusive reporting modal with immediate feedback.

## Task Execution Steps

- [ ] **[Read]**      Inspect question screen layout in index.html and Google Apps Script handling in Code.gs.
- [ ] **[Implement]** Add a report error button on each quiz question screen in index.html and app.js.
- [ ] **[Implement]** Add an explanatory note on the start screen detailing how to report question errors.
- [ ] **[Implement]** Handle error reporting submissions in app.js and store in Meldingen tab in Code.gs.
- [ ] **[Verify]**    Verify error reporting modal flow and start screen explanation with before and after screenshots.
- [ ] **[Doc]**       Document error reporting workflow in README.md and record validation in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to enable question error reporting directly from the quiz to a separate Google Sheet tab.

## Walkthrough & Validation

### Scope & Criteria

- Report button / icon visible on `#screen-quiz` during active question.
- Reporting modal or inline prompt allowing optional remarks.
- Webhook submission sending question details to Google Apps Script.
- `google-apps-script/Code.gs` writes to a separate sheet tab named `Meldingen`.
- Explanation of reporting icon on start screen.
- Visual screenshots showing the button, reporting dialog, and start screen explanation.

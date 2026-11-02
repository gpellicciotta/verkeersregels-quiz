---
id: T0007
owner: "@antigravity"
needs: []
branch: task/T0007-report-question-error-to-google-sheet
worktree: ./work/T0007-report-question-error-to-google-sheet
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0007: Report Question Error to Google Sheet

## Goals

Enable players to report errors or ambiguities directly from any quiz question screen.
Store question error reports in a dedicated Meldingen tab in the Google Sheet.
Explain the error reporting button and icon on the quiz start page.
Provide a clean, unobtrusive reporting modal with immediate feedback.

## Task Execution Steps

- [x] **[Read]**      Inspect question screen layout in index.html and Google Apps Script handling in Code.gs.
- [x] **[Implement]** Add a report error button on each quiz question screen in index.html and app.js.
- [x] **[Implement]** Add an explanatory note on the start screen detailing how to report question errors.
- [x] **[Implement]** Handle error reporting submissions in app.js and store in Meldingen tab in Code.gs.
- [x] **[Verify]**    Verify error reporting modal flow and start screen explanation with before and after screenshots.
- [x] **[Doc]**       Document error reporting workflow in README.md and record validation in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to enable question error reporting directly from the quiz to a separate Google Sheet tab.

- [2026-09-18] **[Read]**
  Inspected question screen layout in index.html and Google Apps Script handling in Code.gs.

- [2026-09-18] **[Implement]**
  Added start screen explanation box detailing the question error reporting feature and flag button.

- [2026-09-18] **[Implement]**
  Added report button in the quiz header and designed a clean question error reporting modal.
  - Added backdrop overlay, question summary, remark textarea, and confirmation message.
  - Implemented keyboard and backdrop dismiss triggers.

- [2026-09-18] **[Implement]**
  Implemented report error webhook submissions in app.js and dedicated Meldingen tab logging in Code.gs.

- [2026-09-18] **[Verify]**
  Verified modal interaction flow and captured baseline, updated quiz, modal, and start screen screenshots.
  - T0007-view-before.png: baseline quiz screen without report button.
  - T0007-view-after.png: quiz screen with header report button.
  - T0007-modal.png: question error report modal open.
  - T0007-start-view.png: start screen explanation box.

- [2026-09-18] **[Doc]**
  Documented question error reporting and Google Sheet Meldingen tab structure in README.md.

- [2026-09-18] **[Complete]**
  Delivered question error reporting button, modal interaction flow, and Google Sheet Meldingen tab storage.

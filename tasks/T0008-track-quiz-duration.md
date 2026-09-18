---
id: T0008
owner: "@antigravity"
needs: []
branch: task/T0008-track-quiz-duration
worktree: ./work/T0008-track-quiz-duration
status: active
started: 2026-09-18
ended: —
---

# T0008: Track Quiz Duration

## Goals

Track total elapsed time from starting the quiz to viewing results.
Display the completed duration cleanly on the results screen and in printouts.
Transmit the duration to the Google Sheet backend alongside the player score.
Update the Google Apps Script handler to persist duration records.

## Task Execution Steps

- [ ] **[Read]**      Inspect quiz lifecycle in js/app.js and sheet endpoint in google-apps-script/Code.gs.
- [ ] **[Implement]** Track quiz start and completion timestamps in state and format elapsed duration.
- [ ] **[Implement]** Display the elapsed quiz duration on the results screen in index.html and app.js.
- [ ] **[Implement]** Send duration in sheet payload and update google-apps-script/Code.gs headers and row values.
- [ ] **[Verify]**    Verify duration tracking and payload submission with before and after screenshots.
- [ ] **[Doc]**       Document duration tracking in README.md and record validation in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to measure quiz duration, display it on results screen, and store it in Google Sheet.

## Walkthrough & Validation

### Scope & Criteria

- Timestamp recorded when quiz starts and stops when results are shown.
- Formatted duration (e.g., "1 min 24 sec" or "01:24") displayed in `#result-summary` or dedicated badge.
- Duration in seconds and formatted duration sent to Google Sheet webhook.
- `google-apps-script/Code.gs` updated to append duration column.
- Visual proof of results screen showing duration.

---
id: T0049
owner: "@claude"
needs: []
branch: task/T0049-persist-player-name-and-configuration-choices-in-localstorage
worktree: ./work/T0049-persist-player-name-and-configuration-choices-in-localstorage
status: completed
started: 2026-09-21
ended: 2026-09-21
---

# T0049: Persist Player Name and Configuration Choices in LocalStorage

## Goals

Remember the player's name and their quiz/carousel configuration choices across
sessions using `localStorage`, so returning players do not have to re-enter them.
Existing query parameter overrides (`name`/`naam`/`n`, `q`/`quantity`, `type`/`t`,
`since`/`sinds`/`s`) must keep taking precedence over any stored value, matching
the task title. Mode selection (quiz vs. carousel) is stored only when chosen
directly through the UI, not when driven by a query parameter or auto-start flow.

## Task Execution Steps

- [x] **[Read]**      Reviewed `js/app.js` state, config modal, and existing query-param helpers.
- [x] **[Implement]** Added `getStoredPreferences`/`setStoredPreferences`/`applyStoredPreferences` helpers.
- [x] **[Implement]** Persisted player name on quiz start and config choices on modal save.
- [x] **[Implement]** Restored stored preferences at startup, deferring to query params.
- [x] **[Verify]**    Ran the automated test suite and a local server smoke check.
- [x] **[Doc]**       Recorded changelog entry and this task file.

## Execution Log

- [2026-09-21] **[Decided]**
  Claimed task T0049 to persist player name and configuration choices in localStorage.

- [2026-09-21] **[Implement]**
  Added `PREFS_STORAGE_KEY` (`verkeersquiz_preferences`) with `getStoredPreferences`,
  `setStoredPreferences`, and `applyStoredPreferences` helpers in `js/app.js`.
  - `applyStoredPreferences` restores player name, quiz count/type/since, carousel
    delay/since, and mode, each only when no matching query param already applies.

- [2026-09-21] **[Implement]**
  Wired persistence into write points: `startQuiz()` saves the player name, `saveConfig()`
  saves quiz and carousel settings, and `setStartMode(mode, persist)` saves mode only
  when called from direct radio/card/toggle user interaction.

- [2026-09-21] **[Verify]**
  Ran `python -m pytest tests/ -q`: 55 passed (47 pre-existing plus 8 new).
  Started a local server and confirmed `index.html` and `js/app.js` return HTTP 200.

- [2026-09-21] **[Doc]**
  Recorded a `FrontEnd` bullet under the active `v3.1.1-pre` section in `CHANGELOG.md`.

- [2026-09-21] **[Complete]**
  Player name and configuration choices now persist in localStorage, with query
  parameter overrides preserved.

## Walkthrough & Validation

### Changes Made

- `js/app.js`: added `PREFS_STORAGE_KEY`, `getStoredPreferences`, `setStoredPreferences`,
  `applyStoredPreferences`; persisted name/config/mode at their respective write points;
  called `applyStoredPreferences()` at startup before the initial `setStartMode` call;
  exported the three new functions on `window`.
- `tests/test_preferences_persistence.py`: new suite covering storage helpers, query-param
  precedence, write points, and startup ordering.
- `CHANGELOG.md`: added a `FrontEnd` bullet under `v3.1.1-pre`.

### Automated Verification

```bash
python -m pytest tests/ -q
```

Result: 55 passed (0 failed).

This project's existing test suite validates JS behavior via static source assertions
(no Selenium/Playwright dependency is present), so the new test follows that same
convention. No visual/DOM changes were made, so no before/after screenshots apply;
a local server smoke check confirmed `index.html` and `js/app.js` still serve with
HTTP 200 after the change.

---
id: T0047
owner: "@claude"
needs: []
branch: task/T0047-keep-start-page-intro-sentence-static-during-mode
worktree: ./work/T0047-keep-start-page-intro-sentence-static-during-mode
status: completed
started: 2026-09-21
ended: 2026-09-21
---

# T0047: Keep Start Page Intro Sentence Static During Mode and Configuration Changes

## Goals

Stop the start screen intro sentence (`#start-desc`) from being rewritten with mode- or
config-specific detail. Carousel mode overwrote it with dynamic sign counts and "since" year
text on every mode switch and config save, while quiz mode already kept it static.
Make the sentence identical across quiz mode, carousel mode, and any configuration change.

## Task Execution Steps

- [x] **[Read]**      Trace `#start-desc` writes in `js/app.js` to find the dynamic carousel branch.
- [x] **[Implement]** Set the static intro sentence once, unconditionally, and remove the dynamic overwrite.
- [x] **[Verify]**    Run automated tests and a headless-browser check across mode toggle and config save.
- [x] **[Doc]**       Record changelog entry and this task file.

## Execution Log

- [2026-09-21] **[Decided]**
  Claimed task T0047 to keep the start page intro sentence static during mode and configuration changes.

- [2026-09-21] **[Implement]**
  Moved the static intro-sentence assignment to the top of `updateStartScreenNotice()`,
  removed the carousel branch that rewrote it with sign counts and "since" text.
  - Dropped the redundant duplicate assignment and unused `signCount`/`delaySec` locals.

- [2026-09-21] **[Verify]**
  Ran the full automated suite (47 tests passed) and a Playwright headless-Chromium check.
  - Toggled quiz to carousel mode and changed the carousel "since" config filter.
  - Confirmed `#start-desc` text never changed and no console errors occurred.

- [2026-09-21] **[Doc]**
  Recorded a `FrontEnd` bullet under the active `v3.1.1-pre` section in `CHANGELOG.md`.

- [2026-09-21] **[Complete]**
  The start page intro sentence now stays static across mode toggles and configuration changes.

## Walkthrough & Validation

### Changes Made

- `js/app.js`: `updateStartScreenNotice()` now sets `#start-desc` to the static sentence once,
  unconditionally, before branching on mode; the carousel branch no longer overwrites it with
  dynamic sign-count/"since" text, and the redundant duplicate assignment plus unused
  `signCount`/`delaySec` locals were removed.

### Automated Verification

```bash
python -m pytest tests/ -q
```

Result: 47 passed.

### Visual Validation Evidence

- Start screen, quiz mode baseline: [T0047-view-before.png](T0047-view-before.png)
- After toggling to carousel mode and changing the carousel "since" config filter:
  [T0047-view-after.png](T0047-view-after.png)
- Both captures show the identical intro sentence `"Oefen de verkeersregels en -borden."`;
  a Playwright script asserted this programmatically (`static: true`, no console errors).

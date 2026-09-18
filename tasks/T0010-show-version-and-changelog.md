---
id: T0010
owner: "@antigravity"
needs: []
branch: task/T0010-show-version-and-changelog
worktree: ./work/T0010-show-version-and-changelog
status: active
started: 2026-09-18
ended: —
---

# T0010: Show Version and Changelog

## Goals

Display the application version on the quiz start screen.
Make the version indicator interactive so clicking it displays the project changelog.
Render changelog entries cleanly in an accessible modal dialog.
Ensure the version and changelog view look great across desktop and mobile devices.

## Task Execution Steps

- [ ] **[Read]**      Inspect start screen markup and determine changelog fetching or rendering approach.
- [ ] **[Implement]** Add a clickable version indicator to the start screen in index.html.
- [ ] **[Implement]** Build an accessible modal to display formatted changelog notes on click.
- [ ] **[Implement]** Style version badge and changelog modal cleanly in css/style.css.
- [ ] **[Verify]**    Verify version display and changelog modal interaction with before and after screenshots.
- [ ] **[Doc]**       Document version display in README.md and record validation in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to display the app version on the start screen and show the CHANGELOG on click.

## Walkthrough & Validation

### Scope & Criteria

- Version string (e.g. `v1.0.0-pre`) displayed on start screen.
- Clickable version opens changelog modal.
- Formatted display of CHANGELOG.md contents with versions and release notes.
- Dismissible via Close button, backdrop click, or Escape key.
- Visual screenshots comparing start screen and open changelog modal.

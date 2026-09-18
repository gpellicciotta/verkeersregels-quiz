---
id: T0006
owner: "@antigravity"
needs: []
branch: task/T0006-mark-recent-wegcode-amendments-and-filter-by-year
worktree: ./work/T0006-mark-recent-wegcode-amendments-and-filter-by-year
status: active
started: 2026-09-18
ended: —
---

# T0006: Mark Recent Wegcode Amendments and Filter by Year

## Goals

Mark questions relating to recent Wegcode amendments with visual year badges.
Display amber badges for changes within the last five years and blue or no badges for older rules.
Support URL query filtering via since to practice newly introduced road rules exclusively.
Ensure questions data, quiz presentation, and results views clearly reflect amendment years.

## Task Execution Steps

- [ ] **[Read]**      Review amending acts in data/law to identify introduction years for each question.
- [ ] **[Implement]** Add since year metadata to questions in data/questions.json with legal citations.
- [ ] **[Implement]** Render amber badges for recent amendments and optional blue badges for older rules.
- [ ] **[Implement]** Support filtering questions using the since query parameter in app.js.
- [ ] **[Verify]**    Verify year filtering and badge rendering in desktop and mobile views with screenshots.
- [ ] **[Doc]**       Document the since metadata and filter parameter in README.md and task files.

## Execution Log

- [2026-09-18] **[Decided]**
  Created this task to tag questions by amendment year and allow focused practice on recent rules.

## Walkthrough & Validation

### Scope & Criteria

- Identify questions based on amendments from 2021 to 2026 and set `since: YYYY`.
- Show amber badge "Sinds YYYY" for amendments within the last 5 years.
- Support `?since=YYYY` in URL query parameters to filter quiz pool to questions introduced on or after that year.

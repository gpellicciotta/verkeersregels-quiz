---
id: T0087
owner: "@claude-code"
needs: []
branch: task/T0087-add-the-github-sponsors-profile-link-to-the
worktree: .plan/work/T0087-add-the-github-sponsors-profile-link-to-the
status: active
started_at: "2026-10-27T19:52:20Z"
ended_at: —
review: none
preview: none
protocol: standard
---
# T0087: Add the GitHub Sponsors profile link to the About view support card and repository funding file

## Goals
Offer the new GitHub Sponsors profile as a zero-fee support option in the About view.
Expose the same profile through a GitHub `FUNDING.yml` so the repository shows a Sponsor button.
Keep all five interface languages and changelogs in sync.

## Task Execution Steps
- [x] **[Implement]** Author failing tests for the Sponsors link, string keys, and funding file.
- [x] **[Verify]**    Run the about view tests and confirm the new assertions fail.
- [x] **[Implement]** Add the Sponsors link, string keys, and funding file.
- [x] **[Verify]**    Run the full pytest suite and confirm all tests pass.
- [x] **[Visual]**    Capture About view screenshots before and after on desktop and mobile.
- [x] **[Doc]**       Update the sponsorship spec and all five changelogs.

## Execution Log
- [2026-10-27] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-10-27] **[Implement]**
  Added the GitHub Sponsors link first in the support card, five localized labels, and FUNDING.yml.

- [2026-10-27] **[Verify]**
  Full pytest suite passed and Playwright captures showed four links with zero console or network errors.
  - 175 tests passed.
  - Screenshots in companion directory.

- [2026-10-27] **[Doc]**
  Size note: five-language label and changelog fan-out crossed eight files; total diff stays under sixty lines.

- [2026-10-27] **[Verify]**
  Recorded task outcomes.
  - Files touched: 15.
  - Lines touched: 58.
  - Reopenings: 0.


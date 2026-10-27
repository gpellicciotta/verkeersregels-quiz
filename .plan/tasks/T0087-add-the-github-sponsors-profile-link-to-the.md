---
id: T0087
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
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
- [ ] **[Implement]** Author failing tests for the Sponsors link, string keys, and funding file.
- [ ] **[Verify]**    Run the about view tests and confirm the new assertions fail.
- [ ] **[Implement]** Add the Sponsors link, string keys, and funding file.
- [ ] **[Verify]**    Run the full pytest suite and confirm all tests pass.
- [ ] **[Visual]**    Capture About view screenshots before and after on desktop and mobile.
- [ ] **[Doc]**       Update the sponsorship spec and all five changelogs.

## Execution Log
- [2026-10-27] **[Doc]**
  Companion task file scaffolded at task creation.

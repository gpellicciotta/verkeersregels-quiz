---
id: T0009
owner: "@antigravity"
needs: []
branch: task/T0009-add-wegcode-links-on-home-page
worktree: ./work/T0009-add-wegcode-links-on-home-page
status: active
started: 2026-09-18
ended: —
---

# T0009: Add Wegcode Links on Home Page

## Goals

Add links on the home page pointing players to official Wegcode legal sources.
Provide direct links to the consolidated Wegcode on wegcode.be and the amendment ledger.
Integrate the links seamlessly into the start screen layout without cluttering mobile viewports.
Ensure external links open safely in a new tab with proper security attributes.

## Task Execution Steps

- [ ] **[Read]**      Identify canonical Wegcode URLs from data/law/README.md and review home screen markup.
- [ ] **[Implement]** Add a legal sources section with links to wegcode.be on the start screen.
- [ ] **[Implement]** Style the legal links cleanly for desktop and mobile viewports in css/style.css.
- [ ] **[Verify]**    Verify links work correctly and capture home screen screenshots before and after.
- [ ] **[Doc]**       Document the home screen links and visual validation findings in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to link to the official consolidated Wegcode and amendments from the home page.

## Walkthrough & Validation

### Scope & Criteria

- Links to official consolidated Wegcode (`https://www.wegcode.be/nl/regelgeving/1975120109~hra8v386pu`) on start screen.
- Links to amendment ledger (`https://www.wegcode.be/nl/regelgeving/1975120109/wijzigingen~hra8v386pu`).
- Uses `target="_blank"` and `rel="noopener noreferrer"`.
- Clean responsive layout on mobile and desktop.
- Visual validation screenshots.

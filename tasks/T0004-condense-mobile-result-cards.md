---
id: T0004
owner: "@antigravity"
needs: []
branch: task/T0004-condense-mobile-result-cards
worktree: ./work/T0004-condense-mobile-result-cards
status: active
started: 2026-09-18
ended: —
---

# T0004: Condense Mobile Result Cards

## Goals

Improve the mobile results layout to make question cards more compact and readable.
Place pill badges for correctness in the card top-right corner.
Combine question number and title into a single concise header.
Merge user and correct answer fields when answered correctly into one row.
Reduce vertical card gaps to condense the overall results screen.

## Task Execution Steps

- [ ] **[Read]**      Inspect existing mobile results styles and markup in css/style.css and js/app.js.
- [ ] **[Implement]** Combine question numbering with question text in results card rendering.
- [ ] **[Implement]** Merge user answer and correct answer into a single field for correct responses.
- [ ] **[Implement]** Style correctness tags as top-right pill badges with condensed spacing.
- [ ] **[Verify]**    Capture mobile before and after screenshots demonstrating condensed layout.
- [ ] **[Doc]**       Record visual walkthrough and validation findings in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to condense mobile result cards with top-right pill badges and merged fields.

## Walkthrough & Validation

### Scope & Criteria

- Pill badge for "Juist" / "Fout" positioned at top-right of mobile cards.
- Merged "Jouw Juiste Antwoord" for correct questions instead of two separate rows.
- Combined "Vraag Nr. ###" header.
- Reduced gap between cards on mobile.
- Visual demo screenshots comparing before and after views.

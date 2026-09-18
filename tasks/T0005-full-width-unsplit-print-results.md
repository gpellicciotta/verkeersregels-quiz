---
id: T0005
owner: "@antigravity"
needs: []
branch: task/T0005-full-width-unsplit-print-results
worktree: ./work/T0005-full-width-unsplit-print-results
status: active
started: 2026-09-18
ended: —
---

# T0005: Full Width and Unsplit Print Results

## Goals

Ensure the quiz results page prints cleanly across full paper width.
Prevent result table rows from splitting awkwardly across multiple printed pages.
Repeat table headers automatically across page breaks.
Hide non-printable UI elements and optimize font sizes and margins for print.

## Task Execution Steps

- [ ] **[Read]**      Inspect print styles in css/style.css and test print rendering in headless browser.
- [ ] **[Implement]** Expand print layout width to use full paper width in css/style.css.
- [ ] **[Implement]** Prevent table rows from splitting across pages using CSS page break rules.
- [ ] **[Implement]** Ensure table headers repeat cleanly on subsequent printed pages.
- [ ] **[Verify]**    Verify full-width unsplit print rendering using PDF or print emulation screenshots.
- [ ] **[Doc]**       Record print verification results and screenshot evidence in the task file.

## Execution Log

- [2026-09-18] **[Decided]**
  Created task to ensure full-width print results and prevent table rows from splitting across pages.

## Walkthrough & Validation

### Scope & Criteria

- Results container and table expand to 100% paper width when printed.
- Page margins set appropriately in `@page`.
- Rows use `break-inside: avoid` and `page-break-inside: avoid`.
- Table header repeats across multiple pages via `display: table-header-group`.
- Visual proof via print emulation screenshot.

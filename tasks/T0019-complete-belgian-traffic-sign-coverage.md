---
id: T0019
owner: "@antigravity"
needs:
  - T0020
  - T0021
  - T0022
  - T0023
  - T0024
  - T0025
branch: task/T0019-complete-belgian-traffic-sign-coverage
worktree: ./work/T0019-complete-belgian-traffic-sign-coverage
status: active
started: 2026-09-18
ended: —
---

# T0019: Complete Belgian Traffic Sign Coverage

## Goals

Ensure the quiz contains every traffic sign currently in use in Belgium under the Wegcode.
Provide authentic SVG assets and at least one verified question for each traffic sign.
Decompose sign coverage across Series A through F into manageable sequential subtasks for subagents.
Review and integrate subagent deliverables to guarantee schema consistency and answer balance.
Validate all SVG assets and ensure all automated unit tests pass cleanly.

## Task Execution Steps

- [x] **[Read]**      Audit the consolidated Wegcode and compile the full inventory of Belgian traffic signs.
- [x] **[Decide]**    Decompose full sign coverage into six sequential subtasks T0020 through T0025 in TODO.md.
- [ ] **[Implement]** Build sign fetching script to search and download pre-2024 Belgian SVG assets from Wikimedia.
- [ ] **[Implement]** Delegate subtasks T0020 through T0025 sequentially to subagents and coordinate execution.
- [ ] **[Verify]**    Review and validate question schema, answer option distributions, and SVG XML integrity.
- [ ] **[Doc]**       Update question bank sources, documentation citations, and release notes.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed umbrella task T0019 and registered sequential subtasks T0020 through T0025.

- [2026-09-18] **[Read]**
  Extracted complete inventory of approximately 184 Belgian traffic signs from the consolidated Wegcode.

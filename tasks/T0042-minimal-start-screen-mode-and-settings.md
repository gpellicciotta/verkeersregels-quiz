---
id: T0042
owner: "@antigravity"
needs: []
branch: task/T0042-minimal-start-screen-mode-and-settings
worktree: ./work/T0042-minimal-start-screen-mode-and-settings
status: active
started: 2026-09-20
ended: —
---

# T0042: Minimal Start Screen with Mode Switch and Configuration Controls

## Goals

Streamline the start screen to a single-line title, explanation sentence, inline start control, subtle divider, five circle buttons, and copyright.
Place the player name input and arrow start button side by side on one line in quiz mode.
Update heading and description dynamically in carousel mode with an isolated start button defaulting to eight seconds delay.
Introduce a bottom-bar mode circle button that switches seamlessly between theory quiz and traffic sign carousel modes.
Introduce a bottom-bar configuration circle button opening settings modals tailored to the active mode.
Allow configuring question counts, question categories, and minimum legislation years in quiz mode.
Allow configuring slide intervals and minimum road sign introduction years in carousel mode.

## Task Execution Steps

- [ ] **[Implement]** Clean start screen markup into single-line title, description, inline action row, divider, and five circle buttons.
- [ ] **[Implement]** Build accessible configuration modal supporting quiz filters and carousel interval and sign year settings.
- [ ] **[Implement]** Style inline start row, right-arrow button, five circle buttons, and configuration modal dialog in CSS.
- [ ] **[Implement]** Update application logic for mode switching, dynamic heading and text, and modal state management.
- [ ] **[Implement]** Support road sign carousel filtering by minimum introduction year in carousel logic.
- [ ] **[Verify]**    Verify responsive layouts, modal interactions, keyboard navigation, and update all unit tests.
- [ ] **[Doc]**       Document start screen refinement in changelog and record validation evidence in task file.

## Execution Log

- [2026-09-20] **[Decided]**
  Claimed task T0042 to streamline start screen layout and introduce mode switch and configuration modals.

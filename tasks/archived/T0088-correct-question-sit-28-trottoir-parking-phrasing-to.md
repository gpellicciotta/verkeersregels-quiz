---
id: T0088
owner: "@gemini"
needs: []
branch: task/T0088-correct-question-sit-28-trottoir-parking-phrasing-to
worktree: .plan/work/T0088-correct-question-sit-28-trottoir-parking-phrasing-to
status: completed
started_at: "2026-11-02T17:23:19Z"
ended_at: "2026-11-02T17:29:09Z"
review: none
preview: none
protocol: standard
completion-commit: 950905140bc3b9cc58a83a8d2b8e1ebdc654e9ff
---
# T0088: Correct question sit-28 trottoir parking phrasing to match situation image

## Goals
Align question sit-28-parkeren-trottoir-verbod with its image showing all four wheels parked on the sidewalk.
Replace outdated reference to E9b with the correct sidewalk parking authorization sign E9e.
Keep all five language overlays (NL, EN, FR, DE, IT) and SOURCES.md in sync.

## Task Execution Steps
- [x] **[Implement]** Author failing unit test in 	ests/test_quiz_data.py asserting correct phrasing and E9e reference.
- [x] **[Verify]**    Run 	ests/test_quiz_data.py to confirm failure in red phase.
- [x] **[Implement]** Update data/questions.json, data/translations.*.json, and data/SOURCES.md.
- [x] **[Verify]**    Run full test suite to confirm green phase.
- [x] **[Doc]**       Update changelogs in all five languages.

## Execution Log
- [2026-11-02] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-02] **[Implement]**
  Authored unit test asserting 4-wheel sidewalk parking phrasing and sign E9e reference.

- [2026-11-02] **[Verify]**
  Confirmed test failure on question sit-28 expecting 4-wheel phrasing and sign E9e.

- [2026-11-02] **[Implement]**
  Updated sit-28 to four wheels and sign E9e across questions and four translations.

- [2026-11-02] **[Verify]**
  All 176 automated unit and regression tests passed cleanly.

- [2026-11-02] **[Doc]**
  Logged changes under v3.8.3-pre across all five changelog files.

- [2026-11-02] **[Verify]**
  Recorded task outcomes.
  - Files touched: 12.
  - Lines touched: 85.
  - Reopenings: 0.

- [2026-11-02] **[Complete]**
  Task completed successfully.


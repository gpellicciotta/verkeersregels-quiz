---
id: T0026
owner: "@antigravity"
needs: []
branch: task/T0026-verify-visual-signs-in-all-questions
worktree: ./work/T0026-verify-visual-signs-in-all-questions
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0026: Verify Visual Signs in All Questions

## Goals

Ensure that every quiz question addressing a specific traffic sign displays the corresponding visual sign asset.
Audit all questions in the bank for sign codes or sign references without an attached image.
Attach official sign assets to questions discussing traffic signs such as B22, B23, and F111.
Strengthen automated test assertions in test_quiz_data.py to prevent unshown signs in future additions.
Verify all question schemas and automated test suites pass cleanly.

## Task Execution Steps

- [x] **[Read]**      Audit the question bank to identify any questions referencing traffic signs without displaying sign graphics.
- [x] **[Implement]** Attach sign assets and update question copy for rule-fietser-b22, rule-fietser-b23, and rule-fietsstraat-f111-2021.
- [x] **[Implement]** Tighten automated test assertion in test_quiz_data.py to detect unshown traffic sign codes.
- [x] **[Verify]**    Run full automated test suite to confirm all questions pass schema and sign display rules.
- [x] **[Doc]**       Document question bank visual sign audit results and finalize task documentation.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task T0026 to ensure all questions referencing traffic signs display the visual sign graphic.

- [2026-09-18] **[Read]**
  Audited all 284 questions and identified rule-fietser-b22, rule-fietser-b23, and rule-fietsstraat-f111-2021 lacking sign assets.

- [2026-09-18] **[Implement]**
  Attached B22.svg, B23.svg, and F111.svg assets to questions and updated text to reference the visual signs.

- [2026-09-18] **[Implement]**
  Tightened test_no_questions_refer_to_unshown_signs in test_quiz_data.py with strict regex matching.

- [2026-09-18] **[Verify]**
  Ran unittest test suite confirming all 9 tests pass cleanly.

- [2026-09-18] **[Doc]**
  Documented visual sign additions and test enhancements in task documentation.

- [2026-09-18] **[Complete]**
  Confirmed 100% visual sign coverage across all questions referencing traffic signs.

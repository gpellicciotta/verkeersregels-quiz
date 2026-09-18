---
id: T0021
owner: "@subagent"
needs: []
branch: task/T0021-series-b-and-d-priority-and-mandatory-signs
worktree: ./work/T0021-series-b-and-d-priority-and-mandatory-signs
status: completed
started: 2026-09-18
ended: 2026-09-18
---

# T0021: Series B and D Priority and Mandatory Signs

## Goals

Add recognition questions and verify sign assets for all remaining Belgian priority and mandatory signs.
Introduce sixteen new questions into the question bank covering Series B and Series D traffic signs.
Guarantee accurate Dutch question wording, realistic distractors, and balanced option indices across the question set.
Update automated test suite assertions to validate question schema integrity and sign asset existence.

## Task Execution Steps

- [x] **[Read]**      Review Articles 67 and 69 of KB 1 December 1975 and verify sign assets.
- [x] **[Implement]** Add sixteen Series B and D sign questions to questions.json with balanced options.
- [x] **[Implement]** Update total question count assertion in test_quiz_data.py to 167 questions.
- [x] **[Verify]**    Run test_quiz_data.py and dev-guidelines markdown and taskfile linters.
- [x] **[Doc]**       Record task completion log and update task status.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task T0021 to add remaining Series B and D signs to the quiz.

- [2026-09-18] **[Read]**
  Reviewed legal definitions in Articles 67 and 69 and verified sixteen SVG sign assets.

- [2026-09-18] **[Implement]**
  Added sixteen recognize questions with balanced answer distributions to data/questions.json.

- [2026-09-18] **[Verify]**
  Ran unittest test suite passing all nine automated tests against the expanded 167-question bank.

- [2026-09-18] **[Complete]**
  Integrated sixteen Belgian Series B and D signs with authentic SVG assets and validated quiz questions.

## Walkthrough & Validation

### Changes Made

- `data/questions.json`: added 16 new questions for Series B and D signs with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 151 to 167.
- `TODO.md`: removed completed task T0021 and updated dependency list in T0019.
- `tasks/T0021-series-b-and-d-priority-and-mandatory-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python C:\Dev-Projects\dev-guidelines\scripts\lint-taskfile.py tasks/T0021-series-b-and-d-priority-and-mandatory-signs.md`: 0 violations found.
- `python C:\Dev-Projects\dev-guidelines\scripts\lint-markdown.py TODO.md tasks/T0021-series-b-and-d-priority-and-mandatory-signs.md`: 0 violations found.

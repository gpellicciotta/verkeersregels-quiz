---
id: T0022
owner: "@subagent"
needs: []
branch: task/T0022-series-c-prohibitory-signs
worktree: ./work/T0022-series-c-prohibitory-signs
status: completed
started: 2026-09-18
ended: 2026-09-18
---

# T0022: Series C Prohibitory Signs

## Goals

Add recognition questions and verify sign assets for all remaining Belgian prohibitory signs in Series C.
Introduce twenty-five new questions into the question bank covering road prohibition signs under Article 68 of the Wegcode.
Guarantee accurate Dutch question wording, realistic distractors, and balanced option indices across the question set.
Update automated test suite assertions to validate question schema integrity and sign asset existence.

## Task Execution Steps

- [x] **[Read]**      Review Article 68 of KB 1 December 1975 and verify Series C sign assets.
- [x] **[Implement]** Add twenty-five Series C prohibitory sign questions to questions.json with balanced options.
- [x] **[Implement]** Update total question count assertion in test_quiz_data.py to 192 questions.
- [x] **[Verify]**    Run test_quiz_data.py and dev-guidelines markdown and taskfile linters.
- [x] **[Doc]**       Record task completion log and update task status.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task T0022 to add remaining Series C prohibitory signs to the quiz.

- [2026-09-18] **[Read]**
  Reviewed legal definitions in Article 68 of KB 1 December 1975 and verified twenty-five SVG assets.

- [2026-09-18] **[Implement]**
  Added twenty-five recognize questions with balanced answer distributions to data/questions.json.

- [2026-09-18] **[Verify]**
  Ran unittest test suite passing all nine automated tests against the expanded 192-question bank.

- [2026-09-18] **[Complete]**
  Integrated twenty-five Belgian Series C signs with authentic SVG assets and validated quiz questions.

## Walkthrough & Validation

### Changes Made

- `data/questions.json`: added 25 new questions for Series C signs with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 167 to 192.
- `TODO.md`: removed completed task T0022 and updated dependency list in T0019.
- `tasks/T0022-series-c-prohibitory-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python C:\Dev-Projects\dev-guidelines\scripts\lint-taskfile.py tasks/T0022-series-c-prohibitory-signs.md`: 0 violations found.
- `python C:\Dev-Projects\dev-guidelines\scripts\lint-markdown.py TODO.md tasks/T0022-series-c-prohibitory-signs.md`: 0 violations found.

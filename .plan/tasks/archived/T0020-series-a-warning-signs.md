---
id: T0020
owner: "@subagent"
needs: []
branch: task/T0020-series-a-warning-signs
worktree: ./work/T0020-series-a-warning-signs
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0020: Series A Warning Signs

## Goals

Add recognition questions and verify sign assets for all remaining Belgian warning signs in Series A.
Introduce twenty-five new questions into the question bank covering road hazard signs under Article 66 of the Wegcode.
Guarantee accurate Dutch question wording, realistic distractors, and balanced option indices across the question set.
Update automated test suite assertions to validate question schema integrity and sign asset existence.

## Task Execution Steps

- [x] **[Read]**      Review Article 66 of KB 1 December 1975 and verify Series A sign assets.
- [x] **[Implement]** Add twenty-five Series A warning sign questions to questions.json with balanced options.
- [x] **[Implement]** Update total question count assertion in test_quiz_data.py to 151 questions.
- [x] **[Verify]**    Run test_quiz_data.py and dev-guidelines markdown and taskfile linters.
- [x] **[Doc]**       Record task completion log and update task status.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task T0020 to add remaining Series A warning signs to the quiz.

- [2026-09-18] **[Read]**
  Reviewed legal definitions in Article 66 of KB 1 December 1975 and verified all twenty-five SVG assets.

- [2026-09-18] **[Implement]**
  Added twenty-five recognize questions with balanced answer distributions to data/questions.json.

- [2026-09-18] **[Verify]**
  Ran unittest test suite passing all nine automated tests against the expanded 151-question bank.

- [2026-09-18] **[Complete]**
  Integrated twenty-five Belgian Series A warning signs with authentic SVG assets and validated quiz questions.

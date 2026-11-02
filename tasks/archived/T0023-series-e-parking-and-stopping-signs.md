---
id: T0023
owner: "@subagent"
needs: []
branch: task/T0023-series-e-parking-and-stopping-signs
worktree: ./work/T0023-series-e-parking-and-stopping-signs
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0023: Series E Parking and Stopping Signs

## Goals

Add recognition questions and verify sign assets for all remaining Belgian parking and stopping signs in Series E.
Introduce twelve new questions into the question bank covering road parking signs under Article 70 of the Wegcode.
Guarantee accurate Dutch question wording, realistic distractors, and balanced option indices across the question set.
Update automated test suite assertions to validate question schema integrity and sign asset existence.

## Task Execution Steps

- [x] **[Read]**      Review Article 70 of KB 1 December 1975 and verify Series E sign assets.
- [x] **[Implement]** Add twelve Series E parking and stopping sign questions to questions.json with balanced options.
- [x] **[Implement]** Update total question count assertion in test_quiz_data.py to 204 questions.
- [x] **[Verify]**    Run test_quiz_data.py and dev-guidelines markdown and taskfile linters.
- [x] **[Doc]**       Record task completion log and update task status.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task T0023 to add remaining Series E parking and stopping signs to the quiz.

- [2026-09-18] **[Read]**
  Reviewed legal definitions in Article 70 of KB 1 December 1975 and verified twelve SVG assets.

- [2026-09-18] **[Implement]**
  Added twelve recognize questions with balanced answer distributions to data/questions.json.

- [2026-09-18] **[Verify]**
  Ran unittest test suite passing all nine automated tests against the expanded 204-question bank.

- [2026-09-18] **[Complete]**
  Integrated twelve Belgian Series E signs with authentic SVG assets and validated quiz questions.

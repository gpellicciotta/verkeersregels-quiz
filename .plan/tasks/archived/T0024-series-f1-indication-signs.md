---
id: T0024
owner: "@subagent"
needs: []
branch: task/T0024-series-f1-indication-signs
worktree: ./work/T0024-series-f1-indication-signs
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0024: Series F1 Indication Signs

## Goals

Add recognition questions and verify sign assets for Belgian indication signs F1a through F50bis.
Introduce thirty-seven new questions into the question bank covering indication signs under Article 71 of the Wegcode.
Ensure accurate Dutch question wording, realistic distractors, and balanced option indices across the question set.
Update automated test suite assertions to validate question schema integrity and sign asset existence.

## Task Execution Steps

- [x] **[Read]**      Review Article 71 of KB 1 December 1975 and verify Series F1 sign assets.
- [x] **[Implement]** Add thirty-seven Series F1 indication sign questions to questions.json with balanced options.
- [x] **[Implement]** Update total question count assertion in test_quiz_data.py to 241 questions.
- [x] **[Verify]**    Run test_quiz_data.py and dev-guidelines markdown and taskfile linters.
- [x] **[Doc]**       Record task completion log and update task status.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task T0024 to add Series F1 indication signs F1a through F50bis to the quiz.

- [2026-09-18] **[Read]**
  Reviewed legal definitions in Article 71 of KB 1 December 1975 and verified thirty-seven SVG assets.

- [2026-09-18] **[Implement]**
  Added thirty-seven recognize questions with balanced answer distributions to data/questions.json.

- [2026-09-18] **[Verify]**
  Ran unittest test suite passing all nine automated tests against the expanded 241-question bank.

- [2026-09-18] **[Complete]**
  Integrated thirty-seven Belgian Series F1 signs with authentic SVG assets and validated quiz questions.

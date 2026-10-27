---
id: T0002
owner: "@antigravity"
needs: []
branch: task/T0002-review-all-questions-and-answers
worktree: ./work/T0002-review-all-questions-and-answers
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0002: Review All Questions and Answers

## Goals

Every question must be correct under the Wegcode in force today, for Flanders, before the v1.0.0 release.
Review each question, correct answer, distractor, explanation and sign image against the current article text in data/law.
A verification pass on 2026-09-18 already found the errors listed below, which serve as a starting point.
Expanding the question bank is out of scope for this task.

## Task Execution Steps

- [x] **[Read]**      Read the consolidated Wegcode in data/law and the sources listed in data/SOURCES.md.
- [x] **[Verify]**    Check each rule question's answer and explanation against the current article text, citing the article.
- [x] **[Verify]**    Check that every distractor is wrong under current law, including Brussels and Walloon differences.
- [x] **[Verify]**    Check every sign code, image and meaning against the sign definitions in the Wegcode.
- [x] **[Implement]** Fix confirmed errors in data/questions.json, keeping question IDs stable.
- [x] **[Doc]**       Record each fix with its article reference in data/SOURCES.md.
- [x] **[Verify]**    Play the corrected questions locally and capture before and after screenshots.

## Execution Log

- [2026-09-18] **[Decided]**
  Created this review task; the known issues below come from checks against the consolidated Wegcode.
  An earlier review session stopped after replacing the C31 and D10 images in commit `6e359b4`.

- [2026-09-18] **[Verify]**
  Verified all 54 questions, distractors, sign images, and article citations against the consolidated Wegcode.

- [2026-09-18] **[Implement]**
  Corrected speed limits, mobile phone rules, fog light rules, and sign designations in data/questions.json.

- [2026-09-18] **[Doc]**
  Recorded all corrections, regional distinctions, and legal citations in data/SOURCES.md.

- [2026-09-18] **[Verify]**
  Captured baseline and updated screenshots showing the running quiz verifying visual integrity without regressions.
  - T0002-view-before.png: baseline start and quiz view.
  - T0002-view-after.png: verified view of updated quiz.

- [2026-09-18] **[Complete]**
  Aligned all 54 questions, options, explanations, and sign images with current Belgian traffic law.

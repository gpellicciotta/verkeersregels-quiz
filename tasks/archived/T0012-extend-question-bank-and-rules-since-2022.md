---
id: T0012
owner: "@antigravity"
needs: []
branch: task/T0012-extend-question-bank-and-rules-since-2022
worktree: ./work/T0012-extend-question-bank-and-rules-since-2022
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0012: Extend Question Bank and Rules Since 2022

## Goals

Double the quiz question bank from 63 to at least 126 high-quality questions.
Ensure every valid traffic sign with an image asset in the repository is tested in the quiz.
Add verified questions covering Belgian traffic rule amendments enacted since 2022.
Investigate official theory exam traffic situation scenarios and incorporate real-life situation questions.
Ensure all questions strictly reflect current Belgian road legislation and pass all automated tests.

## Task Execution Steps

- [x] **[Read]**      Review existing questions, law amendments since 2021, and sign assets in the repository.
- [x] **[Verify]**    Audit sign asset usage to identify all signs lacking dedicated recognition or identification questions.
- [x] **[Implement]** Draft new questions covering every sign image and all legal amendments since 2022.
- [x] **[Implement]** Add questions modeling official real-life traffic situation scenarios and priority rules.
- [x] **[Verify]**    Validate question schemas, option distributions, sign file paths, and test suite assertions.
- [x] **[Doc]**       Update legal citations and question counts in data documentation and record task progress.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task to double the question set, cover all sign assets, and add post-2022 rules.

- [2026-09-18] **[Read]**
  Reviewed all 35 sign SVGs, recent legislation amendments since 2022, and official exam scenario patterns.

- [2026-09-18] **[Verify]**
  Audited sign usage and found 13 signs lacking recognize questions and 3 signs lacking subject questions.

- [2026-09-18] **[Implement]**
  Added 63 new questions in data/questions.json covering all remaining signs, post-2022 amendments, and traffic situations.
  - Added dedicated recognize questions for all remaining signs in assets/signs/.
  - Added dedicated identify questions for C39, E3, and F3b.
  - Added questions for e-scooter, smartphone, speed pedelec, and velomobile rules.
  - Added scenario questions for priority, trams, unpaved roads, and manoeuvres.

- [2026-09-18] **[Verify]**
  Validated schema compliance, balanced answer index distributions, and updated automated test assertions.
  - All 8 unit tests in tests/test_quiz_data.py passed cleanly.
  - Verified 100% SVG coverage across all 35 asset files.

- [2026-09-18] **[Doc]**
  Updated question counts, category distributions, type breakdowns, and correction logs in data/SOURCES.md.

- [2026-09-18] **[Complete]**
  Doubled the quiz question bank to 126 verified questions with full sign asset coverage.

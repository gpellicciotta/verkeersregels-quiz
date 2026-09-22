---
id: T0067
owner: "@claude"
needs: []
branch: task/T0067-keep-only-in-localstorage-play-stats-and-most
worktree: ./work/T0067-keep-only-in-localstorage-play-stats-and-most
status: completed
started: 2026-09-23
ended: 2026-09-23
---

# T0067: Keep Play Stats and Most-Used Errors in localStorage

## Goals
Track play stats and per-question error counts entirely client-side, in `localStorage`,
with no server component. Every finished round should update running totals (games
played, questions answered, correct/wrong counts, last-played timestamp) and per-question
wrong-answer counts, queryable as a ranked "most-used errors" list. This groundwork feeds
T0068's planned "restart with past errors" feature; T0067 itself adds no new UI surface,
since no display requirement was specified for this data yet.

## Task Execution Steps
- [x] **[Read]**      Inspect `state.js`, `preferences.js`, and `quiz.js` for existing localStorage patterns.
- [x] **[Decide]**    Add a dedicated `stats.js` module and storage key instead of extending `preferences.js`.
- [x] **[Implement]** Add `js/stats.js` with `recordQuizResult`, `getStoredStats`, `getMostUsedErrors`, `resetStats`.
- [x] **[Implement]** Call `recordQuizResult(state.answers)` from `showResult()` in `quiz.js`.
- [x] **[Verify]**    Add Node and pytest coverage; run the full pytest suite.
- [x] **[Doc]**       Document the feature in `docs/requirements.md` and record a `CHANGELOG.md` entry.

## Execution Log
- [2026-09-23] **[Decided]**
  Claimed T0067; scoped it to the localStorage data layer only, no UI, since the task
  description only asks to "keep" stats, and T0068 will consume this data for replay.

- [2026-09-23] **[Decided]**
  Used a separate `verkeersquiz_stats` key and `stats.js` module rather than folding into
  `preferences.js`, keeping "user settings" and "accumulated play history" distinct.

- [2026-09-23] **[Implement]**
  `js/stats.js`: `getStoredStats`/`recordQuizResult`/`getMostUsedErrors`/`resetStats`,
  storing `gamesPlayed`, `questionsAnswered`, `correctAnswers`, `wrongAnswers`,
  `lastPlayedAt`, and a per-question-id `errorCounts` map.

- [2026-09-23] **[Implement]**
  `js/quiz.js`: `showResult()` now calls `recordQuizResult(state.answers)` right before
  `submitToSheet`, so every finished round updates local stats regardless of server submission.

- [2026-09-23] **[Verify]**
  Added `tests/stats.test.cjs` (3 `node --test` cases: accumulation, corrupt-storage
  recovery, reset) and `tests/test_stats.py` (4 cases: runs the Node suite plus static
  guards for the API surface, storage-key isolation, and the `quiz.js` wiring).
  `python -m pytest -q`: 132 passed, 8 subtests passed.

- [2026-09-23] **[Doc]**
  Added a "Local Play Statistics" subsection to `docs/requirements.md`, listed `stats.js`
  in the module-structure bullet, and recorded a `FrontEnd` bullet in `CHANGELOG.md`
  (regenerated the `de`/`en`/`fr`/`it` translations via `translate-markdown.py generate --all`).

- [2026-09-23] **[Complete]**
  Play stats and most-used-errors are now tracked purely client-side in `localStorage`
  under `verkeersquiz_stats`, updated after every finished round.

## Walkthrough & Validation

### Changes Made
- `js/stats.js`: new module — see Execution Log for the full API.
- `js/quiz.js`: `showResult()` now records the finished round into local stats.
- `tests/stats.test.cjs`, `tests/test_stats.py`: new automated coverage (see above).
- `docs/requirements.md`, `CHANGELOG.md` (+ `de`/`en`/`fr`/`it` translations): documented.

### Automated Checks
- `node --test tests/stats.test.cjs`: 3/3 passed.
- `python -m pytest -q`: 132 passed, 8 subtests passed.

### Manual/Visual Validation
Not applicable: this task adds no new UI surface, only a localStorage data layer consumed
internally after each round. Behavior was validated through the automated Node fixtures
above (accumulation, corrupt-storage recovery, and reset against a fake `localStorage`).

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and
documentation all passed, so this task integrates directly per the coordination protocol.

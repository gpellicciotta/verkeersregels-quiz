---
id: T0068
owner: "@claude"
needs: []
branch: task/T0068-enable-starting-a-quiz-with-questions-where-you
worktree: ./work/T0068-enable-starting-a-quiz-with-questions-where-you
status: completed
started: 2026-09-23
ended: 2026-09-23
---

# T0068: Restart a Quiz with Past or Round-Wrong Questions

## Goals
Let players replay questions they got wrong. Add a start-screen button that begins a
quiz built from every question ever answered wrong (the `errorCounts` map from T0067),
and a result-screen button that restarts using only the current round's wrong answers.
Add an opt-in settings checkbox, "Always include errors from last quiz", that forces the
previous round's wrong questions into every subsequent normal quiz. Builds directly on
T0067's `stats.js` localStorage layer; no server or schema changes needed.

## Task Execution Steps
- [x] **[Read]**      Inspect `quiz.js`, `stats.js`, `state.js`, `preferences.js`, `config-modal.js`.
- [x] **[Decide]**    Distinguish "all-time errors" (start button) from "last quiz's errors" (checkbox/retry).
- [x] **[Implement]** Add `getErrorQuestionIds`, `hasStoredErrors`, `getLastQuizWrongIds` to `stats.js`.
- [x] **[Implement]** Add `startErrorReviewQuiz`, `restartWithWrongAnswers`, `buildRoundWithForcedIds` to `quiz.js`.
- [x] **[Implement]** Add start/result buttons and settings checkbox to `index.html`, wire in `app.js`/`dom.js`.
- [x] **[Verify]**    Add Node, pytest, and Playwright coverage; run the full suite and a real-browser flow.
- [x] **[Doc]**       Update `docs/requirements.md`, `docs/devops.md`, and `CHANGELOG.md` (all 5 languages).

## Execution Log
- [2026-09-23] **[Decided]**
  Split the feature into three independent entry points instead of one: a start-screen
  "review all-time errors" button, a result-screen "retry this round's errors" button,
  and a separate "always include last quiz's errors" checkbox — matching the task's own
  wording of "errors in the past" vs. "last quiz" as two distinct concepts.

- [2026-09-23] **[Decided]**
  Error-review rounds bypass the active type/since filters and pull straight from
  `allQuestions`, since the goal is spaced repetition of missed questions regardless of
  the player's current filter configuration.

- [2026-09-23] **[Implement]**
  `js/stats.js`: added `lastQuizWrongIds` to the stored shape (overwritten, not
  accumulated, each round) plus `getErrorQuestionIds`, `hasStoredErrors`,
  `getLastQuizWrongIds` reader helpers.

- [2026-09-23] **[Implement]**
  `js/quiz.js`: factored `beginRound()` out of `startQuiz()`; added
  `buildRoundWithForcedIds()` (caps forced questions to the round size, fills the rest
  from the normal pool), `startErrorReviewQuiz()`, and `restartWithWrongAnswers()`.
  `updateStartScreenNotice()` toggles the start button via `hasStoredErrors()`;
  `showResult()` toggles the retry button via `correct === total`.

- [2026-09-23] **[Implement]**
  `index.html`/`dom.js`/`app.js`: added `#btn-start-errors`, `#btn-result-retry-errors`,
  and `#config-always-include-errors` (reusing the existing `.modal-checkbox-label`
  pattern), wired to `startErrorReviewQuiz`/`restartWithWrongAnswers`/`saveConfig`.
  `state.js`/`preferences.js` persist `alwaysIncludeLastErrors` like the other quiz settings.

- [2026-09-23] **[Doc]**
  Added new keys to all five `data/strings.*.json` (nl/fr/de/it/en); verified with
  `tests/test_i18n.py` that key sets stay in sync. Updated `docs/requirements.md`
  (Local Play Statistics section) and `docs/devops.md` (new browser-check section).
  Recorded `CHANGELOG.md` bullets and hand-translated the same into the four
  `CHANGELOG.<lang>.md` overlays (no network translation call made).

- [2026-09-23] **[Verify]**
  Added 3 `node --test` cases to `tests/stats.test.cjs`, a new `tests/test_error_review.py`
  (12 static wiring checks), and updated `tests/test_stats.py` for the new exports.
  `python -m unittest discover -s tests`: 144 passed (was 132 before this task).
  Wrote `tests/error-review-browser.cjs` (Playwright/Chrome) exercising the full flow
  end-to-end: hidden button with no history, answering wrong, retry-this-round,
  review-all-errors, and the always-include-errors checkbox forcing a question back in.
  Ran with `--baseline` and `--screenshots` against `python -m http.server 8068`; all
  assertions passed, screenshots inspected and confirmed correct rendering (see below).

- [2026-09-23] **[Complete]**
  Players can now start a quiz from all-time missed questions, retry a round's wrong
  answers immediately, or opt in to auto-including last quiz's errors going forward.

## Walkthrough & Validation

### Changes Made
- `js/stats.js`: `lastQuizWrongIds` tracking; `getErrorQuestionIds`, `hasStoredErrors`, `getLastQuizWrongIds`.
- `js/quiz.js`: `beginRound`, `buildRoundWithForcedIds`, `startErrorReviewQuiz`, `restartWithWrongAnswers`; visibility toggles.
- `js/state.js`, `js/preferences.js`, `js/config-modal.js`: `alwaysIncludeLastErrors` setting, persisted like other quiz settings.
- `js/dom.js`, `js/app.js`, `index.html`, `css/style.css`: new buttons/checkbox and their wiring/styling.
- `data/strings.{nl,fr,de,it,en}.json`: new UI strings.
- `docs/requirements.md`, `docs/devops.md`, `CHANGELOG.md` (+4 language overlays): documented.
- `tests/stats.test.cjs`, `tests/test_stats.py`, `tests/test_error_review.py`, `tests/error-review-browser.cjs`: new/updated coverage.

### Automated Checks
- `node --test tests/stats.test.cjs`: 4/4 passed.
- `python -m unittest discover -s tests`: 144 passed, 0 failed.
- `node tests/error-review-browser.cjs --baseline` and `--screenshots` against `http://127.0.0.1:8068/`: both passed, 0 page errors.

### Manual/Visual Validation
Screenshots captured under `tasks/`: `T0068-start-before.png` (no history → button hidden),
`T0068-start-after.png` (review button visible after one recorded error),
`T0068-result-after.png` (retry button visible on an imperfect score), and
`T0068-config-after.png` (settings checkbox checked and persisted). All inspected and
confirmed to render as intended, in Dutch, with no layout regressions.

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, automated
tests, a real-browser functional pass, and documentation all passed, so this task
integrates directly per the coordination protocol.

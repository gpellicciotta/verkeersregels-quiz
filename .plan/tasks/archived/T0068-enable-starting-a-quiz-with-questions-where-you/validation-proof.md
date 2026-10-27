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

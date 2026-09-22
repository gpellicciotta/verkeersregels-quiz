---
id: T0062
owner: "@codex"
needs: []
branch: task/T0062-confirm-quiz-cancellation
worktree: ./work/T0062-confirm-quiz-cancellation
status: needs-review
started: 2026-09-22
ended: —
---

# T0062: Confirm quiz cancellation

## Goals
Allow players to stop a quiz using a close button on every question.
Warn that stopping discards all progress and require confirmation before returning to the start screen.
Preserve player preferences and support keyboard navigation, mobile layouts, and all five languages.

## Task Execution Steps
- [x] **[Read]**      Inspect quiz state, modal patterns, localization, and task coordination requirements.
- [x] **[Decided]**   Claim locally and implement an accessible confirmation dialog that defaults to continuing the quiz.
- [x] **[Implement]** Add cancellation controls, reset abandoned progress, and translate dialog labels.
- [x] **[Verify]**    Exercise cancellation, dismissal, focus, retained preferences, and normal completion in browser tests.
- [x] **[Visual]**    Inspect desktop and mobile screenshots before and after implementation.
- [x] **[Doc]**       Update requirements, user instructions, changelog, and validation evidence.

## Execution Log
- [2026-09-22] **[Read]**
  Inspected state, quiz navigation, modal styling, translation dictionaries, and existing tests.

- [2026-09-22] **[Decided]**
  Claimed locally in commit `3c13811`, following explicit user instructions to omit the claim push.
  Created the dedicated task branch and worktree after committing the claim.

- [2026-09-22] **[Decided]**
  Use a native modal dialog with initial focus on continuing; confirm cancellation before clearing round state.
  Preserve player name and settings, and never submit abandoned scores.

- [2026-09-22] **[Implement]**
  Added the quiz close button, translated confirmation, keyboard focus handling, and reset of abandoned answers, questions, and timing.
  Updated requirements, play instructions, the unreleased feature version, and the offline asset cache.

- [2026-09-22] **[Verify]**
  Expanded keyboard tests exposed native dialog tabbing into browser controls; explicit wrapping now passes forward and reverse navigation.
  One initial mobile startup timed out; diagnostic reruns passed without application errors.

- [2026-09-22] **[Verify]**
  Passed 101 automated tests and browser scenarios at desktop, mobile, and narrow widths across all five languages.
  Confirmed abandoned rounds submit no scores, while normal completion submits once.

- [2026-09-22] **[Visual]**
  Verified HTTP 200 before screenshots and inspected the quiz, answered questions, confirmations, and German dark theme.
  Compare [desktop before](T0062-view-before.png), [desktop after](T0062-view-after.png), [mobile before](T0062-mobile-before.png), and [mobile after](T0062-mobile-after.png).

- [2026-09-22] **[Doc]**
  Review tier: solo AI agent; implementation awaits human permission for mainline integration.
  The local review server remains running as PID `8400`; no changes were pushed or deployed.

- [2026-09-22] **[Implement]**
  Corrected the review finding by anchoring the quiz close button to the ancestor card instead of the header layout.
  Added regression checks for matching offsets, dimensions, and nonoverlapping status controls.

- [2026-09-22] **[Visual]**
  Inspected updated desktop and mobile captures after HTTP 200 responses; close controls now match the established card positioning.
  Compare [desktop before](T0062-position-view-before.png), [desktop after](T0062-position-view-after.png), [mobile before](T0062-position-mobile-before.png), and [mobile after](T0062-position-mobile-after.png).

## Walkthrough & Validation
The quiz card now includes an accessible close button anchored to its top-right corner, matching other screen close controls.
Confirmation defaults to continuing; Escape, backdrop clicks, and the dialog close button preserve the current answer and question.
Confirmed cancellation clears round state and timing, retains preferences, focuses Start, and avoids result submission.

### Browser evidence
- [Desktop confirmation](T0062-view-confirmation.png)
- [Desktop answered question](T0062-view-answered.png)
- [Mobile confirmation](T0062-mobile-confirmation.png)
- [Mobile answered question](T0062-mobile-answered.png)
- [Mobile German dark theme](T0062-mobile-dark-de.png)
- [Narrow question](T0062-narrow-after.png)
- [Narrow answered question](T0062-narrow-answered.png)
- [Narrow confirmation](T0062-narrow-confirmation.png)
- [Narrow German dark theme](T0062-narrow-dark-de.png)

### Commands and results
Run commands from the task worktree unless specified otherwise.

```text
npm install --no-save --package-lock=false playwright
Exit 0: added 2 packages in 5s.

python -m http.server 8062 --bind 127.0.0.1
Running: PID 8400, started 2026-09-22T15:20:08+02:00, retained for review.
Started through PowerShell Start-Process with -WindowStyle Hidden.

node tests/quiz-cancel-browser.cjs --baseline
Exit 0, PID 38764: HTTP 200; visible quiz at 1280x800 and 375x667.

node tests/quiz-cancel-browser.cjs --screenshots
Exit 0, PID 20304: PASS at 1280x800, 375x667, and 320x568.
Covered initial, middle, and final questions; keyboard focus; all dismissal paths;
cleared state; retained preferences; five languages; no abandoned score; normal completion.
External requests were intercepted locally throughout browser verification.

python scripts/generate-sw.py generate
Exit 0: Generated sw.js with 276 precached assets (version v3.4.0-pre).

python -m pytest tests -q
Exit 0: 101 passed.

python ../../../dev-guidelines/scripts/lint-markdown.py tasks/T0062-confirm-quiz-cancellation.md README.md CHANGELOG.md docs/devops.md docs/requirements.md TODO.md
Exit 0: All 6 markdown files passed linting.

python ../../../dev-guidelines/scripts/lint-taskfile.py tasks/T0062-confirm-quiz-cancellation.md TODO.md
Exit 0: All 1 task files passed linting.

git diff --check
Exit 0: no whitespace errors.
```

The review server is available at [localhost port 8062](http://127.0.0.1:8062/).

### Close button positioning follow-up
The initial implementation placed the button inside the header's flex layout, causing the reported mismatch with other close controls.
The button now uses the ancestor card as its absolute positioning anchor, with matching 12-pixel top and right offsets.
Header spacing prevents overlap with the score, progress, reporting control, and answer status.

- Desktop: [before](T0062-position-view-before.png) and [after](T0062-position-view-after.png).
- Mobile: [before](T0062-position-mobile-before.png) and [after](T0062-position-mobile-after.png).
- Narrow mobile: [before](T0062-position-narrow-before.png) and [after](T0062-position-narrow-after.png).
- Confirmation: [desktop](T0062-position-view-confirmation.png) and [mobile](T0062-position-mobile-confirmation.png).

```text
QUIZ_SCREENSHOT_PREFIX=T0062-position node tests/quiz-cancel-browser.cjs --baseline
Exit 0, PID 21992: HTTP 200; baseline screenshots at all three viewport widths.

node tests/quiz-cancel-browser.cjs
Exit 1, PID 24336: reproduced incorrect distance from the card's top edge before the fix.

QUIZ_SCREENSHOT_PREFIX=T0062-position node tests/quiz-cancel-browser.cjs --screenshots
Exit 0, PID 33436: PASS at 1280x800, 375x667, and 320x568, across all five languages.
Verified card-relative offsets, no header overlap, matching result close placement, and existing cancellation scenarios.
PowerShell invocations set the prefix through $env:QUIZ_SCREENSHOT_PREFIX='T0062-position'.

python scripts/generate-sw.py generate
Exit 0: Generated sw.js with 276 precached assets (version v3.4.0-pre).

python -m pytest tests -q
Exit 0: 101 passed.
```

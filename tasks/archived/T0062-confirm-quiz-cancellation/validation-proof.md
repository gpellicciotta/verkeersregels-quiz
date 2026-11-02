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

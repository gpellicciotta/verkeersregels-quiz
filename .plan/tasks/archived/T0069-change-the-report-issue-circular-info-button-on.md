---
id: T0069
owner: "@claude"
needs: []
branch: task/T0069-change-the-report-issue-circular-info-button-on
worktree: ./work/T0069-change-the-report-issue-circular-info-button-on
status: completed
started: 2026-09-22
ended: 2026-09-23
---
# T0069: Change the Report Issue Circular Info Button on the Start Screen

## Goals
Turn the start screen's decorative "report" hint icon into a real, clickable
"Report issue" button, and add an equivalent report button to every other
screen and the settings modal so an issue can be reported from anywhere.
Generalize the report modal's default context per screen: the current quiz
question, the currently shown carrousel sign, or the view's name (e.g.
"Quiz resultaten", "Start scherm", "Instellingen scherm") for all other
views. Keep the existing quiz-screen report buttons and Google Sheet payload
shape unchanged.

## Task Execution Steps
- [x] **[Read]**      Inspect report-modal.js, report-queue.js, dom.js, screens.js, and all screen markup/CSS.
- [x] **[Implement]** Convert the start screen hint icon into a real report button.
- [x] **[Implement]** Add report buttons to result, carousel, about screens and the settings modal.
- [x] **[Implement]** Generalize report context resolution (question / sign / view name) in report-modal.js.
- [x] **[Implement]** Add i18n strings across all five languages.
- [x] **[Verify]**    Run the Python test suite and a Playwright browser check with before/after screenshots.
- [x] **[Doc]**       Record validation results and screenshots in this task file.

## Execution Log
- [2026-09-22] **[Decided]**
  Claimed T0069. Keep the existing per-question quiz report buttons unchanged; add matching
  round report buttons to start/result/carousel/about/settings, all sharing one context resolver.

- [2026-09-23] **[Verify]**
  Ran `python -m pytest tests/ -q`: 128 passed, 8 subtests passed, no regressions.
  - Regenerated translated `CHANGELOG.{en,fr,de,it}.md` via `translate-markdown.py generate --all`.
  - Ran `tests/report-issue-browser.cjs --screenshots` against a local server (HTTP 200).
  - Report button reachable and correctly contextualized on all six entry points.

- [2026-09-23] **[Doc]**
  Recorded validation results, screenshots, review tier, and a devops.md section for the new
  browser check in this task file.

- [2026-09-23] **[Complete]**
  Delivered a real, reachable "Report issue" button on every screen and the settings modal,
  each defaulting to the correct per-screen context.

---
id: T0013
owner: "@antigravity"
needs: []
branch: task/T0013-show-question-links-when-answered
worktree: ./work/T0013-show-question-links-when-answered
status: completed
started: 2026-09-18
ended: 2026-09-18
---
# T0013: Show Question Links When Answered

## Goals

Provide an authoritative reference link for each quiz question to the official Wegcode rule or explainer site.
Ensure the link is displayed clearly in the UI once the user has selected an answer.
Style the reference link cleanly with accessible contrast and responsive placement on mobile and desktop.
Update questions in data/questions.json with valid, verified URLs for all sign and rule questions.
Verify visual rendering and test suite integrity across the updated quiz.

## Task Execution Steps

- [x] **[Read]**      Inspect question rendering logic in js/app.js and existing sources in data/questions.json.
- [x] **[Implement]** Ensure every question in data/questions.json contains a valid authoritative source URL.
- [x] **[Implement]** Render an accessible external reference link below the question explanation in js/app.js.
- [x] **[Implement]** Style the question reference link and hover states responsively in css/style.css.
- [x] **[Verify]**    Verify link rendering, URL validity, and capture before and after visual screenshots.
- [x] **[Doc]**       Update data documentation and record task validation and walkthrough details.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task to display authoritative rule and explainer links upon answering each question.

- [2026-09-18] **[Read]**
  Inspected question rendering logic, stylesheet rules, and existing source references across questions.

- [2026-09-18] **[Implement]**
  Populated authoritative consolidated Wegcode links across all sign questions and updated test assertions.

- [2026-09-18] **[Implement]**
  Rendered accessible reference links below question explanations and styled responsive interactive states.

- [2026-09-18] **[Verify]**
  Verified automated unit tests and captured visual before, after, and mobile screenshots.
  - T0013-view-before.png: baseline question view before reference link rendering.
  - T0013-view-after.png: desktop question view displaying official reference link.
  - T0013-view-mobile.png: mobile question view displaying responsive link layout.

- [2026-09-18] **[Doc]**
  Updated requirements, question bank source notes, and changelog records with link details.

- [2026-09-18] **[Complete]**
  Delivered official rule and explainer reference links revealed upon answering each question.

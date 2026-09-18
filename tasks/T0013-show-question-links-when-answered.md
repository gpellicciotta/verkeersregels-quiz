---
id: T0013
owner: "@antigravity"
needs: []
branch: task/T0013-show-question-links-when-answered
worktree: ./work/T0013-show-question-links-when-answered
status: active
started: 2026-09-18
ended: —
---

# T0013: Show Question Links When Answered

## Goals

Provide an authoritative reference link for each quiz question to the official Wegcode rule or explainer site.
Ensure the link is displayed clearly in the UI once the user has selected an answer.
Style the reference link cleanly with accessible contrast and responsive placement on mobile and desktop.
Update questions in data/questions.json with valid, verified URLs for all sign and rule questions.
Verify visual rendering and test suite integrity across the updated quiz.

## Task Execution Steps

- [ ] **[Read]**      Inspect question rendering logic in js/app.js and existing sources in data/questions.json.
- [ ] **[Implement]** Ensure every question in data/questions.json contains a valid authoritative source URL.
- [ ] **[Implement]** Render an accessible external reference link below the question explanation in js/app.js.
- [ ] **[Implement]** Style the question reference link and hover states responsively in css/style.css.
- [ ] **[Verify]**    Verify link rendering, URL validity, and capture before and after visual screenshots.
- [ ] **[Doc]**       Update data documentation and record task validation and walkthrough details.

## Execution Log

- [2026-09-18] **[Decided]**
  Claimed task to display authoritative rule and explainer links upon answering each question.

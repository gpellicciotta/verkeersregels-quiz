---
id: T0033
owner: "@claude"
needs: []
branch: task/T0033-review-all-questions
worktree: ./work/T0033-review-all-questions
status: active
started: 2026-09-19
ended: —
---

# T0033: Review All Questions for Issues or Inconsistencies

## Goals

The question bank has grown to 294 questions across four types since the last full review in T0002.
Review every question for content issues that automated schema tests in tests/test_quiz_data.py cannot catch.
Check for duplicate or near-duplicate questions, ambiguous or multiple defensible answers, weak or repeated
distractors, category or "since" year inconsistencies, and legal accuracy against data/law and data/SOURCES.md.
Produce a findings list only; do not fix anything until the user confirms which fixes to apply.

## Task Execution Steps

- [x] **[Read]**      Read data/questions.json, data/SOURCES.md, and data/law/README.md for context.
- [ ] **[Verify]**    Check recognize/identify questions for duplicate signs, wrong meanings, weak distractors.
- [ ] **[Verify]**    Check rule/situation questions against data/law and data/SOURCES.md for legal accuracy.
- [ ] **[Verify]**    Check cross-question consistency: categories, "since" years, source anchors, phrasing.
- [ ] **[Doc]**        Record all findings in the Execution Log and present them for user confirmation.

## Execution Log

- [2026-09-19] **[Decided]**
  Claimed T0033 and created branch/worktree; scoping the review to content issues beyond automated schema checks.

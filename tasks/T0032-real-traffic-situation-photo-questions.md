---
id: T0032
owner: "@antigravity"
needs: []
branch: task/T0032-real-traffic-situation-photo-questions
worktree: ./work/T0032-real-traffic-situation-photo-questions
status: active
started: 2026-09-19
ended: —
---

# T0032: Integrate 10 Real-Live Traffic Situation Photo Questions

## Goals

Integrate 10 authentic real-live photo traffic situation questions into the quiz.
Filter questions dynamically by type using URL query parameters.
Pre-cache all situation photo assets in the Service Worker for offline support.
Preserve complete test coverage across schemas, images, and quiz functionality.

## Task Execution Steps

- [ ] **[Decide]**    Select 10 real-life traffic situation photo questions from official Flemish sources.
- [ ] **[Implement]** Store high-resolution situation photos in assets and register in questions data.
- [ ] **[Implement]** Add question type URL filtering and responsive photo rendering in interface.
- [ ] **[Implement]** Update Service Worker cache generator to pre-cache all situation photos.
- [ ] **[Verify]**    Verify automated tests, offline caching, and visual appearance on desktop and mobile.
- [ ] **[Doc]**       Document question provenance, Wegcode citations, and changelog updates.

## Execution Log

- [2026-09-19] **[Decided]**
  Claimed task T0032 to integrate 10 real-live traffic situation photo questions with URL type filtering.

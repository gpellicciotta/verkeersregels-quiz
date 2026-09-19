---
id: T0037
owner: "@antigravity"
needs: []
branch: task/T0037-sign-carousel-mode
worktree: ./work/T0037-sign-carousel-mode
status: needs-review
started: 2026-09-19
ended: —
---

# T0037: Sign Carousel Mode with Configurable Delay and Pause Controls

## Goals

Introduce automated traffic sign carousel mode activated via URL query parameters.
Display random traffic signs with explanations cycling at configurable delay intervals.
Support instant pause and resume via click, touch, keyboard spacebar, or UI controls.
Provide prominent visual indicators for paused state and time elapsed until next sign.

## Task Execution Steps

- [x] **[Implement]** Add carousel screen markup and styling with pause indicator and navigation controls.
- [x] **[Implement]** Implement carousel lifecycle, interval cycling, pause/resume handlers, and URL parameter parsing.
- [x] **[Implement]** Add keyboard accessibility for spacebar toggle and arrow key navigation.
- [x] **[Verify]**    Verify carousel timing, pause/resume behavior, and layout across desktop and mobile viewports.
- [x] **[Verify]**    Add automated unit tests covering URL activation, delay configuration, and pause controls.
- [x] **[Doc]**       Update documentation and record release deliverables in changelog and task log.

## Execution Log

- [2026-09-19] **[Decided]**
  Claimed task T0037 to implement sign carousel mode with configurable interval and interactive pause.

- [2026-09-19] **[Implement]**
  Added sign carousel markup, responsive card styling, prominent pause banner, and progress bar.

- [2026-09-19] **[Implement]**
  Implemented URL query activation, configurable interval cycling, interactive pause toggling, and keyboard navigation.

- [2026-09-19] **[Verify]**
  Captured before, running, paused, and mobile screenshots and validated all automated tests.

- [2026-09-19] **[Doc]**
  Recorded carousel deliverable in active changelog and updated task validation walkthrough.

## Walkthrough & Validation

### Changes Made

- `index.html`: added `#screen-carousel`, stage card, pause overlay, progress track, controls, and start link.
- `css/style.css`: added styles for carousel card, pause overlay banner, progress bar, and mobile responsive rules.
- `js/app.js`: implemented `getCarouselParams`, `startCarousel`, `toggleCarouselPause`, interval timer, and keyboard handlers.
- `tests/test_sign_carousel.py`: added 3 automated tests verifying DOM structure, styling, and JS lifecycle logic.
- `CHANGELOG.md`: documented sign carousel mode deliverable under active version `v2.0.1-pre`.

### Visual Validation

- [T0037-view-before.png](T0037-view-before.png): baseline start screen before changes.
- [T0037-view-after.png](T0037-view-after.png): running sign carousel displaying sign card, progress bar, and controls.
- [T0037-view-paused.png](T0037-view-paused.png): paused carousel state displaying prominent "Gepauzeerd" indicator and resume button.
- [T0037-view-mobile.png](T0037-view-mobile.png): mobile view demonstrating centered sign card, compact buttons, and full responsive layout.

### Verification Results

- `python -m unittest discover -s tests -v`: 26 of 26 tests passed in 0.48s.

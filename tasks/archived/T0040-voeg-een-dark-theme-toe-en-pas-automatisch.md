---
id: T0040
owner: "@gemini"
needs: []
branch: task/T0040-voeg-een-dark-theme-toe-en-pas-automatisch
worktree: ./work/T0040-voeg-een-dark-theme-toe-en-pas-automatisch
status: completed
started: 2026-09-21
ended: 2026-09-21
---
# T0040: Add Dark Theme and Theme Color Customization

## Goals

Implement a dark theme that automatically adapts to system color scheme preferences.
Support URL query parameters `?theme=dark`, `?theme=light`, and `?theme=system`.
Support primary accent theme color customization via `?theme-color=yellow|geel|red|rood|blue|blauw`.
Update all blue action buttons, badges, links, and highlights to match selected theme color.
Ensure seamless appearance across quiz, sign carousel, about screen, modals, and print views.

## Task Execution Steps

- [x] **[Implement]** Define CSS theme variables for dark theme and customizable primary accent color schemes.
- [x] **[Implement]** Implement theme and theme-color URL query parameter parsing and system preference listeners in app.js.
- [x] **[Verify]**    Verify dark theme and accent color rendering across all views with automated unit and visual tests.
- [x] **[Doc]**       Update changelog and service worker precache with theme enhancements and finalize task documentation.

## Execution Log

- [2026-09-21] **[Decided]**
  Claimed task T0040 to implement dark theme and customizable theme colors.

- [2026-09-21] **[Implement]**
  Defined CSS design tokens for dark theme and customizable theme colors (blue, yellow, red).
  Implemented `getThemeParam`, `getThemeColorParam`, `applyTheme`, and `initTheme` in `app.js`.

- [2026-09-21] **[Verify]**
  Added automated unit tests in `test_theme_and_color.py` with 47 of 47 tests passing.
  Captured visual verification screenshots confirming dark mode and color scheme rendering.

- [2026-09-21] **[Doc]**
  Updated `CHANGELOG.md` for `v3.1.1-pre` and regenerated `sw.js` asset precache.

- [2026-09-21] **[Complete]**
  Completed dark theme and theme color customizations across all views.

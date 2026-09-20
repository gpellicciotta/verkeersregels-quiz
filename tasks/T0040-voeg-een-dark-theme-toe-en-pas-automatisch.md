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

## Walkthrough & Validation

### Changes Made

- `css/style.css`: defined `:root` tokens for theme colors (`data-theme-color="yellow|red|blue"`) and dark mode (`data-theme="dark"`). Updated all component styles across start screen, quiz view, about screen, sign carousel, modals, and print stylesheet to use CSS variables.
- `js/app.js`: implemented `getThemeParam()`, `getThemeColorParam()`, `applyTheme()`, and `initTheme()` with dynamic `matchMedia` listener support for system preference changes.
- `index.html`: added early inline theme initialization script in `<head>` to ensure instantaneous theme application.
- `tests/test_theme_and_color.py`: added automated unit tests for query parameter parsing, alias resolution, DOM attribute setting, and CSS token coverage.
- `CHANGELOG.md`: added `## v3.1.1-pre` release bullet.
- `sw.js`: regenerated service worker asset precache for version `v3.1.1-pre`.

### Visual Validation

- [T0040-view-before.png](T0040-view-before.png): baseline start screen in default light theme.
- [T0040-view-after.png](T0040-view-after.png): start screen in light theme.
- [T0040-view-dark.png](T0040-view-dark.png): start screen in dark theme (`?theme=dark`).
- [T0040-view-theme-yellow.png](T0040-view-theme-yellow.png): start screen with yellow accent color (`?theme=light&theme-color=yellow`).
- [T0040-view-theme-red.png](T0040-view-theme-red.png): start screen with red accent color (`?theme=light&theme-color=red`).
- [T0040-view-dark-yellow.png](T0040-view-dark-yellow.png): start screen in dark theme with yellow accent color (`?theme=dark&theme-color=geel`).
- [T0040-view-dark-red.png](T0040-view-dark-red.png): start screen in dark theme with red accent color (`?theme=dark&theme-color=rood`).
- [T0040-view-dark-quiz.png](T0040-view-dark-quiz.png): active quiz screen in dark theme with answer feedback.
- [T0040-view-dark-result.png](T0040-view-dark-result.png): quiz result summary in dark theme.
- [T0040-view-dark-about.png](T0040-view-dark-about.png): about screen with changelog and sources in dark theme.
- [T0040-view-dark-carousel.png](T0040-view-dark-carousel.png): active sign carousel in dark theme.

### Verification Results

- `python -m unittest discover -s tests -v`: 47 of 47 tests passed.

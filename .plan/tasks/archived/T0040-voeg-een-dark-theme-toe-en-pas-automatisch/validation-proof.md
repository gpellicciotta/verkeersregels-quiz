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

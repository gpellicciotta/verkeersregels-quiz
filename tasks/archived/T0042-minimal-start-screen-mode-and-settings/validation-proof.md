### Changes Made

- `index.html`: replaced mode cards with single-line heading, description without question count, inline start row (`#player-name` and right-arrow `#btn-start`), divider, and separated circle buttons (blue action buttons on left including `#btn-install`, neutral tooltips on right). Standardized About, Carousel, and Result view close actions to transparent top-right `&times;` buttons. Moved Carousel navigation controls into top header and positioned progress counter centered below the progress track. Updated configuration modals with "10 vragen", "Welke borden tonen", and carousel options "Alle 198 verkeersborden", "vanaf 1990", "vanaf 2000", and "vanaf 2010". Centered "Quiz Resultaat" title with header spacer, added desktop `.quiz-bottom-meta` with round blue `#btn-report-error`, and added enactment warning container.
- `css/style.css`: styled `.start-meta-group`, `.start-meta-actions`, `.start-meta-info`, `.start-meta-btn-action`, `.view-close-btn`, 38px circular `.btn-carousel-ctrl`, and `.carousel-progress-wrap`. Removed dark pause overlay over carousel traffic signs. Added `.carousel-bottom-meta` and `.carousel-divider`. Styled centered `.result-header`, solid blue `.result-btn-round`, hidden `.filter-notice`, amber `.config-field-warning`, and round `.quiz-btn-report-round`. Pinned screen bottom metadata across quiz and carousel views to card bottom using `margin-top: auto` and flex containers.
- `js/app.js`: updated start description to avoid hardcoded question counts, wired pause/play controls, defaulted carousel auto-advance to 8 seconds, updated modal labels, and added carousel enactment year filtering. Maintained fixed start description without filter notices, populated enactment years with $\ge 10$ questions, added dynamic warning when requested count exceeds available questions, and wired desktop report error button. Implemented focus management ensuring `#btn-next` receives focus when an answer is selected and `#btn-carousel-toggle` receives focus in the carousel for immediate Enter-key activation.
- `tests/test_minimal_start_screen.py`: added automated unit tests covering minimal start screen layout, mode toggle, configuration modal labels, carousel header controls, view close buttons, centered result title, blue print button, config warning, desktop report button, bottom alignment flex rules, and autofocus behavior (37 total tests).
- `CHANGELOG.md`: documented UI and configuration refinements under `v3.0.1-pre`.

### Visual Validation

- [T0042-view-before.png](T0042-view-before.png): baseline start screen before redesign.
- [T0042-view-after.png](T0042-view-after.png): clean start screen in quiz mode with blue action buttons on left and neutral tooltips on right.
- [T0042-view-install.png](T0042-view-install.png): start screen with install app circle button in action group.
- [T0042-view-carousel.png](T0042-view-carousel.png): clean start screen in carousel mode with dynamic title and start button.
- [T0042-view-carousel-active.png](T0042-view-carousel-active.png): active carousel with top-centered circular controls, top-right close cross, and progress bar with centered counter.
- [T0042-view-carousel-paused.png](T0042-view-carousel-paused.png): paused carousel showing unobstructed traffic sign without large dark overlay.
- [T0042-view-about.png](T0042-view-about.png): full about view with centered title and top-right close cross.
- [T0042-view-config-quiz.png](T0042-view-config-quiz.png): quiz configuration modal showing enactment warning when requested questions exceed available count.
- [T0042-view-config-carousel.png](T0042-view-config-carousel.png): carousel configuration modal with "Welke borden tonen" and "Alle 198 verkeersborden".
- [T0042-view-quiz-desktop.png](T0042-view-quiz-desktop.png): desktop quiz view showing subtle divider and round blue "Meld fout" button at bottom.
- [T0042-view-results.png](T0042-view-results.png): quiz result view with centered "Quiz Resultaat" title, round blue print button, and top-right close cross.
- [T0042-view-mobile.png](T0042-view-mobile.png): mobile 390px view showing centered controls, top-right close cross, and card layout.

### Verification Results

- `python -m unittest discover -s tests -v`: 37 of 37 tests passed.
- `python scripts/bootstrap-dev-environment.py setup`: all tests and markdown linting passed cleanly.
- Review tier: Solo AI agent walkthrough approved by human reviewer.

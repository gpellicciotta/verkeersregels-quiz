### Changes Made

- `index.html`: centered start title, positioned bottom meta row (2 hint icons with tooltips + 1 Info/About button + copyright), added `#screen-about` full-window section with sources preceding version history.
- `css/style.css`: added `.start-title`, compact `.btn-install`, `.start-divider`, `.start-bottom-meta`, `.start-meta-bar` with CSS tooltips, side-by-side `.start-mode-selector` responsive rules, and `#screen-about` cards with bottom-pinned footers.
- `js/app.js`: added About screen lifecycle and navigation (`showScreen("about")`), wired `#btn-about` and `#btn-about-back`, rendered changelog in `#about-changelog-body`, enabled `?view=about`, and dynamically updated quiz mode question count.
- `tests/test_about_view.py`: added 4 automated tests covering start screen structure, About view DOM with sources-first ordering, CSS tooltip and bottom-meta styling, and JavaScript navigation.
- `CHANGELOG.md`: documented start screen cleanup and About view deliverable under `v2.0.1-pre`.

### Visual Validation

- [T0039-view-before.png](T0039-view-before.png): baseline start screen before changes with cluttered text paragraphs.
- [T0039-view-start.png](T0039-view-start.png): clean desktop start screen with centered title, side-by-side mode cards, and bottom-pinned metadata row.
- [T0039-view-start-mobile.png](T0039-view-start-mobile.png): mobile view (375x667) showing side-by-side choice cards, configuration, and bottom-pinned icon bar.
- [T0039-view-start-q10.png](T0039-view-start-q10.png): start screen with ?q=10 dynamically updating question count to 10 oefenvragen.
- [T0039-view-about.png](T0039-view-about.png): full-window desktop About view displaying sources first and version history second.
- [T0039-view-about-mobile.png](T0039-view-about-mobile.png): responsive mobile About view with sources card preceding version history.
- [T0039-view-tooltip.png](T0039-view-tooltip.png): tooltip hover state demonstrating contextual explanation above hint icon.
- [T0039-view-after.png](T0039-view-after.png): final desktop start view matching user specification.

### Verification Results

- `python -m unittest discover -s tests -v`: 30 of 30 tests passed in 0.32s.

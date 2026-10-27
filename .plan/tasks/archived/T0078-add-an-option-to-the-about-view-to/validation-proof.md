### Changes Made
- `js/icons.js`: added `heart` and `github` SVG paths to `ICON_DEFS`.
- `index.html`: added `.about-support-card` with GitHub Sponsors and voluntary donation links between sources and version history.
- `css/style.css`: styled `.about-support-card`, `.about-support-desc`, `.about-support-actions`, and `.about-support-link`.
- `data/strings.*.json`: added keys for support heading, description, GitHub button, and donation button across NL, EN, FR, DE, and IT.
- `tests/test_about_view.py`: added assertions for `.about-support-card` presence, link attributes, and ordering.
- `docs/specs/sponsorship-and-donations.md`: documented provider comparative matrix and architectural recommendations.
- `docs/requirements.md` & `docs/index.md`: documented About view support card requirements and linked specification.
- `CHANGELOG.md` (and translated changelogs): recorded the deliverable under `v3.5.1-pre`.

### Visual Validation
- [T0078-view-before.png](T0078-view-before.png): baseline About view before changes.
- [T0078-view-after.png](T0078-view-after.png): desktop About view with project support card and external links.
- [T0078-view-after-mobile.png](T0078-view-after-mobile.png): mobile view (375x667) showing responsive card and button wrapping.
- [T0078-view-after-dark.png](T0078-view-after-dark.png): dark theme About view validating color token inheritance.
- [T0078-view-after-fr.png](T0078-view-after-fr.png): French localized About view showing translated card content.

![Desktop After](T0078-view-after.png)

![Mobile After](T0078-view-after-mobile.png)

### Automated Checks
- `python -m pytest`: 153/153 passed.
- `node --test tests/gas-summary.test.cjs tests/stats.test.cjs`: 16/16 passed.

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, documentation, and visual evidence passed.

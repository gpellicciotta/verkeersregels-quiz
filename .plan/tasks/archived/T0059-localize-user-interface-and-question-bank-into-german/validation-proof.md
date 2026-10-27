### Changes Made
- `data/strings.de.json`: Added complete German translation dictionary for all UI text elements.
- `data/strings.nl.json`, `data/strings.fr.json`, `data/strings.en.json`: Added `lang.de` label entry.
- `data/translations.de.json`: Generated overlay covering all 324 questions, options, explanations, and road sign details.
- `scripts/translate-questions.py`: Added German glossary replacements for Belgian traffic terminology.
- `js/i18n.js`: Exported `SUPPORTED_LANGS` including `"de"` with validation.
- `js/app.js`: Updated language toggle button rotation (NL -> FR -> DE -> EN) and dynamic string refreshes.
- `sw.js`: Precached `data/strings.de.json` and `data/translations.de.json`.
- `tests/test_i18n.py`, `tests/test_colorblind_indicator.py`, `tests/test_result_share.py`, `tests/test_image_alt_accessibility.py`, `tests/test_sign_carousel_explanation.py`: Extended test suites for German validation.

### Automated Verification
```bash
pytest tests
```
Result: 94 passed in 0.58s.

### Visual Validation Evidence
- Baseline start screen (Dutch): [T0059-view-before.png](T0059-view-before.png)
- German start screen: [T0059-view-after.png](T0059-view-after.png)
- German carousel mode start: [T0059-view-carousel-de.png](T0059-view-carousel-de.png)
- German active quiz question: [T0059-view-quiz-de.png](T0059-view-quiz-de.png)
- German mobile viewport layout: [T0059-view-mobile-de.png](T0059-view-mobile-de.png)

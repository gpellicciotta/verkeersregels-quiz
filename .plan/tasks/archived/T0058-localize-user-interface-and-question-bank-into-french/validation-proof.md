### Changes Made
- `data/strings.fr.json`: Added complete French translation dictionary for all UI text elements.
- `data/strings.nl.json`, `data/strings.en.json`: Added `lang.fr` label entry.
- `data/translations.fr.json`: Generated overlay covering all 324 questions, options, explanations, and road sign details.
- `scripts/translate-questions.py`: Added French glossary replacements for Belgian traffic terminology.
- `js/i18n.js`: Exported `SUPPORTED_LANGS` including `"fr"` with validation.
- `js/app.js`: Updated language toggle button rotation (NL -> FR -> EN) and dynamic string refreshes.
- `js/quiz.js`: Fixed start screen error display timing during asynchronous question loading.
- `sw.js`: Precached `data/strings.fr.json` and `data/translations.fr.json`.
- `tests/test_i18n.py`, `tests/test_result_share.py`, `tests/test_sign_carousel_explanation.py`, `tests/test_image_alt_accessibility.py`: Extended test suites for French validation.

### Automated Verification
```bash
pytest
```
Result: 92 passed in 0.54s.

### Visual Validation Evidence
- Baseline start screen (Dutch): [T0058-view-before.png](T0058-view-before.png)
- French start screen: [T0058-view-after.png](T0058-view-after.png)
- French carousel mode start: [T0058-view-carousel-fr.png](T0058-view-carousel-fr.png)
- French active quiz question: [T0058-view-quiz-fr.png](T0058-view-quiz-fr.png)
- French mobile viewport layout: [T0058-view-mobile-fr.png](T0058-view-mobile-fr.png)

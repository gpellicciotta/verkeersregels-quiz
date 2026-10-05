---
id: T0058
owner: "@gemini"
needs: []
branch: task/T0058-localize-user-interface-and-question-bank-into-french
worktree: ./work/T0058-localize-user-interface-and-question-bank-into-french
status: completed
started: 2026-09-22
ended: 2026-09-22
---

# T0058: Localize User Interface and Question Bank into French

## Goals
Localize the complete user interface and all 324 quiz questions into French. Support French in the i18n module and language switcher alongside Dutch and English. Add French dictionary and translation overlay files with complete key and question coverage.

## Task Execution Steps
- [x] **[Read]**      Review existing i18n architecture, dictionary keys, and translation scripts.
- [x] **[Decide]**    Define French translation glossary and language switcher cycle order.
- [x] **[Implement]** Create data/strings.fr.json and generate data/translations.fr.json overlay.
- [x] **[Implement]** Update js/i18n.js, js/app.js, and sw.js for French language support.
- [x] **[Verify]**    Run test suite and capture visual screenshots of French UI views.
- [x] **[Doc]**       Update CHANGELOG.md, TODO.md, and record completed task file.

## Execution Log
- [2026-09-22] **[Read]**
  Reviewed i18n module, existing strings dictionaries, translation scripts, and test suites.

- [2026-09-22] **[Decided]**
  Adopted three-way language cycling order Dutch, French, English across UI and storage preferences.

- [2026-09-22] **[Implement]**
  Added complete French UI string dictionary and generated 324-question French translation overlay.
  - Created `data/strings.fr.json` with all UI dictionary keys.
  - Generated `data/translations.fr.json` via updated translation batch pipeline.
  - Extended `SUPPORTED_LANGS` in `js/i18n.js` and added language switcher cycling in `js/app.js`.
  - Added French dictionary and question overlays to `sw.js` precache assets.
  - Updated unit test suites for three-language string parity and question coverage.

- [2026-09-22] **[Verify]**
  Validated entire test suite with 92 passing tests and captured visual evidence across views.

- [2026-09-22] **[Doc]**
  Recorded French localization in `CHANGELOG.md` under active development version.

- [2026-09-22] **[Complete]**
  Integrated French language support across UI, question bank, service worker, and test suite.

## Walkthrough & Validation

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

---
id: T0057
owner: "@gemini"
needs: []
branch: task/T0057-the-carrousel-is-currently-re-using-the-correct
worktree: ./work/T0057-the-carrousel-is-currently-re-using-the-correct
status: completed
started: 2026-09-22
ended: 2026-09-22
---

# T0057: Use Separate Localized Road Sign Explanations in Carousel

## Goals
Replace reused quiz answers in the road sign carousel with clear, dedicated sign titles and explanations.
Provide standalone descriptions for all traffic signs rather than relying on multiple-choice question phrasing.
Ensure full Dutch and English localization for all sign titles and explanations in the carousel.

## Task Execution Steps
- [x] **[Read]**      Reviewed carousel rendering, question schema, and road sign explanation requirements.
- [x] **[Implement]** Added dedicated signTitle and signExplanation fields with Dutch and English translations.
- [x] **[Verify]**    Added unit test suite, confirmed 90 tests pass, and captured visual validation screenshots.
- [x] **[Doc]**       Updated changelog and recorded task execution history in task file.

## Execution Log
- [2026-09-22] **[Decided]**
  Claimed task T0057 to implement separate localized road sign explanations in the carousel.

- [2026-09-22] **[Implement]**
  Populated dedicated `signTitle` and `signExplanation` in `data/questions.json` and `data/translations.en.json`.
  - Updated `js/carousel.js` to render `signTitle` and `signExplanation` with `applyTranslation`.
  - Updated `js/quiz.js` to map sign fields in translation overlays.
  - Updated `js/app.js` to re-render active carousel card on language switches.
  - Enhanced `scripts/translate-questions.py` to extract and translate sign fields.

- [2026-09-22] **[Verify]**
  Created `tests/test_sign_carousel_explanation.py` and validated all 90 tests pass cleanly.
  - Captured desktop baseline, carousel Dutch, carousel English, and mobile screenshots.

- [2026-09-22] **[Doc]**
  Recorded release deliverable bullet in `CHANGELOG.md` under active development version `v3.1.1-pre`.

- [2026-09-22] **[Complete]**
  Completed standalone localized road sign explanations in carousel with full test and visual verification.

## Walkthrough & Validation

### Changes Made
- `data/questions.json`: Added `signTitle` and `signExplanation` across all 198 traffic sign questions.
- `data/translations.en.json`: Added English translations for `signTitle` and `signExplanation` for all 198 sign items.
- `js/carousel.js`: Updated `renderCarouselCard` to display `signTitle` and `signExplanation` with `applyTranslation`.
- `js/quiz.js`: Updated `applyTranslation` to overlay `signTitle` and `signExplanation`.
- `js/app.js`: Re-rendered active carousel cards when switching between Dutch and English languages.
- `scripts/translate-questions.py`: Added extraction and translation of `signTitle` and `signExplanation`.
- `tests/test_sign_carousel_explanation.py`: Added unit test suite validating sign fields across data and UI modules.

### Automated Verification
```bash
python -m pytest tests/
```
Result: 90 passed in 0.54s.

### Visual Validation Evidence
- Baseline start screen: [T0057-view-before.png](T0057-view-before.png)
- Carousel Dutch view with separate sign title and explanation: [T0057-view-after.png](T0057-view-after.png)
- Carousel English localized view: [T0057-view-en.png](T0057-view-en.png)
- Carousel mobile viewport view: [T0057-view-mobile.png](T0057-view-mobile.png)

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

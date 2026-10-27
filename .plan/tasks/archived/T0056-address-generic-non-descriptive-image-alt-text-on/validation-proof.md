### Changes Made
- `js/utils.js`: Added and exported `getSignCode` function to parse sign identifiers from SVG paths.
- `js/quiz.js`: Updated `renderQuestion`, `optionCell`, `questionCell`, and `applyTranslation` to apply descriptive sign code and custom alt text.
- `js/carousel.js`: Updated `renderCarouselCard` to display sign-code alt text on carousel images.
- `data/strings.nl.json` & `data/strings.en.json`: Added `quiz.image_alt_sign_code`, `quiz.option_img_alt_sign`, `result.image_alt_sign_code`, and `carousel.sign_img_alt_code`.
- `tests/test_image_alt_accessibility.py`: Created unit test suite checking template keys, utility extraction, and question image coverage.

### Automated Verification
```bash
python -m pytest tests/
```
Result: 84 passed in 0.49s.

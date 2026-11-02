### Changes Made
- `index.html`: Added `#quiz-status-indicator` with ARIA status role to the quiz header.
- `js/dom.js`: Cached `quizStatusIndicator` element.
- `js/quiz.js`: Added `createOptionIndicator` rendering SVG icons and text on answer selection.
- `data/strings.nl.json` & `data/strings.en.json`: Added `quiz.indicator_correct`, `quiz.indicator_wrong`, `quiz.status_correct`, and `quiz.status_wrong`.
- `css/style.css`: Added responsive styling for `.quiz-status-indicator`, `.quiz-status-badge`, `.option-btn`, and `.option-indicator`.
- `tests/test_colorblind_indicator.py`: Added automated regression suite validating elements, classes, and localization keys.

### Automated Verification
```bash
python -m pytest tests/
```
Result: 72 passed in 0.46s.

### Visual Validation Evidence
- Initial unanswered question: [T0054-view-before.png](T0054-view-before.png)
- Correct answer desktop view: [T0054-view-after.png](T0054-view-after.png)
- Wrong answer desktop view: [T0054-view-wrong.png](T0054-view-wrong.png)
- Correct answer mobile view: [T0054-view-mobile.png](T0054-view-mobile.png)
- Correct answer dark theme view: [T0054-view-dark.png](T0054-view-dark.png)

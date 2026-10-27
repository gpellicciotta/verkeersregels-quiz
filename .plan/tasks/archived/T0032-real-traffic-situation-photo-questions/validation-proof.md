### Changes Made

- `assets/situations/`: Added 10 JPEG photo assets covering priority, cycling infrastructure, lights, and officer signals.
- `data/questions.json`: Added questions `sit-01` to `sit-10` bringing total questions to 294.
- `data/SOURCES.md`: Added comprehensive attribution table for situation questions citing official Wegcode articles.
- `js/app.js`: Added type filter parsing (`t=` or `type=`), banner notice, and situation image CSS class toggle.
- `css/style.css`: Added `.situation-image` styling with responsive max-height, rounded corners, and shadow.
- `scripts/generate_sw.py` and `sw.js`: Updated pre-cache assets to include all situation photos (216 assets).
- `tests/`: Added automated tests in `test_quiz_data.py` and `test_pwa.py` covering situation photos and sw precache.
- `CHANGELOG.md`: Recorded content and frontend deliverables under `v2.0.1-pre`.

### Automated Verification

```pwsh
python -m unittest discover -s tests -v
```

Result: 18 passed in 0.347s.

### Visual Validation Evidence

- Start screen baseline: [T0032-view-before.png](T0032-view-before.png)
- Filtered start screen with notice: [T0032-view-after.png](T0032-view-after.png)
- Situation question view: [T0032-view-quiz.png](T0032-view-quiz.png)
- Answered situation question view: [T0032-view-answered.png](T0032-view-answered.png)
- Results table view: [T0032-view-result.png](T0032-view-result.png)

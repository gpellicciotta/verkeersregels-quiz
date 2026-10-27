### Changes Made

- `assets/situations/`: Added 20 JPEG photo assets (`sit-21` through `sit-40`) covering roundabouts, level crossings, bus lanes, woonerven, emergency vehicles, and cyclist interactions.
- `data/questions.json`: Added questions `sit-21` to `sit-40` bringing total question count to 324 (40 situation questions).
- `data/SOURCES.md`: Added legal citations and attribution records for all 20 new situation questions.
- `scripts/generate-sw.py` and `sw.js`: Updated pre-cache assets to include all 40 situation photos (247 total assets).
- `tests/test_quiz_data.py` and `tests/test_pwa.py`: Updated test assertions for 324 total questions and 40 situation photos.
- `CHANGELOG.md`: Added content note under `v3.1.1-pre`.

### Automated Verification

```pwsh
python -m unittest discover -s tests -v
```

Result: 47 passed in 0.217s.

### Visual Validation Evidence

- Start screen baseline: [T0044-view-before.png](T0044-view-before.png)
- Filtered situation mode: [T0044-view-after.png](T0044-view-after.png)
- Situation quiz view: [T0044-view-quiz.png](T0044-view-quiz.png)
- Answered question view: [T0044-view-answered.png](T0044-view-answered.png)
- Mobile situation view: [T0044-view-mobile.png](T0044-view-mobile.png)
- Results view: [T0044-view-result.png](T0044-view-result.png)

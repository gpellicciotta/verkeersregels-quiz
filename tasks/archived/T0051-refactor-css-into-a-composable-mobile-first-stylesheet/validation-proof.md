### Changes Made

- `css/style.css`: Restructured stylesheet into 13 modular sections using a mobile-first approach.
  - Replaced hardcoded hex colors with custom property tokens.
  - Standardized font sizes using `--font-size-xs` through `--font-size-2xl`.
  - Standardized border radii using `--radius-sm` through `--radius-round`.
  - Added `--color-on-primary: #0f172a` for yellow theme to achieve 5.28:1 contrast (WCAG AA).
  - Restored visible focus indicators on `.btn-about-close`, `.btn-carousel-close`, and `.result-btn-restart`.
- `tests/test_css_tokens.py`: Added automated test suite verifying tokens, contrast, focus rings, and specificity.

### Automated Verification

```bash
python -m pytest tests/
```

Result: 67 passed in 0.54s.

### Visual Validation Evidence

- Baseline desktop start view: [T0051-view-before.png](T0051-view-before.png)
- Refactored desktop start view: [T0051-view-after.png](T0051-view-after.png)
- Refactored yellow theme start view: [T0051-view-yellow.png](T0051-view-yellow.png)
- Refactored mobile start view: [T0051-view-mobile.png](T0051-view-mobile.png)

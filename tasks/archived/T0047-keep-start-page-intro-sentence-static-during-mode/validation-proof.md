### Changes Made

- `js/app.js`: `updateStartScreenNotice()` now sets `#start-desc` to the static sentence once,
  unconditionally, before branching on mode; the carousel branch no longer overwrites it with
  dynamic sign-count/"since" text, and the redundant duplicate assignment plus unused
  `signCount`/`delaySec` locals were removed.

### Automated Verification

```bash
python -m pytest tests/ -q
```

Result: 47 passed.

### Visual Validation Evidence

- Start screen, quiz mode baseline: [T0047-view-before.png](T0047-view-before.png)
- After toggling to carousel mode and changing the carousel "since" config filter:
  [T0047-view-after.png](T0047-view-after.png)
- Both captures show the identical intro sentence `"Oefen de verkeersregels en -borden."`;
  a Playwright script asserted this programmatically (`static: true`, no console errors).

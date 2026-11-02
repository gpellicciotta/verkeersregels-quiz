### Changes Made

- `js/app.js`: added `startTime`, `endTime`, and `durationSeconds` to `state`, recorded start timestamp in `startQuiz()`, implemented `formatDuration()` helper, updated `showResult()` to show duration, and included `duur` and `duur_tekst` in `submitToSheet()`.
- `google-apps-script/Code.gs`: expanded sheet headers to include `Duur (sec)` and `Duur`, and appended `p.duur` and `p.duur_tekst` row values.
- `README.md`: documented elapsed duration visibility on results screen and updated Google Sheet column documentation.
- `CHANGELOG.md`: recorded product change under `v1.0.0-pre`.

### Visual Validation

Visual checks on desktop confirmed that the results screen displays the formatted duration properly:

- Baseline view shows results summary without duration (`Je scoorde 20/20 (100%).`).
- After view shows results summary with formatted duration (`Je scoorde 20/20 (100%) in 1 min 24 sec.`).

![Baseline Results View](T0008-view-before.png)

![Results View with Duration](T0008-view-after.png)

### Automated Checks

- Helper validation: verified `formatDuration()` across unit test cases (e.g. 1 sec, 45 sec, 1 min, 1 min 24 sec, 2 min, 2 min 5 sec, 60 min).
- Markdown linting: passed for `README.md`, `CHANGELOG.md`, and this task file.
- Taskfile linting: passed for this task file.

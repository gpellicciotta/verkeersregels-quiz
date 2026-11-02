### Changes Made

- `js/app.js`: updated `showResult` to add semantic column classes (`col-num`, `col-question`, `col-user-ans`, `col-correct-ans`, `col-result`), combine question numbering into `data-label="Vraag Nr. ${i + 1}"`, merge correct user answers into `data-label="Jouw Juiste Antwoord"`, and render `.badge-result` elements.
- `css/style.css`: styled `.badge-result` (`.badge-result-correct`, `.badge-result-wrong`) as pill-shaped badges (`border-radius: 9999px`, padding `2px 10px`).
- `css/style.css`: updated `@media screen and (max-width: 639px)` to hide `.col-num`, hide `.col-correct-ans` when `correct-row`, position `.col-result` as a top-right badge, reduce card vertical padding to `8px 12px`, and set an `8px` vertical gap (`margin-bottom: 8px`) between cards.
- `css/style.css`: reinforced `@media print` rules to ensure full tabular display is preserved across all viewports.

### Visual Validation

Visual checks across mobile and desktop viewports confirmed:

- **Vertical gap**: clear 8px vertical separation between cards on mobile.
- **Top-right pill badge**: "Juist" and "Fout" badges rendered as compact pills at the top-right corner of each card.
- **Combined question header**: "Vraag Nr. ###" displayed directly above question content without a separate number row.
- **Unified answer on correct responses**: single "Jouw Juiste Antwoord" field shown on correct cards with redundant answer row omitted.
- **Detailed wrong responses**: "Jouw antwoord" and "Juist antwoord" both preserved on incorrect cards for learning.
- **Desktop & Print compatibility**: clean 5-column table display maintained on desktop and in print view.

![Baseline Mobile Results Screen](T0004-view-before.png)

![Condensed Mobile Results Screen](T0004-view-after.png)

### Automated Checks

- Markdown linting: passed via `lint-markdown.py`.
- Taskfile linting: passed via `lint-taskfile.py`.

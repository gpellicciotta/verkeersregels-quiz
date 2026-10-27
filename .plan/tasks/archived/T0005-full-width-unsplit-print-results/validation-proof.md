### Changes Made

- `css/style.css`: configured `@page { size: auto; margin: 12mm 15mm; }` for standard printable paper margins.
- `css/style.css`: expanded `body`, `#app`, `#screen-result`, and `#result-table` to `100%` width with `padding: 0`, `margin: 0`, and removed container card shadows and border radii in `@media print`.
- `css/style.css`: enforced strict tabular display (`display: table !important`, `table-layout: auto !important`, `border-collapse: collapse !important`).
- `css/style.css`: enabled automatic repeating table headers across printed pages with `thead { display: table-header-group !important; }`.
- `css/style.css`: prevented table rows and cells from breaking across pages with `break-inside: avoid !important` and `page-break-inside: avoid !important` on `tr` and `td`/`th`.
- `css/style.css`: preserved badge colors and contrast in print output via `print-color-adjust: exact` and `-webkit-print-color-adjust: exact`.

### Visual Validation

Visual checks using Chrome DevTools Protocol print emulation confirmed:

- **Full width**: the results summary and table expand across the entire available page width instead of being constrained to 620px.
- **Unsplit table rows**: each row remains intact on a single page, avoiding awkward page cuts across question text or answers.
- **Repeating table header**: table column headers repeat at the top of each subsequent printed page.
- **Pill badge and color preservation**: "Juist" and "Fout" badges retain colored borders and backgrounds.
- **Crisp typography and spacing**: table cells use compact padding and clean borders for paper printouts.

![Baseline Print Results View](T0005-view-before.png)

![Full-Width Unsplit Print Results View](T0005-view-after.png)

### Automated Checks

- Markdown linting: passed via `lint-markdown.py`.
- Taskfile linting: passed via `lint-taskfile.py`.

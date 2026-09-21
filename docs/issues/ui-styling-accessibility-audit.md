# UI Styling and Accessibility Audit

Deterministic review of `index.html` and `css/style.css` for styling
inconsistencies and accessibility issues, run for task
[T0046](../../tasks/T0046-review-user-interface-for-styling-inconsistencies-and-accessibility.md).
All findings below were produced with reproducible checks (`grep`, WCAG
contrast-ratio computation, and source inspection), not subjective review.

## Summary

- 3 accessibility findings rated High.
- 2 accessibility findings rated Medium.
- 4 styling-consistency findings rated Low, feeding into
  [T0051](../../TODO.md).
- 1 informational note with no required action.

## High: Yellow theme button text fails WCAG AA contrast

`.btn-primary` and `.btn-start-arrow` render `color: white` on
`background: var(--color-primary)`. Computed contrast ratio of white text
against the yellow theme's `--color-primary` value:

- Light mode (`#ca8a04`): 2.94:1.
- Dark mode (`#d97706`): 3.19:1.

Both fail the WCAG AA 4.5:1 minimum for normal text. The default blue and
red themes pass (6.18:1 and 4.83:1 respectively). The yellow theme is a
supported, user-selectable option (`?theme-color=yellow` / `geel`), so this
affects real users, not just an edge case.

Reproduction: compute WCAG relative luminance for `#ffffff` vs
`--color-primary` per `:root[data-theme-color="yellow"]`
(`css/style.css:34-43`) and `:root[data-theme="dark"][data-theme-color="yellow"]`
(`css/style.css:94-103`).

Recommendation: darken the yellow theme's `--color-primary` (or switch
button text to a dark color for that theme) as part of T0051's token
cleanup.

## High: Focus indicator removed without replacement on three close buttons

Three `:focus-visible` rules set both `outline: none` and `box-shadow: none`,
leaving only a `rgba(0, 0, 0, 0.05)` background tint as the sole focus cue:

- `.btn-about-close:focus-visible`, `.btn-about-back:focus-visible`
  (`css/style.css:576-585`).
- `.result-btn-restart:focus-visible` (`css/style.css:1142-1149`).
- `.btn-carousel-close:focus-visible`, `.btn-carousel-exit:focus-visible`
  (`css/style.css:2148-2157`).

A 5%-opacity black tint is far below the 3:1 non-text contrast WCAG 1.4.11
expects for a focus indicator, so keyboard users tabbing to the About,
Result, or Carousel close ("×") button get no visible focus ring. This is
inconsistent with the sibling `.modal-close` base rule (`css/style.css:1425-1441`),
which keeps the browser's native outline, and with every other
`:focus-visible` rule in the sheet, which pairs `outline: none` with a
`box-shadow` ring (see `css/style.css:408-425`, `2237-2244`, `2266-2273`).

Recommendation: give these three rules the same `box-shadow` focus ring used
elsewhere, as part of T0051.

## High: Quiz answer correctness conveyed by color alone

After answering, `.option-btn.correct` / `.option-btn.wrong` change only
`border-color`, `background`, and `color` (`css/style.css:960-969`); no icon
or text is added to the option itself (`js/app.js:582-591`). Green vs. red
is the classic problem pair for deuteranopia/protanopia, so colorblind users
have no non-color way to tell which option was correct from the option list
alone (the row does duplicate this correctly via a text badge, but that is
in the result table, not on the quiz screen itself).

Recommendation: add a small ✓/✗ icon or text suffix to the option button
in addition to the color change. Filed as new task T0054 below (not part of
T0051's CSS-only scope, since it needs a markup change).

## Medium: Result table headers lack `scope`

`<th>#</th>`, `<th>Vraag</th>`, etc. in `#result-table` (`index.html:307-316`)
have no `scope="col"` attribute, so screen readers cannot reliably announce
the column header when a user navigates into a data cell (WCAG 1.3.1).
Filed as new adhoc task A0055 below (single-file, low-risk fix).

## Medium: Generic, non-descriptive image alt text

`js/app.js:516` sets `alt` to the fixed string `"Verkeersbord"` or
`"Verkeerssituatie"` for the question image, and `js/app.js:531` sets
`"Optie N"` for answer-option images. `data/questions.json` has no
human-readable sign-name field to draw from (only an SVG asset path), so
none of this alt text actually identifies which sign is shown.

For a quiz whose content is "recognize this sign," this means screen-reader
users cannot answer image-based questions from the accessible name alone.
Fixing this well requires a product decision (add a name/description field
per sign to the data model, or accept the limitation as a documented gap
for this release) rather than a quick markup fix, so it is filed as new
task T0056 below rather than actioned here.

## Low: Styling-consistency findings (feed into T0051)

- **137 hardcoded hex colors outside `:root`**, despite 83 defined custom
  properties. Several exactly duplicate an existing token's value instead of
  using `var(...)`, risking future light/dark drift: `#ffffff` (18×),
  `#b91c1c` (6×), `#1e293b` (6×), `#f1f5f9` (4×), `#0f172a` (3×), `#cbd5e1`
  (3×), `#e2e8f0` (2×).
- **108 `!important` declarations** across the sheet, indicating specificity
  fights rather than a clean cascade.
- **No typographic scale**: 28 distinct ad hoc `font-size` values in use
  (from `0.70rem` to `1.8rem`, plus two `em`-based outliers), with no
  smaller token set to pick from.
- **`--radius: 10px` token defined but mostly bypassed**: 7 different
  hardcoded `border-radius` values appear instead (`4px`, `6px`, `8px`,
  `12px`, `16px`, `50%`, `9999px`).

Reproduction: `grep -oE "#[0-9a-fA-F]{6}" css/style.css | sort | uniq -c`,
`grep -c "!important" css/style.css`, `grep -oE "font-size:\s*[0-9.]+(rem|em)"
css/style.css | sort -u`, `grep -oE "border-radius:\s*[0-9]+(px|%)"
css/style.css | sort | uniq -c`.

Recommendation: this is exactly the token/composability debt T0051 is
scoped to address; no separate task needed.

## Informational: Four `<h1>` elements in one document

`index.html` has four top-level `<h1>` elements (start, about, result,
carousel screens), one per SPA "screen." This is mitigated at runtime:
inactive screens carry `.hidden`, which resolves to `display: none
!important` (`css/style.css:151`), removing them from the accessibility
tree, so only one `<h1>` is ever exposed to assistive tech at a time.
Flagged for awareness only; no WCAG failure and no action required.

## Checks that passed

- No duplicate `id` attributes in `index.html`.
- No positive `tabindex` values; the only `tabindex="0"` uses are on
  genuinely focusable informational hints.
- Every form control (`<input>`, `<select>`, `<textarea>`) has an associated
  `<label>` or `aria-label`; the two unlabeled radio inputs are inside an
  `aria-hidden="true"` wrapper and are not exposed to assistive tech.
- `lang="nl"` is set on `<html>`.
- Body text contrast (`--color-text` on `--color-bg`), muted text contrast,
  and correct/wrong badge text contrast all pass WCAG AA in both themes and
  all three theme colors (blue, red; yellow only fails for button text, see
  above).
- Result-row correctness is also conveyed as text ("Juist"/"Fout"), not
  color alone.

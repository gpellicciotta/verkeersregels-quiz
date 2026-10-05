---
id: T0046
owner: "@claude"
needs: []
branch: task/T0046-review-user-interface-for-styling-inconsistencies-and-accessibility
worktree: ./work/T0046-review-user-interface-for-styling-inconsistencies-and-accessibility
status: completed
started: 2026-09-21
ended: 2026-09-21
---

# T0046: Review User Interface for Styling Inconsistencies and Accessibility Issues

## Goals

Audit `index.html` and `css/style.css` for styling inconsistencies and
accessibility issues using deterministic, reproducible checks (grep-based
inventories and WCAG contrast-ratio computation), not subjective visual
review. Produce a findings document and file follow-up tasks, since fixing
is out of scope here (T0051 already covers the CSS token refactor this
audit feeds into).

## Task Execution Steps

- [x] **[Read]**      Reviewed `index.html` and `css/style.css` structure, tokens, and theme variants.
- [x] **[Verify]**    Ran deterministic checks: WCAG contrast ratios, hardcoded-color/`!important`/font-size/border-radius inventories, duplicate-ID, label, and tabindex scans.
- [x] **[Doc]**       Recorded findings in `docs/issues/ui-styling-accessibility-audit.md`.
- [x] **[Decide]**    Human sign-off on severity/priority and on the three new follow-up tasks filed below.

## Execution Log

- [2026-09-21] **[Decided]**
  Claimed task T0046 to audit the UI for styling inconsistencies and
  accessibility issues.

- [2026-09-21] **[Verify]**
  Computed WCAG contrast ratios for all theme/color combinations in
  `:root` and `[data-theme="dark"]`; found the yellow theme's primary
  button text fails AA (2.94:1 light, 3.19:1 dark).
  - Grepped `outline: none` occurrences (13) and found 3 button variants
    that strip both outline and box-shadow, leaving only a 5%-opacity
    background as the focus indicator.
  - Confirmed quiz answer correctness is color-only (no icon/text) on the
    option buttons themselves.
  - Confirmed result table `<th>` cells lack `scope`, and image `alt` text
    is generic/non-descriptive for a sign-recognition quiz.
  - Inventoried styling debt: 137 hardcoded hex colors outside `:root`
    (several duplicating existing tokens), 108 `!important` declarations,
    28 ad hoc `font-size` values, and 7 hardcoded `border-radius` values
    despite a `--radius` token.
  - Checks that passed: no duplicate IDs, no positive `tabindex`, all
    form controls labeled, `lang="nl"` set, body/muted/badge text contrast
    all pass AA.

- [2026-09-21] **[Doc]**
  Wrote up all findings with reproduction steps and recommendations in
  `docs/issues/ui-styling-accessibility-audit.md`.

- [2026-09-21] **[Complete]**
  Human approved all recommendations. Yellow-contrast and focus-ring fixes
  fold into T0051. T0054, A0055, and T0056 remain as filed; T0056 scope
  includes adding a descriptive name field per sign to `questions.json`.

## Validation Record / Progress Log

Review summary: 3 High and 2 Medium accessibility findings, 4 Low
styling-consistency findings (all feeding into T0051's existing scope),
and 1 informational note requiring no action. Full detail with reproduction
steps in `docs/issues/ui-styling-accessibility-audit.md`.

No code was changed in this task; `index.html` and `css/style.css` are
untouched. Follow-up tasks added to `TODO.md`:

- T0054 (Full): add a non-color correct/wrong indicator to quiz options.
- A0055 (Adhoc): add `scope="col"` to the result table headers.
- T0056 (Full): address generic/non-descriptive image alt text.

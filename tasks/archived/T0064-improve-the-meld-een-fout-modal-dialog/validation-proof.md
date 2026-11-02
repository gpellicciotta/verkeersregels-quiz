### Changes Made

- `index.html`: wrapped the modal-report title in an icon span plus text span; reordered the form body to
  remark label/textarea, then the "include context" checkbox, then the (now `id`-tagged) question-context box.
- `css/style.css`: added `.modal-title-icon` and `.modal-checkbox-label` styles, and `white-space: pre-line`
  on `.modal-desc` so the two-sentence intro renders on separate lines.
- `js/dom.js`: added `modalQuestionSummary` and `reportIncludeContext` element references.
- `js/report-modal.js`: reset the checkbox to checked and the context box to visible on open; added
  `toggleReportContextVisibility()`; `handleReportSubmit` now reads the checkbox and forwards it.
- `js/report-queue.js`: `submitErrorReport` gained an `includeContext` parameter (default `true`) that
  omits the question id/text from the submitted payload when the checkbox is unchecked.
- `data/strings.{nl,en,de,fr,it}.json`: updated `report.label_remark`, added `report.label_include_context`,
  and split `report.description`/`report.description_offline` onto two lines.

### Visual Validation

Verified locally with a static HTTP server (`http.server`, HTTP 200) driven by Playwright at
`?mode=quiz&report=1`, viewport 500x800:

- Title now shows the report flag icon before "Meld een fout".
- Intro renders as two separate lines.
- "Opmerking of toelichting:" (no longer "(optioneel)") leads with its textarea.
- The "Vraagcontext meesturen:" checkbox, checked by default, precedes the visible context box.
- Unchecking the checkbox hides the context box immediately.

![Before](T0064-view-before.png)

![After, context checked](T0064-view-after.png)

![After, context unchecked](T0064-view-after-unchecked-context.png)

### Automated Checks

- `python -m pytest tests/ -q`: 114 passed, 8 subtests passed.
- Manual Playwright smoke test: no console errors on load or checkbox toggle.

### Review Tier

Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and visual
verification all passed, so this task integrates directly per the coordination protocol.

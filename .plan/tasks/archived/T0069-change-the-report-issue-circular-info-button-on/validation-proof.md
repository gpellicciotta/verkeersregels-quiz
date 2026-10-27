### Changes Made
- `index.html`: replaced the start screen's decorative hint `<span>` with a real `<button
  id="btn-report-start">`; added matching round report buttons `#btn-report-about`,
  `#btn-report-result`, `#btn-report-carousel`, and `#btn-report-config` (in the settings
  modal header) reusing the existing round-icon-button styles.
- `js/dom.js`: added element references for the five new report buttons.
- `js/app.js`: wired each new button's click handler to the existing `openReportModal`.
- `js/report-modal.js`: added `getReportContext()`, which inspects which screen/modal is
  currently visible (settings modal takes priority, then carousel, quiz, result, about, else
  start) and returns `{ id, text }` — the current question, the current carrousel sign, or the
  view's i18n name. `openReportModal` captures this into `currentReportContext` and shows/hides
  the question-id prefix accordingly; `handleReportSubmit` forwards the captured context instead
  of reading `state.round[state.currentIndex]` directly.
- `js/report-queue.js`: `submitErrorReport` now takes a generic `context` (`{ id, text }`)
  instead of a quiz question object; the Google Sheet payload shape (`vraagId`, `vraag`, etc.)
  is unchanged.
- `data/strings.{nl,en,de,fr,it}.json`: added `report.btn_generic_aria`/`_tooltip` and the five
  `report.view_*` view-name strings ("Start scherm", "Instellingen scherm", "Quiz resultaten",
  "Over deze app", the carousel fallback).
- `css/style.css`: added `.start-meta-btn-action`, `.btn-report-round` (+ `-sm` variant), and
  `.modal-header-actions` styles so the new buttons match the existing round icon buttons.
- `tests/test_about_view.py`: updated the start-screen markup assertions for the new button.
- `tests/report-issue-browser.cjs` (new): Playwright regression test exercising the report
  button and its default context on all six entry points.

### Visual Validation
Served locally with `python -m http.server` (HTTP 200 confirmed) and driven by Playwright at
1280x900:
- Start screen: the old plain decorative flag hint is now a solid-blue clickable button; opening
  it shows "Start scherm" as context with no question-id prefix.
- Quiz screen: existing per-question report button unchanged, still shows the question and a
  "Vraag ..." id prefix.
- Carousel: report button opens with the current sign's title as context.
- Result screen: opens with "Quiz resultaten" as context.
- About screen: opens with "Over deze app" as context.
- Settings modal: report button opens the report modal on top, with "Instellingen scherm" as
  context; the settings modal stays open underneath and closing the report modal doesn't close it.

![Before (original decorative icon)](T0069-view-before.png)

![After (real report button)](T0069-view-after.png)

![Start screen modal](T0069-start-modal.png)

![Carousel screen + modal](T0069-carousel-modal.png)

![Result screen + modal](T0069-result-modal.png)

![About screen + modal](T0069-about-modal.png)

![Settings modal + report modal](T0069-config-modal.png)

### Automated Checks
- `python -m pytest tests/ -q`: 128 passed, 8 subtests passed.
- `node tests/report-issue-browser.cjs --screenshots`: PASS, no browser console errors, all six
  context assertions correct.

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and visual
verification all passed, so this task integrates directly per the coordination protocol.

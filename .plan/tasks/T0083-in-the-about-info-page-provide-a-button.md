---
id: T0083
owner: "@claude"
needs: []
branch: task/T0083-in-the-about-info-page-provide-a-button
worktree: ./work/T0083-in-the-about-info-page-provide-a-button
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0083: Print all Belgian road signs from the About page

## Goals
The About page explains the app's sources but gives no way to study the full sign set
offline. Add a button there that prints a document listing every Belgian road sign the
quiz covers, one table per Wegcode series (A-F), in the same order wegcode.be presents
them, with each sign's image, code, title, explanation, and a link to its Wegcode
article. Reuse the existing question bank's per-sign data instead of adding a new data
file, and keep the printed output isolated from the existing quiz-result print feature.

## Task Execution Steps
- [x] **[Read]**           Inspect `data/questions.json` for per-sign title, explanation and wegcode.be source fields.
- [x] **[Decided]**        Derive series order (A-F) and per-sign wegcode.be links from existing question data, not a new file.
- [x] **[Implement]**      Add `js/signs-doc.js` building the deduplicated, wegcode.be-ordered sign catalog and the print flow.
- [x] **[Implement]**      Add the print button and hidden print-only document container to `index.html`.
- [x] **[Implement]**      Add print-only CSS scoped to a `body.printing-signs-doc` toggle class.
- [x] **[Implement]**      Add `about.print_signs_btn` and `signs_doc.*` i18n keys to all 5 language files.
- [x] **[Verify]**         Run the full pytest suite plus a new Playwright browser test with before/after screenshots.
- [x] **[Doc]**            Update `docs/requirements.md`, `docs/devops.md`, and `CHANGELOG.md`.

## Execution Log
- [2026-09-24] **[Read]**
  Found every sign-bearing question already carries `signTitle`, `signExplanation`,
  and a `source` wegcode.be article link (`#art-66`..`#art-71` for series A-F), across
  197 unique signs; a handful of `rule`-type questions cite unrelated pages for the
  same sign, so the catalog prefers the `recognize`-type question per sign.

- [2026-09-24] **[Implement]**
  Added `js/signs-doc.js` (`buildSignCatalog`, `renderSignsPrintDocument`,
  `printSignsDocument`), a print button in the About sources card, a hidden
  `#print-signs-document` container, and print CSS gated on a `body.printing-signs-doc`
  class so it never interferes with the existing quiz-result print feature.

- [2026-09-24] **[Verify]**
  Added `tests/test_signs_print_document.py` (8 tests, data-level catalog ordering and
  i18n parity) and `tests/signs-print-browser.cjs` (Playwright); ran the full pytest
  suite (168 passed) and the browser test (0 errors, 197 signs across 6 series in
  order) against both baseline and implemented code.
  - Baseline screenshot: [T0083-view-before.png](T0083-view-before.png).
  - Implemented screenshot: [T0083-view-after.png](T0083-view-after.png).
  - Printed output screenshot: [T0083-printing.png](T0083-printing.png).

- [2026-09-24] **[Complete]**
  Added a print-all-signs button to the About page producing a wegcode.be-ordered,
  6-series document of all 197 signs with images, explanations, and article links;
  168 automated tests pass; validated visually via Playwright screenshots.

## Walkthrough & Validation
- Changed files: `index.html`, `css/style.css`, `js/app.js`, `js/dom.js`,
  `js/signs-doc.js` (new), `data/strings.{nl,en,fr,de,it}.json`, `docs/requirements.md`,
  `docs/devops.md`, `CHANGELOG.md`, `tests/test_signs_print_document.py` (new),
  `tests/signs-print-browser.cjs` (new).
- `py -m pytest tests/ -q` → 168 passed, 8 subtests passed.
- `node tests/signs-print-browser.cjs --baseline` against the unmodified `main` server →
  PASS (button absent).
- `node tests/signs-print-browser.cjs --screenshots` against the implemented worktree
  server → PASS, 0 page errors, 197 signs across 6 series, all links host
  `www.wegcode.be`.
- **[Visual]** See `T0083-view-before.png`, `T0083-view-after.png`, and
  `T0083-printing.png` in this directory.
- Review tier: solo AI agent, pre-authorized autonomous-loop integration per the
  coordination protocol; changes committed locally on `main`, never pushed per this
  repository's `CLAUDE.md`.

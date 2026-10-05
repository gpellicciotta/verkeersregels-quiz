---
id: T0086
owner: "@claude"
needs: []
branch: task/T0086-improve-sign-printout-and-about-hint
worktree: ./work/T0086-improve-sign-printout-and-about-hint
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0086: Improve the road-sign printout and clean up an About-page hint

## Goals
The all-signs printout (T0083) works but has rough edges: the "Wetsartikel" column
links to the source without showing which article it is, series don't start on a
fresh printed page, the suggested PDF filename is a generic browser default, and
there is no direct PDF export shortcut. Separately, the About page's "Gebruikte
bronnen & wetgeving" card repeats a hint sentence that is already shown elsewhere.
Fix each of these in the existing `js/signs-doc.js` / print-CSS feature without
adding new dependencies, and remove the redundant hint sentence from the sources
card across all 5 languages.

## Task Execution Steps
- [x] **[Read]**           Confirm every catalog sign's `recognize` source resolves to a `#art-NN` wegcode.be fragment.
- [x] **[Decided]**        Derive the article number from the existing `source` URL fragment instead of new data.
- [x] **[Implement]**      Show "Artikel {number}" as the source link text per row in `js/signs-doc.js`.
- [x] **[Implement]**      Add a page break before each series title except the first in the print CSS.
- [x] **[Implement]**      Set `document.title` to the requested filename during print, restored after.
- [x] **[Implement]**      Add an "Exporteren als PDF" button next to "Afdrukken" reusing the same print flow.
- [x] **[Implement]**      Remove the redundant `about.law_hint` sentence from the About sources card in `index.html`.
- [x] **[Verify]**         Run the full pytest suite and a Playwright check of the printed document and About card.
- [x] **[Doc]**            Update `CHANGELOG.md` (all languages) and `docs/requirements.md` / `docs/devops.md`.

## Execution Log
- [2026-09-24] **[Read]**
  Verified all 197 catalog signs use their `recognize` question as source, and every
  one resolves to `#art-66`..`#art-71`; no fallback article-number format is needed.

- [2026-09-24] **[Implement]**
  Parsed the article number in `buildSignCatalog` via `extractArticleNumber`, changed
  the source cell to show `Artikel {number} ↗` as link text (`signs_doc.article_label`,
  all 5 languages), added `break-before: page` on `.signs-doc-series-title:not(:first-of-type)`,
  set/restored `document.title` to `signs_doc.print_filename` around `window.print()`,
  added a second "Exporteren als PDF" button (new `download` icon) reusing
  `printSignsDocument()`, and removed the `about.law_hint` paragraph plus its now-orphaned
  `.start-legal-hint` CSS rule from the sources card.

- [2026-09-24] **[Verify]**
  Extended `tests/test_signs_print_document.py` (8 new/updated assertions) and
  `tests/signs-print-browser.cjs` (article-number text, title swap/restore, PDF-export
  button); fixed a stale `start-legal-hint` assertion in `tests/test_ux_layout.py`. Full
  pytest suite: 172 passed, 8 subtests passed (up from 168). Playwright run against the
  worktree: 197 signs across 6 series, 0 page errors, article links, title swap/restore,
  and PDF-export button all confirmed.
  - Baseline screenshot: [T0086-view-before.png](T0086-view-before.png) (reused
    `T0083-view-after.png` as the pre-change state; this task only edits an existing
    feature, no absent-button baseline applies).
  - Implemented screenshot: [T0086-view-after.png](T0086-view-after.png).
  - Printed output screenshot: [T0086-printing.png](T0086-printing.png).

- [2026-09-24] **[Doc]**
  Updated `docs/requirements.md` (About view bullet) and `docs/devops.md` (Signs Print
  Document Browser Checks section) to describe the article numbers, per-series page
  breaks, filename, and PDF-export button; added a `CHANGELOG.md` bullet in all 5
  languages under the active `v3.8.0-pre` heading.

- [2026-09-24] **[Complete]**
  Road-sign printout now shows real article numbers, paginates per series, suggests a
  descriptive filename, offers a PDF-export shortcut, and the About card lost its
  redundant hint sentence; 172 automated tests pass.

## Walkthrough & Validation
- Changed files: `index.html`, `css/style.css`, `js/signs-doc.js`, `js/icons.js`,
  `js/dom.js`, `js/app.js`, `data/strings.{nl,en,fr,de,it}.json`, `tests/test_signs_print_document.py`,
  `tests/test_ux_layout.py`, `tests/signs-print-browser.cjs`, `docs/requirements.md`,
  `docs/devops.md`, `CHANGELOG.md` (all 5 languages), `sw.js` (regenerated).
- `python -m pytest tests/ -q` → 172 passed, 8 subtests passed.
- `node tests/signs-print-browser.cjs --screenshots` (via a clean local static server,
  `NODE_PATH` pointed at the main checkout's `node_modules`) → PASS, 0 page errors, 197
  signs across 6 series, article links to `www.wegcode.be` all showing "Artikel N ↗",
  document title swaps to "VerkeersQuiz - ..." while printing and restores after
  `afterprint`, and the PDF-export button also triggers the print flow.
- **[Visual]** See `T0086-view-after.png` and `T0086-printing.png` in this directory;
  the printed table's "Wetsartikel" column now shows real "Artikel 66 ↗" links instead
  of a generic "Wegcode.be ↗" label, and the sources card shows both action buttons
  side by side with the redundant hint sentence gone.
- Review tier: solo AI agent, pre-authorized autonomous-loop integration per the
  coordination protocol; changes committed locally on `main`, never pushed per this
  repository's `CLAUDE.md`.

- [2026-09-24] **[Implement]**
  Follow-up in the same conversation: removed the "Exporteren als PDF" button again
  since it triggered the identical `printSignsDocument()` flow as "Afdrukken" (the
  browser's own print dialog already offers "Save as PDF" as a destination), making
  two buttons for one action. Reverted `index.html`, `css/style.css` (dropped the
  `.about-signs-print-actions` wrapper, restored the single full-width button), the
  `download` icon in `js/icons.js`, the `btnExportSignsPdf` wiring in `js/dom.js` /
  `js/app.js`, the `about.export_signs_pdf_btn` key in all 5 languages, the related
  test assertions, and the PDF-export mentions in `docs/requirements.md`,
  `docs/devops.md`, and `CHANGELOG.md` (all 5 languages, still unreleased `-pre` so
  safe to edit in place). Also fixed a separately reported bug the same day: sign
  icons could be missing on the very first print because `window.print()` fired
  before the freshly inserted `<img>` thumbnails had loaded; `printSignsDocument()`
  now awaits each thumbnail's `decode()` first. Full pytest suite: 173 passed, 8
  subtests passed.

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

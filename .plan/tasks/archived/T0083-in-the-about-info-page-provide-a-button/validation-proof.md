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

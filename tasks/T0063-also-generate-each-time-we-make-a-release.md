---
id: T0063
owner: "@claude"
needs: []
branch: task/T0063-also-generate-each-time-we-make-a-release
worktree: ./work/T0063-also-generate-each-time-we-make-a-release
status: completed
started: 2026-09-22
ended: 2026-09-22
---

# T0063: Generate Translated CHANGELOG Files On Release

## Goals
Generate `CHANGELOG.<lang>.md` overlays on every release so the About screen shows the
version history in the active interface language, not only Dutch. Build a reusable
`translate-markdown.py` that chunks a Markdown document by total length, then by
`##`-heading, then by blank-line paragraph, before sending each chunk to translation.

## Task Execution Steps
- [x] **[Read]**      Review changelog rendering, i18n language handling, and the release script.
- [x] **[Decided]**   Keep bullet area badges (e.g. `FrontEnd:`) and version headings untranslated verbatim.
- [x] **[Implement]** Add `translate-markdown.py`, wire it into the release script, and localize the About view.
- [x] **[Verify]**    Run the automated test suite and validate the About screen visually per language.
- [x] **[Doc]**       Update `CHANGELOG.md` and `docs/devops.md`.

## Execution Log
- [2026-09-22] **[Read]**
  Reviewed `js/changelog.js` rendering, `js/i18n.js` language handling, and `scripts/deploy-to-production.py`.

- [2026-09-22] **[Decided]**
  Protect `##` version headings and leading `- Area:` badge labels from translation to keep badge styling and version parsing intact.

- [2026-09-22] **[Implement]**
  Added `scripts/translate-markdown.py` with three-tier chunking (whole doc, by heading, by paragraph) reusing `translate_batch` from `translate-questions.py`.
  - Wired `translate-markdown.py generate --all` into `deploy-to-production.py`'s release flow, committed alongside `CHANGELOG.md` and `sw.js`.
  - Updated `js/changelog.js` to fetch `CHANGELOG.<lang>.md` (falling back to `CHANGELOG.md`) and cache per active language.
  - Updated `scripts/generate-sw.py` to precache translated changelogs when present.
  - Generated `CHANGELOG.en.md`, `CHANGELOG.fr.md`, `CHANGELOG.de.md`, `CHANGELOG.it.md` for the current changelog content.

- [2026-09-22] **[Verify]**
  Found and fixed a token-leak bug (duplicated `FrontEnd: ZZAREAZZ:` badge) via a stubbed-translator unit test before it reached generated output.
  - `python -m unittest discover -s tests`: 114 passed.
  - Visual check via Playwright at HTTP 200: About screen in English showed the Dutch changelog before the fix and the English changelog after.
  - Before: [T0063-view-before.png](T0063-view-before.png)
  - After: [T0063-view-after.png](T0063-view-after.png)

- [2026-09-22] **[Doc]**
  Added the `v3.5.0-pre` changelog entries and documented the new script and release step in `docs/devops.md`.

- [2026-09-22] **[Complete]**
  Translated CHANGELOG overlays now generate on every release and the About screen renders them in the active language.

## Walkthrough & Validation

### Changes Made
- `scripts/translate-markdown.py`: New script chunking and translating a Markdown document into `<lang>` overlays.
- `scripts/deploy-to-production.py`: Added `regenerate_translated_changelogs`, called before `sw.js` regeneration and committed with the release.
- `scripts/generate-sw.py`: Precaches `CHANGELOG.<lang>.md` overlays when they exist on disk.
- `js/changelog.js`: Fetches the changelog for the active language, falling back to `CHANGELOG.md`.
- `CHANGELOG.en.md`, `CHANGELOG.fr.md`, `CHANGELOG.de.md`, `CHANGELOG.it.md`: Generated overlays.
- `tests/test_translate_markdown.py`: Network-free coverage of chunking, markup protection, line reassembly, and overlay presence.
- `docs/devops.md`, `CHANGELOG.md`: Updated to reflect the new script and release step.

### Automated Verification
```text
python -m unittest discover -s tests
Ran 114 tests in 0.847s
OK
```

### Visual Verification
Playwright-driven check of `index.html` served over local HTTP (200), switching the UI to English
and opening the About screen:
- Before: [T0063-view-before.png](T0063-view-before.png) — changelog stayed in Dutch regardless of UI language.
- After: [T0063-view-after.png](T0063-view-after.png) — changelog renders in English, badges and version headings intact.

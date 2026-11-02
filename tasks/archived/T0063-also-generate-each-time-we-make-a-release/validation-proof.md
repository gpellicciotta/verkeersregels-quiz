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

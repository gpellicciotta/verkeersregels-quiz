---
id: T0060
owner: "@copilot"
needs: []
branch: task/T0060-add-italian-translation
worktree: ./work/T0060-add-italian-translation
status: completed
started: 2026-09-22
ended: 2026-09-22
---

# T0060: Add Italian Translation

## Goals
Add Italian as a supported quiz language with complete user-interface and question-bank localization. Preserve the existing offline PWA behavior, language cycling, translation coverage checks, and localized road-sign content.

## Task Execution Steps
- [x] **[Read]**      Review localization assets, generation tooling, tests, and browser validation flow.
- [x] **[Decided]**   Define Italian terminology and preserve the established language-cycle behavior.
- [x] **[Implement]** Add the Italian dictionary, question overlay, runtime loading, precache entries, and test coverage.
- [x] **[Verify]**    Run the test suite and capture Italian desktop and mobile UI evidence.
- [x] **[Doc]**       Update changelog and record completed validation in this task file.

## Execution Log
- [2026-09-22] **[Read]**
	Reviewed the existing Dutch, French, German, and English localization architecture, translation tooling, tests, and service-worker precache.

- [2026-09-22] **[Decided]**
	Added Italian to the established language cycle as NL -> FR -> DE -> IT -> EN.

- [2026-09-22] **[Implement]**
	Added Italian UI and question translations, glossary post-processing, runtime loading, offline precache entries, and localization regression coverage.
	- Generated `data/strings.it.json` with 197 UI keys.
	- Generated `data/translations.it.json` covering all 324 questions.
	- Added `scripts/translate-strings.py` for reproducible UI dictionary generation.

- [2026-09-22] **[Verify]**
	Passed `pytest tests -q` with 96 tests and validated the Italian start screen over HTTP 200 at desktop and mobile sizes.
	- Desktop: [T0060-view-desktop.png](T0060-view-desktop.png)
	- Mobile: [T0060-view-mobile.png](T0060-view-mobile.png)

- [2026-09-22] **[Doc]**
	Added the Italian localization entry to the active changelog.

- [2026-09-22] **[Complete]**
	Integrated Italian support across the UI, question bank, carousel, language switcher, offline cache, and automated tests.

## Walkthrough & Validation

### Changes Made
- `data/strings.it.json`: Added the complete Italian UI dictionary.
- `data/translations.it.json`: Added Italian translations for all quiz questions, options, explanations, and sign details.
- `scripts/translate-strings.py`: Added reproducible UI dictionary generation with placeholder and HTML preservation.
- `js/i18n.js`, `js/app.js`, `sw.js`: Added Italian runtime support and offline assets.
- `tests/`: Extended dictionary, question overlay, sharing, accessibility, and carousel localization checks.

### Automated Verification
```text
pytest tests -q
96 passed in 6.08s
```

```text
python -m py_compile scripts/translate-strings.py scripts/translate-questions.py
git diff --check
```
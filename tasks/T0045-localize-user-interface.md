---
id: T0045
owner: "@claude"
needs: []
branch: main
worktree: .
status: completed
started: 2026-09-21
ended: 2026-09-21
---

# T0045: Localize UI into English with Extensible Architecture

## Goals

Implement internationalisation (i18n) for the application by creating extensible dictionaries and localized question bank support. Add English localization covering chrome, modals, and all 324 questions. Add a language switcher circle button in the meta bar and support the `?lang=` query parameter.

## Task Execution Steps

- [x] **[Read]**      Review current UI strings and structure across modules.
- [x] **[Decide]**    Choose dictionary and translation overlay architecture.
- [x] **[Implement]** Create i18n module, string files, and translations overlay.
- [x] **[Implement]** Update application modules and index.html with i18n keys.
- [x] **[Verify]**    Run automated test suite and capture visual screenshots.
- [x] **[Doc]**       Update CHANGELOG.md, TODO.md, and create task file.

## Execution Log

- [2026-09-21] **[Read]**
  Audited all static and dynamic Dutch UI strings across HTML and JS modules.

- [2026-09-21] **[Decide]**
  Adopted `js/i18n.js` with `data/strings.nl.json`, `data/strings.en.json`, and overlay `data/translations.en.json`.

- [2026-09-21] **[Implement]**
  Created core i18n module with `t()`, `setLang()`, and automatic DOM binding via `data-i18n`.
  Generated full English translation overlay for all 324 questions.
  Added language switcher button to start screen meta bar.

- [2026-09-21] **[Verify]**
  All 62 automated unit tests passed. Captured visual screenshots in Dutch and English modes.

- [2026-09-21] **[Complete]**
  Localized entire user interface and 324 questions into English.

## Walkthrough & Validation

Visual validation captures:
- [Before (Dutch)](./T0045-view-before.png)
- [After (English Start)](./T0045-view-after.png)
- [English About View](./T0045-view-about.png)
- [English Quiz Screen](./T0045-view-quiz.png)
- [English Carousel Screen](./T0045-view-carousel.png)

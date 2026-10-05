---
id: T0081
owner: "@claude"
needs: []
branch: task/T0081-extend-the-quiz-with-15-additional-traffic-situation
worktree: ./work/T0081-extend-the-quiz-with-15-additional-traffic-situation
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0081: Extend the quiz with 15 additional traffic situation questions

## Goals

The quiz had 40 `situation` questions (`sit-01` through `sit-40`), all sourced
from *De Grote Verkeerstoets*, which has no further usable photos. Add 15 more
real-world situation questions (`sit-41` through `sit-55`) sourced from
Wikimedia Commons instead, each showing a real, unstaged photo of a physical
Belgian traffic sign, individually verified against the Wegcode and against
the sign already catalogued in `assets/signs/`. Wire each into
`data/questions.json`, all 4 translation files, `sw.js`, `SOURCES.md`,
`README.md`, and `docs/requirements.md`.

## Task Execution Steps

- [x] **[Read]**      Browse Commons per-sign-code categories for real street photos of already-catalogued signs.
- [x] **[Decide]**    Reject studio-render candidates and mis-sourced photos after visual inspection.
- [x] **[Implement]** Add 15 `situation` questions with sources, translations, and `sw.js` precache entries.
- [x] **[Verify]**    Run the full automated test suite and a live local server spot-check.
- [x] **[Doc]**       Update SOURCES.md, README.md, docs/requirements.md, and CHANGELOG.md.

## Execution Log

- [2026-09-24] **[Read]**
  Resumed an interrupted turn: `data/questions.json`, all 4 translation files,
  `sw.js`, `SOURCES.md`, `README.md`, and `docs/requirements.md` already held
  the full 15-question change plus a detailed sourcing trail in SOURCES.md's
  correction log; only the task file, `CHANGELOG.md`, and final verification
  were missing.

- [2026-09-24] **[Verify]**
  Re-verified the resumed work rather than trusting it: counted 55 unique
  `sit-*` image references in `questions.json`, confirmed all 15 new JPEGs
  exist on disk with plausible file sizes, and confirmed all 15 new question
  IDs are present in `translations.{en,fr,de,it}.json`.

  - Spot-fetched 4 of the 15 Commons source pages; license, author, and sign
    subject matched `SOURCES.md` for 3 of 4.
  - The 4th (`sit-43`, Pont de Godinne) looked like a mismatch from the
    category-only fetch summary, but direct visual inspection of the local
    JPEG confirmed it does show both the C29 height and C21 weight signs with
    the "Excepte bus et autocars" undersign as described.

- [2026-09-24] **[Verify]**
  `python -m unittest discover -s tests -v`: 160/160 passed.
  `node tests/stats.test.cjs`: 6/6 passed. `node tests/gas-summary.test.cjs`: 12/12 passed.

- [2026-09-24] **[Verify]**
  Served the worktree locally; `index.html` and a new situation JPEG both
  returned HTTP 200, and `data/questions.json` parsed with 343 questions.
  Loaded the quiz filtered to `situation` questions in headless Chromium: no
  console errors, and `sit-52-a5-steile-helling-kemmelberg` rendered its
  image, Dutch question text, and 3 options correctly. Content-only change,
  no layout/CSS touched, so no before/after screenshots per the project's
  UI-change-only screenshot rule.

- [2026-09-24] **[Doc]**
  Added the CHANGELOG.md entry for this task under the active `-pre` heading.

- [2026-09-24] **[Complete]**
  15 new situation questions land, sourced and individually verified from
  Wikimedia Commons; the bank now totals 343 questions (55 `situation`).

## Validation Record

- `python -m unittest discover -s tests -v`: 160 of 160 tests passed.
- `node tests/stats.test.cjs`: 6 of 6 passed. `node tests/gas-summary.test.cjs`: 12 of 12 passed.
- Live server (`scripts/run-review-server.py`, port 8092): `index.html` 200,
  `assets/situations/sit-55-d3-verplichte-rijrichting-pijl.jpg` 200,
  `data/questions.json` parses with 343 questions (stopped after capture).
- Headless Chromium spot-check of a new situation question: no console
  errors; image, question text, and options rendered correctly.
- Review tier: Solo AI agent — validation results above stand in for
  interactive review; pre-authorized for direct integration per the task
  protocol once validation passes.

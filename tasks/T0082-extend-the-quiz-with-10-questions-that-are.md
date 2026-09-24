---
id: T0082
owner: "@claude"
needs: []
branch: task/T0082-extend-the-quiz-with-10-questions-that-are
worktree: ./work/T0082-extend-the-quiz-with-10-questions-that-are
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0082: Extend the quiz with 10 questions that are likely asked on a Belgian theoretical driver exam and that are not about traffic situations or signs

## Goals

The quiz had 79 `rule`-type questions covering speed, alcohol, seatbelts, phones,
priority, cyclists/pedestrians, insurance, and motorways, but no questions on
several other common exam topics. Add 10 more `rule` questions (`sit`/`sign`-free,
verified against authoritative Belgian sources) on: warning triangle placement,
the safety vest duty, safe following distance, trailer towing weight limits,
periodic technical inspection, the AM moped license, drugs in traffic,
the duty to stay at an accident scene, cargo overhang signaling, and the
motorcycle helmet duty. Wire each into `data/questions.json`, all 4 translation
files, `SOURCES.md`, `README.md`, and `docs/requirements.md`.

## Task Execution Steps

- [x] **[Read]**      Survey existing 79 `rule` questions to identify uncovered, exam-relevant, non-sign topics.
- [x] **[Decide]**    Pick 10 topics with a clean, single verifiable fact each and no sign-code references.
- [x] **[Implement]** Add 10 `rule` questions with sources, and translations in en/fr/de/it.
- [x] **[Verify]**    Fetch and confirm all 9 source URLs return HTTP 200; run the full test suite and a live server spot-check.
- [x] **[Doc]**       Update SOURCES.md, README.md, docs/requirements.md, and CHANGELOG.md.

## Execution Log

- [2026-09-24] **[Read]**
  Surveyed all 79 existing `rule` questions by ID and topic; found no coverage
  for breakdown equipment, following distance, trailer towing, technical
  inspection, moped licensing, drugs, accident duty, cargo signaling, or
  motorcycle helmets.

- [2026-09-24] **[Decide]**
  Rejected a general "omkeren" (U-turn) topic candidate after research turned
  up only sign-based (C35) sourcing, which would blur the "not about signs"
  scope; substituted the motorcycle helmet duty instead.

- [2026-09-24] **[Implement]**
  Added 10 `rule` questions (category `algemeen`) to `data/questions.json` and
  matching overlays to `translations.{en,fr,de,it}.json`; all use existing
  categories and question types, no new sign or image assets needed.

- [2026-09-24] **[Verify]**
  Fetched all 9 cited source pages via WebFetch to confirm the quoted facts,
  then re-verified all 9 URLs return HTTP 200 with a standard browser
  User-Agent via `curl`.

  - `python -m unittest discover -s tests -v`: 160/160 passed (counts updated
    to 353 total, 89 `rule`).
  - `node tests/stats.test.cjs`: 6/6 passed. `node tests/gas-summary.test.cjs`: 12/12 passed.
  - Served the worktree locally (`scripts/run-review-server.py`, port 8093):
    `index.html` returned 200, `data/questions.json` parsed with 353
    questions including all 10 new IDs.

- [2026-09-24] **[Doc]**
  Updated `data/SOURCES.md` (counts, correctIndex spread, new rule-sources
  subsection with all 9 links), `README.md`, `docs/requirements.md`, and
  `CHANGELOG.md`.

- [2026-09-24] **[Complete]**
  10 new non-sign, non-situation exam questions land, each sourced from a
  fetched and HTTP-200-verified page; the bank now totals 353 questions.

## Validation Record

- `python -m unittest discover -s tests -v`: 160 of 160 tests passed.
- `node tests/stats.test.cjs`: 6 of 6 passed. `node tests/gas-summary.test.cjs`: 12 of 12 passed.
- All 9 new source URLs fetched with a standard browser User-Agent via `curl`: all returned HTTP 200.
- Live server (`scripts/run-review-server.py`, port 8093): `index.html` 200,
  `data/questions.json` parses with 353 questions including all 10 new IDs
  (stopped after capture).
- Content-only change, no layout/CSS touched, so no before/after screenshots
  per the project's UI-change-only screenshot rule.
- Review tier: Solo AI agent — validation results above stand in for
  interactive review; pre-authorized for direct integration per the task
  protocol once validation passes.

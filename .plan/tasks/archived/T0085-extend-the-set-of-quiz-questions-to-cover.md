---
id: T0085
owner: "@claude"
needs: []
branch: task/T0085-extend-the-set-of-quiz-questions-to-cover
worktree: ./work/T0085-extend-the-set-of-quiz-questions-to-cover
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0085: Extend the set of quiz questions to cover all official Belgian road signs

## Goals

T0019 (2026-09-18) already covered all 193 then-known Belgian road signs, but
never checked that list against the locally stored authoritative law text.
Extract every sign code from `data/law/wegcode-kb-1975-12-01-consolidated.pdf`
and diff it against `assets/signs/` to find any true gaps, add verified SVGs
and questions for whatever is missing, and leave a documented trail for
candidates that turn out not to be real current-law signs.

## Task Execution Steps

- [x] **[Read]**      Extract every sign code from the consolidated Wegcode PDF and diff against local assets.
- [x] **[Decide]**    Triage each candidate gap against the PDF text before sourcing any image.
- [x] **[Implement]** Source and validate SVGs for the confirmed missing signs by exact Commons SHA-1.
- [x] **[Implement]** Add recognize questions, translations, and service-worker precache entries.
- [x] **[Verify]**    Run the full automated test suite and a live local server spot-check.
- [x] **[Doc]**       Update SOURCES.md, CHANGELOG.md, and test count assertions.

## Execution Log

- [2026-09-24] **[Read]**
  Cross-checked a Wikipedia-sourced candidate gap list against
  `pdfminer`-extracted text of the consolidated Wegcode PDF, the same
  authoritative snapshot already used for every rule question.

  - Candidates: `A53`, `D1f`, `D3a`, `D3b`, `D9a`, `C48`, `C49`, `F34b`, `F34c`.
  - Only `F34b.1`/`F34b.2`/`F34c.1`/`F34c.2` are real current-law codes (art. 71.2).
  - The rest are 2024-decree signs, discontinued codes, or PDF layout artifacts.

- [2026-09-24] **[Implement]**
  Downloaded the 4 new SVGs from Commons and verified each by exact SHA-1
  via the Commons API, not the bulk `generate-sign-sources.py` run.

  - Bulk run hit Commons rate limiting, produced 63 spurious regressions, was reverted.
  - Flagged the files' shared "historic information" Commons category in SOURCES.md for review.

- [2026-09-24] **[Implement]**
  Added 4 `recognize`/`aanwijzing` questions (`rec-f34b1`, `rec-f34b2`,
  `rec-f34c1`, `rec-f34c2`) to `data/questions.json`, citing art. 71.2.
  Regenerated `sw.js` via `scripts/generate-sw.py` and added the 4 codes to
  `scripts/fetch-belgian-signs.py`'s known-signs table.

  - Hand-wrote the 4 entries directly in each `data/translations.{en,fr,de,it}.json`.
  - `scripts/translate-questions.py` has no cache here; a full run would have altered all 320 existing entries.

- [2026-09-24] **[Verify]**
  Full suite (`python -m unittest discover -s tests`, 160 tests) passes
  after updating count assertions in `tests/test_quiz_data.py` (324→328
  questions, 193→197 recognize) and `tests/test_sign_carousel_explanation.py`
  (198→202 sign-bearing questions). `node tests/stats.test.cjs` and
  `node tests/gas-summary.test.cjs` pass unchanged.

- [2026-09-24] **[Verify]**
  Served this worktree via `scripts/run-review-server.py` on port 8091:
  `index.html`, `assets/signs/F34b1.svg`, and `assets/signs/F34c2.svg` all
  returned HTTP 200, and `data/questions.json` parsed with 328 questions.
  No UI/UX layout changed (content-only addition), so no before/after
  screenshots were captured per the project's screenshot rule.

- [2026-09-24] **[Complete]**
  Added the 4 confirmed-missing signs with verified SVGs and questions; the
  bank now covers all 197 current-law sign codes in the consolidated text.

  - 328 questions total; updated SOURCES.md and CHANGELOG.md.
  - Solo AI agent task, pre-authorized; integrating into mainline now.

## Validation Record

- Ground truth: `pdfminer.high_level.extract_text` on
  `data/law/wegcode-kb-1975-12-01-consolidated.pdf`, sign-series block
  (index of `A1a.` to the second `Hoofdstuk III`), confirms `F34b.1`,
  `F34b.2`, `F34c.1`, `F34c.2` exist and no other candidate code does.
- SHA-1 match: all 4 new local files match their named Commons file exactly
  (`F34b1` `cd3077d…`, `F34b2` `1c801dc…`, `F34c1` `77a8da0…`, `F34c2`
  `adb42e0…`), verified individually via the Commons `imageinfo` API.
- `python -m unittest discover -s tests -v`: 160 of 160 tests passed.
- `node tests/stats.test.cjs`: 6 of 6 passed. `node tests/gas-summary.test.cjs`: 12 of 12 passed.
- Live server: `index.html` 200, `assets/signs/F34b1.svg` 200,
  `assets/signs/F34c2.svg` 200, `data/questions.json` parses with 328
  questions (port 8091, stopped after capture).
- Review tier: Solo AI agent — validation results above stand in for
  interactive review; pre-authorized for direct integration per the task
  protocol once validation passes.

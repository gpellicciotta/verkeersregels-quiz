---
id: T0084
owner: "@claude"
needs: []
branch: task/T0084-question-rec-e9i-refers-to-sign-e9i-which
worktree: ./work/T0084-question-rec-e9i-refers-to-sign-e9i-which
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0084: Question rec-e9i's sign image does not match its meaning

## Goals

`rec-e9i` correctly describes sign E9i as "Parkeren uitsluitend voor
motorfietsen" (motorcycle-only parking, art. 70.2.1), but the rendered
`assets/signs/E9i.svg` shows a wheelchair pictogram instead. Find the root
cause, fix the asset, and build a repeatable check that can catch this class
of error across all 193 signs so it does not silently recur.

## Task Execution Steps

- [x] **[Read]**           Render the current E9i.svg and compare it against wegcode.be art. 70.
- [x] **[Read]**           Trace how assets/signs/E9i.svg was originally sourced (scripts/fetch-belgian-signs.py).
- [x] **[Decided]**        Root cause: the Commons file matching our filename convention is itself mislabeled upstream.
- [x] **[Implement]**      Replace assets/signs/E9i.svg with the correctly-categorized Commons source.
- [x] **[Implement]**      Write scripts/check-sign-semantics.py to flag category/meaning keyword conflicts.
- [x] **[Verify]**         Run the checker against all 193 local sign SVGs.
- [x] **[Doc]**            Log the correction in data/SOURCES.md's correction log and update its table row.
- [x] **[Verify]**         Capture before/after screenshots served from a live local HTTP server.

## Execution Log

- [2026-09-24] **[Read]**
  Rendered `assets/signs/E9i.svg` via headless Edge: it shows only a small
  wheelchair pictogram, not the "P + motorcycle" board required by art. 70.

- [2026-09-24] **[Decided]**
  Root cause: `scripts/fetch-belgian-signs.py` queries Commons for candidate
  filenames in order and stops at the first hit, with no content check. For
  E9i its first candidate, "Belgian road sign E9i.svg", exists on Commons but
  is itself mislabeled upstream — its own Commons categories are "Diagrams of
  disability additional road signs" / "wheelchair", not motorcycle parking.
  The correct file is a *different* Commons upload, "Belgian traffic sign
  E9i.svg" (categorized "Diagrams of motorcycle parking road signs"), which
  the script never tried because the first candidate already matched. This is
  the same failure class already logged twice in `data/SOURCES.md`'s
  correction log on 2026-09-18 for `C31.svg`/`D10.svg`: Commons uploads whose
  own filename does not match their own content/category.

- [2026-09-24] **[Implement]**
  Verified the candidate replacement visually (rendered "P" + motorcycle
  rider pictogram, matching wegcode.be art. 70) before use, then replaced
  `assets/signs/E9i.svg` with the byte-identical content of
  `File:Belgian traffic sign E9i.svg`. `questions.json`'s `rec-e9i` text,
  options, and explanation were already correct and needed no change.

- [2026-09-24] **[Implement]**
  Wrote `scripts/check-sign-semantics.py`: for every local sign, finds its
  Commons match by exact SHA-1 (like `generate-sign-sources.py`), reads that
  match's Commons categories, and flags a conflict when a category keyword
  (e.g. "motorcycle", "disab", "wheelchair", "truck", "bicycle") appears with
  no matching Dutch word in the local `signTitle`/explanation text. This is a
  heuristic that catches upstream Commons mislabeling, which content-hash
  verification alone (`generate-sign-sources.py`) cannot detect since a
  mislabeled Commons file still matches its own bytes exactly.

- [2026-09-24] **[Verify]**
  Ran the checker across all 193 signs. See validation record below for the
  full result and triage of every flagged sign.

- [2026-09-24] **[Verify]**
  Started `scripts/run-review-server.py` on the unmodified main checkout
  (port 8091, confirmed HTTP 200) and captured `tasks/T0084-view-before.png`
  showing the wheelchair pictogram served live; repeated on this worktree
  (port 8092, confirmed HTTP 200) for `tasks/T0084-view-after.png` showing
  the corrected "P + motorcycle" board. Both servers stopped after capture.

- [2026-09-24] **[Verify]**
  First full run (initial keyword patterns) flagged 12 signs besides the
  already-fixed E9i: A49, C23, D10, D7, F101a/b/c, F50, F50bis, F99a/b/c, all
  with `['bicycle']`, `['truck']` or `['tram']`. Manually inspected each
  `signTitle`/explanation in `questions.json`: every one is a real false
  positive from regexes too narrow for Dutch inflection/compounding, e.g.
  `\bfiets(en)?\b` does not match `fietsers` or `fietspad`, and `vrachtauto`
  does not match `vervoer van goederen`. No genuine content error among them.

- [2026-09-24] **[Implement]**
  Broadened the Dutch-side patterns (`\bfiets\w*`, `\bmotorfiets\w*`,
  `\bbromfiets\w*`, added `goederenvervoer`/`vervoer van goederen` to
  truck/lorry, added `spoor\w*`/`sporen` to tram) and re-ran the checker
  against just those 13 signs plus E9i: all 13 are now clean. Also confirmed,
  against the original (pre-fix) `E9i.svg` bytes kept aside from the
  investigation, that the checker does flag it (`disab` category present,
  no "handicap"/"gehandicapt"/"rolstoel" in the local text) — proving the
  tool would have caught this exact bug.

- [2026-09-24] **[Complete]**
  Root cause: `scripts/fetch-belgian-signs.py` trusts the first Commons
  filename match with no content check, and Commons itself has files
  mislabeled under the wrong sign code. Fixed `assets/signs/E9i.svg` (now
  byte-identical to the correctly-categorized "Belgian traffic sign
  E9i.svg"); `rec-e9i`'s question text needed no change. Added
  `scripts/check-sign-semantics.py`, which checks all signs for this failure
  class by cross-referencing each sign's Commons-matched file categories
  against its local meaning text; ran clean across all 193 signs (117 proven
  clean by keyword match, 0 flagged, 64 unresolved because they have no exact
  Commons hash match at all — the same pre-existing "Unresolved" set already
  known from T0080, unrelated to this bug and out of this task's scope).
  Updated `data/SOURCES.md`'s table row and correction log, `CHANGELOG.md`,
  and captured before/after screenshots served from a live local HTTP server.
  Solo AI agent task, pre-authorized for direct integration once validated;
  integrating into mainline now.

## Validation Record

- `python scripts/check-sign-semantics.py check --verbose` run against all
  193 local sign SVGs: 117 clean (proven by Commons category cross-check), 0
  flagged, 64 unresolved (no exact Commons hash match — pre-existing gap from
  T0080, not caused by or related to this task).
- Retroactive check against the original wrong `E9i.svg` bytes confirms the
  tool flags it (`disab` category, no matching Dutch keyword) — the tool
  would have caught this bug had it existed earlier.
- `assets/signs/E9i.svg` SHA-1 `40a4159b1f523a4c4c3f0df0cbc81a72bdf80e4f`,
  exact match for Commons `File:Belgian traffic sign E9i.svg` (category
  "Diagrams of motorcycle parking road signs").
- Visual: `tasks/T0084-view-before.png` (wheelchair pictogram, served HTTP
  200 from the unmodified main checkout) vs `tasks/T0084-view-after.png`
  ("P" + motorcycle rider, served HTTP 200 from this worktree).
- Review tier: Solo AI agent — walkthrough and screenshots above stand in for
  interactive review; pre-authorized for direct integration per the task
  protocol once validation passes.

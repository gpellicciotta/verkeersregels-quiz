---
id: T0080
owner: "@claude"
needs: []
branch: —
worktree: —
status: completed
started: 2026-09-24
ended: 2026-09-24
---

# T0080: Regenerate the Sign images table in SOURCES.md

## Goals

The "Sign images" table in `data/SOURCES.md` only ever documented the first 35
signs added under early tasks; it silently went stale as sign coverage grew to
193 SVGs across tasks T0019-T0025, leaving 159 files with no recorded Commons
source. Build a script that matches every local sign SVG to its Wikimedia
Commons source page by exact content hash (not by guessing a filename
pattern), regenerate the table from that verified data, and make it re-runnable
so the table can't silently go stale again.

## Task Execution Steps

- [x] **[Implement]**      Write scripts/generate-sign-sources.py matching local SVGs to Commons by SHA-1.
- [x] **[Verify]**         Dry-run the table-replacement regex on a copy of SOURCES.md before touching the real file.
- [x] **[Implement]**      Run the generator against all 193 signs in assets/signs/.
- [x] **[Decided]**        Fix initial plain string sort to a natural sort so series order reads correctly.
- [x] **[Read]**           Investigate the 2 signs that did not match by hash before accepting them as unresolved.
- [x] **[Doc]**            Log the regeneration and the 2 unresolved signs in SOURCES.md's correction log.

## Execution Log

- [2026-09-24] **[Implement]**
  Wrote `scripts/generate-sign-sources.py`: for each local SVG, queries the
  Commons `allimages` API by exact SHA-1 hash and rebuilds the table from
  matches, so every row is proven against the committed file's actual bytes.

- [2026-09-24] **[Verify]**
  First run matched 191/193 by hash but sorted plain-alphabetically (A11 before
  A1a); fixed with a natural-sort key splitting digit/text chunks, re-ran, same
  191/193 result with correct A1a, A1b, ... A7a, A9, A11 series order.

- [2026-09-24] **[Read]**
  For the 2 unmatched signs (`C31a.svg`, `C6.svg`), the closest Commons files by
  name exist but differ in actual SVG source (different editor metadata, not
  just whitespace) from the local files, so they were not used; consistent with
  the 2026-09-18 correction-log entry noting `C31` was already re-sourced once
  before for a caption mismatch. Left both out of the table as unresolved.

- [2026-09-24] **[Complete]**
  Regenerated the Sign images table with 191 of 193 signs verified by exact
  Commons content hash; 2 left flagged unresolved rather than guessed. Worked
  directly on `main` at the user's request; committed locally, not yet pushed.

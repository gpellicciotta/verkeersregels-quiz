---
id: T0079
owner: "@claude"
needs: []
branch: task/T0079-fix-article-anchor-links
worktree: ./work/T0079-fix-article-anchor-links
status: active
started: 2026-09-24
ended: —
---

# T0079: Fix article-anchor links in question sources

## Goals

Every question in `data/questions.json` carries a `source` URL shown to the user
after answering. Most `wegcode.be` consolidated-law links already use a correct
`#art-N` fragment, but 43 of them point at the bare law page with no fragment,
and 11 more point at a `wegcode.be` explainer/news page instead of the law text.
Some third-party sources also have unused, real heading anchors. Fetch every
distinct source page, confirm which `#`-anchors genuinely exist server-side,
and repoint each `source` field at the closest verified in-page anchor, leaving
a link unanchored only when its target page has no matching HTML anchor.

## Task Execution Steps

- [x] **[Read]**           Extract all 45 distinct source URLs and their citations from questions.json.
- [x] **[Read]**           Fetch the wegcode.be consolidated Wegcode and WAM-wet pages and list real `id="art-*"` anchors.
- [x] **[Read]**           Fetch all other distinct source domains and check for usable heading-level anchors.
- [x] **[Decided]**        Add `#art-N` to the 40 bare wegcode.be links whose explanation cites one base article.
- [x] **[Decided]**        Leave 3 bare wegcode.be links unanchored (composite or wrong-law citation); documented in SOURCES.md.
- [x] **[Decided]**        Repoint 5 wegcode.be explainer/news links to the law-text page with the matching `#art-N`.
- [x] **[Decided]**        Add verified heading anchors on 5 third-party/explainer pages that already match the cited fact.
- [ ] **[Implement]**      Apply all 50 source-field edits to data/questions.json via a script.
- [ ] **[Verify]**         Re-run the extraction script to confirm zero remaining mismatches for changed rows.
- [ ] **[Doc]**            Log the correction in data/SOURCES.md and CHANGELOG.md.

## Execution Log

- [2026-09-24] **[Read]**
  Fetched `wegcode.be` consolidated Wegcode and WAM-wet pages; confirmed every
  article has a real `id="art-N"` anchor but no finer per-paragraph anchor exists.

- [2026-09-24] **[Decided]**
  Policy: single-base-article citations on a bare or wrong wegcode.be page get
  `#art-N`; composite (2+ distinct articles) or non-Wegcode citations are left
  unanchored rather than picking a misleading single anchor.

- [2026-09-24] **[Decided]**
  Fetched all 16 SOURCES.md third-party pages; only `verkeerszaken.be` (rotondes)
  and `touring.be` (reddingsstrook) and the `wegcode.be` cyclist brochure expose
  real heading anchors matching cited facts; the rest have no usable anchors.


---
id: T0033
owner: "@claude"
needs: []
branch: task/T0033-review-all-questions
worktree: ./work/T0033-review-all-questions
status: active
started: 2026-09-19
ended: —
---

# T0033: Review All Questions for Issues or Inconsistencies

## Goals

The question bank has grown to 294 questions across four types since the last full review in T0002.
Review every question for content issues that automated schema tests in tests/test_quiz_data.py cannot catch.
Check for duplicate or near-duplicate questions, ambiguous or multiple defensible answers, weak or repeated
distractors, category or "since" year inconsistencies, and legal accuracy against data/law and data/SOURCES.md.
Produce a findings list only; do not fix anything until the user confirms which fixes to apply.

## Task Execution Steps

- [x] **[Read]**      Read data/questions.json, data/SOURCES.md, and data/law/README.md for context.
- [x] **[Verify]**    Check recognize/identify questions for duplicate signs, wrong meanings, weak distractors.
- [x] **[Verify]**    Check rule/situation questions against data/law and data/SOURCES.md for legal accuracy.
- [x] **[Verify]**    Check cross-question consistency: categories, "since" years, source anchors, phrasing.
- [x] **[Doc]**        Record all findings in the Execution Log and present them for user confirmation.
- [x] **[Implement]** Fix the 18 confirmed findings in data/questions.json, keeping question IDs stable.
- [ ] **[Verify]**    Dig further into the 11 uncertain findings and resolve or reclassify each one.

## Execution Log

- [2026-09-19] **[Decided]**
  Claimed T0033 and created branch/worktree; scoping the review to content issues beyond automated schema checks.

- [2026-09-19] **[Verify]**
  Checked all 294 questions in 3 parallel batches against the consolidated Wegcode PDF and data/SOURCES.md.
  - Also checked for duplicate signs/questions/options across the full file directly; found none.

- [2026-09-19] **[Doc]**
  Recorded 33 flagged questions (18 confirmed, 11 uncertain) below; awaiting user confirmation before any fixes.

- [2026-09-19] **[Decided]**
  User confirmed: fix all 18 confirmed findings now; keep digging into the 11 uncertain ones.

- [2026-09-19] **[Implement]**
  Re-verified each of the 18 confirmed findings directly against the consolidated Wegcode PDF, then fixed them.
  - Fixed 13 wrong article/subsection citations; the stated answers were already correct.
  - Rewrote 5 questions with genuinely wrong content (2 velomobile, rec-f27, 2 fabricated parking rules).

- [2026-09-19] **[Verify]**
  Full pytest suite (22 tests) passed; served the fixed questions.json locally and spot-checked the changed entries.

## Findings

Legend: **confirmed** = verified against the consolidated Wegcode text; **uncertain** = plausible but not
verifiable from locally stored sources, or a judgment call. Source: `data/law/wegcode-kb-1975-12-01-consolidated.pdf`
unless noted. Automated schema issues (dup IDs, correctIndex bounds, missing files) are excluded — those are
already covered by tests/test_quiz_data.py.

The 18 confirmed findings below are **fixed** (see data/questions.json and the 2026-09-19 entry in
data/SOURCES.md's Correction log). The 11 uncertain findings are still open, pending further digging.

### Systemic pattern: wrong article subsection on otherwise-correct rule questions (13, confirmed, fixed)

The stated correct answer is right; only the cited article/subsection number is wrong. Likely from citing the
top-level article without checking the exact subsection letter/number.

- `rule-estep-leeftijd-2022`: cites "8.2bis" (doesn't exist) → should be art. 8.2, 7°.
- `rule-estep-passagier-2022`: cites "8.2bis" (doesn't exist) → should be art. 44.2.
- `rule-fietser-aan-hand`: cites "42.2.1" → should be art. 2.46 (definition of voetganger).
- `rule-overweg`: cites "20.3.1°" → should be 20.3, 2° (flashing red lights).
- `rule-parkeren-kruispunt-afstand`: cites "25.1.1°" → should be art. 24, 7°.
- `rule-ritsen-locatie`: cites "12quinquies" (doesn't exist) → should be art. 12bis.
- `rule-ritsen-voorrang`: cites "12quinquies" (doesn't exist) → should be art. 12bis.
- `rule-inhalen-kruispunt`: cites "16.4.1°" → should be art. 17.2.2°a.
- `rule-inhalen-oversteekplaats`: cites "16.5" → should be art. 17.2.5°.
- `sit-08-licht-boven-bord`: cites "6.2" → should be art. 6.3.
- `rule-snelheid-woonerf`: cites "22bis.2°" → should be art. 22bis, 3°.
- `rule-voorrang-tram-voetganger`: cites "40.4.2°" (no tram content there) → should be art. 12.1.
- `rule-rotonde-pinker`: cites "19.3" (left-turn article) → should be art. 19.2, 1°.

### Wrong answer content, not just citation (5, confirmed, fixed)

- `rule-velomobiel-2022`: claims a safety flag + 1.40m height rule under art. 82bis; that article covers
  e-steps, not velomobiles. The real 2022 rule (art. 82.1.2, 6°) requires a reflective side strip instead.
- `rule-velomobiel-hoogte-2022`: same fabricated flag/height claim as above — a companion question with the
  same underlying error, also citing art. 82bis.
- `rec-f27`: answer says F27 specifically means "route over a motorway"; the law gives F27 the same bare
  "voorwegwijzer" meaning as F25 — the motorway badge is an optional overlay, not F27's inherent meaning.
- `rule-parkeren-brandkraan`: no "brandkraan" (fire hydrant) parking-distance rule found anywhere in the
  consolidated Wegcode; cited art. 25.1.13° is about parking on the median outside built-up areas.
- `rule-estep-parkeren-2022`: cited art. 75.3 is about central-lane markings, unrelated; no e-step drop-zone
  text found anywhere in the federal code — this may be a municipal rule, not a Wegcode rule.

### Uncertain — needs a human decision (11)

- `rule-middenrijbaan-2022`: cited art. 9.1.3° is about draft animals; the actual central-lane behavioral
  rule wasn't locatable in the consolidated text under any article number.
- `rule-vierwieler-helm-2024`: cites "36.2" but art. 36 has no subsections; term "rolbeugel" doesn't appear
  in the text; the quadricycle exemption may exist under different wording not located.
- `rule-fietsstraat-f111-2021`: cites art. 65.5 (general zone mechanism); no F111-specific "next
  intersection" clause found there.
- `rule-rijbewijs-begeleider` / `rule-begeleider-ervaring`: same KB 10 juli 1998 source but different
  `since` years (2007 vs 1998); that KB predates the locally stored law snapshot (2021+), can't verify.
- `iden-d10`: `since: 2014` for the D9/D10 split can't be verified against locally stored sources.
- `iden-e9a`: `since: 1990` for the E9a symbol can't be verified against locally stored sources.
- `rule-verlichting-tunnels`: no tunnel-specific headlight clause found in art. 30/30.1; may derive from an
  EU directive not stored locally.
- `rule-voorrang-aardeweg`: explanation adds "verharde" (paved) as a qualifier not present in art. 12.3.1.b;
  low-impact wording drift.
- `rule-estep-trottoir-2022`: citation "Wet 15 mei 2022, art. 9.1.2°" doesn't match the Wegcode's own art.
  9.1.2° (about cycle-path rules); may reference the amending law's own internal numbering instead.
- `rec-d1b` / `rec-d1c` / `rec-d1d` / `rec-d1e`: the quiz splits D1 variants into two semantic families
  (turn-at-intersection vs bypass-obstacle) that the law only defines generically; SVG icon shapes suggest
  the grouping may not match, but needs a rendered side-by-side check.
- `rec-f49` category (`fietsers-voetgangers`): sibling F-series pedestrian/cyclist infrastructure signs
  (f50, f51, f14, f45b) are all categorized `aanwijzing` instead — inconsistent, not necessarily wrong.

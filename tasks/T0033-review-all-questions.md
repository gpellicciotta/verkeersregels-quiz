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
- [x] **[Verify]**    Dig further into the 11 uncertain findings and resolve or reclassify each one.
- [ ] **[Decide]**    Get user confirmation to commit, merge, and push the second fix pass.

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

- [2026-09-19] **[Implement]**
  Resolved 9 of 11 uncertain findings using amendment PDFs in data/law/amendments/ and targeted web lookups.
  - 2 remain genuinely unverifiable (pre-2021 sign-introduction years); documented in data/SOURCES.md instead of guessed.

- [2026-09-19] **[Verify]**
  Full pytest suite (22 tests) passed again; served the updated questions.json locally and spot-checked changed entries.

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

### Uncertain findings — resolved (9 of 11, fixed)

All 9 were resolved using amendment PDFs already cached in `data/law/amendments/` plus a few targeted,
robots.txt-compliant web lookups (wegcode.be, nl.wikipedia.org). Full evidence for each is in the
2026-09-19 correction-log entry in `data/SOURCES.md`.

- `rule-middenrijbaan-2022`: not a standalone article — the rule is definitions art. 2.71-2.72 combined
  with the crossing/overtaking rules art. 15.3 and 16.5. Confirmed against `kb-2022-07-30.pdf`.
- `rule-vierwieler-helm-2024`: the real KB 2 oktober 2023 rule exempts small agricultural quadricycles
  (≤40 km/u, no motorcycle handlebars) from the helmet duty — not a "seatbelt + rollbar" exemption, which
  doesn't exist. Rewrote the question around the real rule.
- `rule-fietsstraat-f111-2021`: superseded — KB 12 maart 2023 renamed "fietsstraat" to "fietszone" and
  removed the automatic next-intersection end; a fietszone now runs until sign F113. Rewrote the question.
- `rule-rijbewijs-begeleider` / `rule-begeleider-ervaring`: both cited the wrong decree (KB 10 juli 1998
  instead of KB 10 juli 2006, art. 2-4 and art. 3 § 2 b); corrected both, and `since` on both is now 2007.
- `rule-verlichting-tunnels`: no explicit tunnel clause exists; reworded to ground the claim in the real
  trigger (art. 30.1's <200m visibility rule) instead of claiming a tunnel-specific rule that isn't in the text.
- `rule-voorrang-aardeweg`: removed "verharde" (paved), a qualifier art. 12.3.1.b doesn't have; swapped the
  source to the official wegcode.be article.
- `rule-estep-trottoir-2022`: corrected the citation to art. 7bis (as amended by Wet 15 mei 2022, art. 3).
- `rec-d1b` / `rec-d1e`: cross-checked against the Dutch Wikipedia D-series article; both just mean
  "verplichte rijrichting: links" — removed the invented "op het kruispunt" / "vóór het bord" framing.
  `rec-d1c` / `rec-d1d` were already correct as-is (obstacle-bypass left/right).
- `rec-f49`: recategorized from `fietsers-voetgangers` to `aanwijzing` to match its closest siblings.

### Uncertain findings — still open (2)

- `iden-d10`: `since: 2014` for the D9/D10 split could not be confirmed or disproven — the code predates
  the local amendment ledger (2021+), and mobilit.belgium.be is CAPTCHA-gated. Sign meaning is correct.
- `iden-e9a`: `since: 1990` for the E9a symbol has the same problem — unverifiable, not necessarily wrong.

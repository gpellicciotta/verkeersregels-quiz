---
id: T0002
owner: "@antigravity"
needs: []
branch: task/T0002-review-all-questions-and-answers
worktree: ./work/T0002-review-all-questions-and-answers
status: active
started: 2026-09-18
ended: —
---

# T0002: Review All Questions and Answers

## Goals

Every question must be correct under the Wegcode in force today, for Flanders, before the v1.0.0 release.
Review each question, correct answer, distractor, explanation and sign image against the current article text in data/law.
A verification pass on 2026-09-18 already found the errors listed below, which serve as a starting point.
Expanding the question bank is out of scope for this task.

## Task Execution Steps

- [ ] **[Read]**      Read the consolidated Wegcode in data/law and the sources listed in data/SOURCES.md.
- [ ] **[Verify]**    Check each rule question's answer and explanation against the current article text, citing the article.
- [ ] **[Verify]**    Check that every distractor is wrong under current law, including Brussels and Walloon differences.
- [ ] **[Verify]**    Check every sign code, image and meaning against the sign definitions in the Wegcode.
- [ ] **[Implement]** Fix confirmed errors in data/questions.json, keeping question IDs stable.
- [ ] **[Doc]**       Record each fix with its article reference in data/SOURCES.md.
- [ ] **[Verify]**    Play the corrected questions locally and capture before and after screenshots.

## Execution Log

- [2026-09-18] **[Decided]**
  Created this review task; the known issues below come from checks against the consolidated Wegcode.
  An earlier review session stopped after replacing the C31 and D10 images in commit `6e359b4`.

## Walkthrough & Validation

### Known Issues

Found on 2026-09-18 against the consolidated Wegcode in data/law, not yet fixed:

- `rule-snelheid-bebouwd` says 50 km/u applies "in België"; article 11.1 sets 30 km/u in the Brussels region.
- `rule-snelheid-buiten-vl` says Brussels still uses 90 km/u; article 11.2 sets 70 km/u there, only Wallonia uses 90.
- The same Brussels claim appears in the review notes of data/SOURCES.md.
- `rule-gsm` requires a switched-off engine; article 8.4 only says "stilstaat of geparkeerd" and covers any device with a screen.
- `rule-mistlichten` asks when rear fog lights "mag"; article 30.1 makes them mandatory below 100 m visibility and in heavy rain.
- `iden-c31` names "Bord C31"; the Wegcode only defines C31a and C31b, and C31.svg shows C31a.
- `iden-d10` and D9a.svg use code "D9a"; the Wegcode only defines D9.

### Already Checked

- All 35 sign images show current Wegcode designs; 30 match the wegcode.be images, and C31, C39, C43, D1a and F3b have none there.
- E9a with a wheelchair symbol is valid: article 70.2.1.3°c allows the symbol on the sign itself.
- Articles 12.3.1, 21.2 and 40ter match `rule-voorrang-rechts`, `rule-snelheid-min-autosnelweg` and `rule-fietser-inhalen`.

---
id: T0001
owner: ""
needs: []
branch: task/T0001-switch-to-code-van-de-openbare-weg-2027
worktree: ./work/T0001-switch-to-code-van-de-openbare-weg-2027
status: available
started: 2026-09-18
ended: —
---

# T0001: Switch to the Code van de Openbare Weg in 2027

## Goals

On 1 June 2027 the federal Code van de openbare weg and the Vlaams verkeersreglement replace the Wegcode.
The quiz deliberately stays on the current Wegcode and its sign designs until then.
Prepare a question bank and sign set that match the new rules, and switch the live quiz on 1 June 2027, not earlier.
Many signs are renumbered, so every sign code needs remapping, not just a new image.

## Task Execution Steps

- [ ] **[Read]**      Download the latest consolidated Code and Vlaams verkeersreglement into data/law/ with their amendments.
- [ ] **[Verify]**    Map every question and sign in data/questions.json to its article and sign code in the new texts.
- [ ] **[Decide]**    Decide whether sign questions show new designs, old designs, or both until 2045.
- [ ] **[Implement]** Replace sign images with the new designs, renaming files where the sign code changed.
- [ ] **[Implement]** Rewrite or remove questions whose rule or sign changes, starting with the list below.
- [ ] **[Implement]** Add questions covering the main new rules listed below.
- [ ] **[Verify]**    Screenshot every changed sign and question before and after in the running quiz.
- [ ] **[Implement]** Merge and deploy the switch on 1 June 2027, not before.
- [ ] **[Doc]**       Update data/SOURCES.md, data/law/README.md and CHANGELOG.md for the new legal basis.

## Execution Log

- [2026-09-18] **[Decided]**
  Kept the quiz on the current Wegcode until 2027-06-01 and recorded the known changes below.
  This task remains unclaimed; branch and worktree paths are planned.

## Walkthrough & Validation

### Starting Context

- Current-law snapshot and amendment list: [data/law/README.md](../data/law/README.md).
- New texts, not stored because they change before 2027: [Code van de openbare weg](https://www.wegcode.be/nl/regelgeving/2024005817~0mocswfbry) and [Vlaams verkeersreglement](https://www.wegcode.be/nl/regelgeving/2024008489~uukwjmez0p).
- Summary of all changes by road user: [Wat verandert er voor jou?](https://www.wegcode.be/nl/code-van-de-openbare-weg/wat-verandert-er-voor-jou) (Vias institute).
- The 2024 sign designs were bundled up to commit `6e359b4`; Wikimedia Commons names end in "KB-AR 03-06-2024".
- Commons codes follow the new numbering, so the 2024 "C31" file shows a camper-van ban, not a turn ban.

### Changes Affecting Existing Questions

Checked against the new Code text (wegcode.be PDF of 2026-09-15) unless marked "Vias summary":

- `rule-snelheid-min-autosnelweg`: the 70 km/u motorway minimum disappears; driving abnormally slowly without reason stays forbidden.
- Sign C31 becomes "verboden toegang voor kampeerwagens"; the current turn bans C31a/C31b become C32a/C32b.
- Sign C35 also forbids overtaking a motorcycle; the Vias summary states the same for C39.
- Sign D10 gets a new meaning, ending a mandatory path (Vias summary); find the new code for the current shared path.
- Every sign gets simpler symbols, a white contrast border and white sub-signs (Vias summary).
- Most current signs stay legal on the road until 2045-01-01, according to a note in the new Code PDF.
- Explanations that cite article numbers, such as article 12.3.1 in `rule-voorrang-rechts`, need the new numbering.

### New Rules to Cover

Checked against the new texts:

- Keep a following distance of at least two seconds where the limit exceeds 50 km/u.
- Pedestrians may cross diagonally where the lights show a pedestrian surrounded by arrows.
- In Flanders, traffic moves at walking pace in erven, school streets, pedestrian zones and play streets (article 11).
- In Flanders, pass a pedestrian at walking pace when the minimum lateral distance is impossible (article 11).

From the Vias summary, still to check against the texts:

- Cyclists may also cross diagonally at such lights, and may filter between queues.
- Bicycles, e-steps and motorcycles may park on the pavement only with 1.5 m free passage, never on tactile paving.
- Stopping is forbidden on disabled parking spaces, tactile paving, bus lanes and along a continuous yellow line.
- Children under three may ride a bicycle only in an approved child seat.
- A cycling group starts at 10 riders instead of 15.
- Overtaking a vehicle that is itself overtaking is forbidden.
- New signs include A18 (fog), A24 (riders), C30 (caravans) and R12/R13 (non-mandatory cycle path).

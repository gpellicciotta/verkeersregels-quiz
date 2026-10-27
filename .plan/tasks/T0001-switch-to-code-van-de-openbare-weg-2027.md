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

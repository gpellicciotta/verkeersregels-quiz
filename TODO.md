# TODO

An overview of all tasks and their planning.

> Tasks are listed by milestone.
> See the coordinating work guidelines in the dev-guidelines repository for the full coordination protocol.
>
> Status: `[ ]` available · `[~]` active · `[!]` blocked · `[?]` needs-review
> Owner: `[owner: @name]` shown only when active/blocked/needs-review.
> Dependencies: `[needs: Tnnnn]` shown only when unresolved.

**Next ID:** 0031

---

## Next Milestone

- [~] T0019 [owner: @antigravity] [needs: T0025] Ensure there is a sign and a question for each traffic sign currently in use in Belgium.
- [ ] T0025 Add sign assets and quiz questions for Belgian indication signs F51 through F120.
- [ ] T0026 Dubbel-check all questions about traffic signs to actually have the visual sign. See e.g. rule-fietser-b23 for a questions that is not OK.
- [ ] T0027 When "Meld fout" dialog is shown and the "Versturen" button is pressed, there should be zero lag, even if it isn't sent yet or sending fails. Just do it in the background and report any issue on the console.
- [ ] A0028 The progress bar seems to run behind, e.g when starting a quiz with 3 questions, and I'm on question 1, it should be filled for 1/3 while currently it isn't filled at all. On the last question it should be filled completely.
- [ ] A0029 Since this is a Dutch audience project, the CHANGELOG entries should be rewritten in Dutch too.
- [ ] A0030 [needs: T0019 T0027 A0028 A0029] Make a new v1.2.0 or v2.0.0 release

---

## Backlog

- [ ] T0001 Switch the quiz to the Code van de openbare weg when it replaces the Wegcode on 1 June 2027.

# TODO

An overview of all tasks and their planning.

> Tasks are listed by milestone.
> See the coordinating work guidelines in the dev-guidelines repository for the full coordination protocol.
>
> Status: `[ ]` available · `[~]` active · `[!]` blocked · `[?]` needs-review
> Owner: `[owner: @name]` shown only when active/blocked/needs-review.
> Dependencies: `[needs: Tnnnn]` shown only when unresolved.

**Next ID:** 0054

---

## Next Milestone

- [~] T0050 [owner: @claude] Ensure installed PWA service worker automatically activates and refreshes on new releases.
- [ ] T0046 Review user interface for styling inconsistencies and accessibility issues using deterministic checks, and discuss findings.
- [ ] T0051 [needs: T0046] Refactor CSS into a composable, mobile-first stylesheet adhering to audit tokens.
- [ ] T0052 [needs: T0050] Refactor app.js into composable, readable modules separating state, storage, and UI.
- [ ] T0045 [needs: T0052] Localize user interface into French, German, and English with an extensible dictionary, and refine Dutch copy.
- [ ] T0038 [needs: T0052] Add quiz result sharing via Web Share API and clipboard copy on the results screen.
- [ ] T0053 [needs: T0051] [needs: T0045] [needs: T0038] Release version 3.2.0 with modular architecture, service worker auto-updates, configuration persistence, and localization.

---

## Backlog

- [ ] T0001 Switch the quiz to the Code van de openbare weg when it replaces the Wegcode on 1 June 2027.


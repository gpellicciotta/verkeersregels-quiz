# TODO

An overview of all tasks and their planning.

> Tasks are listed by milestone.
> See the coordinating work guidelines in the dev-guidelines repository for the full coordination protocol.
>
> Status: `[ ]` available · `[~]` active · `[!]` blocked · `[?]` needs-review
> Owner: `[owner: @name]` shown only when active/blocked/needs-review.
> Dependencies: `[needs: Tnnnn]` shown only when unresolved.

**Next ID:** 0070

---

## Next Milestone
- [ ] T0069 Change the "Report issue" circular info button on the start screen, to actually be the real "Report issue" action button: we want to have this button available on all screens of the app, as issues might appear anywhere. The context - by default selected to be sent - should be determined as follows:
  - For quiz questions: the question itself
  - For carrousel rounds: the traffic sign being shown when the button was pressed
  - For all other views: the name of the view, e.g. "Quiz resultaten" or "Start scherm" or "Instellingen scherm" 
- [ ] T0067 Keep (only in localStorage) play stats and most-used errors
- [ ] T0068 Enable starting a quiz with questions where you've made errors in the past. Also at the end of a quiz, enable re-starting with all the questions for which wrong answers were given. Maybe there could be a new checkbox-setting: "Always include errors from last quiz".

---

## Backlog
- [ ] T0001 Switch the quiz to the Code van de openbare weg when it replaces the Wegcode on 1 June 2027.





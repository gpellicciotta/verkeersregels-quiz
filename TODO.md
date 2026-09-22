# TODO

An overview of all tasks and their planning.

> Tasks are listed by milestone.
> See the coordinating work guidelines in the dev-guidelines repository for the full coordination protocol.
>
> Status: `[ ]` available · `[~]` active · `[!]` blocked · `[?]` needs-review
> Owner: `[owner: @name]` shown only when active/blocked/needs-review.
> Dependencies: `[needs: Tnnnn]` shown only when unresolved.

**Next ID:** 0069

---

## Next Milestone
- [~] T0065 [owner: @claude] Currently we have separate "Settings" dialogs for carrousel and quiz mode, while some settings (like the default name, the interface language, the theme and them-color) can only be set differently. Make a unified settings dialog, with sections making it clear that some settings are general, otheres for carrousel only and still others for the quiz. Still keep the language toggle button and the query parameters but let the settings overwrite them. All settings should be kept in localStorage and also re-read from there.
- [ ] T0066 How can I have a script that runs automatically every day at 7am and 7pm UTC, reads the spreadsheet where the results of non-anomymous users and the issues reported are being stored, summarizes the sheet and send me a mail with the results? The summary should report:
  - How many times the quiz was played until now, in total and in the past 24h
  - How many times the quiz was played in the past 24h, the past week (=7x24h)
  - What is the average number of questions in the past 24h, the past week
  - What is the average number of play time (in minutes) in the past 24h, the past week
  - What is the average percentage score in the past 24h, the past week
  - How many issues are currently reported?
  - How many additional issues have been reported in the past 24h, the past week?
  - What are the 3 last issues reported?
  - What are the 3 most used contexts used over all issues? Of just the 3 latest if there are no "most used"
  - How many times did Noah or Noahp play in the past 24h, the past week
  - How many minutes did Noah or Noahp play in the past 24h, the past week
  - What was the average result percentage of Noah or Noahp in the past 24h, the past week

---

## Backlog
- [ ] T0001 Switch the quiz to the Code van de openbare weg when it replaces the Wegcode on 1 June 2027.
- [ ] T0067 Keep (only in localStorage) play stats and most-used errors
- [ ] T0068 Enable starting a quiz only with questions where you've made errors in the past
      Also at the end of a quiz, enable re-starting with only the errors just made.




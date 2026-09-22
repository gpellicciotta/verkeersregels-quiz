# TODO

An overview of all tasks and their planning.

> Tasks are listed by milestone.
> See the coordinating work guidelines in the dev-guidelines repository for the full coordination protocol.
>
> Status: `[ ]` available · `[~]` active · `[!]` blocked · `[?]` needs-review
> Owner: `[owner: @name]` shown only when active/blocked/needs-review.
> Dependencies: `[needs: Tnnnn]` shown only when unresolved.

**Next ID:** 0066

---

## Next Milestone
- [ ] T0063 Also generate, each time we make a release, CHANGELOG.{{language code}}.md files so also the about can be shown in the target language. Create a custom translate-markdown.py to chunk this appropriately (check total length of doc first and if small enough: do that, otherwise split by ##-heading, if any ##-sections are too large, split further ultimately splitting on empty lines if needed)
- [ ] T0064 Improve the "Meld een fout modal dialog":
  - Add the icon also at the start of the title
  - Start with the "Opmerking of toelichting"+ the comment box but without the word "optioneel
  - Then underneath add the context box but preceded by a checkbox "Include question context:"
  - The intro consists of 2 sentences. Make sure each sentence starts on a new line.
- [ ] T0065 Currently we have separate "Settings" dialogs for carrousel and quiz mode, while some settings (like the default name, the interface language, the theme and them-color) can only be set differently. Make a unified settings dialog, with sections making it clear that some settings are general, otheres for carrousel only and still others for the quiz. Still keep the language toggle button and the query parameters but let the settings overwrite them. All settings should be kept in localStorage and also re-read from there.

---

## Backlog
- [ ] T0001 Switch the quiz to the Code van de openbare weg when it replaces the Wegcode on 1 June 2027.





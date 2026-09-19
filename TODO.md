# TODO

An overview of all tasks and their planning.

> Tasks are listed by milestone.
> See the coordinating work guidelines in the dev-guidelines repository for the full coordination protocol.
>
> Status: `[ ]` available · `[~]` active · `[!]` blocked · `[?]` needs-review
> Owner: `[owner: @name]` shown only when active/blocked/needs-review.
> Dependencies: `[needs: Tnnnn]` shown only when unresolved.

**Next ID:** 0036

---

## Next Milestone

- [ ] T0032 Look online for additional questions that use a real-live photo of a traffic situation. Try to find at least 10 and integrate into the quiz.
- [ ] T0033 [needs: T0032] [owner: claude] Review all questions for issues or inconsistencies. List all issues and ask me for confirmation before trying to fix them.
- [ ] T0035 Review the UX separate only mobile and on desktop.
      - On desktop: can we make better use of horizontal space
        - Can we avoid the 'jump' of the possible answers when the right answer + explanation appear
        - Can we place the "Volgende Vraag" button to the right, in the shape of a right-arrow, and maybe next to the explanation
      - On mobile:
        - To avoid the need to scroll to still see the answers after an answer was given: maybe just hide all answers that are not the given answer or the correct answer
        - To avoid the need to scroll to still see the answers after an answer was given: adapt the height (and hence size) of the sign picture that the 1 or 2 answers are still visible, above the "Volgende vraag" button
        - To avoid the need to scroll to still see the answers after an answer was given: don't cover the full bottom of the screen with the "Volgende Vraag" button but just make it a round overlay button (seeming to over ovr the page) in the right-bottom corner
      - On both:
        - Can we avoid vertical scrolling for the question pages
        - Maybe just have a clear icon to the "more information" link, and no text as it doesn't really provide more info? (also explain the icon "link to reference information" on the start page )
      - All the above should be critically reviewed as they are ideas and suggestions but better alternatives might be available.
      - The overall goal is to make the UX better
- [ ] A0034 [needs: T0032 T0033 T0035] Release as 2.1.0 or 3.0.0

---

## Backlog

- [ ] T0001 Switch the quiz to the Code van de openbare weg when it replaces the Wegcode on 1 June 2027.

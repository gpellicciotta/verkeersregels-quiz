---
id: T0086
owner: "@claude"
needs: []
branch: task/T0086-improve-sign-printout-and-about-hint
worktree: ./work/T0086-improve-sign-printout-and-about-hint
status: active
started: 2026-09-24
ended: —
---

# T0086: Improve the road-sign printout and clean up an About-page hint

## Goals
The all-signs printout (T0083) works but has rough edges: the "Wetsartikel" column
links to the source without showing which article it is, series don't start on a
fresh printed page, the suggested PDF filename is a generic browser default, and
there is no direct PDF export shortcut. Separately, the About page's "Gebruikte
bronnen & wetgeving" card repeats a hint sentence that is already shown elsewhere.
Fix each of these in the existing `js/signs-doc.js` / print-CSS feature without
adding new dependencies, and remove the redundant hint sentence from the sources
card across all 5 languages.

## Task Execution Steps
- [x] **[Read]**           Confirm every catalog sign's `recognize` source resolves to a `#art-NN` wegcode.be fragment.
- [x] **[Decided]**        Derive the article number from the existing `source` URL fragment instead of new data.
- [ ] **[Implement]**      Show "Artikel {number}" as the source link text per row in `js/signs-doc.js`.
- [ ] **[Implement]**      Add a page break before each series title except the first in the print CSS.
- [ ] **[Implement]**      Set `document.title` to the requested filename during print, restored after.
- [ ] **[Implement]**      Add an "Exporteren als PDF" button next to "Afdrukken" reusing the same print flow.
- [ ] **[Implement]**      Remove the redundant `about.law_hint` sentence from the About sources card in `index.html`.
- [ ] **[Verify]**         Run the full pytest suite and a Playwright check of the printed document and About card.
- [ ] **[Doc]**            Update `CHANGELOG.md` (all languages) and `docs/requirements.md` if affected.

## Execution Log
- [2026-09-24] **[Read]**
  Verified all 197 catalog signs use their `recognize` question as source, and every
  one resolves to `#art-66`..`#art-71`; no fallback article-number format is needed.

## Walkthrough & Validation
- Review tier: solo AI agent, pre-authorized autonomous-loop integration per the
  coordination protocol; changes committed locally on `main`, never pushed per this
  repository's `CLAUDE.md`.

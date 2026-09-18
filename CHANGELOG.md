# Versioned Changes

A summarized overview of all changes, per version of this project.

> Entries will be added in reverse chronological order, so with the most recent at the top.
>
> The top-most version heading is always the active in-development version, identified by a `-pre`
> suffix on its version number (e.g. `## v1.0.1-pre`) instead of a status tag. Once a version is frozen
> or released, that suffix is replaced by one of these status codes:
> - `[{{date}}]` - frozen/finalized on {{date}}
> - `[released: {{date}}]` - released to package manager or production on {{date}}
> - `[broken]` - considered broken and not be used

---

## v1.0.0-pre
- FrontEnd: Added an interactive version badge to the start screen opening a formatted changelog modal on click.
- FrontEnd: Added an in-quiz error reporting button and modal sending question feedback to a dedicated Google Sheet tab.
- FrontEnd: Tracked quiz duration from start to finish, displaying elapsed time on results and logging to Google Sheets.
- FrontEnd: Added direct links to the official consolidated Wegcode and amendment ledger on the start screen.
- FrontEnd: Expanded printed results to full width with page-break protection against split rows and repeating headers.
- FrontEnd: Condensed mobile result cards with top-right pill badges and unified answer fields for correct responses.
- FrontEnd: Added amendment year badges and supported URL query filtering to practice recent traffic rule changes.
- FrontEnd: Added a mobile-first Dutch quiz asking 20 random sign and traffic-rule questions with instant explanations.
- FrontEnd: Added a printable results overview with sign thumbnails and confetti on a perfect score.
- Content: Aligned quiz questions, answers, explanations, and sign images with current Belgian traffic law.
- Content: Added 54 exam questions with cited sources and 35 Belgian sign images in currently valid designs.
- BackEnd: Added optional Google Sheet score logging for named players through a restricted Apps Script endpoint.
- Docs: Added README instructions for local testing, GitHub Pages deployment and Google Sheet setup.
- Docs: Added the official Wegcode text and all amending acts since 2021 as reference sources.

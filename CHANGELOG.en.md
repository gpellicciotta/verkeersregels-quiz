# Versioned Changes

A summarized overview of all changes, per version of this project.

> Entries will be added in reverse chronological order, so with the most recent at the top.
>
> The top-most version heading is always the active in-development version, identified by a `-pre`
> Suffix on its version number (e.g. `## v1.1.1-pre`) instead of a status tag. Once a version is frozen
> Or released, that suffix is replaced by one of these status codes:
> - `[{{date}}]` - frozen/finalized on {{date}}
> - `[released: {{date}}]` - released to package manager or production on {{date}}
> - `[broken]` - considered broken and not used

---

## v3.5.1-pre
- FrontEnd: Play statistics and most frequently incorrectly answered questions are now tracked locally in localStorage.
- FrontEnd: Report a bug button is now a real, ubiquitous button with automatic screen context.
- BackEnd: The summary email now shows its own table for each followed player with equally divided Always/Last week/Last 24h columns.
- BackEnd: Reported issues now show both the question ID and the question text instead of just one.

## v3.5.0 [released: 2026-09-22]
- BackEnd: Google Apps Script now sends a Dutch, styled summary email every day at 7am and 7pm UTC with results, notifications and a customizable list of players to follow.
- FrontEnd: About screen now shows the changelog translated into the active interface language.
- FrontEnd: "Report a bug" dialog now shows a title icon and a configurable optional question context.
- FrontEnd: One settings dialog with clear General/Quiz/Carousel sections replaces the two separate dialogs.
- FrontEnd: Name, language, theme and theme color are now also adjustable and saved in localStorage.
- DevEx: Added `translate-markdown.py`, chunking Markdown by heading and paragraph before translating each release.

## v3.4.0 [released: 2026-09-22]
- FrontEnd: Quiz questions received a close button at the top right of the card confirming loss of progress in all five languages.
- FrontEnd: Automatic PWA updates will now happen faster.
- FrontEnd: The iconset is now set aside and used consistently throughout.

## v3.3.0 [released: 2026-09-22]
- FrontEnd: Added Italian translations for the user interface, configuration dialogs and question bank.
- FrontEnd: Added German translations for the user interface, configuration dialogs and question bank.
- FrontEnd: Added French translations for the user interface, configuration dialogs and question bank.
- FrontEnd: Clarified the language switching tooltip; it now shows the full language cycle with the active language highlighted.
- FrontEnd: Highway Code source code links now show the French version when selecting French language; German and English remain on the Dutch version, in the absence of an official equivalent.
- FrontEnd: All kinds of other minor UI/UX improvements

## v3.2.0 [2026-09-22]
- FrontEnd: Separate, localized explanations and titles for road signs added to the carousel, including full Dutch and English translations.
- FrontEnd: Replaced generic image alt texts with descriptive board codes in quiz questions, answer options, and the carousel.
- FrontEnd: Added ability to share quiz results via the Web Share API, with a fallback to copy to clipboard and toast notifications.
- FrontEnd: Added indicator badges (not dependent on color) to answer options and the header to indicate correct and incorrect answers (colorblind accessibility).
- FrontEnd: Refactored CSS to a modular 'mobile-first' stylesheet that complies with audit tokens and WCAG contrast standards.
- FrontEnd: Added English translation and language switch for the UI, configuration dialogs and all 324 questions.
- FrontEnd: Added 'Scope' attributes to column headings in the results table for screen reader accessibility.
- DevEx: JavaScript architecture modularized into separate ES modules, separating application state, storage, and UI presentation logic.
- FrontEnd: Enabled automatic service worker lifecycle updates and client reloads when rolling out new releases.
- FrontEnd: Keep introductory text on the home screen when switching quiz modes or changing configurations.
- FrontEnd: Added dark theme and configurable color accents, including system preference detection and query parameter support.
- FrontEnd: Added support for player name query parameters (including aliases) to bypass the input field on the home screen.
- FrontEnd: Twenty photo questions about real traffic situations added, including improved offline caching and automated testing.
- DevEx: All source code comments in HTML, CSS and JavaScript modules standardized to American English.
- FrontEnd: Player name and quiz settings saved to local storage, with URL query parameters taking precedence.

## v3.1.0 [released: 2026-09-21]
- FrontEnd: Home screen minimized with round action buttons, mode switch, carousel controls and interactive settings dialogs.
- FrontEnd: Better configuration choices, more consistent buttons, and simplified interface instructions.
- DevEx: Version numbering linked to the changelog as a central source for frontend and development scripts.

## v3.0.0 [released: 2026-09-19]
- FrontEnd: Cleaned up the home screen and added a specific About view with version history, release notes, source citations and copyright.
- FrontEnd: Application icon and favicon outside the round road sign made fully transparent with multi-resolution ico.
- FrontEnd: Added traffic sign carousel with adjustable change duration, pause control and clear pause indicator via URL parameters and start button.
- Inhoud: All 294 questions revised; Corrected 27 substantive errors and 2 unconfirmed years.
- FrontEnd: Results buttons compactly placed at the top right of the desktop and legal change labels harmonized in terms of typography.
- Inhoud: Twenty practice questions with photos of traffic situations added, including support for filtering via query parameters.
- FrontEnd: Added question type filter with visual start prompts and responsive photo display for real-world situations.
- FrontEnd: Two-panel layout on desktop and scroll-free mobile view with floating action button and compact law link implemented.
- FrontEnd: Progressive web app installed with 100 percent offline support, roundabout icons and local error queue.
- Test: Added automated layout tests for two-panel structure, mobile option hiding, and compact law link.
- Test: Added automated verification testing for web app manifest, icon sizes, and service worker preload files.
- CLI: Standardized all development scripts to actionable CLI guidelines with structured logging and kebab-case filenames.

## v2.0.0 [released: 2026-09-18]
- Inhoud: Complete coverage of all Belgian traffic signs achieved with 193 sign images and 284 questions.
- FrontEnd: Error reporting form optimized for instant background sending without any interface delay.
- FrontEnd: Progress bar corrected to increase proportionally from the first question to 100 percent.
- Test: Test suite expanded with strict checks for the presence of board images for all board questions.

## v1.1.0 [released: 2026-09-18]
- Documentatie: Visual tour with desktop and mobile screenshots added to the README.
- FrontEnd: Blue traffic sign favicon added and button for the last question changed to show results.
- FrontEnd: Start notification and progress indicators now show dynamic question counts limited to available questions.
- FrontEnd: Added URL query parameters for filtering by year of law change and number of questions.
- FrontEnd: Official law articles and explanatory links displayed after answering each quiz question.
- Inhoud: Question bank doubled to 126 questions with full board coverage and post-2022 rules.

## v1.0.0 [released: 2026-09-18]
- Documentatie: Added standard project documentation including requirements, DevOps guide, license and documentation index.
- DevEx: Added cross-platform bootstrap and deployment scripts with CLI version and help options.
- Test: Added automated test suite for verification of question structure, board images and law years.
- FrontEnd: Road signs and thumbnails shown on the results overview for sign related questions.
- FrontEnd: Added interactive version badge on the home screen that opens the changelog when clicked.
- FrontEnd: Added error reporting button and dialog to send question feedback to Google Sheets.
- FrontEnd: Quiz duration tracked from start to finish, shown with results and recorded in Google Sheets.
- FrontEnd: Direct links to the official consolidated Highway Code and law changes added to the home screen.
- FrontEnd: Results overview when printed made full screen with page separation protection and repeating headings.
- FrontEnd: Mobile result cards made more compact with status badges at the top right and merged answer fields.
- FrontEnd: Added law change badges and URL parameters to practice recent traffic rules in a targeted manner.
- FrontEnd: Mobile-friendly Dutch quiz built with 20 random questions and immediate feedback.
- FrontEnd: Added printable results overview with board thumbnails and confetti for a perfect score.
- Inhoud: Questions, answers, explanations and traffic signs tailored to current Belgian traffic legislation.
- Inhoud: 63 verified exam questions with source references and 35 Belgian traffic signs added.
- BackEnd: Optional score tracking in Google Sheets for players via a secure Apps Script endpoint.
- Documentatie: Added instructions for local testing, GitHub Pages publishing, and Google Sheet configuration.
- Documentatie: Official Highway Code and all amendments since 2021 added as legal reference sources.

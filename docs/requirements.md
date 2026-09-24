# Requirements

Functional and technical requirements for the Verkeersregels Quiz application.

---

## High-Level Goals
- Provide a modern, mobile-friendly interactive quiz for practicing the Belgian theoretical driving exam (Category B).
- Maintain complete legal accuracy under the current Belgian Highway Code (Wegcode / KB 1 December 1975) as applied in Flanders, with explicit annotations for regional rules.
- Support focused practice on recent legal reforms and newly introduced signs via amendment year tracking (`since`).
- Run entirely as a static client-side application hosted on GitHub Pages with zero required runtime server dependencies.

---

## Functional Requirements
### Quiz Flow and User Experience
- **Start Screen**:
  - Centered hero title and introductory description.
  - Dual mode selection cards allowing users to choose between Quiz mode and Traffic Sign Carousel mode.
  - Configuration container accepting an optional player name for score tracking and displaying the question round count.
  - Prominent primary action button ("Start quiz" or "Bekijk carrousel").
  - Discreet "Installeer als app" button when running in supporting PWA browsers.
  - Subtle horizontal divider separating primary interaction from application metadata.
  - Bottom-pinned action icon row with accessible tooltips:
    - External link icon to the official consolidated Belgian Highway Code on wegcode.be.
    - Report issue icon opening GitHub issues for filing feedback.
    - Info icon button opening the dedicated full-window About view.
  - Subtle copyright notice pinned to the bottom of the viewport.
- **In-Round Quiz Experience**:
  - Employs a 2-column split layout on desktop (`max-width: 960px`) separating question media on the left and stationary options on the right with zero layout jump.
  - Presents randomized questions per round (default 20, customizable via `?q=N`) sampled from the verified question pool.
  - Shows real-time progress indicators (`Vraag X/N`) and running score count.
  - Displays amendment year badges (e.g. `Sinds 2021`) for questions covering recently updated traffic rules.
  - Renders official SVG sign illustrations or real traffic situation photographs.
  - Delivers immediate color-coded feedback upon option selection with legal explanations and compact `Wegcode ↗` pill reference links.
  - On mobile, automatically collapses unchosen wrong options to ensure zero vertical scrolling across standard phone viewports.
  - Features an ergonomic circular floating action button (FAB `→`) on mobile and right-aligned arrow action on desktop.
  - Offers a dedicated "Meld fout" button on every question allowing users to report inaccuracies.
  - Provides a close button on every question, including answered questions and the final question.
  - Anchors the quiz close button to the ancestor card's top-right corner, matching other screen close controls without overlapping status.
  - Requires confirmation before discarding quiz progress and returning to the start screen without submitting results.
  - Preserves progress when dismissing confirmation through Continue, Escape, the dialog close button, or its backdrop.
  - Keeps keyboard focus inside confirmation, defaults to continuing, and retains player preferences after cancellation.
- **Traffic Sign Carousel Mode**:
  - Auto-cycles through Belgian traffic signs with sign codes, names, and legal descriptions.
  - Customizable slide duration via URL query parameter `?delay=N` (alias: `?d=N`, default 8 seconds).
  - Visual pause overlay with play/pause action button.
  - Keyboard shortcuts (Space to toggle pause, Arrow keys to navigate, Escape or Home button to return to start).
  - Smooth progress bar indicator tracking slide interval.
- **Dedicated About View**:
  - Full-window view accessible via the start screen Info button or `?view=about` URL parameter.
  - Displays application version tag dynamically derived from `CHANGELOG.md`.
  - Highlights authoritative legal and educational sources (Wegcode, VSV, Vias, De Grote Verkeerstoets, Wikimedia Commons).
  - Offers a dedicated project support card with GitHub Sponsors and voluntary donation links.
  - Provides a button that prints every Belgian road sign as a table, grouped and ordered
    like wegcode.be (series A-F), each row linking to its Wegcode article.
  - Fetches and formats full release notes and version history from `CHANGELOG.md`.
  - Details software license terms and provides an immediate return button to the start screen.
- **Dedicated Settings View**:
  - Full-window view accessible via the start screen gear button or `?config=1` URL parameter.
  - Mirrors the About view chrome: centered title, report issue button top-left, close button top-right.
  - Groups general, quiz-only, and carousel-only preferences into separate cards, all always visible.
  - Provides immediate live visual preview when modifying theme or accent color dropdowns.
  - Reverts uncommitted theme changes when closed via the close button or Escape key.
  - Keeps the bottom "Opslaan" save button sticky at the viewport bottom on both mobile and desktop screens during scrolling.
- **Dedicated Statistics View**:
  - Full-window view accessible via the start screen statistics button or `?view=stats` URL parameter.
  - Summarizes total games played, total minutes played, total questions answered, and aggregate average score percentage.
  - Presents detail metrics including correct answers, wrong answers, and the timestamp of the last played session.
  - Provides a data reset control allowing users to clear all stored statistics and error tracking on the device.
  - In mobile view, the statistics round-button is displayed when the app install button is absent and takes its place.
- **Results and Review**:
  - Displays total score, accuracy percentage, and total elapsed duration (minutes and seconds).
  - Keeps action buttons (Report, Share, Print, Close) and error retry controls sticky on mobile view during table scrolling.
  - Triggers a celebratory confetti animation when achieving a perfect score.
  - Presents a complete review table detailing every question, sign thumbnail, user response, and correct answer.
  - Provides a print-optimized layout that spans full width and prevents page breaks inside result rows.

### Question Bank and Legal Accuracy
- **Question Catalog**: Contains 353 verified questions covering hazard warnings, priority rules, speed limits, road positioning, cyclist/pedestrian infrastructure, real-world traffic situations, and general exam knowledge (breakdown equipment, following distance, licensing, drugs, accident duty, cargo, helmets).
- **Question Types**:
  - `recognize`: displays a traffic sign SVG and asks the user to identify its official meaning.
  - `identify`: displays a legal description and presents candidate sign options.
  - `rule`: presents a concrete driving scenario or regulatory question with four choice options.
  - `situation`: displays a high-resolution photograph of a real traffic situation and tests priority rules, lane positioning, and maneuvers.
- **Sign Assets**: All 193 signs reside in `assets/signs/` as valid SVGs using official Belgian designation codes (e.g. `A1a.svg`, `C31a.svg`, `D5.svg`).
- **Situation Photos**: All 55 situation photos reside in `assets/situations/` as high-resolution JPEG files sourced from De Grote Verkeerstoets and, for the sign-focused situations, from Wikimedia Commons under compatible free licenses.
- **Unshown Sign Safeguard**: No question may refer to a specific traffic sign without displaying its SVG image or photograph.
- **Query Parameter Filtering and Configuration**:
  - `?lang=nl|fr|de|en`: sets the interface language (default `nl`).
  - `?name=` (aliases: `?naam=`, `?n=`): pre-fills the player name on the start screen.
  - `?since=YYYY` (aliases: `?sinds=YYYY`, `?s=YYYY`): restricts question pool to questions introduced in or after the specified year.
  - `?type=` (alias: `?t=`): restricts question pool to a type (`recognize`, `identify`, `rule`, `situation`, `sign`).
  - `?q=N` (alias: `?quantity=N`): overrides the number of questions per round (default 20).
  - `?mode=carousel` (aliases: `?mode=carrousel`, `?sign-carousel`, `?sign-carrousel`): starts traffic sign carousel mode.
  - `?delay=N` (alias: `?d=N`): sets carousel slide duration in seconds (default 8).
  - `?pause=1`: pauses carousel on initial load.
  - `?view=about` (aliases: `?about=1`, `?screen=about`): opens the dedicated About view on load.
  - `?config=1` (alias: `?modal=config`): opens the dedicated Settings view on load.
  - `?theme=light|dark|system`: sets the color theme (default `system`).
  - `?theme-color=blue|yellow|red` (aliases: `?themecolor=`, `?theme_color=`): sets the accent color theme (default `blue`).
  - `?autotest=results`: automatically completes the quiz for visual verification and testing.

### Google Sheets Integration and Error Reporting
- **Result Logging**:
  - Optional score logging to a configured Google Apps Script Web App endpoint when a player name is provided.
  - Records timestamp, player name, correct count, total count, score percentage, and elapsed duration into a `Resultaten` sheet.
- **Question Error Reporting**:
  - Accessible modal dialog allowing users to submit corrections or feedback for a specific question.
  - Submits timestamp, question ID, question text, player name, and user remarks into a `Meldingen` sheet.
  - Offline FIFO queue in `localStorage` preserving error reports when disconnected, automatically dispatching sequentially upon reconnection.
- **Daily Summary Email**:
  - Apps Script time-driven triggers run `sendDailySummaryEmail` at 07:00 and 19:00 UTC every day.
  - Reports total and 24h/7d play counts, average questions/play, average play time, and average score.
  - Reports total and 24h/7d issue counts, the 3 latest issues, and the 3 most-reported question contexts.
  - Reports play counts, minutes played, and average score per configured tracked player, each in its own all-time/7d/24h table.
  - Email is titled "Verkeersregels Quiz Status Update", worded in Dutch, and styled after the app's light-theme blue palette.
- **Progressive Web App & Offline Execution**:
  - Installable application with standalone display mode, D5 roundabout icon suite, and native install prompt.
  - 100% offline execution via root Service Worker pre-caching all 227 core assets, sign SVGs, and situation images.
  - Installed clients activate new releases automatically and reload once the updated Service Worker takes control.
  - Register before language loading; check at startup, every visible minute, and when returning online or resuming.
  - Download fresh assets into a content-fingerprinted cache before activation; retain the working release if installation fails.
  - Real-time offline indicator alerting users when operating without network connectivity.

### Local Play Statistics
- **Storage Scope**: Play stats and most-used errors live only in the browser's `localStorage`
  (`verkeersquiz_stats` key); never sent to the server and cleared like any other site data.
- **Tracked Totals**: Games played, questions answered, correct/wrong counts, total play time,
  and the timestamp of the last played round, updated once per finished round.
- **Most-Used Errors**: Per-question wrong-answer counts, queryable as a ranked top-N list.
- **Error Review**: A start-screen button starts a quiz from every question ever answered
  wrong; a result-screen button restarts with only the current round's wrong answers.
- **Always-Include-Last-Errors Setting**: An opt-in settings checkbox forces the previous
  round's wrong questions into every subsequent quiz, filling remaining slots as usual.

---

## Technical and Architectural Requirements
### Client Architecture
- **Technology Stack**: Static HTML5, CSS3, vanilla ES2020 JavaScript without external UI frameworks or bundlers.
- **Module Structure**: Native ES modules under `js/` separate state (`state.js`, `dom.js`), storage (`preferences.js`, `report-queue.js`, `sheet.js`, `stats.js`), and UI concerns (`quiz.js`, `carousel.js`, `screens.js`, and related modules), composed by `app.js`.
- **Responsive Layout**: Mobile-first design adapting seamlessly from narrow mobile screens (375px) to desktop viewports (1000px+).
- **Accessibility**: Semantic HTML landmarks, ARIA modal dialogs (`role="dialog"`, `aria-modal="true"`), keyboard traps, and escape key handling.
- **Hosting Target**: Hosted on GitHub Pages directly from the repository's production branch.

### Security and Abuse Mitigation
- **Client-Side Secret Architectural Decision**:
  - The configuration parameter `CONFIG.SHEET_SECRET` in `js/config.js` is an abuse-mitigation write key rather than a confidential secret.
  - In a public static web application without a custom backend server, all client code and configuration strings are inherently visible to the user browser.
  - The write key acts as a threshold against generic scrapers, spiders, and automated spam bots targeting the Google Apps Script endpoint.
  - This architecture avoids requiring user registration, authentication servers, or database infrastructure while protecting the logging sheet against ambient automated abuse.

### Automated Testing and Quality Assurance
- **Unit Test Suite**: 32 automated tests across five test modules (`tests/test_quiz_data.py`, `tests/test_pwa.py`, `tests/test_ux_layout.py`, `tests/test_sign_carousel.py`, `tests/test_about_view.py`):
  - Validates exact count of 304 questions in `data/questions.json`.
  - Schema integrity, unique IDs, required fields, and valid option counts (`options >= 2`).
  - Correct index validity (`0 <= correctIndex < len(options)`).
  - Integer validity of `since` amendment years.
  - Authoritative HTTP(S) source URL validity on every question.
  - Existence and XML validity of all referenced SVG files in `assets/signs/`.
  - Existence and format validity of all referenced JPEG photos in `assets/situations/`.
  - Confirmation that no questions reference unshown signs.
  - Manifest validity, icon presence and dimensions, and completeness of service worker pre-caching.
- **DevOps Tooling**: Python scripts in `scripts/` automate local bootstrapping, PWA icon generation, and pre-flight validation.

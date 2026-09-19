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
  - Accepts an optional player name for personalized result tracking.
  - Displays quiz overview and explanation of the 20-question format.
  - Provides prominent legal reference links to the official consolidated Wegcode and amendment ledgers.
  - Features an interactive version pill badge displaying the current release and opening a changelog modal.
  - Explains the in-quiz question feedback mechanism with a visual hint.
- **In-Round Quiz Experience**:
  - Presents 20 randomized questions per round sampled from the verified question pool.
  - Shows real-time progress indicators (`Vraag X/20`) and running score count.
  - Displays amendment year badges (e.g. `Sinds 2021`) for questions covering recently updated traffic rules.
  - Renders official SVG sign illustrations for sign recognition and rule-related sign questions.
  - Delivers immediate color-coded feedback upon option selection with legal explanations and authoritative reference links.
  - Offers a dedicated "Meld fout" button on every question allowing users to report inaccuracies.
- **Results and Review**:
  - Displays total score, accuracy percentage, and total elapsed duration (minutes and seconds).
  - Triggers a celebratory confetti animation when achieving a perfect score (20/20).
  - Presents a complete review table detailing every question, sign thumbnail, user response, and correct answer.
  - Provides a print-optimized layout that spans full width and prevents page breaks inside result rows.

### Question Bank and Legal Accuracy

- **Question Catalog**: Contains 126 verified questions covering hazard warnings, priority rules, speed limits, road positioning, and pedestrian/cyclist infrastructure.
- **Question Types**:
  - `recognize`: displays a traffic sign SVG and asks the user to identify its official meaning.
  - `identify`: displays a legal description and presents candidate sign options.
  - `rule`: presents a concrete driving scenario or regulatory question with four choice options.
- **Sign Assets**: All signs reside in `assets/signs/` as valid SVGs using official Belgian designation codes (e.g. `A1a.svg`, `C31a.svg`, `D5.svg`).
- **Unshown Sign Safeguard**: No question may refer to a specific traffic sign without displaying its SVG image.
- **Query Parameter Filtering and Configuration**:
  - `?since=YYYY` (aliases: `?sinds=YYYY`, `?s=YYYY`): restricts question pool to questions introduced in or after the specified year.
  - `?q=N` (alias: `?quantity=N`): overrides the number of questions per round (default 20).
  - `?autotest=results`: automatically completes the quiz for visual verification and testing.

### Google Sheets Integration and Error Reporting

- **Result Logging**:
  - Optional score logging to a configured Google Apps Script Web App endpoint when a player name is provided.
  - Records timestamp, player name, correct count, total count, score percentage, and elapsed duration into a `Resultaten` sheet.
- **Question Error Reporting**:
  - Accessible modal dialog allowing users to submit corrections or feedback for a specific question.
  - Submits timestamp, question ID, question text, player name, and user remarks into a `Meldingen` sheet.
  - Offline FIFO queue in `localStorage` preserving error reports when disconnected, automatically dispatching sequentially upon reconnection.
- **Progressive Web App & Offline Execution**:
  - Installable application with standalone display mode, D5 roundabout icon suite, and native install prompt.
  - 100% offline execution via root Service Worker pre-caching all 193 sign SVGs, question banks, and assets.
  - Real-time offline indicator alerting users when operating without network connectivity.

---

## Technical and Architectural Requirements

### Client Architecture

- **Technology Stack**: Static HTML5, CSS3, vanilla ES2020 JavaScript without external UI frameworks or bundlers.
- **Responsive Layout**: Mobile-first design adapting seamlessly from narrow mobile screens (375px) to desktop viewports (1000px+).
- **Accessibility**: Semantic HTML landmarks, ARIA modal dialogs (`role="dialog"`, `aria-modal="true"`), keyboard traps, and escape key handling.
- **Hosting Target**: Hosted on GitHub Pages directly from the repository's production branch.

### Security and Abuse Mitigation

- **Client-Side Secret Architectural Decision**:
  - The configuration parameter `CONFIG.SHEET_SECRET` in `js/app.js` is an abuse-mitigation write key rather than a confidential secret.
  - In a public static web application without a custom backend server, all client code and configuration strings are inherently visible to the user browser.
  - The write key acts as a threshold against generic scrapers, spiders, and automated spam bots targeting the Google Apps Script endpoint.
  - This architecture avoids requiring user registration, authentication servers, or database infrastructure while protecting the logging sheet against ambient automated abuse.

### Automated Testing and Quality Assurance

- **Unit Test Suite**: `tests/test_quiz_data.py` and `tests/test_pwa.py` validate:
  - Exact count of 284 questions in `data/questions.json`.
  - Schema integrity, unique IDs, required fields, and valid option counts (`options >= 2`).
  - Correct index validity (`0 <= correctIndex < len(options)`).
  - Integer validity of `since` amendment years.
  - Authoritative HTTP(S) source URL validity on every question.
  - Existence and XML validity of all referenced SVG files in `assets/signs/`.
  - Confirmation that no questions reference unshown signs.
  - Manifest validity, icon presence and dimensions, and completeness of service worker pre-caching.
- **DevOps Tooling**: Python scripts in `scripts/` automate local bootstrapping, PWA icon generation, and pre-flight validation.

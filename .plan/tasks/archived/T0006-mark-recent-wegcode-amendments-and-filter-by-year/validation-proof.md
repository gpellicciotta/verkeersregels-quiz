### Changes Made

- `data/questions.json`: annotated 17 existing questions with `since` metadata and added 9 questions covering 2021-2026 Wegcode amendments.
- `css/style.css`: added pill-shaped `.badge-amber` and `.badge-blue` styles, `.filter-notice`, and `.table-question-wrap`.
- `js/app.js`: supported `?since=YYYY` URL parameter filtering, start screen notices, quiz question badges, and result table badges.
- `README.md`: documented the `?since=YYYY` and `?q=N` query parameters and the year badge system.
- `data/SOURCES.md`: updated the question bank count to 63 and recorded citations for all new amendment questions.

### Visual Validation

Visual checks on desktop and mobile confirmed that badges and filtering work as expected:

- Start screen with `?since=2022` displays an amber "Sinds 2022" badge and question count notice.
- Active quiz screen renders the amber badge prominently above the question text.
- Result table displays amber badges for recent amendments (<= 5 years) and blue badges for older rules.
- Mobile view renders cards cleanly with badges under the question header.

![Baseline Start View](T0006-view-before.png)

![Filtered Start View](T0006-view-after.png)

![Quiz Question with Amber Badge](T0006-quiz-badge.png)

![Result Table with Amendment Badges](T0006-result-badges.png)

### Automated Checks

- Question validation: verified 63 questions with unique IDs, 4 options, valid asset paths, and correctIndex bounds.
- Filtering check: verified `?since=2026` (1 question), `?since=2024` (2 questions), `?since=2022` (8 questions), and `?since=2021` (10 questions).
- Markdown linting: passed for `README.md`, `data/SOURCES.md`, and this task file.
- Taskfile linting: passed for this task file.

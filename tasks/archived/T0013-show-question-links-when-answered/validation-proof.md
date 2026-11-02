### Changes Made

- `data/questions.json`: added authoritative consolidated Wegcode links for all 47 sign questions.
- `js/app.js`: implemented `renderExplanation` with safe DOM link creation and external icon.
- `css/style.css`: styled `.explanation`, `.explanation-text`, `.explanation-source`, and `.explanation-link`.
- `tests/test_quiz_data.py`: added `test_all_questions_have_valid_source_url` and required source field checks.
- `docs/requirements.md`: documented instant question source links and 126 questions catalog count.
- `data/SOURCES.md`: documented consolidated Wegcode article sources for all traffic signs.
- `README.md`: noted official rule links in the gameplay summary.
- `CHANGELOG.md`: added entry under `v1.1.0-pre`.

### Visual Validation

Visual checks on desktop and mobile confirmed clear link rendering and responsive layouts:

- Baseline question view captured in [T0013-view-before.png](T0013-view-before.png).
- Desktop question view with link captured in [T0013-view-after.png](T0013-view-after.png).
- Mobile responsive layout captured in [T0013-view-mobile.png](T0013-view-mobile.png).
- Local web server returned HTTP 200 for all quiz assets.
- Links include `target="_blank"`, `rel="noopener noreferrer"`, and explicit focus styling.

![Baseline Question View](T0013-view-before.png)

![Desktop View with Reference Link](T0013-view-after.png)

![Mobile View with Reference Link](T0013-view-mobile.png)

### Automated Checks

- Ran `python -m unittest discover tests` passing all 9 tests in 0.06s.
- Validated all 126 question URLs with HTTP 200 responses.

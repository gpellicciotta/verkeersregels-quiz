### Changes Made

- `index.html`: added `.start-legal-links` footer to `#screen-start` with secure links to the official Wegcode and amendment ledger.
- `css/style.css`: added styles for `.start-legal-links`, muted header, and responsive column stacking below 640px.

### Visual Validation

Visual checks on desktop and mobile confirmed that legal links render cleanly without clutter:

- Baseline view before changes captured in [T0009-view-before.png](T0009-view-before.png).
- Updated view with legal links captured in [T0009-view-after.png](T0009-view-after.png).
- Local web server returned HTTP 200 for all quiz assets.
- Both external links include `target="_blank"` and `rel="noopener noreferrer"`.

![Baseline Home View](T0009-view-before.png)

![Updated Home View](T0009-view-after.png)

### Automated Checks

- Linters passed: `lint-markdown.py` and `lint-taskfile.py` verified the task documentation.
- Link attributes: confirmed `target="_blank"` and `rel="noopener noreferrer"` on all links.

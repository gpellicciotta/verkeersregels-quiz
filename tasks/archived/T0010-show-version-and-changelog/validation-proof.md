### Changes Made

- `js/app.js`: configured version string, wired dynamic badge text, implemented markdown parser with category badges, and added modal open/close listeners.
- `index.html`: added version badge button `#btn-version` to `#screen-start` footer and added accessible dialog `#modal-changelog`.
- `css/style.css`: styled `.btn-version` as an interactive pill badge, styled `.modal-dialog-changelog` with scrolling body and badges, and excluded modal from print.
- `README.md`: documented version indicator, changelog modal interaction, and `?modal=changelog` query parameter.
- `CHANGELOG.md`: added release note bullet under `v1.0.0-pre`.

### Visual Validation

Visual checks on desktop confirmed clean layout and smooth modal interactions:

- Baseline start screen view captured in [T0010-view-before.png](T0010-view-before.png).
- Updated start screen with version badge captured in [T0010-view-after.png](T0010-view-after.png).
- Interactive changelog modal captured in [T0010-modal.png](T0010-modal.png).
- Local web server returned HTTP 200 for all quiz assets.
- Verified dismissal via Close button, Sluiten button, backdrop click, and Escape key.

![Baseline Start View](T0010-view-before.png)

![Updated Start View with Version](T0010-view-after.png)

![Changelog Modal](T0010-modal.png)

### Automated Checks

- End-to-end tests: verified automated Playwright interactions opening modal, parsing changelog, and testing all dismiss mechanisms.
- Linters passed: verified documentation and task file formatting with dev-guidelines scripts.

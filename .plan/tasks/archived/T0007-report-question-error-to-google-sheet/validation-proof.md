### Changes Made

- `index.html`: added report explanation callout on `#screen-start`, added `#btn-report-error` to quiz header, and added `#modal-report` dialog.
- `css/style.css`: added styles for `.start-report-hint`, `.btn-report-error`, and the responsive modal dialog; excluded modal from print media.
- `js/app.js`: wired modal open/close interactions, dismiss handlers, remark input, and asynchronous submission to Google Apps Script.
- `google-apps-script/Code.gs`: added `report_error` action branch appending question feedback rows to the `Meldingen` sheet tab.
- `README.md`: documented error reporting in the gameplay instructions and detailed the `Meldingen` sheet columns.
- `CHANGELOG.md`: recorded release note under `v1.0.0-pre`.

### Visual Validation

Visual checks on desktop and automated browser runs confirmed that reporting works cleanly:

- Start screen shows explanation box with flag icon and guidance for reporting errors.
- Active quiz screen displays the "Meld fout" button in the header between progress and score.
- Clicking the button opens the modal displaying the current question ID, text, and remark field.
- Submitting displays the confirmation notice "Bedankt voor je melding!" and automatically closes the dialog.

![Baseline Quiz View](T0007-view-before.png)

![Updated Quiz View with Report Button](T0007-view-after.png)

![Question Error Report Modal](T0007-modal.png)

![Start Screen with Report Explanation](T0007-start-view.png)

### Automated Checks

- End-to-end browser tests: verified opening modal, cancelling via button, closing via Escape key, filling remark, and submitting POST payload.
- Payload verification: confirmed `actie`, `sleutel`, `datum`, `vraagId`, `vraag`, `naam`, and `opmerking` fields sent correctly.
- Markdown linting: passed for `README.md`, `CHANGELOG.md`, and this task file.
- Taskfile linting: passed for this task file.

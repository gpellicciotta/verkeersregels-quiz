### Changes Made
- `google-apps-script/Code.gs`: added the daily summary email (see Execution Log for the full
  function list); `doPost` behavior for `Resultaten`/`Meldingen` writes is unchanged.
- `tests/gas-summary.test.cjs`, `tests/test_gas_summary.py`: new automated coverage (see above).
- `docs/devops.md`, `docs/requirements.md`, `CHANGELOG.md`: documented the new operational feature.

### Automated Checks
- `node --test tests/gas-summary.test.cjs`: 9/9 passed.
- `python -m pytest -q`: 128 passed, 8 subtests passed.

### Manual/Visual Validation
Not applicable: this is a backend-only Apps Script change with no UI surface. The email body
format was validated through the automated `node --test` fixtures above (regex-matched exact
line output for each summary section) rather than a live send, since sending requires the
deployed Apps Script project's authorized Gmail scope, which is outside this repository.

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and
documentation all passed, so this task integrates directly per the coordination protocol.

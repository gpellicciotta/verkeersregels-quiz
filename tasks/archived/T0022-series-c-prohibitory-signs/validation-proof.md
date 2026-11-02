### Changes Made

- `data/questions.json`: added 25 new questions for Series C signs with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 167 to 192.
- `TODO.md`: removed completed task T0022 and updated dependency list in T0019.
- `tasks/T0022-series-c-prohibitory-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0022-series-c-prohibitory-signs.md`: 0 violations found.
- `python ../dev-guidelines/scripts/lint-markdown.py TODO.md tasks/T0022-series-c-prohibitory-signs.md`: 0 violations found.

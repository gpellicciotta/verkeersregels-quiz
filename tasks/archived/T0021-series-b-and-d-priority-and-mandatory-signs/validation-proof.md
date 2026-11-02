### Changes Made

- `data/questions.json`: added 16 new questions for Series B and D signs with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 151 to 167.
- `TODO.md`: removed completed task T0021 and updated dependency list in T0019.
- `tasks/T0021-series-b-and-d-priority-and-mandatory-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0021-series-b-and-d-priority-and-mandatory-signs.md`: 0 violations found.
- `python ../dev-guidelines/scripts/lint-markdown.py TODO.md tasks/T0021-series-b-and-d-priority-and-mandatory-signs.md`: 0 violations found.

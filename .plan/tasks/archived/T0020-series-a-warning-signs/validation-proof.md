### Changes Made

- `data/questions.json`: added 25 new questions for signs A1c through A51 with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 126 to 151.
- `TODO.md`: removed completed task T0020 and updated dependency list in T0019.
- `tasks/T0020-series-a-warning-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0020-series-a-warning-signs.md`: 0 violations found.
- `python ../dev-guidelines/scripts/lint-markdown.py TODO.md tasks/T0020-series-a-warning-signs.md`: 0 violations found.

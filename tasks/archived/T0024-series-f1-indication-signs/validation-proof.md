### Changes Made

- `data/questions.json`: added 37 new questions for Series F1 indication signs with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 204 to 241.
- `TODO.md`: removed completed task T0024 and updated dependency list in T0019.
- `tasks/T0024-series-f1-indication-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0024-series-f1-indication-signs.md`: 0 violations found.
- `python ../dev-guidelines/scripts/lint-markdown.py TODO.md tasks/T0024-series-f1-indication-signs.md`: 0 violations found.

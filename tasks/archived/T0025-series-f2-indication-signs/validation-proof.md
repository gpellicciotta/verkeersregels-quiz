### Changes Made

- `data/questions.json`: added 43 new questions for Series F2 indication signs with balanced options.
- `tests/test_quiz_data.py`: updated expected total question count assertion from 241 to 284.
- `TODO.md`: removed completed task T0025 and updated dependency list in T0019.
- `tasks/T0025-series-f2-indication-signs.md`: documented implementation steps, verification logs, and completion status.

### Verification Evidence

- `python -m unittest discover -s tests -v`: 9 of 9 automated tests passed cleanly.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0025-series-f2-indication-signs.md`: 0 violations found.
- `python ../dev-guidelines/scripts/lint-markdown.py TODO.md tasks/T0025-series-f2-indication-signs.md`: 0 violations found.

### Changes Made

- `data/questions.json`:
  - `rule-fietser-b22`: added `"sign": "assets/signs/B22.svg"` and updated question to `"Wat laat dit toelatingsbord (B22) toe aan fietsers en bestuurders van speed pedelecs bij een rood verkeerslicht?"`.
  - `rule-fietser-b23`: added `"sign": "assets/signs/B23.svg"` and updated question to `"Wat betekent dit toelatingsbord (B23) voor fietsers en bestuurders van speed pedelecs bij een rood verkeerslicht?"`.
  - `rule-fietsstraat-f111-2021`: added `"sign": "assets/signs/F111.svg"` and updated question to `"Tot waar gelden de specifieke verkeersregels na het voorbijrijden van dit verkeersbord (F111)?"`.
- `tests/test_quiz_data.py`: tightened `test_no_questions_refer_to_unshown_signs` to check all sign codes `\b(?:bord|toelatingsbord|verkeersbord)?\s*\(?([A-F][0-9]+[a-z]?)\)?\b` across all non-identify questions.

### Verification Results

- `python -m unittest discover -s tests -v`: 9 of 9 tests passed cleanly in 0.611s.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0026-verify-visual-signs-in-all-questions.md`: 0 violations.
- `python ../dev-guidelines/scripts/lint-markdown.py tasks/T0026-verify-visual-signs-in-all-questions.md`: 0 violations.

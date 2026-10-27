### Changes Made

- `scripts/fetch_belgian_signs.py`: Created CLI tool for fetching, rate-limiting, and XML-validating Belgian sign SVGs from Wikimedia Commons.
- `assets/signs/`: Expanded asset library from 35 to 193 valid SVG traffic signs across Series A, B, C, D, E, and F.
- `data/questions.json`: Expanded question bank from 126 to 284 questions, providing full question coverage for every sign.
  - Subtask T0020: 25 questions for Series A (Gevaarsborden A1c–A51).
  - Subtask T0021: 16 questions for Series B (Voorrang B3–B23) and Series D (Gebod D1b–D13).
  - Subtask T0022: 25 questions for Series C (Verbodsborden C5–C47).
  - Subtask T0023: 12 questions for Series E (Parkeren & Stilstaan E5–E11).
  - Subtask T0024: 37 questions for Series F Part 1 (Aanwijzingsborden F1a–F50bis).
  - Subtask T0025: 43 questions for Series F Part 2 (Aanwijzingsborden F51–F120).
  - Answer index distribution perfectly balanced: 70 for index 0, 71 for index 1, 71 for index 2, 72 for index 3.
- `data/SOURCES.md`: Updated question counts, category distributions, type breakdowns, and logged additions.
- `tests/test_quiz_data.py`: Updated test assertion validating 284 questions and 193 SVG files.

### Verification Results

- `python -m unittest discover -s tests -v`: 9 of 9 tests passed cleanly in 0.367s.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0019-complete-belgian-traffic-sign-coverage.md`: 0 violations.
- `python ../dev-guidelines/scripts/lint-markdown.py TODO.md data/SOURCES.md tasks/T0019-complete-belgian-traffic-sign-coverage.md`: 0 violations.

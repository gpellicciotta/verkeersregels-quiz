### Changes Made

- `data/questions.json`: expanded question bank from 63 to 126 questions by adding 63 high-quality questions.
  - 13 direct `recognize` questions covering all previously unaddressed signs in `assets/signs/`.
  - 3 `identify` questions for C39, E3, and F3b.
  - 14 rule questions covering post-2022 amendments (e-scooters, smartphone mount, speed pedelec, velomobile flag, emergency corridor, ritsen, cycle streets, B22/B23 exemptions).
  - 33 realistic traffic situation questions covering priority to the right exceptions, trams, bus stops, manoeuvres, pedestrian vs cyclist crossings, parking distances, lighting, and alcohol laws.
  - Balanced answer slots across indices: 31 for index 0, 32 for index 1, 32 for index 2, 31 for index 3.
- `tests/test_quiz_data.py`: updated `test_total_question_count` assertion to validate exactly 126 questions.
- `data/SOURCES.md`: updated total count to 126, updated type and category breakdowns, verified URLs, and logged changes.

### Verification Results

- `python -m pytest tests/`: 8 passed in 0.09s.
- `python ../dev-guidelines/scripts/lint-taskfile.py tasks/T0012-extend-question-bank-and-rules-since-2022.md`: passed linting.
- `python ../dev-guidelines/scripts/lint-markdown.py data/SOURCES.md tasks/T0012-extend-question-bank-and-rules-since-2022.md`: passed linting.
- Confirmed all 35 SVG sign assets in `assets/signs/` now have dedicated recognize questions and pass XML parsing.

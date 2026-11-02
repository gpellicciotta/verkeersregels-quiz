# T0088: Technical Specifications

- **[Decided]** Update question sit-28-parkeren-trottoir-verbod to state parking with four wheels on the sidewalk.
  The situation photo shows all four wheels parked on the sidewalk.
- **[Decided]** Replace reference to sign E9b with sign E9e.
  Under Belgian traffic law art. 70.2.1, E9e allows parking completely on the sidewalk, while E9b does not.
- Propagate corrections to English, French, German, and Italian translation overlays.
- Update data/SOURCES.md row for sit-28-parkeren-trottoir-verbod.jpg.
- Size estimate: 12 files, 30 lines.
- Size note: localization and changelog fan-out across five languages exceeds 8 files; total lines stay small.
- Completion check: python -m unittest discover tests/ passes.

### Declared Files
- data/questions.json
- data/translations.en.json
- data/translations.fr.json
- data/translations.de.json
- data/translations.it.json
- data/SOURCES.md
- 	ests/test_quiz_data.py
- CHANGELOG.md
- CHANGELOG.en.md
- CHANGELOG.fr.md
- CHANGELOG.de.md
- CHANGELOG.it.md

### Tests
- Unit: 	est_sit_28_trottoir_phrasing_and_sign_reference in 	ests/test_quiz_data.py.
  - Asserts that question sit-28-parkeren-trottoir-verbod in questions.json contains ier wielen and not 	wee wielen.
  - Asserts that question sit-28-parkeren-trottoir-verbod references E9e and not E9b.
  - Asserts that all translation files in data/translations.<lang>.json reference four wheels and sign E9e.
- Integration: python -m unittest discover tests/ passes all 175+ tests including i18n overlays.

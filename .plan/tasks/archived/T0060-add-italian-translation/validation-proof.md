### Changes Made
- `data/strings.it.json`: Added the complete Italian UI dictionary.
- `data/translations.it.json`: Added Italian translations for all quiz questions, options, explanations, and sign details.
- `scripts/translate-strings.py`: Added reproducible UI dictionary generation with placeholder and HTML preservation.
- `js/i18n.js`, `js/app.js`, `sw.js`: Added Italian runtime support and offline assets.
- `tests/`: Extended dictionary, question overlay, sharing, accessibility, and carousel localization checks.

### Automated Verification
```text
pytest tests -q
96 passed in 6.08s
```

```text
python -m py_compile scripts/translate-strings.py scripts/translate-questions.py
git diff --check
```

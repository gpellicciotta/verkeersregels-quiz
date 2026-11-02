# T0088: Walkthrough & Validation

## Red Phase
Command: `python -m unittest tests/test_quiz_data.py` (exit code 1)

```text
..........F.
======================================================================
FAIL: test_sit_28_trottoir_phrasing_and_sign_reference (tests.test_quiz_data.TestQuizData.test_sit_28_trottoir_phrasing_and_sign_reference)
Validates that sit-28 refers to parking with 4 wheels and sign E9e across all languages.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_quiz_data.py", line 178, in test_sit_28_trottoir_phrasing_and_sign_reference
    self.assertNotIn("twee wielen", sit_28["question"].lower())
AssertionError: 'twee wielen' unexpectedly found in 'mag je je auto met twee wielen op het trottoir parkeren zoals getoond op deze foto, als er geen verkeersbord e9b staat?'

----------------------------------------------------------------------
Ran 12 tests in 0.217s

FAILED (failures=1)
```

## Green Phase
Command: `python -m unittest tests/test_quiz_data.py` (exit code 0)

```text
............
----------------------------------------------------------------------
Ran 12 tests in 0.141s

OK
```

Command: `python -m unittest discover tests/` (exit code 0)

```text
................................................................................................................................................................................
----------------------------------------------------------------------
Ran 176 tests in 0.937s

OK
```

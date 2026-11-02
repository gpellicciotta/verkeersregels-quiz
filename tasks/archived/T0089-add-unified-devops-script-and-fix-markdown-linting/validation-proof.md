# T0089: Walkthrough & Validation

## Red Phase
Command: `python -m unittest tests/test_devops.py` (exit code 1)

```text
FFF.FF
======================================================================
FAIL: test_devops_script_exists (tests.test_devops.TestDevopsCli.test_devops_script_exists)
Validates that scripts/devops.py exists on disk.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_devops.py", line 20, in test_devops_script_exists
    self.assertTrue(DEVOPS_SCRIPT.exists(), f"Missing script: {DEVOPS_SCRIPT}")
AssertionError: False is not true : Missing script: scripts/devops.py

[... 4 failures omitted ...]
----------------------------------------------------------------------
Ran 6 tests in 0.266s

FAILED (failures=5)
```

## Green Phase
Command: `python scripts/devops.py check` (exit code 0)

```text
[*] Running automated test suite
============================================================
OK
[*] Linting documentation and changelog
============================================================
All documentation passed markdown linting.
```

Command: `python -m unittest discover tests/` (exit code 0)

```text
......................................................................................................................................................................................
----------------------------------------------------------------------
Ran 182 tests in 2.265s

OK
```

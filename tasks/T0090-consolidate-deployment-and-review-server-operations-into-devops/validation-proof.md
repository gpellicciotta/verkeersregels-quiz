# T0090: Walkthrough & Validation

## Red Phase
Command: `python -m unittest tests/test_devops.py` (exit code 1)

```text
...F.F..
======================================================================
FAIL: test_inlined_server_and_deploy_symbols (tests.test_devops.TestDevopsCli.test_inlined_server_and_deploy_symbols)
Validates that review server and deployment symbols are inlined into devops.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_devops.py", line 44, in test_inlined_server_and_deploy_symbols
    self.assertFalse(
AssertionError: True is not false : devops module should not contain _DEPLOY_PATH reference

======================================================================
FAIL: test_obsolete_scripts_removed (tests.test_devops.TestDevopsCli.test_obsolete_scripts_removed)
Validates that standalone deploy and review server scripts have been removed.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_devops.py", line 26, in test_obsolete_scripts_removed
    self.assertFalse(
AssertionError: True is not false : Obsolete standalone script should be deleted: scripts/deploy-to-production.py

----------------------------------------------------------------------
Ran 8 tests in 0.901s

FAILED (failures=2)
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
........................................................................................................................................................................................
----------------------------------------------------------------------
Ran 184 tests in 5.962s

OK
```

Command: `python scripts/devops.py deploy --dry-run` (exit code 0)

```text
[*] Checking git working tree status
============================================================
Working tree is clean.
[*] Checking active CHANGELOG.md version
============================================================
Active in-development version: v3.8.3-pre
[*] Checking git branch
============================================================
Current branch: task/T0090-consolidate-deployment-and-review-server-operations-into-devops
[*] Running automated test suite
============================================================
OK
[*] Linting documentation and changelog
============================================================
All documentation passed markdown linting.
[*] Deployment Pre-flight Summary for v3.8.3
============================================================
Target Version: v3.8.3
Current Branch: task/T0090-consolidate-deployment-and-review-server-operations-into-devops
Pre-flight Checks: ALL PASSED
[dry-run] Preconditions validated successfully. Would finalize, commit, and tag v3.8.3. No files were changed.
```

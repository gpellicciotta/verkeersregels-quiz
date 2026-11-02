# T0091: Walkthrough & Validation

## Red Phase
Command: `python -m unittest tests/test_devops.py` (exit code 1)

```text
.F..F..F..
======================================================================
FAIL: test_has_plan_branch_detects_plan (tests.test_devops.TestDevopsCli.test_has_plan_branch_detects_plan)
Validates that has_plan_branch detects local plan branch.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_devops.py", line 81, in test_has_plan_branch_detects_plan
    self.assertTrue(hasattr(mod, "has_plan_branch"))
AssertionError: False is not true

======================================================================
FAIL: test_inlined_server_and_deploy_symbols (tests.test_devops.TestDevopsCli.test_inlined_server_and_deploy_symbols)
Validates that review server and deployment symbols are inlined into devops.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_devops.py", line 73, in test_inlined_server_and_deploy_symbols
    self.assertTrue(
AssertionError: False is not true : Missing inlined deployment function in devops: has_plan_branch

======================================================================
FAIL: test_push_release_includes_plan_branch (tests.test_devops.TestDevopsCli.test_push_release_includes_plan_branch)
Validates that push_release includes plan branch when local plan branch exists.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_devops.py", line 94, in test_push_release_includes_plan_branch
    self.assertEqual(
AssertionError: Lists differ: ['git', 'push', 'origin', 'main', 'v3.8.3'] != ['git', 'push', 'origin', 'main', 'v3.8.3', 'plan']

----------------------------------------------------------------------
Ran 10 tests in 0.976s

FAILED (failures=3)
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
..........................................................................................................................................................................................
----------------------------------------------------------------------
Ran 186 tests in 2.060s

OK
```

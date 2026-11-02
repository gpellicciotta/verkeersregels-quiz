---
id: T0090
owner: "@gemini"
needs: []
branch: task/T0090-consolidate-deployment-and-review-server-operations-into-devops
worktree: .plan/work/T0090-consolidate-deployment-and-review-server-operations-into-devops
status: completed
started_at: "2026-11-02T18:12:49Z"
ended_at: "2026-11-02T18:21:34Z"
review: none
preview: none
protocol: standard
completion-commit: f4bf7efe8a13dd2d9ff02f4627a57638f23abba1
---
# T0090: Consolidate deployment and review server operations into devops script

## Goals
Consolidate deployment and review server operations into scripts/devops.py.
Remove obsolete deploy-to-production.py and run-review-server.py scripts.
Update references in docs, README, and bootstrap script.
Ensure full test coverage and verified pre-flight deployment checks.

## Task Execution Steps
- [x] **[Implement]** Author failing tests in tests/test_devops.py for script removal and inlining.
- [x] **[Verify]**    Run tests/test_devops.py to verify failure in red phase.
- [x] **[Implement]** Inline ReviewServer and deploy operations into scripts/devops.py and delete obsolete scripts.
- [x] **[Implement]** Update documentation, README, and bootstrap references to point to devops.py.
- [x] **[Verify]**    Run devops checks and test suite confirming green phase.
- [x] **[Doc]**       Update changelogs across all five languages.

## Execution Log
- [2026-11-02] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-02] **[Implement]**
  Authored failing unit tests in tests/test_devops.py for script removal and inlined symbols.

- [2026-11-02] **[Verify]**
  Confirmed failure in red phase with two test failures as expected.

- [2026-11-02] **[Implement]**
  Inlined ReviewServer, QuietHandler, and deploy operations into scripts/devops.py and deleted obsolete standalone scripts.

- [2026-11-02] **[Implement]**
  Updated docs/devops.md, README.md, and scripts/bootstrap-dev-environment.py references to point to devops.py.

- [2026-11-02] **[Verify]**
  Ran devops check and full 184 unit tests confirming clean passes in green phase.

- [2026-11-02] **[Doc]**
  Updated changelogs across Dutch, English, French, German, and Italian recording consolidated devops operations.

- [2026-11-02] **[Verify]**
  Recorded task outcomes.
  - Files touched: 12.
  - Lines touched: 439.
  - Reopenings: 0.

- [2026-11-02] **[Complete]**
  Task completed successfully.


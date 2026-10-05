---
name: adhoc
description: Adhoc direct-commit protocol executed in-place without separate branch, worktree, or task file.
worktree: false
branch: false
task_file: false
integration: none
commit: true
push: none
cleanup: false
roles:
  - name: developer
    description: Quick in-place editor and validator
---

# Adhoc Task Execution Protocol

You are executing task **{{task-id}}**: {{description}}

## Environment
- Working Directory: {{work-dir}} (primary checkout)
- Isolation: None (in-place execution)

## Workflow
1. Perform edits directly in the primary workspace without creating a separate branch or worktree.
2. Do not create or require a companion task markdown file.
3. Implement the requested fix or minor change cleanly.
4. Run relevant tests to verify the change introduces no regressions.
5. When verification succeeds, update CHANGELOG.md if user-facing, and remove {{task-id}} from PLAN.md.
6. Commit changes directly to mainline with a concise, single-sentence commit message.
7. End the turn immediately once the terminal state is reached.

---
name: draft
description: In-place draft protocol executed without branch, worktree, task file, or automated commits.
worktree: false
branch: false
task_file: false
integration: none
commit: false
push: none
cleanup: false
roles:
  - name: developer
    description: Quick in-place editor and validator
---

# Draft Task Execution Protocol

You are executing task **{{task-id}}**: {{description}}

## Environment
- Working Directory: {{work-dir}} (primary checkout)
- Isolation: None (in-place execution)
- Commits: None (leave uncommitted in working tree)

## Workflow
1. Perform edits directly in the primary workspace without creating a separate branch or worktree.
2. Do not create or require a companion task markdown file.
3. Implement the requested fix or changes cleanly.
4. Run relevant tests to verify changes and ensure no unintended regressions.
5. When work is complete, mark {{task-id}} in PLAN.md as completed with [x] (do not delete the line).
6. Leave all modified files uncommitted in the working tree for developer inspection and review.
7. End the turn immediately once the terminal state is reached.

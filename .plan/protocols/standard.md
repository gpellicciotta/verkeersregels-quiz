---
name: standard
description: Standard full task protocol with isolated worktree, git branch, and companion task file.
worktree: true
branch: true
task_file: true
roles:
  - name: developer
    description: Primary code and documentation implementer
---

# Standard Task Execution Protocol

You are executing task **{{task-id}}**: {{description}}

## Environment
- Working Directory: {{work-dir}}
- Task File: {{task-file}}
- Target Branch: {{branch}}
- Target Worktree: {{worktree}}

## Workflow
1. Verify the task branch and worktree are prepared for {{task-id}}.
2. Inspect git status and any checkpoint stashes from previous turns.
3. Review goals, execution steps, and acceptance criteria in {{task-file}}.
4. Confine code modifications strictly to the isolated worktree directory.
5. Run automated test suites and verify all checks pass cleanly.
6. Record execution progress, update CHANGELOG.md, and sign off the task file.
7. Integrate the task branch into mainline, remove {{task-id}} from PLAN.md, and prune the worktree.
8. End the turn immediately once the terminal state is reached.

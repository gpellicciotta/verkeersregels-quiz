---
id: T0003
owner: ""
needs: [T0007, T0008]
branch: task/T0003-release-v1-0-0
worktree: ./work/T0003-release-v1-0-0
status: available
started: 2026-09-18
ended: —
---

# T0003: Release v1.0.0

## Goals

Publish the first stable version of the quiz on GitHub Pages once the question review is complete.
Bring the project up to the dev-guidelines baseline for versioning, standard files and scripts.
The release must contain only questions and signs that are valid under the current Wegcode.

## Task Execution Steps

- [ ] **[Decide]**    Choose where version metadata lives for this static site and how the page shows it.
- [ ] **[Implement]** Add the missing standard files: LICENSE.md, docs/index.md, docs/requirements.md and docs/devops.md.
- [ ] **[Implement]** Add scripts/bootstrap-dev-environment.py and scripts/deploy-to-production.py as the dev-guidelines require.
- [ ] **[Implement]** Add an automated check that questions.json is well-formed and every referenced sign file exists.
- [ ] **[Decide]**    Confirm the Google Sheet shared secret is acceptable in public client-side code.
- [ ] **[Verify]**    Test the full quiz flow at mobile and desktop widths, with before and after screenshots.
- [ ] **[Doc]**       Mark v1.0.0 as released in CHANGELOG.md and open the next -pre heading.
- [ ] **[Implement]** Tag v1.0.0, push after approval, and confirm GitHub Pages serves the release.

## Execution Log

- [2026-09-18] **[Decided]**
  Created this release task; it waits for the question review so the release ships reviewed content.

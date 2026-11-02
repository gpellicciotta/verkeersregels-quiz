# T0091: Technical Specifications

- **[Decided]** Add `has_plan_branch` helper detecting local `plan` branch in git object store.
- **[Decided]** Update `push_release` to include `plan` branch alongside release branch and version tag.
- **[Decided]** Update manual push guidance message in `deploy` to include `plan` branch when present.
- **[Decided]** Update `check_clean_git_tree` to verify working tree status of `.plan` worktree.
- **[Decided]** Add unit tests in `tests/test_devops.py` verifying `plan` branch inclusion and push target formatting.
- **[Decided]** Update `docs/devops.md` and changelogs across all five languages.
- Size estimate: 8 files, 80 lines.
- Completion check: `python scripts/devops.py check` passes and `python -m unittest tests/test_devops.py` passes.

### Declared Files
- `scripts/devops.py`
- `tests/test_devops.py`
- `docs/devops.md`
- `CHANGELOG.md`
- `CHANGELOG.en.md`
- `CHANGELOG.fr.md`
- `CHANGELOG.de.md`
- `CHANGELOG.it.md`

### Tests
- Unit: `tests/test_devops.py` tests `has_plan_branch`, `push_release` target list, and manual push guidance format.
- Integration: `python scripts/devops.py deploy --dry-run` checks working tree and reports pre-flight status with exit code 0.

# T0090: Technical Specifications

- **[Decided]** Consolidate standalone deployment and review server operations into `scripts/devops.py`.
- **[Decided]** Inline `ReviewServer`, `QuietHandler`, and `serve` from `scripts/run-review-server.py` into `scripts/devops.py`.
- **[Decided]** Inline pre-flight checks, release commit, tag creation, and deploy pipeline into `scripts/devops.py`.
- **[Decided]** Delete obsolete `scripts/deploy-to-production.py` and `scripts/run-review-server.py`.
- **[Decided]** Update `docs/devops.md`, `README.md`, and `scripts/bootstrap-dev-environment.py` references to use `devops.py`.
- **[Decided]** Add unit tests in `tests/test_devops.py` verifying script removal and inlined functionality.
- Size estimate: 10 files, 350 lines.
- Size note: localization fan-out across five changelogs increases file count; total lines remain low.
- Completion check: `python scripts/devops.py check` passes and `python -m unittest discover tests/` passes.

### Declared Files
- `scripts/devops.py`
- `tests/test_devops.py`
- `docs/devops.md`
- `README.md`
- `scripts/bootstrap-dev-environment.py`
- `CHANGELOG.md`
- `CHANGELOG.en.md`
- `CHANGELOG.fr.md`
- `CHANGELOG.de.md`
- `CHANGELOG.it.md`

### Tests
- Unit: `tests/test_devops.py` verifies obsolete script removal, inlined server/deploy symbols, and CLI subcommands.
- Integration: `python scripts/devops.py production deploy --dry-run` runs full pre-flight checks and returns exit code 0.

# T0089: Technical Specifications

- **[Decided]** Implement `scripts/devops.py` following `cli-guidelines`:
  - Actions: `test`, `lint`, `check`, `serve`, `sw`, `versions`, `production`, `deploy` (shortcut), `version`, `help`.
  - Supports `--dry-run` and `--push` on `production deploy` and top-level `deploy`.
  - Supports standard flags: `--version`, `--help` (`-h`, `help --verbose`), `-v`/`--verbose`, `--debug`, `--log-file`, `--log-level`.
  - Standard exit codes: 0 (success), 1 (failure), 2 (invalid arguments).
- **[Decided]** Fix `run_markdown_lint` in `scripts/deploy-to-production.py`:
  - Pass the required `check` subcommand and `--offline` flag to `lint-markdown.py`.
  - Capture and log both stderr and stdout on lint failure so error messages are visible.
- **[Decided]** Fix all 27 MD019 file link issues in `docs/devops.md` and `docs/requirements.md` and 1 in `README.md`.
- Size estimate: 11 files, 250 lines.
- Size note: localization and changelog fan-out across five languages exceeds 8 files; total lines stay small.
- Completion check: `python scripts/devops.py check` passes and `python -m unittest discover tests/` passes.

### Declared Files
- `scripts/devops.py`
- `scripts/deploy-to-production.py`
- `docs/devops.md`
- `docs/requirements.md`
- `README.md`
- `tests/test_devops.py`
- `CHANGELOG.md`
- `CHANGELOG.en.md`
- `CHANGELOG.fr.md`
- `CHANGELOG.de.md`
- `CHANGELOG.it.md`

### Tests
- Unit: `tests/test_devops.py` verifying `--help`, `--version`, exit codes, `versions`, `check`, and production commands.
- Integration: `python scripts/devops.py production deploy --dry-run` completes pre-flight checks successfully with exit code 0.

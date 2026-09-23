#!/usr/bin/env python3
"""Bootstraps a fresh checkout of Verkeersregels Quiz.

Verifies Python version, repository structure, runs automated unit tests, and confirms working build readiness.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/bootstrap-dev-environment.py
  python scripts/bootstrap-dev-environment.py --version
  python scripts/bootstrap-dev-environment.py --help
"""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

# Add scripts directory to path to import _cli_common when run directly
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from _cli_common import (
    REPO_ROOT,
    TeeLogger,
    build_action_parser,
    get_project_version,
    print_help,
    print_version,
)

PROG = "bootstrap-dev-environment"
DESCRIPTION = "Prepares dev environment, verifies requirements, runs tests, and confirms site build readiness."
ACTIONS = ["setup", "version", "help"]
DEFAULT_ACTION = "setup"
EXIT_CODES = [
    (0, "Success (environment verified and ready)"),
    (1, "One or more bootstrap steps failed"),
]


def run_step(logger: TeeLogger, description: str, args: list[str]) -> bool:
    """Runs one bootstrap step, logging its outcome."""
    logger.log(f"\n[*] {description}\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        args,
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=not logger.verbose,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"{description} failed (exit code {result.returncode})", level="ERROR")
        if not logger.verbose and result.stdout:
            logger.log(result.stdout.strip(), level="ERROR")
        if not logger.verbose and result.stderr:
            logger.log(result.stderr.strip(), level="ERROR")
        return False
    if not logger.verbose and result.stdout.strip():
        lines = [line for line in result.stdout.strip().splitlines() if line.strip()]
        if lines:
            logger.log(lines[-1], level="INFO")
    return True


def check_python_version(logger: TeeLogger) -> bool:
    """Ensures Python version is at least 3.10."""
    logger.log("\n[*] Checking Python version\n" + "=" * 60, level="INFO")
    major, minor = sys.version_info.major, sys.version_info.minor
    if (major, minor) < (3, 10):
        logger.log(f"Python 3.10+ required, current is {major}.{minor}", level="ERROR")
        return False
    logger.log(f"Python {major}.{minor}.{sys.version_info.micro} OK", level="INFO")
    return True


def check_repo_structure(logger: TeeLogger) -> bool:
    """Verifies that all mandatory directories and files exist."""
    logger.log("\n[*] Verifying project directory structure\n" + "=" * 60, level="INFO")
    required_paths = [
        REPO_ROOT / "index.html",
        REPO_ROOT / "css" / "style.css",
        REPO_ROOT / "js" / "app.js",
        REPO_ROOT / "data" / "questions.json",
        REPO_ROOT / "assets" / "signs",
        REPO_ROOT / "docs" / "index.md",
        REPO_ROOT / "docs" / "requirements.md",
        REPO_ROOT / "docs" / "devops.md",
        REPO_ROOT / "LICENSE.md",
        REPO_ROOT / "CHANGELOG.md",
        REPO_ROOT / "TODO.md",
    ]
    missing = [str(p.relative_to(REPO_ROOT)) for p in required_paths if not p.exists()]
    if missing:
        logger.log(f"Missing required project files: {', '.join(missing)}", level="ERROR")
        return False
    logger.log("All required project files present.", level="INFO")
    return True


def setup(logger: TeeLogger) -> int:
    """Executes the full bootstrap sequence."""
    if not check_python_version(logger):
        return 1
    if not check_repo_structure(logger):
        return 1

    all_ok = True
    all_ok &= run_step(
        logger,
        "Running automated unit tests",
        [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
    )

    linter_path = REPO_ROOT.parent / "dev-guidelines" / "scripts" / "lint-markdown.py"
    if linter_path.exists():
        all_ok &= run_step(
            logger,
            "Linting documentation and changelog",
            [
                sys.executable,
                str(linter_path),
                "LICENSE.md",
                "docs/index.md",
                "docs/requirements.md",
                "docs/devops.md",
                "CHANGELOG.md",
            ],
        )

    if all_ok:
        logger.log(
            "\n[+] Bootstrap completed successfully: development environment is ready.\n"
            "    To run the quiz locally: python scripts/run-review-server.py serve\n",
            level="INFO",
        )
        return 0
    return 1


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    args = parser.parse_args()

    if args.version or args.action == "version":
        print_version(PROG, version)
        return 0
    if args.help or args.action == "help":
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    logger = TeeLogger(args.log_file, debug=args.debug, verbose=args.verbose)
    start_time = time.time()
    try:
        logger.log_startup(PROG, version, args.action)
        exit_code = setup(logger)
        logger.log_completion(PROG, args.action, exit_code, start_time)
        return exit_code
    finally:
        logger.close()


if __name__ == "__main__":
    sys.exit(main())

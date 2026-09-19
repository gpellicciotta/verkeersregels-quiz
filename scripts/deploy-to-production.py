#!/usr/bin/env python3
"""Pre-flight checks and deployment guidance for GitHub Pages.

Validates that the git working tree is clean, the version is finalized, all tests pass,
and markdown files pass linting before releasing to GitHub Pages.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/deploy-to-production.py deploy [--dry-run]
  python scripts/deploy-to-production.py --version
  python scripts/deploy-to-production.py --help
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

PROG = "deploy-to-production"
DESCRIPTION = "Validates preconditions and guides production deployment to GitHub Pages."
ACTIONS = ["deploy", "version", "help"]
DEFAULT_ACTION = "deploy"
EXIT_CODES = [
    (0, "Success (preconditions validated or deployment guided)"),
    (1, "Preconditions not met or verification failed"),
]


def check_clean_git_tree(logger: TeeLogger) -> bool:
    """Returns whether the git working tree has no uncommitted changes."""
    logger.log("\n[*] Checking git working tree status\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log("Failed to query git status", level="ERROR")
        return False
    if result.stdout.strip():
        logger.log(
            "Working tree has uncommitted changes - commit or stash before deploying.\n"
            + result.stdout.strip(),
            level="ERROR",
        )
        return False
    logger.log("Working tree is clean.", level="INFO")
    return True


def check_not_pre_release(version: str, logger: TeeLogger) -> bool:
    """Returns whether the current version is a finalized release, not '-pre'."""
    logger.log("\n[*] Checking release version status\n" + "=" * 60, level="INFO")
    if version.endswith("-pre"):
        logger.log(
            f"Version '{version}' is still in development ('-pre') - finalize release first.",
            level="ERROR",
        )
        return False
    logger.log(f"Version '{version}' is a finalized release.", level="INFO")
    return True


def check_current_branch(logger: TeeLogger) -> str:
    """Returns the current git branch name."""
    logger.log("\n[*] Checking git branch\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    branch = result.stdout.strip() if result.returncode == 0 else "unknown"
    logger.log(f"Current branch: {branch}", level="INFO")
    return branch


def run_unit_tests(logger: TeeLogger) -> bool:
    """Runs automated unit tests."""
    logger.log("\n[*] Running automated test suite\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"Test suite failed:\n{result.stderr}\n{result.stdout}", level="ERROR")
        return False
    lines = [line for line in result.stderr.strip().splitlines() if line.strip()]
    if lines:
        logger.log(lines[-1], level="INFO")
    return True


def run_markdown_lint(logger: TeeLogger) -> bool:
    """Runs markdown linter if available."""
    linter_path = REPO_ROOT.parent / "dev-guidelines" / "scripts" / "lint-markdown.py"
    if not linter_path.exists():
        return True
    logger.log("\n[*] Linting documentation and changelog\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        [
            sys.executable,
            str(linter_path),
            "LICENSE.md",
            "docs/index.md",
            "docs/requirements.md",
            "docs/devops.md",
            "CHANGELOG.md",
        ],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"Markdown linting failed:\n{result.stdout}", level="ERROR")
        return False
    logger.log("All documentation passed markdown linting.", level="INFO")
    return True


def deploy(version: str, dry_run: bool, logger: TeeLogger) -> int:
    """Validates pre-flight checks and reports deployment steps."""
    all_ok = True
    all_ok &= check_clean_git_tree(logger)
    all_ok &= check_not_pre_release(version, logger)
    branch = check_current_branch(logger)
    all_ok &= run_unit_tests(logger)
    all_ok &= run_markdown_lint(logger)

    if not all_ok:
        logger.log(
            "\n[!] Pre-flight deployment checks failed. Resolve issues before deploying.",
            level="ERROR",
        )
        return 1

    summary_lines = [
        f"\n[*] Deployment Pre-flight Summary for v{version}",
        "=" * 60,
        f"Target Version: v{version}",
        f"Current Branch: {branch}",
        "Pre-flight Checks: ALL PASSED",
    ]
    logger.log("\n".join(summary_lines), level="INFO")

    if dry_run:
        logger.log(
            "\n[dry-run] Preconditions validated successfully. No deployment actions taken.",
            level="INFO",
        )
        return 0

    guidance = (
        "\n[+] Ready for GitHub Pages deployment:\n"
        "    1. Ensure task branch is merged to 'main':\n"
        f"       git checkout main && git merge {branch}\n"
        f"    2. Ensure tag v{version} exists:\n"
        f"       git tag v{version}\n"
        "    3. With user confirmation, push main and tags to remote:\n"
        f"       git push origin main v{version}\n"
        "    4. GitHub Pages will build and publish automatically within 2 minutes.\n"
    )
    logger.log(guidance, level="INFO")
    return 0


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    parser.add_argument("--dry-run", action="store_true", help="Validate preconditions without deploying")
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
        config = {"dry_run": args.dry_run}
        logger.log_startup(PROG, version, args.action, config)
        exit_code = deploy(version, args.dry_run, logger)
        logger.log_completion(PROG, args.action, exit_code, start_time)
        return exit_code
    finally:
        logger.close()


if __name__ == "__main__":
    sys.exit(main())

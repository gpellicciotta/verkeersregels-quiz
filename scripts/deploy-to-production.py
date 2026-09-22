#!/usr/bin/env python3
"""Pre-flight checks and release automation for GitHub Pages.

Validates that the git working tree is clean, an active '-pre' version exists in
CHANGELOG.md, all tests pass, and markdown files pass linting. Once verified, finalizes
the CHANGELOG.md heading, regenerates sw.js, commits, and tags the release locally.
Pushing to the remote (which actually publishes to GitHub Pages) only happens when
'--push' is passed explicitly - passing that flag IS the confirmation to push. Without
it, the exact push command is printed as a separate manual step instead.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/deploy-to-production.py deploy [--dry-run | --push]
  python scripts/deploy-to-production.py --version
  python scripts/deploy-to-production.py --help
"""

from __future__ import annotations

from datetime import date
import re
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
DESCRIPTION = "Validates preconditions, then finalizes, commits, and tags a release for GitHub Pages."
ACTIONS = ["deploy", "version", "help"]
DEFAULT_ACTION = "deploy"
EXIT_CODES = [
    (0, "Success (preconditions validated, or release finalized/committed/tagged)"),
    (1, "Preconditions not met or a release step failed"),
]

CHANGELOG_PATH = REPO_ROOT / "CHANGELOG.md"
SW_SCRIPT_PATH = REPO_ROOT / "scripts" / "generate-sw.py"


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


def read_active_pre_release_version(logger: TeeLogger) -> str | None:
    """Returns the active '-pre' version number from CHANGELOG.md's top heading, or None."""
    logger.log("\n[*] Checking active CHANGELOG.md version\n" + "=" * 60, level="INFO")
    if not CHANGELOG_PATH.exists():
        logger.log("CHANGELOG.md not found.", level="ERROR")
        return None
    text = CHANGELOG_PATH.read_text(encoding="utf-8")
    m = re.search(r"^## v([0-9]+(?:\.[0-9]+)+)-pre\s*$", text, re.MULTILINE)
    if not m:
        logger.log(
            "No active '-pre' version heading found at the top of CHANGELOG.md - nothing to release.",
            level="ERROR",
        )
        return None
    version = m.group(1)
    logger.log(f"Active in-development version: v{version}-pre", level="INFO")
    return version


def finalize_changelog(version: str, logger: TeeLogger) -> bool:
    """Replaces the active '-pre' heading with a '[released: date]' status tag."""
    logger.log("\n[*] Finalizing CHANGELOG.md heading\n" + "=" * 60, level="INFO")
    text = CHANGELOG_PATH.read_text(encoding="utf-8")
    today = date.today().isoformat()
    new_text, count = re.subn(
        rf"^## v{re.escape(version)}-pre\s*$",
        f"## v{version} [released: {today}]",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    if count != 1:
        logger.log("Failed to locate the '-pre' heading to finalize.", level="ERROR")
        return False
    CHANGELOG_PATH.write_text(new_text, encoding="utf-8")
    logger.log(f"Finalized heading: v{version} [released: {today}]", level="INFO")
    return True


def regenerate_service_worker(logger: TeeLogger) -> bool:
    """Regenerates sw.js so precached assets and the cache-key version stay current."""
    logger.log("\n[*] Regenerating service worker precache\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        [sys.executable, str(SW_SCRIPT_PATH), "generate"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"sw.js regeneration failed:\n{result.stderr}\n{result.stdout}", level="ERROR")
        return False
    logger.log("sw.js regenerated successfully.", level="INFO")
    return True


def create_release_commit(version: str, logger: TeeLogger) -> bool:
    """Commits the finalized CHANGELOG.md and regenerated sw.js."""
    logger.log("\n[*] Committing release\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        ["git", "add", "CHANGELOG.md", "sw.js"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"git add failed:\n{result.stderr}", level="ERROR")
        return False
    result = subprocess.run(
        ["git", "commit", "-m", f"Released v{version}."],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"git commit failed:\n{result.stderr}\n{result.stdout}", level="ERROR")
        return False
    logger.log(f"Committed release v{version}.", level="INFO")
    return True


def create_git_tag(version: str, logger: TeeLogger) -> bool:
    """Creates the local git tag for the release."""
    logger.log("\n[*] Creating git tag\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        ["git", "tag", f"v{version}"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"git tag failed (it may already exist):\n{result.stderr}", level="ERROR")
        return False
    logger.log(f"Created tag v{version}.", level="INFO")
    return True


def push_release(branch: str, version: str, logger: TeeLogger) -> bool:
    """Pushes the release branch and tag to origin. Only called when --push was passed explicitly."""
    logger.log("\n[*] Pushing release to origin\n" + "=" * 60, level="INFO")
    result = subprocess.run(
        ["git", "push", "origin", branch, f"v{version}"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        logger.log(f"git push failed:\n{result.stderr}\n{result.stdout}", level="ERROR")
        return False
    logger.log(f"Pushed {branch} and tag v{version} to origin.", level="INFO")
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


def deploy(dry_run: bool, push: bool, logger: TeeLogger) -> int:
    """Validates pre-flight checks, then finalizes, commits, tags, and optionally pushes the release."""
    if dry_run and push:
        logger.log("--dry-run and --push cannot be combined.", level="ERROR")
        return 1

    all_ok = True
    all_ok &= check_clean_git_tree(logger)
    version = read_active_pre_release_version(logger)
    all_ok &= version is not None
    branch = check_current_branch(logger)
    all_ok &= run_unit_tests(logger)
    all_ok &= run_markdown_lint(logger)

    if not all_ok or version is None:
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
            f"\n[dry-run] Preconditions validated successfully. Would finalize, commit, and "
            f"tag v{version}. No files were changed.",
            level="INFO",
        )
        return 0

    if not finalize_changelog(version, logger):
        return 1
    if not regenerate_service_worker(logger):
        logger.log(
            "CHANGELOG.md was finalized but sw.js regeneration failed.\n"
            "Fix the issue and rerun, or 'git checkout -- CHANGELOG.md' to revert.",
            level="ERROR",
        )
        return 1
    if not create_release_commit(version, logger):
        logger.log(
            "CHANGELOG.md and sw.js were updated but not committed.\n"
            "Inspect with 'git diff', then commit manually or resolve and rerun.",
            level="ERROR",
        )
        return 1
    if not create_git_tag(version, logger):
        return 1

    if not push:
        guidance = (
            f"\n[+] Release v{version} committed and tagged locally on '{branch}'.\n"
            "    With explicit confirmation, push to publish to GitHub Pages:\n"
            f"      git push origin {branch} v{version}\n"
            "    GitHub Pages will build and publish automatically within 2 minutes.\n"
        )
        logger.log(guidance, level="INFO")
        return 0

    if not push_release(branch, version, logger):
        return 1

    logger.log(
        f"\n[+] Release v{version} pushed to origin ('--push' was given). "
        "GitHub Pages will build and publish automatically within 2 minutes.",
        level="INFO",
    )
    return 0


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    parser.add_argument("--dry-run", action="store_true", help="Validate preconditions without deploying")
    parser.add_argument(
        "--push",
        action="store_true",
        help="Push the release branch and tag to origin after tagging, without a separate confirmation step. "
        "Passing this flag IS the explicit confirmation to push.",
    )
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
        config = {"dry_run": args.dry_run, "push": args.push}
        logger.log_startup(PROG, version, args.action, config)
        exit_code = deploy(args.dry_run, args.push, logger)
        logger.log_completion(PROG, args.action, exit_code, start_time)
        return exit_code
    finally:
        logger.close()


if __name__ == "__main__":
    sys.exit(main())

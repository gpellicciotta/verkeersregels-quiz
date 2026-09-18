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
from pathlib import Path

from _cli_common import build_action_parser, get_project_version, print_help, print_version

PROG = "deploy-to-production"
DESCRIPTION = "Validates preconditions and guides production deployment to GitHub Pages."
EXIT_CODES = [(0, "Success"), (1, "Preconditions not met or verification failed")]
REPO_ROOT = Path(__file__).resolve().parent.parent


def check_clean_git_tree() -> bool:
    """Returns whether the git working tree has no uncommitted changes."""
    print("\n[*] Checking git working tree status", flush=True)
    print("=" * 60, flush=True)
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("[!] Failed to query git status", flush=True)
        return False
    if result.stdout.strip():
        print("[!] Working tree has uncommitted changes - commit or stash before deploying.", flush=True)
        print(result.stdout.strip(), flush=True)
        return False
    print("Working tree is clean.", flush=True)
    return True


def check_not_pre_release(version: str) -> bool:
    """Returns whether the current version is a finalized release, not '-pre'."""
    print("\n[*] Checking release version status", flush=True)
    print("=" * 60, flush=True)
    if version.endswith("-pre"):
        print(f"[!] Version '{version}' is still in development ('-pre') - finalize release first.", flush=True)
        return False
    print(f"Version '{version}' is a finalized release.", flush=True)
    return True


def check_current_branch() -> str:
    """Returns the current git branch name."""
    print("\n[*] Checking git branch", flush=True)
    print("=" * 60, flush=True)
    result = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    branch = result.stdout.strip() if result.returncode == 0 else "unknown"
    print(f"Current branch: {branch}", flush=True)
    return branch


def run_unit_tests() -> bool:
    """Runs automated unit tests."""
    print("\n[*] Running automated test suite", flush=True)
    print("=" * 60, flush=True)
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"[!] Test suite failed:\n{result.stderr}\n{result.stdout}", flush=True)
        return False
    lines = [line for line in result.stderr.strip().splitlines() if line.strip()]
    if lines:
        print(lines[-1], flush=True)
    return True


def run_markdown_lint() -> bool:
    """Runs markdown linter if available."""
    linter_path = REPO_ROOT.parent / "dev-guidelines" / "scripts" / "lint-markdown.py"
    if not linter_path.exists():
        return True
    print("\n[*] Linting documentation and changelog", flush=True)
    print("=" * 60, flush=True)
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
        print(f"[!] Markdown linting failed:\n{result.stdout}", flush=True)
        return False
    print("All documentation passed markdown linting.", flush=True)
    return True


def deploy(version: str, dry_run: bool) -> int:
    """Validates pre-flight checks and reports deployment steps."""
    all_ok = True
    all_ok &= check_clean_git_tree()
    all_ok &= check_not_pre_release(version)
    branch = check_current_branch()
    all_ok &= run_unit_tests()
    all_ok &= run_markdown_lint()

    if not all_ok:
        print("\n[!] Pre-flight deployment checks failed. Resolve issues before deploying.", flush=True)
        return 1

    print(f"\n[*] Deployment Pre-flight Summary for v{version}", flush=True)
    print("=" * 60, flush=True)
    print(f"Target Version: v{version}")
    print(f"Current Branch: {branch}")
    print("Pre-flight Checks: ALL PASSED")

    if dry_run:
        print("\n[dry-run] Preconditions validated successfully. No deployment actions taken.", flush=True)
        return 0

    print("\n[+] Ready for GitHub Pages deployment:")
    print("    1. Ensure task branch is merged to 'main':")
    print("       git checkout main && git merge " + branch)
    print(f"    2. Ensure tag v{version} exists:")
    print(f"       git tag v{version}")
    print("    3. With user confirmation, push main and tags to remote:")
    print(f"       git push origin main v{version}")
    print("    4. GitHub Pages will build and publish automatically within 2 minutes.\n")
    return 0


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ["deploy", "version", "help"], "deploy")
    parser.add_argument("--dry-run", action="store_true", help="Validate preconditions without deploying")
    args = parser.parse_args()

    if args.version or args.action == "version":
        print_version(PROG, version)
        return 0
    if args.help or args.action == "help":
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    return deploy(version, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())

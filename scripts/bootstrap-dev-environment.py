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
from pathlib import Path

from _cli_common import build_action_parser, get_project_version, print_help, print_version

PROG = "bootstrap-dev-environment"
DESCRIPTION = "Prepares dev environment, verifies requirements, runs tests, and confirms site build readiness."
EXIT_CODES = [(0, "Success"), (1, "One or more bootstrap steps failed")]
REPO_ROOT = Path(__file__).resolve().parent.parent


def run_step(description: str, args: list[str], verbose: bool = False) -> bool:
    """Runs one bootstrap step, printing its outcome."""
    print(f"\n[*] {description}", flush=True)
    print("=" * 60, flush=True)
    result = subprocess.run(
        args,
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=not verbose,
        text=True,
    )
    if result.returncode != 0:
        print(f"[!] {description} failed (exit code {result.returncode})", flush=True)
        if not verbose and result.stdout:
            print(result.stdout, flush=True)
        if not verbose and result.stderr:
            print(result.stderr, flush=True)
        return False
    if not verbose and result.stdout.strip():
        # Print summary lines
        lines = [line for line in result.stdout.strip().splitlines() if line.strip()]
        if lines:
            print(lines[-1], flush=True)
    return True


def check_python_version() -> bool:
    """Ensures Python version is at least 3.10."""
    print("\n[*] Checking Python version", flush=True)
    print("=" * 60, flush=True)
    major, minor = sys.version_info.major, sys.version_info.minor
    if (major, minor) < (3, 10):
        print(f"[!] Python 3.10+ required, current is {major}.{minor}", flush=True)
        return False
    print(f"Python {major}.{minor}.{sys.version_info.micro} OK", flush=True)
    return True


def check_repo_structure() -> bool:
    """Verifies that all mandatory directories and files exist."""
    print("\n[*] Verifying project directory structure", flush=True)
    print("=" * 60, flush=True)
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
        print(f"[!] Missing required project files: {', '.join(missing)}", flush=True)
        return False
    print("All required project files present.", flush=True)
    return True


def setup(verbose: bool = False) -> int:
    """Executes the full bootstrap sequence."""
    if not check_python_version():
        return 1
    if not check_repo_structure():
        return 1

    all_ok = True
    all_ok &= run_step(
        "Running automated unit tests",
        [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
        verbose=verbose,
    )

    # Optional markdown linting check if dev-guidelines script is reachable
    linter_path = REPO_ROOT.parent / "dev-guidelines" / "scripts" / "lint-markdown.py"
    if linter_path.exists():
        all_ok &= run_step(
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
            verbose=verbose,
        )

    if all_ok:
        print("\n[+] Bootstrap completed successfully: development environment is ready.", flush=True)
        print("    To run the quiz locally: python -m http.server 8000\n", flush=True)
        return 0
    return 1


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ["setup", "version", "help"], "setup")
    args = parser.parse_args()

    if args.version or args.action == "version":
        print_version(PROG, version)
        return 0
    if args.help or args.action == "help":
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    return setup(verbose=args.verbose)


if __name__ == "__main__":
    sys.exit(main())

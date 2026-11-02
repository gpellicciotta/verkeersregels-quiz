#!/usr/bin/env python3
"""Unified development and operational CLI for Verkeersregels Quiz.

Provides action-oriented commands for testing, linting, quality checking, serving locally,
service worker regeneration, version inspection, and production deployment.

Usage:
  python scripts/devops.py test
  python scripts/devops.py lint
  python scripts/devops.py check
  python scripts/devops.py serve [--port 8000]
  python scripts/devops.py sw
  python scripts/devops.py versions [--check]
  python scripts/devops.py production {deploy|check} [--dry-run] [--push]
  python scripts/devops.py deploy [--dry-run] [--push]
  python scripts/devops.py --version
  python scripts/devops.py --help
"""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path
import re
import subprocess
import sys
import time

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

# Load deploy-to-production module dynamically due to hyphenated filename
_DEPLOY_PATH = SCRIPTS_DIR / "deploy-to-production.py"
_SPEC = importlib.util.spec_from_file_location("deploy_to_production", _DEPLOY_PATH)
assert _SPEC and _SPEC.loader
deploy_to_production = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(deploy_to_production)

PROG = "devops"
DESCRIPTION = "Unified development and operational CLI: test, lint, check, serve, sw, versions, and deploy."
ACTIONS = [
    "test",
    "lint",
    "check",
    "serve",
    "sw",
    "versions",
    "production",
    "deploy",
    "version",
    "help",
]
DEFAULT_ACTION = "help"
EXIT_CODES = [
    (0, "Success"),
    (1, "An operation or precondition failed"),
    (2, "Invalid arguments or syntax errors"),
]

CORE_DOCS = [
    "LICENSE.md",
    "docs/index.md",
    "docs/requirements.md",
    "docs/devops.md",
    "CHANGELOG.md",
]


def run_unit_tests(logger: TeeLogger) -> bool:
    """Runs automated unit tests via python unittest."""
    logger.log("\n[*] Running automated test suite\n" + "=" * 60, level="INFO")
    cmd = [sys.executable, "-m", "unittest", "discover", "-s", "tests"]
    result = subprocess.run(
        cmd,
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        err = (result.stderr.strip() + "\n" + result.stdout.strip()).strip()
        logger.log(f"Test suite failed:\n{err}", level="ERROR")
        return False
    lines = [line for line in result.stderr.strip().splitlines() if line.strip()]
    if lines:
        logger.log(lines[-1], level="INFO")
    return True


def run_markdown_lint(logger: TeeLogger) -> bool:
    """Runs markdown linter across core documentation."""
    candidates = [
        REPO_ROOT.parent / "dev-guidelines" / "scripts" / "lint-markdown.py",
        REPO_ROOT.parent.parent.parent.parent / "dev-guidelines" / "scripts" / "lint-markdown.py",
    ]
    linter_path = next((p for p in candidates if p.exists()), None)
    if linter_path is None:
        logger.log("dev-guidelines linter not found; skipping markdown lint.", level="WARN")
        return True

    logger.log("\n[*] Linting documentation and changelog\n" + "=" * 60, level="INFO")
    cmd = [
        sys.executable,
        str(linter_path),
        "check",
        "--offline",
        *CORE_DOCS,
    ]
    result = subprocess.run(
        cmd,
        cwd=str(REPO_ROOT),
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        err = (result.stderr.strip() + "\n" + result.stdout.strip()).strip()
        logger.log(f"Markdown linting failed:\n{err}", level="ERROR")
        return False
    logger.log("All documentation passed markdown linting.", level="INFO")
    return True


def run_check(logger: TeeLogger) -> bool:
    """Runs tests and markdown linting."""
    tests_ok = run_unit_tests(logger)
    lint_ok = run_markdown_lint(logger)
    return tests_ok and lint_ok


def run_serve(port: int, logger: TeeLogger) -> bool:
    """Runs the local review web server."""
    server_script = SCRIPTS_DIR / "run-review-server.py"
    if not server_script.exists():
        logger.log("run-review-server.py not found.", level="ERROR")
        return False
    cmd = [sys.executable, str(server_script), "serve", "--port", str(port)]
    logger.log(f"Starting review server on port {port}...", level="INFO")
    return subprocess.run(cmd, cwd=str(REPO_ROOT), check=False).returncode == 0


def run_sw(logger: TeeLogger) -> bool:
    """Regenerates service worker precache assets and version hash."""
    sw_script = SCRIPTS_DIR / "generate-sw.py"
    if not sw_script.exists():
        logger.log("generate-sw.py not found.", level="ERROR")
        return False
    cmd = [sys.executable, str(sw_script), "generate"]
    result = subprocess.run(cmd, cwd=str(REPO_ROOT), check=False, capture_output=True, text=True)
    if result.returncode != 0:
        err = (result.stderr.strip() + "\n" + result.stdout.strip()).strip()
        logger.log(f"sw.js generation failed:\n{err}", level="ERROR")
        return False
    logger.log("sw.js regenerated successfully.", level="INFO")
    return True


def run_versions(check_drift: bool, logger: TeeLogger) -> bool:
    """Inspects project version and checks for drift."""
    version = get_project_version()
    changelog_path = REPO_ROOT / "CHANGELOG.md"
    sw_path = REPO_ROOT / "sw.js"

    logger.log(f"Project version: v{version}", level="INFO")
    if not check_drift:
        return True

    drift = False
    if changelog_path.exists():
        text = changelog_path.read_text(encoding="utf-8")
        m = re.search(r"^##\s+v?([0-9]+(?:\.[0-9]+)+(?:-[^\s\[]+)?|[^\s\[]+)", text, re.MULTILINE)
        if m and m.group(1).strip() != version:
            logger.log(f"Version drift detected: CHANGELOG has v{m.group(1).strip()}, project has v{version}", level="ERROR")
            drift = True
        else:
            logger.log("CHANGELOG.md version matches active project version.", level="INFO")

    if sw_path.exists():
        sw_text = sw_path.read_text(encoding="utf-8")
        clean_v = version[:-4] if version.endswith("-pre") else version
        if clean_v not in sw_text:
            logger.log(f"Version note: sw.js cache key may not match release v{clean_v}; run 'devops sw' before release.", level="WARN")

    return not drift


def print_detailed_help(prog: str, version: str, parser: argparse.ArgumentParser) -> None:
    """Prints help including detailed descriptions for each action."""
    print_help(prog, version, DESCRIPTION, parser, EXIT_CODES)
    print("\nDetailed Action Descriptions:")
    details = [
        ("test", "Run automated unit and integration tests across the test suite."),
        ("lint", "Validate documentation and changelog formatting using lint-markdown."),
        ("check", "Execute full quality suite (automated unit tests and markdown linting)."),
        ("serve", "Launch threaded local HTTP review server for browser inspection."),
        ("sw", "Regenerate service worker cache key and asset precache list."),
        ("versions", "Inspect active project version and verify synchronization across files."),
        ("production", "Execute production deployment checks or release workflow (deploy, check)."),
        ("deploy", "Shortcut for 'production deploy' to validate, finalize, tag, and publish."),
    ]
    for name, desc in details:
        print(f"  {name:<12} {desc}")


def main(argv: list[str] | None = None) -> int:
    if argv is None:
        argv = sys.argv[1:]

    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    parser.add_argument("subaction", nargs="?", default=None, help="Subaction for production (deploy, check)")
    parser.add_argument("--dry-run", action="store_true", help="Validate preconditions without deploying")
    parser.add_argument(
        "--push",
        action="store_true",
        help="Push the release branch and tag to origin after tagging (confirmation to publish).",
    )
    parser.add_argument("--check", action="store_true", help="Check version drift without modifying files")
    parser.add_argument("--port", type=int, default=8000, help="HTTP port for serve (default: 8000)")

    # Intercept --help and version early to support help --verbose
    is_help = any(arg in argv for arg in ("-h", "--help", "help"))
    is_verbose = "--verbose" in argv or "-v" in argv
    is_version = any(arg in argv for arg in ("--version", "version"))

    if is_help:
        if is_verbose:
            print_detailed_help(PROG, version, parser)
        else:
            print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    if is_version and not is_help:
        print_version(PROG, version)
        return 0

    try:
        args = parser.parse_args(argv)
    except SystemExit as exc:
        return exc.code

    start_time = time.time()
    logger = TeeLogger(
        verbose=args.verbose,
        debug=args.debug,
        log_path=args.log_file,
    )
    logger.log_startup(PROG, version, args.action)

    exit_code = 0
    try:
        if args.action == "test":
            exit_code = 0 if run_unit_tests(logger) else 1
        elif args.action == "lint":
            exit_code = 0 if run_markdown_lint(logger) else 1
        elif args.action == "check":
            exit_code = 0 if run_check(logger) else 1
        elif args.action == "serve":
            exit_code = 0 if run_serve(args.port, logger) else 1
        elif args.action == "sw":
            exit_code = 0 if run_sw(logger) else 1
        elif args.action == "versions":
            exit_code = 0 if run_versions(args.check, logger) else 1
        elif args.action == "production":
            sub = args.subaction or "deploy"
            if sub == "check":
                exit_code = deploy_to_production.deploy(dry_run=True, push=False, logger=logger)
            elif sub == "deploy":
                exit_code = deploy_to_production.deploy(dry_run=args.dry_run, push=args.push, logger=logger)
            else:
                logger.log(f"Unknown production subaction: '{sub}'. Choose 'deploy' or 'check'.", level="ERROR")
                exit_code = 2
        elif args.action == "deploy":
            exit_code = deploy_to_production.deploy(dry_run=args.dry_run, push=args.push, logger=logger)
        else:
            logger.log(f"Unknown action: '{args.action}'", level="ERROR")
            exit_code = 2
    except Exception as exc:
        logger.log(f"Unhandled operational failure: {exc}", level="ERROR")
        exit_code = 1
    finally:
        logger.log_completion(PROG, args.action, exit_code, start_time)
        logger.close()

    return exit_code


if __name__ == "__main__":
    sys.exit(main())

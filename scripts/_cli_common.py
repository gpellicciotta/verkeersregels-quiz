"""Shared CLI boilerplate for standalone scripts under scripts/."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

APP_AUTHOR = "Giovanni Pellicciotta"

REPO_ROOT = Path(__file__).resolve().parent.parent


def get_project_version() -> str:
    """Read the version from js/app.js so all scripts self-report consistently."""
    try:
        app_js = REPO_ROOT / "js" / "app.js"
        if app_js.exists():
            text = app_js.read_text(encoding="utf-8")
            m = re.search(r'VERSION:\s*"([^"]+)"', text)
            if m:
                v = m.group(1).strip()
                return v[1:] if v.startswith("v") else v
    except OSError:
        pass
    return "0.0.0+unknown"


def build_action_parser(prog: str, description: str, actions: list, default_action: str) -> argparse.ArgumentParser:
    """Builds an action-oriented parser with version and help options."""
    parser = argparse.ArgumentParser(prog=prog, description=description, add_help=False)
    parser.add_argument("action", nargs="?", default=default_action, choices=actions, help="Action to perform")
    parser.add_argument("-h", "--help", action="store_true", help="Show this help message and exit")
    parser.add_argument("-v", "--version", action="store_true", help="Show version information and exit")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose output")
    return parser


def print_version(prog: str, version: str) -> None:
    """Prints single-line version output conforming to CLI guidelines."""
    print(f"{prog} v{version} - Copyright (c) 2026 {APP_AUTHOR}")


def print_help(prog: str, version: str, description: str, parser: argparse.ArgumentParser, exit_codes: list) -> None:
    """Prints formatted help output including header, usage, and exit codes."""
    print_version(prog, version)
    print()
    print(description)
    print()
    parser.print_help()
    print("\nExit codes:")
    for code, meaning in exit_codes:
        print(f"  {code}  {meaning}")

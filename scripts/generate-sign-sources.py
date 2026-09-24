#!/usr/bin/env python3
"""Regenerates the "Sign images" table in data/SOURCES.md from assets/signs/.

For every local sign SVG, looks up its exact Wikimedia Commons source page by
querying the Commons API for a file with the identical SHA-1 content hash, so
every row is proven against the committed file's actual bytes rather than
guessed from a filename pattern. Signs with no exact-hash match on Commons are
left out of the table and reported so they can be investigated manually.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/generate-sign-sources.py generate
  python scripts/generate-sign-sources.py --version
  python scripts/generate-sign-sources.py --help
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import time
from pathlib import Path
from typing import Any

import requests

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

PROG = "generate-sign-sources"
DESCRIPTION = 'Regenerates the Sign images table in data/SOURCES.md from assets/signs/, matched by exact Commons file hash.'
ACTIONS = ["generate", "version", "help"]
DEFAULT_ACTION = "generate"
EXIT_CODES = [
    (0, "Success (table regenerated, every sign matched)"),
    (1, "One or more signs could not be matched to a Commons file by hash"),
    (2, "Invalid arguments or runtime error"),
]

SIGNS_DIR = REPO_ROOT / "assets" / "signs"
QUESTIONS_PATH = REPO_ROOT / "data" / "questions.json"
SOURCES_PATH = REPO_ROOT / "data" / "SOURCES.md"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "VerkeersregelsQuizBot/3.0 (https://github.com/gpellicciotta/verkeersregels-quiz; contact@verkeersregels-quiz.local)"

TABLE_START = "| Local file | Meaning (NL) | Wikimedia Commons source page |"
TABLE_SEP = "|---|---|---|"


def natural_sort_key(filename: str) -> list[Any]:
    """Splits a sign filename into text/number chunks so A1a < A7a < A11 < A21, not string order."""
    return [int(chunk) if chunk.isdigit() else chunk for chunk in re.split(r"(\d+)", filename)]


def load_sign_meanings() -> dict[str, str]:
    """Maps 'assets/signs/<file>.svg' to its Dutch signTitle from questions.json."""
    data = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    meanings: dict[str, str] = {}
    for q in data.get("questions", []):
        sign = q.get("sign")
        title = q.get("signTitle")
        if sign and title:
            meanings[sign] = title
    return meanings


def find_commons_source(sha1_hex: str, session: requests.Session, logger: TeeLogger) -> dict[str, str] | None:
    """Looks up the Commons file with the exact given SHA-1 content hash."""
    params = {
        "action": "query",
        "list": "allimages",
        "aisha1": sha1_hex,
        "aiprop": "url",
        "format": "json",
    }
    for attempt in range(3):
        try:
            time.sleep(1.0)
            resp = session.get(COMMONS_API, params=params, timeout=15)
            if resp.status_code == 429:
                logger.log(f"Hit rate limit on hash lookup, backing off...", level="WARN")
                time.sleep(4.0 * (attempt + 1))
                continue
            resp.raise_for_status()
            images = resp.json().get("query", {}).get("allimages", [])
            if not images:
                return None
            if len(images) > 1:
                logger.log(
                    f"SHA1 {sha1_hex} matched {len(images)} Commons files, using the first one.",
                    level="WARN",
                )
            return {"title": images[0]["title"], "url": images[0]["descriptionurl"]}
        except Exception as exc:
            logger.log(f"Error on hash lookup for {sha1_hex} (attempt {attempt}): {exc}", level="DEBUG")
            time.sleep(2.0)
    return None


def build_table(rows: list[tuple[str, str, str, str]]) -> str:
    """Builds the Markdown table body from (filename, meaning, title, url) rows."""
    lines = [TABLE_START, TABLE_SEP]
    for filename, meaning, title, url in rows:
        lines.append(f"| {filename} | {meaning} | [{title}]({url}) |")
    return "\n".join(lines)


def replace_table_in_sources(new_table: str, unresolved_note: str) -> None:
    """Replaces the existing Sign images table (and any trailing unresolved note) in SOURCES.md."""
    text = SOURCES_PATH.read_text(encoding="utf-8")
    pattern = re.compile(
        r"(\| Local file \| Meaning \(NL\) \| Wikimedia Commons source page \|\n\|---\|---\|---\|\n(?:\|.*\|\n?)*)"
        r"(\n> \*\*Unresolved:\*\*.*\n)?",
    )
    match = pattern.search(text)
    if not match:
        raise RuntimeError("Could not find the existing Sign images table in SOURCES.md")
    replacement = new_table + "\n" + (unresolved_note if unresolved_note else "")
    text = text[: match.start()] + replacement + text[match.end() :]
    SOURCES_PATH.write_text(text, encoding="utf-8", newline="\n")


def generate(logger: TeeLogger) -> int:
    """Regenerates the Sign images table by matching every local SVG to Commons by content hash."""
    meanings = load_sign_meanings()
    svg_files = sorted(SIGNS_DIR.glob("*.svg"), key=lambda p: natural_sort_key(p.name))
    logger.log(f"Matching {len(svg_files)} local sign SVGs against Wikimedia Commons by SHA-1...", level="INFO")

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    rows: list[tuple[str, str, str, str]] = []
    unresolved: list[str] = []
    for svg_path in svg_files:
        rel_key = f"assets/signs/{svg_path.name}"
        meaning = meanings.get(rel_key)
        if not meaning:
            logger.log(f"No question references {rel_key}; skipping.", level="ERROR")
            unresolved.append(svg_path.name)
            continue

        sha1_hex = hashlib.sha1(svg_path.read_bytes()).hexdigest()
        match = find_commons_source(sha1_hex, session, logger)
        if not match:
            logger.log(f"No exact Commons hash match for {svg_path.name} (sha1 {sha1_hex}).", level="WARN")
            unresolved.append(svg_path.name)
            continue

        rows.append((svg_path.name, meaning, match["title"], match["url"]))
        logger.log(f"{svg_path.name} -> {match['title']}", level="DEBUG")

    table = build_table(rows)
    unresolved_note = ""
    if unresolved:
        unresolved_note = (
            "\n> **Unresolved:** no exact Commons content match found for: "
            + ", ".join(unresolved)
            + ". Kept out of the table above rather than guessed; needs manual research.\n"
        )
    replace_table_in_sources(table, unresolved_note)

    logger.log(
        f"Regenerated Sign images table: {len(rows)} matched, {len(unresolved)} unresolved.",
        level="INFO",
    )
    return 0 if not unresolved else 1


def execute_action(args: Any, logger: TeeLogger) -> int:
    """Executes the requested subcommand."""
    if args.action == "generate":
        return generate(logger)
    return 0


def main(argv: list[str] | None = None) -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    args = parser.parse_args(argv)

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
        exit_code = execute_action(args, logger)
        logger.log_completion(PROG, args.action, exit_code, start_time)
        return exit_code
    finally:
        logger.close()


if __name__ == "__main__":
    sys.exit(main())

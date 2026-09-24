#!/usr/bin/env python3
"""Flags local sign SVGs whose matched Wikimedia Commons file is mislabeled.

generate-sign-sources.py proves a local SVG's *bytes* match a named Commons
file, which only catches local corruption/substitution. It cannot catch a
Commons file that is itself uploaded under the wrong sign code (as happened
with E9i: our local copy is byte-identical to the Commons file named
"Belgian road sign E9i.svg", but that Commons file is actually the disabled
parking wheelchair pictogram, filed under the wrong name upstream).

This script closes that gap: for every local sign, it finds the Commons file
by exact SHA-1 hash (same as generate-sign-sources.py), reads that file's
Commons categories, and cross-checks them against a small table of mutually
exclusive vehicle/pictogram keywords. A sign whose meaning text (Dutch
signTitle + explanation from questions.json) does not mention the Dutch
counterpart of a category keyword that IS present is flagged for manual
review, e.g. Commons categories mention "disab"/"wheelchair" but the meaning
text never mentions "handicap"/"gehandicapt"/"rolstoel".

This is a heuristic, not a proof: it only catches disagreements between the
Commons category taxonomy and the local meaning text, for the keyword pairs
below. A clean report is not a guarantee of correctness, only the absence of
this specific class of mismatch.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/check-sign-semantics.py check
  python scripts/check-sign-semantics.py --version
  python scripts/check-sign-semantics.py --help
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

PROG = "check-sign-semantics"
DESCRIPTION = "Cross-checks local sign SVGs against their matched Commons file's categories to catch mislabeled upstream sources."
ACTIONS = ["check", "version", "help"]
DEFAULT_ACTION = "check"
EXIT_CODES = [
    (0, "Success (no semantic keyword conflicts found)"),
    (1, "One or more signs flagged for a category/meaning keyword conflict"),
    (2, "Invalid arguments or runtime error"),
]

SIGNS_DIR = REPO_ROOT / "assets" / "signs"
QUESTIONS_PATH = REPO_ROOT / "data" / "questions.json"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "VerkeersregelsQuizBot/3.0 (https://github.com/gpellicciotta/verkeersregels-quiz; contact@verkeersregels-quiz.local)"

# (category keyword on Commons, regex of Dutch words that must appear in the local
# meaning text to justify that category keyword; if the keyword is present on Commons
# but none of the Dutch words appear locally, the sign is flagged as a likely mismatch)
KEYWORD_CONFLICTS: list[tuple[str, str]] = [
    ("motorcycle", r"\bmotorfiets\w*|\bmoto\b"),
    ("disab", r"handicap|gehandicapt|invalide"),
    ("wheelchair", r"handicap|gehandicapt|rolstoel"),
    ("moped", r"bromfiets\w*"),
    ("bicycle", r"\bfiets\w*"),
    ("lorry", r"vrachtwagen|vrachtauto|goederenvervoer|vervoer van goederen"),
    ("truck", r"vrachtwagen|vrachtauto|goederenvervoer|vervoer van goederen"),
    ("coach", r"autocar|\bbus\b"),
    ("motorhome", r"kampeerauto"),
    ("caravan", r"caravan"),
    ("tram", r"\btram\b|spoor\w*|sporen\b"),
    ("pedestrian", r"voetganger"),
]


def load_meanings() -> dict[str, str]:
    """Maps 'assets/signs/<file>.svg' to lowercased Dutch signTitle + explanation text."""
    data = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    meanings: dict[str, str] = {}
    for q in data.get("questions", []):
        sign = q.get("sign")
        if not sign:
            continue
        parts = [q.get("signTitle", ""), q.get("signExplanation", ""), q.get("explanation", "")]
        text = " ".join(p for p in parts if p).lower()
        if text:
            meanings[sign] = (meanings.get(sign, "") + " " + text).strip()
    return meanings


def find_commons_match(sha1_hex: str, session: requests.Session, logger: TeeLogger) -> dict[str, Any] | None:
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
                logger.log("Hit rate limit on hash lookup, backing off...", level="WARN")
                time.sleep(4.0 * (attempt + 1))
                continue
            resp.raise_for_status()
            images = resp.json().get("query", {}).get("allimages", [])
            if not images:
                return None
            return {"title": images[0]["title"]}
        except Exception as exc:
            logger.log(f"Error on hash lookup for {sha1_hex} (attempt {attempt}): {exc}", level="DEBUG")
            time.sleep(2.0)
    return None


def get_commons_categories(title: str, session: requests.Session, logger: TeeLogger) -> list[str]:
    """Fetches the Commons category names for a given File: title."""
    params = {
        "action": "query",
        "titles": title,
        "prop": "categories",
        "cllimit": "50",
        "format": "json",
    }
    for attempt in range(3):
        try:
            time.sleep(1.0)
            resp = session.get(COMMONS_API, params=params, timeout=15)
            if resp.status_code == 429:
                logger.log(f"Hit rate limit on category lookup for {title}, backing off...", level="WARN")
                time.sleep(4.0 * (attempt + 1))
                continue
            resp.raise_for_status()
            pages = resp.json().get("query", {}).get("pages", {})
            cats: list[str] = []
            for _, pdata in pages.items():
                for c in pdata.get("categories", []):
                    cats.append(c.get("title", ""))
            return cats
        except Exception as exc:
            logger.log(f"Error on category lookup for {title} (attempt {attempt}): {exc}", level="DEBUG")
            time.sleep(2.0)
    return []


def check(logger: TeeLogger) -> int:
    """Checks every local sign SVG for a category/meaning keyword conflict against its Commons match."""
    meanings = load_meanings()
    svg_files = sorted(SIGNS_DIR.glob("*.svg"))
    logger.log(f"Checking {len(svg_files)} local sign SVGs against Commons categories...", level="INFO")

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    flagged: list[str] = []
    unresolved: list[str] = []
    clean = 0

    for svg_path in svg_files:
        rel_key = f"assets/signs/{svg_path.name}"
        meaning_text = meanings.get(rel_key, "")
        sha1_hex = hashlib.sha1(svg_path.read_bytes()).hexdigest()
        match = find_commons_match(sha1_hex, session, logger)
        if not match:
            unresolved.append(svg_path.name)
            continue

        categories = " | ".join(get_commons_categories(match["title"], session, logger)).lower()
        conflicts = [
            kw for kw, nl_pattern in KEYWORD_CONFLICTS
            if kw in categories and not re.search(nl_pattern, meaning_text)
        ]
        if conflicts:
            flagged.append(svg_path.name)
            logger.log(
                f"{svg_path.name}: Commons match '{match['title']}' has category keyword(s) "
                f"{conflicts} not reflected in local meaning text.",
                level="ERROR",
            )
        else:
            clean += 1
            logger.log(f"{svg_path.name}: OK ({match['title']})", level="DEBUG")

    logger.log(
        f"Checked {len(svg_files)}: {clean} clean, {len(flagged)} flagged, {len(unresolved)} unresolved (no Commons hash match).",
        level="INFO",
    )
    if unresolved:
        logger.log("Unresolved (skipped, no exact Commons hash match): " + ", ".join(unresolved), level="WARN")
    return 0 if not flagged else 1


def execute_action(args: Any, logger: TeeLogger) -> int:
    """Executes the requested subcommand."""
    if args.action == "check":
        return check(logger)
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

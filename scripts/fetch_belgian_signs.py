"""Utility script to fetch, download, and validate Belgian traffic sign SVGs from Wikimedia Commons."""

from __future__ import annotations

import argparse
import logging
import re
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests

from _cli_common import APP_AUTHOR, build_action_parser, get_project_version, print_help, print_version

PROG = "fetch_belgian_signs"
DESCRIPTION = "Fetch, download, and validate Belgian traffic sign SVGs from Wikimedia Commons."
ACTIONS = ["fetch", "verify", "list", "version", "help"]
DEFAULT_ACTION = "fetch"
EXIT_CODES = [
    (0, "Success (all requested signs fetched and validated)"),
    (1, "One or more signs failed to download or validate"),
    (2, "Invalid arguments or runtime error"),
]

REPO_ROOT = Path(__file__).resolve().parent.parent
SIGNS_DIR = REPO_ROOT / "assets" / "signs"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "VerkeersregelsQuizBot/1.1 (https://github.com/gpellicciotta/verkeersregels-quiz; contact@verkeersregels-quiz.local)"

SERIES_SIGNS: dict[str, list[str]] = {
    "A": [
        "A1a", "A1b", "A1c", "A1d", "A3", "A5", "A7a", "A7b", "A7c", "A9",
        "A11", "A13", "A14", "A15", "A17", "A19", "A21", "A23", "A25", "A27",
        "A29", "A31", "A33", "A35", "A37", "A39", "A41", "A43", "A45", "A47",
        "A49", "A50", "A51"
    ],
    "B": [
        "B1", "B3", "B5", "B7", "B9", "B11", "B13", "B15", "B17", "B19",
        "B21", "B22", "B23"
    ],
    "C": [
        "C1", "C3", "C5", "C6", "C7", "C9", "C11", "C13", "C15", "C17",
        "C19", "C21", "C22", "C23", "C24a", "C24b", "C24c", "C25", "C27", "C29",
        "C31a", "C31b", "C33", "C35", "C37", "C39", "C41", "C43", "C45", "C46", "C47"
    ],
    "D": [
        "D1a", "D1b", "D1c", "D1d", "D1e", "D3", "D4", "D5", "D7", "D9",
        "D10", "D11", "D13"
    ],
    "E": [
        "E1", "E3", "E5", "E7", "E9a", "E9b", "E9c", "E9d", "E9e", "E9f",
        "E9g", "E9h", "E9i", "E9j", "E11"
    ],
    "F1": [
        "F1a", "F1b", "F3a", "F3b", "F4a", "F4b", "F5", "F7", "F8", "F9",
        "F11", "F12a", "F12b", "F13", "F14", "F15", "F17", "F18", "F19", "F21",
        "F23a", "F23b", "F23c", "F23d", "F25", "F27", "F29", "F31", "F33a", "F33b",
        "F33c", "F34a", "F35", "F37", "F39", "F41", "F43", "F45", "F45b", "F47",
        "F49", "F50", "F50bis"
    ],
    "F2": [
        "F51", "F52", "F52bis", "F53", "F55", "F56", "F57", "F59", "F60", "F61",
        "F62", "F63", "F65", "F67", "F69", "F71", "F73", "F75", "F77", "F79",
        "F81", "F83", "F85", "F87", "F89", "F91", "F93", "F95", "F97", "F98",
        "F99a", "F99b", "F99c", "F101a", "F101b", "F101c", "F103", "F105", "F111", "F113",
        "F117", "F118", "F119", "F120"
    ],
}


def query_commons_image_url(filename: str, session: requests.Session) -> str | None:
    """Queries Wikimedia Commons API for the direct download URL of a given file."""
    params = {
        "action": "query",
        "titles": f"File:{filename}" if not filename.startswith("File:") else filename,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "format": "json",
    }
    for attempt in range(3):
        try:
            time.sleep(1.0)
            resp = session.get(COMMONS_API, params=params, timeout=15)
            if resp.status_code == 429:
                logging.warning("Hit rate limit on API query for %s, backing off...", filename)
                time.sleep(4.0 * (attempt + 1))
                continue
            resp.raise_for_status()
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            for _, pdata in pages.items():
                imageinfo = pdata.get("imageinfo", [])
                if imageinfo and "url" in imageinfo[0]:
                    return imageinfo[0]["url"]
            return None
        except Exception as exc:
            logging.debug("Error querying Commons for %s (attempt %d): %s", filename, attempt, exc)
            time.sleep(2.0)
    return None


def get_candidate_filenames(code: str) -> list[str]:
    """Generates ordered candidate Wikimedia Commons filenames for a given sign code."""
    candidates = [
        f"Belgian road sign {code}.svg",
        f"Belgian traffic sign {code}.svg",
    ]
    # D-series often uses D01a instead of D1a on Commons
    m_d = re.match(r"^D([0-9])([a-z]?)$", code, re.IGNORECASE)
    if m_d:
        candidates.append(f"Belgian road sign D0{m_d.group(1)}{m_d.group(2)}.svg")
        candidates.append(f"Belgian traffic sign D0{m_d.group(1)}{m_d.group(2)}.svg")
    # Uppercase/lowercase variations
    candidates.append(f"Belgian road sign {code.upper()}.svg")
    candidates.append(f"Belgian traffic sign {code.upper()}.svg")
    return candidates


def download_and_validate_svg(url: str, dest_path: Path, session: requests.Session) -> bool:
    """Downloads an SVG from url, parses it as valid XML, and writes to dest_path."""
    for attempt in range(3):
        try:
            time.sleep(1.2)
            resp = session.get(url, timeout=20)
            if resp.status_code == 429:
                logging.warning("Rate limit hit downloading %s, backing off...", dest_path.name)
                time.sleep(4.0 * (attempt + 1))
                continue
            resp.raise_for_status()
            content = resp.content
            root = ET.fromstring(content)
            if "svg" not in root.tag.lower():
                logging.error("Root element of %s is not svg: %s", dest_path.name, root.tag)
                return False
            dest_path.write_bytes(content)
            return True
        except Exception as exc:
            logging.warning("Download failed for %s (attempt %d): %s", dest_path.name, attempt, exc)
            time.sleep(2.0)
    return False


def fetch_sign(code: str, session: requests.Session, force: bool = False) -> bool:
    """Fetches a single sign SVG by code if not already existing, validating XML."""
    dest_path = SIGNS_DIR / f"{code}.svg"
    if dest_path.exists() and not force:
        try:
            tree = ET.parse(dest_path)
            if "svg" in tree.getroot().tag.lower():
                logging.info("Sign %s already exists and is valid SVG.", code)
                return True
        except Exception:
            logging.warning("Sign %s exists but is invalid XML, re-fetching...", code)

    for filename in get_candidate_filenames(code):
        url = query_commons_image_url(filename, session)
        if url:
            logging.info("Found %s on Commons: %s", filename, url)
            if download_and_validate_svg(url, dest_path, session):
                logging.info("Saved and validated %s", dest_path.name)
                return True
    logging.error("Could not find or download sign %s on Wikimedia Commons", code)
    return False


def expand_sign_codes(args_codes: list[str]) -> list[str]:
    """Expands series aliases (like 'A', 'B', 'all') to concrete sign codes."""
    expanded: list[str] = []
    for item in args_codes:
        upper = item.upper()
        if upper == "ALL":
            for series_list in SERIES_SIGNS.values():
                expanded.extend(series_list)
        elif upper == "F":
            expanded.extend(SERIES_SIGNS["F1"])
            expanded.extend(SERIES_SIGNS["F2"])
        elif upper in SERIES_SIGNS:
            expanded.extend(SERIES_SIGNS[upper])
        else:
            expanded.append(item)
    # Deduplicate while preserving order
    seen = set()
    dedup = []
    for c in expanded:
        if c not in seen:
            seen.add(c)
            dedup.append(c)
    return dedup


def main() -> int:
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    parser.add_argument("codes", nargs="*", help="Sign codes or series to fetch (e.g. A, B, A3, all)")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files in assets/signs/")
    parser.add_argument("--log-file", type=Path, help="Append operational logs to file")

    args = parser.parse_args()
    version = get_project_version()

    if args.version:
        print_version(PROG, version)
        return 0

    if args.help or args.action == "help":
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    if args.action == "version":
        print_version(PROG, version)
        return 0

    log_level = logging.DEBUG if args.verbose else logging.INFO
    handlers: list[logging.Handler] = [logging.StreamHandler(sys.stdout)]
    if args.log_file:
        handlers.append(logging.FileHandler(args.log_file, encoding="utf-8"))
    logging.basicConfig(level=log_level, format="%(message)s", handlers=handlers)

    SIGNS_DIR.mkdir(parents=True, exist_ok=True)

    if args.action == "verify":
        svg_files = sorted(SIGNS_DIR.glob("*.svg"))
        logging.info("Verifying %d SVG files in %s...", len(svg_files), SIGNS_DIR)
        errors = 0
        for f in svg_files:
            try:
                tree = ET.parse(f)
                if "svg" not in tree.getroot().tag.lower():
                    logging.error("Invalid root tag in %s: %s", f.name, tree.getroot().tag)
                    errors += 1
            except Exception as exc:
                logging.error("XML parse error in %s: %s", f.name, exc)
                errors += 1
        if errors == 0:
            logging.info("All %d signs verified successfully as valid SVG XML.", len(svg_files))
            return 0
        logging.error("%d signs failed XML verification.", errors)
        return 1

    if args.action == "list":
        svg_files = sorted(SIGNS_DIR.glob("*.svg"))
        print(f"Total sign assets in {SIGNS_DIR}: {len(svg_files)}")
        for f in svg_files:
            print(f.stem)
        return 0

    if args.action == "fetch":
        if not args.codes:
            logging.error("No sign codes specified to fetch. Provide sign codes or series (e.g. A, B, all).")
            return 2

        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT})

        codes_to_fetch = expand_sign_codes(args.codes)
        success_count = 0
        failure_count = 0
        for code in codes_to_fetch:
            if fetch_sign(code, session, force=args.force):
                success_count += 1
            else:
                failure_count += 1

        logging.info("Fetch summary: %d successful, %d failed.", success_count, failure_count)
        return 0 if failure_count == 0 else 1

    return 0


if __name__ == "__main__":
    sys.exit(main())

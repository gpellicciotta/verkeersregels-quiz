#!/usr/bin/env python3
"""Translate quiz questions using Google Translate into target language overlays.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/translate-questions.py generate --lang en
  python scripts/translate-questions.py generate --lang fr
  python scripts/translate-questions.py generate --lang de
    python scripts/translate-questions.py generate --lang it
  python scripts/translate-questions.py --version
  python scripts/translate-questions.py --help
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
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

DATA_DIR = REPO_ROOT / "data"

PROG = "translate-questions"
DESCRIPTION = "Translates data/questions.json into data/translations.<lang>.json via Google Translate with terminology corrections."
ACTIONS = ["generate", "version", "help"]
DEFAULT_ACTION = "generate"
EXIT_CODES = [
    (0, "Success (translations generated successfully)"),
    (1, "Input file missing or network error"),
]

# Belgian traffic law and English road terminology corrections for post-processing
EN_GLOSSARY_REPLACEMENTS = [
    # Fixed official terms
    (r"\bWegcode\b", "Highway Code"),
    (r"\bkm/u\b", "km/h"),
    (r"\bkm / u\b", "km/h"),
    (r"\bkm / h\b", "km/h"),
    (r"\bDangerous left turn\b", "Dangerous bend to the left"),
    (r"\bDangerous right turn\b", "Dangerous bend to the right"),
    (r"\bdangerous left turn\b", "dangerous bend to the left"),
    (r"\bdangerous right turn\b", "dangerous bend to the right"),
    (r"\bTwo-way street\b", "Two-way traffic"),
    (r"\btwo-way street\b", "two-way traffic"),
    (r"\bKB 1 december 1975\b", "Royal Decree 1 December 1975"),
    (r"\bbebouwde kom\b", "built-up area"),
    (r"\bwoonerf\b", "residential area (woonerf)"),
    (r"\bvoorrang van rechts\b", "priority to the right"),
    (r"\bhaaientanden\b", "yield markings (shark's teeth)"),
    (r"\bMAM\b", "MAM (maximum authorised mass)"),
    (r"\bUAL\b", "BrAC (breath alcohol concentration)"),
]

# Belgian traffic law and French road terminology corrections for post-processing
FR_GLOSSARY_REPLACEMENTS = [
    (r"\bWegcode\b", "Code de la route"),
    (r"\bkm/u\b", "km/h"),
    (r"\bkm / u\b", "km/h"),
    (r"\bkm / h\b", "km/h"),
    (r"\bKB 1 december 1975\b", "AR du 1er décembre 1975"),
    (r"\bbebouwde kom\b", "agglomération"),
    (r"\bwoonerf\b", "zone résidentielle"),
    (r"\bvoorrang van rechts\b", "priorité de droite"),
    (r"\bhaaientanden\b", "dents de requin"),
    (r"\bMAM\b", "MMA"),
    (r"\bUAL\b", "AAE"),
]


# Belgian traffic law and German road terminology corrections for post-processing
DE_GLOSSARY_REPLACEMENTS = [
    (r"\bWegcode\b", "Straßenverkehrsordnung"),
    (r"\bkm/u\b", "km/h"),
    (r"\bkm / u\b", "km/h"),
    (r"\bkm / h\b", "km/h"),
    (r"\bKB 1 december 1975\b", "Kgl. Erlass vom 1. Dezember 1975"),
    (r"\bbebouwde kom\b", "geschlossene Ortschaft"),
    (r"\bwoonerf\b", "Wohnzone"),
    (r"\bvoorrang van rechts\b", "Rechtsvorfahrt"),
    (r"\bhaaientanden\b", "Haifischzähne"),
    (r"\bMAM\b", "zGG"),
    (r"\bUAL\b", "AAK"),
]

# Belgian traffic law and Italian road terminology corrections for post-processing
IT_GLOSSARY_REPLACEMENTS = [
    (r"\bWegcode\b", "Codice della strada"),
    (r"\bkm/u\b", "km/h"),
    (r"\bkm / u\b", "km/h"),
    (r"\bkm / h\b", "km/h"),
    (r"\bKB 1 december 1975\b", "Regio decreto del 1° dicembre 1975"),
    (r"\bbebouwde kom\b", "centro abitato"),
    (r"\bwoonerf\b", "zona residenziale"),
    (r"\bvoorrang van rechts\b", "precedenza a destra"),
    (r"\bhaaientanden\b", "triangoli di precedenza"),
    (r"\bMAM\b", "MMA"),
    (r"\bUAL\b", "tasso alcolemico"),
]


def format_sentence_case(text: str) -> str:
    """Ensures the first letter of the string is capitalized and trailing whitespace stripped."""
    if not text:
        return text
    t = text.strip()
    if len(t) > 0 and t[0].isalpha() and not t[0].isupper():
        t = t[0].upper() + t[1:]
    return t


def translate_batch(texts: list[str], sl: str = "nl", tl: str = "en") -> list[str]:
    """Translates a batch of sentences in a single Google Translate request using indexed delimiters."""
    if not texts:
        return []

    # Format batch with unique delimiters
    joined = "\n".join([f"@@@{i}@@@ {t}" for i, t in enumerate(texts)])
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl={tl}&dt=t&q={urllib.parse.quote(joined)}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
    )

    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        full_text = "".join([part[0] for part in data[0] if part and part[0]])

        # Parse delimited segments
        parts = re.split(r"@@@\s*(\d+)\s*@@@", full_text)
        res_map: dict[int, str] = {}
        for k in range(1, len(parts), 2):
            try:
                idx = int(parts[k])
                val = parts[k + 1].strip()
                res_map[idx] = val
            except (ValueError, IndexError):
                pass

        return [res_map.get(i, texts[i]) for i in range(len(texts))]


def post_process_en(text: str) -> str:
    """Applies English domain terminology fixes and proper sentence casing."""
    res = text
    for pat, rep in EN_GLOSSARY_REPLACEMENTS:
        res = re.sub(pat, rep, res)
    return format_sentence_case(res)


def post_process_fr(text: str) -> str:
    """Applies French domain terminology fixes and proper sentence casing."""
    res = text
    for pat, rep in FR_GLOSSARY_REPLACEMENTS:
        res = re.sub(pat, rep, res)
    return format_sentence_case(res)


def post_process_de(text: str) -> str:
    """Applies German domain terminology fixes and proper sentence casing."""
    res = text
    for pat, rep in DE_GLOSSARY_REPLACEMENTS:
        res = re.sub(pat, rep, res)
    return format_sentence_case(res)


def post_process_it(text: str) -> str:
    """Applies Italian domain terminology fixes and proper sentence casing."""
    res = text
    for pat, rep in IT_GLOSSARY_REPLACEMENTS:
        res = re.sub(pat, rep, res)
    return format_sentence_case(res)


def post_process(text: str, target_lang: str) -> str:
    """Applies language-specific post-processing rules."""
    if target_lang == "en":
        return post_process_en(text)
    if target_lang == "fr":
        return post_process_fr(text)
    if target_lang == "de":
        return post_process_de(text)
    if target_lang == "it":
        return post_process_it(text)
    return format_sentence_case(text)


def build_translations(target_lang: str = "en", source_lang: str = "nl") -> int:
    """Extracts, batch-translates, and formats translations.<lang>.json from questions.json."""
    questions_file = DATA_DIR / "questions.json"
    if not questions_file.exists():
        print(f"Error: {questions_file} does not exist.", file=sys.stderr)
        return 1

    output_file = DATA_DIR / f"translations.{target_lang}.json"
    cache_file = DATA_DIR / f".trans_cache_{target_lang}.json"

    with open(questions_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data["questions"]

    # Load existing cache
    cache = {}
    if cache_file.exists():
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    # Collect unique strings to translate
    unique_strings = set()
    for q in questions:
        unique_strings.add(q["question"])
        if q.get("explanation"):
            unique_strings.add(q["explanation"])
        if q.get("signTitle"):
            unique_strings.add(q["signTitle"])
        if q.get("signExplanation"):
            unique_strings.add(q["signExplanation"])
        for opt in q["options"]:
            if not opt.startswith("assets/"):
                unique_strings.add(opt)

    missing = [s for s in sorted(unique_strings) if s not in cache]
    print(f"Total unique strings: {len(unique_strings)} ({len(cache)} cached, {len(missing)} to translate)")

    # Batch translate missing strings (batches of 35 to stay safely under character limits)
    batch_size = 35
    for i in range(0, len(missing), batch_size):
        chunk = missing[i : i + batch_size]
        try:
            translated_chunk = translate_batch(chunk, sl=source_lang, tl=target_lang)
            for orig, trans in zip(chunk, translated_chunk):
                trans = post_process(trans, target_lang)
                cache[orig] = trans
        except Exception as e:
            print(f"\nBatch failed ({e}), falling back to single requests...", file=sys.stderr)
            for item in chunk:
                try:
                    single = translate_batch([item], sl=source_lang, tl=target_lang)[0]
                    single = post_process(single, target_lang)
                    cache[item] = single
                except Exception:
                    cache[item] = item
                time.sleep(0.1)

        # Save cache progressively
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)

        done = min(i + batch_size, len(missing))
        print(f"Progress: {done}/{len(missing)} translated ({(done/len(missing)*100):.1f}%)", end="\r")
        time.sleep(0.3)

    print("\nAll strings translated. Reassembling question overlay...")

    # Reassemble overlay
    overlay = {}
    for q in questions:
        qid = q["id"]
        q_trans = post_process(cache.get(q["question"], q["question"]), target_lang)

        options_trans = []
        for opt in q["options"]:
            if opt.startswith("assets/"):
                options_trans.append(opt)
            else:
                o_trans = post_process(cache.get(opt, opt), target_lang)
                options_trans.append(o_trans)

        exp_trans = ""
        if q.get("explanation"):
            exp_trans = post_process(cache.get(q["explanation"], q["explanation"]), target_lang)

        item_overlay = {
            "question": q_trans,
            "options": options_trans,
            "explanation": exp_trans,
        }

        if q.get("signTitle"):
            st_trans = post_process(cache.get(q["signTitle"], q["signTitle"]), target_lang)
            item_overlay["signTitle"] = st_trans

        if q.get("signExplanation"):
            se_trans = post_process(cache.get(q["signExplanation"], q["signExplanation"]), target_lang)
            item_overlay["signExplanation"] = se_trans

        overlay[qid] = item_overlay

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(overlay, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {output_file} with {len(overlay)} translated questions.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_action_parser(
        prog=PROG,
        description=DESCRIPTION,
        actions=ACTIONS,
        default_action=DEFAULT_ACTION,
    )
    parser.add_argument(
        "--lang",
        "-l",
        default="en",
        help="Target language code (default: en). Supported: en, fr, de, it",
    )
    args = parser.parse_args(argv)

    version = get_project_version()
    if args.version:
        print_version(PROG, version)
        return 0
    if args.help:
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    return build_translations(target_lang=args.lang)


if __name__ == "__main__":
    sys.exit(main())

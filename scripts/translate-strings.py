#!/usr/bin/env python3
"""Generate a localized UI string dictionary from the Dutch source dictionary."""

from __future__ import annotations

import json
import importlib.util
import re
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPTS_DIR.parent
DATA_DIR = REPO_ROOT / "data"

sys.path.insert(0, str(SCRIPTS_DIR))
translator_spec = importlib.util.spec_from_file_location(
    "translate_questions", SCRIPTS_DIR / "translate-questions.py"
)
if translator_spec is None or translator_spec.loader is None:
    raise ImportError("Could not load translate-questions.py")
translator = importlib.util.module_from_spec(translator_spec)
translator_spec.loader.exec_module(translator)
post_process_it = translator.post_process_it
translate_batch = translator.translate_batch


def protect_markup(text: str) -> tuple[str, dict[str, str]]:
    """Replace placeholders and HTML tags with stable tokens during translation."""
    protected: dict[str, str] = {}

    def replace(match: re.Match[str]) -> str:
        token = f"ZZTOKEN{len(protected)}ZZ"
        protected[token] = match.group(0)
        return token

    return re.sub(r"\{\w+\}|<[^>]+>", replace, text), protected


def restore_markup(text: str, protected: dict[str, str]) -> str:
    """Restore placeholders and HTML tags after translation."""
    for token, original in protected.items():
        text = text.replace(token, original).replace(token.lower(), original)
    return text


def main() -> int:
    source_path = DATA_DIR / "strings.nl.json"
    output_path = DATA_DIR / "strings.it.json"
    with source_path.open(encoding="utf-8") as source_file:
        source = json.load(source_file)

    keys = [key for key in source if not key.startswith("lang.")]
    prepared: list[str] = []
    protections: list[dict[str, str]] = []
    for key in keys:
        value, protected = protect_markup(source[key])
        prepared.append(value)
        protections.append(protected)

    translated: list[str] = []
    for start in range(0, len(prepared), 35):
        translated.extend(translate_batch(prepared[start : start + 35], sl="nl", tl="it"))

    result = {
        key: post_process_it(restore_markup(value, protections[index]))
        for index, (key, value) in enumerate(zip(keys, translated))
    }
    result.update(
        {
            "lang.nl": "Olandese",
            "lang.fr": "Francese",
            "lang.de": "Tedesco",
            "lang.it": "Italiano",
            "lang.en": "Inglese",
            "lang.btn_aria": "Cambia lingua",
            "lang.btn_tooltip": "Lingua",
        }
    )
    with output_path.open("w", encoding="utf-8") as output_file:
        json.dump(result, output_file, indent=2, ensure_ascii=False)
        output_file.write("\n")
    print(f"Successfully generated {output_path} with {len(result)} keys.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
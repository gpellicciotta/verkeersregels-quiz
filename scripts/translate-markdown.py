#!/usr/bin/env python3
"""Translate a Markdown document (e.g. CHANGELOG.md) into per-language overlays.

Splits the source document into translation-request-sized chunks: the whole
document if it is already short enough, otherwise by top-level '##' heading,
and any still-oversized heading section further by blank-line paragraph
boundaries. Markdown structure (headings, bullet markers, inline code, bold
spans, links, and area/category badge labels such as 'FrontEnd:') is
protected from translation and restored verbatim afterwards.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/translate-markdown.py generate --lang en
  python scripts/translate-markdown.py generate --all
  python scripts/translate-markdown.py --version
  python scripts/translate-markdown.py --help
"""

from __future__ import annotations

import importlib.util
import re
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

_translator_spec = importlib.util.spec_from_file_location(
    "translate_questions", SCRIPTS_DIR / "translate-questions.py"
)
if _translator_spec is None or _translator_spec.loader is None:
    raise ImportError("Could not load translate-questions.py")
_translator = importlib.util.module_from_spec(_translator_spec)
_translator_spec.loader.exec_module(_translator)
translate_batch = _translator.translate_batch
post_process = _translator.post_process

PROG = "translate-markdown"
DESCRIPTION = (
    "Translates a Markdown document (default CHANGELOG.md) into per-language overlays "
    "(e.g. CHANGELOG.en.md), chunking the document to stay within translation request limits."
)
ACTIONS = ["generate", "version", "help"]
DEFAULT_ACTION = "generate"
EXIT_CODES = [
    (0, "Success (translated document(s) generated)"),
    (1, "Source file missing or a translation request failed)"),
]

SOURCE_LANG = "nl"
SUPPORTED_LANGS = ["en", "fr", "de", "it"]
MAX_CHUNK_CHARS = 4000

# Markdown markup that must survive translation unchanged: placeholders, HTML
# tags, inline code spans, bold spans, and links.
_TOKEN_RE = re.compile(r"\{\w+\}|<[^>]+>|`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)")
# The category badge label that starts a changelog bullet, e.g. '- FrontEnd: '.
_AREA_LABEL_RE = re.compile(r"^(\s*[-*]\s+)([A-Za-z]+)(:\s*)")
# Leading marker of a line: bullet, blockquote, or ATX heading (any depth).
_PREFIX_RE = re.compile(r"^(\s*(?:[-*]\s+|>\s*|#{1,6}\s+)?)(.*)$")


def split_by_heading(text: str) -> list[str]:
    """Splits Markdown text into exact substrings, each starting at a top-level '##' heading.

    Uses a zero-width split so concatenating the result reproduces the input exactly.
    """
    return re.split(r"(?=^## )", text, flags=re.MULTILINE)


def split_by_paragraph(text: str, max_chars: int) -> list[str]:
    """Splits an oversized section into paragraph-bounded chunks, preserving blank lines exactly."""
    pieces = re.split(r"(\n\s*\n)", text)
    chunks: list[str] = []
    current = ""
    for piece in pieces:
        if current and len(current) + len(piece) > max_chars:
            chunks.append(current)
            current = piece
        else:
            current += piece
    if current:
        chunks.append(current)
    return chunks


def chunk_markdown_document(text: str, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    """Chunks a document for translation: whole doc if short, else by heading, else by paragraph.

    Concatenating the returned chunks always reproduces the input exactly.
    """
    if len(text) <= max_chars:
        return [text]
    chunks: list[str] = []
    for section in split_by_heading(text):
        if not section:
            continue
        if len(section) <= max_chars:
            chunks.append(section)
        else:
            chunks.extend(split_by_paragraph(section, max_chars))
    return chunks


def protect_tokens(text: str) -> tuple[str, dict[str, str]]:
    """Replaces protected markdown markup with stable tokens during translation."""
    protected: dict[str, str] = {}

    def replace(match: re.Match[str]) -> str:
        token = f"ZZTOKEN{len(protected)}ZZ"
        protected[token] = match.group(0)
        return token

    return _TOKEN_RE.sub(replace, text), protected


def restore_tokens(text: str, protected: dict[str, str]) -> str:
    """Restores protected markdown markup after translation."""
    for token, original in protected.items():
        text = text.replace(token, original).replace(token.lower(), original)
    return text


def is_translatable_line(line: str) -> bool:
    """Returns whether a line carries prose to translate (not blank, not a '##' version heading)."""
    stripped = line.strip()
    return bool(stripped) and not stripped.startswith("## ") and stripped != "##"


def translate_chunk(chunk: str, target_lang: str) -> str:
    """Translates the prose lines of one Markdown chunk, restoring structure and protected markup."""
    lines = chunk.split("\n")
    line_prefixes: list[str] = [""] * len(lines)
    line_protections: list[dict[str, str]] = [{} for _ in lines]
    segment_indices: list[int] = []
    segments: list[str] = []

    for index, line in enumerate(lines):
        if not is_translatable_line(line):
            continue
        area_match = _AREA_LABEL_RE.match(line)
        if area_match:
            # Exclude the whole '- Area: ' badge label from translation, verbatim in every language.
            prefix, rest = area_match.group(0), line[area_match.end():]
        else:
            prefix_match = _PREFIX_RE.match(line)
            prefix, rest = prefix_match.group(1), prefix_match.group(2)
        rest, protected = protect_tokens(rest)
        line_prefixes[index] = prefix
        line_protections[index] = protected
        segment_indices.append(index)
        segments.append(rest)

    translated = translate_batch(segments, sl=SOURCE_LANG, tl=target_lang) if segments else []

    for position, index in enumerate(segment_indices):
        rest = restore_tokens(translated[position], line_protections[index])
        rest = post_process(rest, target_lang)
        lines[index] = f"{line_prefixes[index]}{rest}"

    return "\n".join(lines)


def translate_document(text: str, target_lang: str) -> str:
    """Chunks and translates a full Markdown document, preserving exact structure and spacing."""
    chunks = chunk_markdown_document(text)
    return "".join(translate_chunk(chunk, target_lang) for chunk in chunks)


def generate(source_path: Path, target_lang: str, logger: TeeLogger) -> bool:
    """Translates `source_path` into a sibling '<stem>.<lang><suffix>' file."""
    if target_lang not in SUPPORTED_LANGS:
        logger.log(f"Unsupported target language: {target_lang}", level="ERROR")
        return False
    if not source_path.exists():
        logger.log(f"Source file not found: {source_path}", level="ERROR")
        return False

    output_path = source_path.with_name(f"{source_path.stem}.{target_lang}{source_path.suffix}")
    text = source_path.read_text(encoding="utf-8")

    try:
        translated = translate_document(text, target_lang)
    except Exception as exc:
        logger.log(f"Translation to '{target_lang}' failed: {exc}", level="ERROR")
        return False

    output_path.write_text(translated, encoding="utf-8")
    logger.log(f"Generated {output_path.relative_to(REPO_ROOT)} ({len(translated)} characters).", level="INFO")
    return True


def main(argv: list[str] | None = None) -> int:
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    parser.add_argument(
        "--lang",
        "-l",
        default="en",
        choices=SUPPORTED_LANGS,
        help="Target language code (default: en)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Generate translated overlays for all supported languages: " + ", ".join(SUPPORTED_LANGS),
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=REPO_ROOT / "CHANGELOG.md",
        help="Source Markdown file to translate (default: CHANGELOG.md)",
    )
    args = parser.parse_args(argv)

    version = get_project_version()
    if args.version:
        print_version(PROG, version)
        return 0
    if args.help:
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    logger = TeeLogger(args.log_file, debug=args.debug, verbose=args.verbose)
    start_time = time.time()
    targets = SUPPORTED_LANGS if args.all else [args.lang]
    try:
        logger.log_startup(PROG, version, args.action, {"source": args.source, "targets": targets})
        ok = all(generate(args.source, lang, logger) for lang in targets)
        exit_code = 0 if ok else 1
        logger.log_completion(PROG, args.action, exit_code, start_time)
        return exit_code
    finally:
        logger.close()


if __name__ == "__main__":
    sys.exit(main())

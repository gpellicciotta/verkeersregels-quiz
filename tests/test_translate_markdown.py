"""Automated tests for the Markdown chunking and markup-protection logic in translate-markdown.py.

These tests exercise only the pure, network-free parts of the script (chunking, token
protection, and line reassembly with a stubbed translator) per the project rule to keep
unit tests independent of external networks and services.
"""

from __future__ import annotations

import importlib.util
import io
import unittest
from contextlib import redirect_stdout
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
SCRIPT_PATH = WORKTREE_ROOT / "scripts" / "translate-markdown.py"

_spec = importlib.util.spec_from_file_location("translate_markdown", SCRIPT_PATH)
assert _spec is not None and _spec.loader is not None
tm = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tm)


class TestChunking(unittest.TestCase):
    """Validates the three-tier chunking strategy: whole doc, by heading, by paragraph."""

    def test_short_document_is_a_single_chunk(self) -> None:
        text = "# Title\n\n## v1.0.0\n- FrontEnd: Small change.\n"
        chunks = tm.chunk_markdown_document(text, max_chars=1000)
        self.assertEqual(chunks, [text])

    def test_oversized_document_splits_by_heading(self) -> None:
        section_a = "## v2.0.0\n" + ("- FrontEnd: Change A.\n" * 5)
        section_b = "## v1.0.0\n" + ("- FrontEnd: Change B.\n" * 5)
        text = "# Title\n\n" + section_a + section_b
        max_chars = len(section_a) + 5  # forces a split, but each section still fits alone
        chunks = tm.chunk_markdown_document(text, max_chars=max_chars)
        self.assertEqual("".join(chunks), text, "chunks must reconstruct the source exactly")
        self.assertTrue(any(c.startswith("## v2.0.0") for c in chunks))
        self.assertTrue(any(c.startswith("## v1.0.0") for c in chunks))

    def test_oversized_heading_section_splits_further_by_paragraph(self) -> None:
        paragraph = "- FrontEnd: " + ("word " * 40) + "\n"
        text = "## v1.0.0\n\n" + paragraph + "\n" + paragraph + "\n" + paragraph
        max_chars = len(paragraph) + 10  # smaller than the whole section
        chunks = tm.chunk_markdown_document(text, max_chars=max_chars)
        self.assertGreater(len(chunks), 1, "an oversized section must be split into multiple chunks")
        self.assertEqual("".join(chunks), text, "chunks must reconstruct the source exactly")

    def test_chunking_never_loses_or_duplicates_content(self) -> None:
        text = (
            "# Versioned Changes\n\n"
            "> Some intro note.\n\n---\n\n"
            "## v3.0.0\n- FrontEnd: One.\n- BackEnd: Two.\n\n"
            "## v2.0.0\n- Test: Three.\n"
        )
        for max_chars in (10, 30, 80, 5000):
            with self.subTest(max_chars=max_chars):
                chunks = tm.chunk_markdown_document(text, max_chars=max_chars)
                self.assertEqual("".join(chunks), text)


class TestTokenProtection(unittest.TestCase):
    """Validates that markdown markup round-trips unchanged through protect/restore."""

    def test_protects_and_restores_code_bold_links_and_placeholders(self) -> None:
        line = "See `code`, **bold text**, [a link](https://example.com/x), and {count} items."
        protected, tokens = tm.protect_tokens(line)
        self.assertNotIn("`code`", protected)
        self.assertNotIn("**bold text**", protected)
        self.assertNotIn("[a link](https://example.com/x)", protected)
        self.assertNotIn("{count}", protected)
        restored = tm.restore_tokens(protected, tokens)
        self.assertEqual(restored, line)

    def test_area_label_regex_matches_only_the_badge_prefix(self) -> None:
        line = "- FrontEnd: Some description text."
        match = tm._AREA_LABEL_RE.match(line)
        self.assertIsNotNone(match)
        self.assertEqual(match.group(0), "- FrontEnd: ")
        self.assertEqual(line[match.end():], "Some description text.")


class TestTranslateChunkReassembly(unittest.TestCase):
    """Validates line reassembly using a stubbed translator (no network)."""

    def setUp(self) -> None:
        self._original_translate_batch = tm.translate_batch
        tm.translate_batch = lambda texts, sl, tl: [f"[{tl}]{t}" for t in texts]

    def tearDown(self) -> None:
        tm.translate_batch = self._original_translate_batch

    def test_heading_and_blank_lines_are_left_untouched(self) -> None:
        chunk = "## v3.4.0 [released: 2026-09-22]\n\n- FrontEnd: Iets veranderd.\n"
        result = tm.translate_chunk(chunk, "en")
        lines = result.split("\n")
        self.assertEqual(lines[0], "## v3.4.0 [released: 2026-09-22]")
        self.assertEqual(lines[1], "")

    def test_area_label_survives_translation_untranslated_and_is_not_duplicated(self) -> None:
        chunk = "- FrontEnd: Iets veranderd."
        result = tm.translate_chunk(chunk, "en")
        self.assertEqual(result, "- FrontEnd: [en]Iets veranderd.")
        self.assertEqual(result.count("FrontEnd"), 1)

    def test_protected_markup_is_restored_after_translation(self) -> None:
        chunk = "- BackEnd: Zie `code` en **belangrijk**."
        result = tm.translate_chunk(chunk, "fr")
        self.assertIn("`code`", result)
        self.assertIn("**belangrijk**", result)

    def test_blockquote_and_plain_paragraph_prefixes_are_preserved(self) -> None:
        chunk = "> Een citaat.\nEen gewone paragraaf."
        result = tm.translate_chunk(chunk, "de")
        lines = result.split("\n")
        self.assertTrue(lines[0].startswith("> "))
        self.assertTrue(lines[1].startswith("[de]"))


class TestChangelogOverlaysExist(unittest.TestCase):
    """Validates the committed CHANGELOG.<lang>.md overlays are present and structurally sane.

    Regenerating them requires network access to Google Translate, so this only inspects the
    already-generated files committed to the repository, per the no-network unit test rule.
    """

    def test_translated_changelogs_exist_for_all_supported_languages(self) -> None:
        source = (WORKTREE_ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
        source_version_match = tm.re.search(r"^## (\S+)", source, tm.re.MULTILINE)
        self.assertIsNotNone(source_version_match, "CHANGELOG.md must have a version heading")

        for lang in tm.SUPPORTED_LANGS:
            with self.subTest(lang=lang):
                path = WORKTREE_ROOT / f"CHANGELOG.{lang}.md"
                self.assertTrue(path.exists(), f"CHANGELOG.{lang}.md must exist")
                text = path.read_text(encoding="utf-8")
                self.assertNotIn("ZZTOKEN", text, f"CHANGELOG.{lang}.md leaked an internal translation token")
                self.assertNotIn("ZZAREAZZ", text, f"CHANGELOG.{lang}.md leaked an internal area-label token")
                version_match = tm.re.search(r"^## (\S+)", text, tm.re.MULTILINE)
                self.assertIsNotNone(version_match, f"CHANGELOG.{lang}.md must have a version heading")
                self.assertEqual(
                    version_match.group(1),
                    source_version_match.group(1),
                    f"CHANGELOG.{lang}.md top version must match CHANGELOG.md",
                )


class TestCliSmoke(unittest.TestCase):
    """Validates --version and --help exit cleanly without any network access."""

    def test_version_flag_exits_zero(self) -> None:
        buf = io.StringIO()
        with redirect_stdout(buf):
            exit_code = tm.main(["--version"])
        self.assertEqual(exit_code, 0)
        self.assertIn("translate-markdown", buf.getvalue())

    def test_help_flag_exits_zero(self) -> None:
        buf = io.StringIO()
        with redirect_stdout(buf):
            exit_code = tm.main(["--help"])
        self.assertEqual(exit_code, 0)


if __name__ == "__main__":
    unittest.main()

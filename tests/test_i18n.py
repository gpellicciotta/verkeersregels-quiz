"""Automated tests for internationalisation (i18n) and English localization."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = WORKTREE_ROOT / "data"
JS_DIR = WORKTREE_ROOT / "js"
INDEX_PATH = WORKTREE_ROOT / "index.html"


class TestI18n(unittest.TestCase):
    """Test suite validating UI localization files, dictionary key parity, and translation overlay."""

    def test_string_dictionaries_exist_and_have_matching_keys(self) -> None:
        """Validates that strings.nl.json, strings.fr.json, strings.de.json, and strings.en.json exist and share identical key sets."""
        nl_path = DATA_DIR / "strings.nl.json"
        fr_path = DATA_DIR / "strings.fr.json"
        de_path = DATA_DIR / "strings.de.json"
        en_path = DATA_DIR / "strings.en.json"

        self.assertTrue(nl_path.exists(), "strings.nl.json must exist")
        self.assertTrue(fr_path.exists(), "strings.fr.json must exist")
        self.assertTrue(de_path.exists(), "strings.de.json must exist")
        self.assertTrue(en_path.exists(), "strings.en.json must exist")

        with open(nl_path, "r", encoding="utf-8") as f:
            nl_dict = json.load(f)
        with open(fr_path, "r", encoding="utf-8") as f:
            fr_dict = json.load(f)
        with open(de_path, "r", encoding="utf-8") as f:
            de_dict = json.load(f)
        with open(en_path, "r", encoding="utf-8") as f:
            en_dict = json.load(f)

        self.assertIsInstance(nl_dict, dict)
        self.assertIsInstance(fr_dict, dict)
        self.assertIsInstance(de_dict, dict)
        self.assertIsInstance(en_dict, dict)

        nl_keys = set(nl_dict.keys())
        fr_keys = set(fr_dict.keys())
        de_keys = set(de_dict.keys())
        en_keys = set(en_dict.keys())

        self.assertEqual(nl_keys - en_keys, set(), f"Keys in NL but missing in EN: {nl_keys - en_keys}")
        self.assertEqual(en_keys - nl_keys, set(), f"Keys in EN but missing in NL: {en_keys - nl_keys}")
        self.assertEqual(nl_keys - fr_keys, set(), f"Keys in NL but missing in FR: {nl_keys - fr_keys}")
        self.assertEqual(fr_keys - nl_keys, set(), f"Keys in FR but missing in NL: {fr_keys - nl_keys}")
        self.assertEqual(nl_keys - de_keys, set(), f"Keys in NL but missing in DE: {nl_keys - de_keys}")
        self.assertEqual(de_keys - nl_keys, set(), f"Keys in DE but missing in NL: {de_keys - nl_keys}")
        self.assertGreater(len(nl_keys), 50, "String dictionaries should have over 50 keys")

    def test_all_t_call_keys_exist_in_string_dictionary(self) -> None:
        """Validates that every literal key passed to t(...) in js/*.js exists in strings.nl.json.

        A key referenced only in code but present in no dictionary (e.g. a typo, or a
        translation added for one code path but never added to the JSON files) silently
        falls back to rendering the raw key string to the user instead of translated text.
        """
        nl_path = DATA_DIR / "strings.nl.json"
        with open(nl_path, "r", encoding="utf-8") as f:
            nl_dict = json.load(f)
        nl_keys = set(nl_dict.keys())

        key_pattern = re.compile(r"\bt\(\s*[\"']([\w.]+)[\"']")
        referenced_keys: dict[str, str] = {}
        for js_path in sorted(JS_DIR.glob("*.js")):
            code = js_path.read_text(encoding="utf-8")
            for match in key_pattern.finditer(code):
                referenced_keys.setdefault(match.group(1), js_path.name)

        missing = {key: src for key, src in referenced_keys.items() if key not in nl_keys}
        self.assertEqual(missing, {}, f"t() keys referenced in JS but missing from strings.nl.json: {missing}")

    def test_translations_en_overlay_covers_all_questions(self) -> None:
        """Validates that translations.en.json contains translations for every question in questions.json."""
        self._validate_translation_overlay("en")

    def test_translations_fr_overlay_covers_all_questions(self) -> None:
        """Validates that translations.fr.json contains translations for every question in questions.json."""
        self._validate_translation_overlay("fr")

    def test_translations_de_overlay_covers_all_questions(self) -> None:
        """Validates that translations.de.json contains translations for every question in questions.json."""
        self._validate_translation_overlay("de")

    def _validate_translation_overlay(self, lang: str) -> None:
        questions_path = DATA_DIR / "questions.json"
        trans_path = DATA_DIR / f"translations.{lang}.json"

        self.assertTrue(questions_path.exists(), "questions.json must exist")
        self.assertTrue(trans_path.exists(), f"translations.{lang}.json must exist")

        with open(questions_path, "r", encoding="utf-8") as f:
            questions_data = json.load(f)
        with open(trans_path, "r", encoding="utf-8") as f:
            trans_data = json.load(f)

        questions = questions_data["questions"]
        self.assertEqual(len(trans_data), len(questions), f"Translation overlay {lang} must cover all questions")

        for q in questions:
            qid = q["id"]
            self.assertIn(qid, trans_data, f"Question ID {qid} missing in translations.{lang}.json")
            item = trans_data[qid]
            self.assertIn("question", item)
            self.assertIn("options", item)
            self.assertIn("explanation", item)
            if "sign" in q:
                self.assertIn("signTitle", item, f"signTitle missing in translations for {qid}")
                self.assertIn("signExplanation", item, f"signExplanation missing in translations for {qid}")
            self.assertEqual(
                len(item["options"]),
                len(q["options"]),
                f"Option length mismatch for question {qid}",
            )
            self.assertTrue(item["question"].strip(), f"Question text empty for {qid}")

    def test_i18n_module_exports_and_structure(self) -> None:
        """Validates that js/i18n.js defines t, getLang, setLang, detectLang, and applyAll."""
        i18n_path = JS_DIR / "i18n.js"
        self.assertTrue(i18n_path.exists(), "js/i18n.js must exist")
        code = i18n_path.read_text(encoding="utf-8")

        self.assertIn("export function t(", code)
        self.assertIn("export function getLang()", code)
        self.assertIn("export function detectLang()", code)
        self.assertIn("export async function setLang(", code)
        self.assertIn("export function applyAll()", code)

    def test_index_html_has_language_switcher_and_i18n_attributes(self) -> None:
        """Validates that index.html defines the language switcher button and data-i18n attributes."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('id="btn-lang"', html, "index.html must define btn-lang")
        self.assertIn('class="btn-lang-label"', html, "btn-lang must define label container")
        self.assertIn('data-i18n="title.quiz"', html)
        self.assertIn('data-i18n="start.description"', html)
        self.assertIn('data-i18n="start.offline"', html)
        self.assertIn('data-i18n="result.title"', html)
        self.assertIn('data-i18n="config.title_quiz"', html)
        self.assertIn('data-i18n="report.title"', html)
        self.assertIn('data-i18n="changelog.modal_title"', html)


if __name__ == "__main__":
    unittest.main()


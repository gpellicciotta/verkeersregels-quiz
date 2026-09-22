"""Automated tests for image alt text accessibility across quiz questions and carousel."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
JS_DIR = REPO_ROOT / "js"
QUESTIONS_PATH = DATA_DIR / "questions.json"


class TestImageAltAccessibility(unittest.TestCase):
    """Test suite validating descriptive image alt text for sign recognition and accessibility."""

    def test_string_dictionaries_contain_descriptive_alt_keys(self) -> None:
        """Validates that strings.nl.json and strings.en.json contain all required alt template keys."""
        required_keys = [
            "quiz.image_alt_situation",
            "quiz.image_alt_sign",
            "quiz.image_alt_sign_code",
            "quiz.option_img_alt",
            "quiz.option_img_alt_sign",
            "result.image_alt_sign",
            "result.image_alt_sign_code",
            "result.image_alt_situation",
            "carousel.sign_img_alt",
            "carousel.sign_img_alt_code",
        ]

        for lang in ("nl", "fr", "de", "en"):
            dict_path = DATA_DIR / f"strings.{lang}.json"
            self.assertTrue(dict_path.exists(), f"Dictionary file missing: {dict_path}")
            with open(dict_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            for key in required_keys:
                self.assertIn(key, data, f"Key '{key}' missing in strings.{lang}.json")
                val = data[key]
                self.assertTrue(isinstance(val, str) and val.strip(), f"Key '{key}' in strings.{lang}.json must not be empty")

    def test_utils_exports_get_sign_code(self) -> None:
        """Validates that js/utils.js exports getSignCode function."""
        utils_path = JS_DIR / "utils.js"
        self.assertTrue(utils_path.exists(), "js/utils.js must exist")
        content = utils_path.read_text(encoding="utf-8")
        self.assertIn("export function getSignCode(", content)

    def test_all_signs_in_questions_have_extractable_code(self) -> None:
        """Validates that every question referencing a sign SVG maps to a valid sign code."""
        with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        questions = data.get("questions", [])
        sign_code_pattern = re.compile(r"([A-Za-z0-9_-]+)\.svg$", re.IGNORECASE)

        for q in questions:
            qid = q.get("id")
            if "sign" in q:
                sign_path = q["sign"]
                match = sign_code_pattern.search(sign_path)
                self.assertIsNotNone(match, f"Question {qid} sign '{sign_path}' has no extractable code")
                self.assertTrue(match.group(1), f"Question {qid} extracted empty sign code")

            if q.get("type") == "identify":
                options = q.get("options", [])
                for idx, opt in enumerate(options):
                    match = sign_code_pattern.search(opt)
                    self.assertIsNotNone(match, f"Identify question {qid} option {idx} '{opt}' has no extractable sign code")
                    self.assertTrue(match.group(1), f"Identify question {qid} option {idx} extracted empty code")

    def test_quiz_js_uses_descriptive_alt_attributes(self) -> None:
        """Validates that js/quiz.js sets descriptive alt attributes using getSignCode and translation keys."""
        quiz_path = JS_DIR / "quiz.js"
        content = quiz_path.read_text(encoding="utf-8")

        self.assertIn("getSignCode", content)
        self.assertIn("quiz.image_alt_sign_code", content)
        self.assertIn("quiz.option_img_alt_sign", content)
        self.assertIn("result.image_alt_sign_code", content)

    def test_carousel_js_uses_descriptive_alt_attributes(self) -> None:
        """Validates that js/carousel.js sets descriptive alt attributes using getSignCode."""
        carousel_path = JS_DIR / "carousel.js"
        content = carousel_path.read_text(encoding="utf-8")

        self.assertIn("getSignCode", content)
        self.assertIn("carousel.sign_img_alt_code", content)


if __name__ == "__main__":
    unittest.main()

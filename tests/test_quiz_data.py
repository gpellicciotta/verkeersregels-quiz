"""Automated validation tests for quiz data, question schemas, and sign assets."""

from __future__ import annotations

import json
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
QUESTIONS_PATH = REPO_ROOT / "data" / "questions.json"
SIGNS_DIR = REPO_ROOT / "assets" / "signs"


class TestQuizData(unittest.TestCase):
    """Test suite validating quiz question schemas, referenced signs, and legal annotations."""

    @classmethod
    def setUpClass(cls) -> None:
        if not QUESTIONS_PATH.exists():
            raise FileNotFoundError(f"Missing questions file: {QUESTIONS_PATH}")
        with open(QUESTIONS_PATH, encoding="utf-8") as f:
            cls.data = json.load(f)
        cls.questions = cls.data.get("questions", [])

    def test_total_question_count(self) -> None:
        """Validates that the question bank contains exactly 324 questions."""
        self.assertEqual(len(self.questions), 324, f"Expected exactly 324 questions, found {len(self.questions)}")

    def test_question_counts_by_type(self) -> None:
        """Validates the question counts for all supported question types."""
        from collections import Counter
        counts = Counter(q.get("type") for q in self.questions)
        self.assertEqual(counts["recognize"], 193)
        self.assertEqual(counts["identify"], 12)
        self.assertEqual(counts["rule"], 79)
        self.assertEqual(counts["situation"], 40)

    def test_question_ids_unique_and_valid(self) -> None:
        """Validates that all question IDs are non-empty, kebab-case formatted, and unique."""
        seen_ids = set()
        id_pattern = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
        for q in self.questions:
            qid = q.get("id")
            self.assertIsInstance(qid, str, f"Question ID must be a string: {q}")
            self.assertTrue(qid, "Question ID must not be empty")
            self.assertRegex(qid, id_pattern, f"Invalid question ID format: {qid}")
            self.assertNotIn(qid, seen_ids, f"Duplicate question ID found: {qid}")
            seen_ids.add(qid)

    def test_question_schema_and_required_fields(self) -> None:
        """Validates that every question has all required fields and valid types."""
        required_fields = {
            "id": str,
            "type": str,
            "category": str,
            "question": str,
            "options": list,
            "correctIndex": int,
            "explanation": str,
            "source": str,
        }
        valid_types = {"recognize", "identify", "rule", "situation"}
        for q in self.questions:
            qid = q.get("id", "unknown")
            for field, field_type in required_fields.items():
                self.assertIn(field, q, f"Question {qid} missing required field '{field}'")
                self.assertIsInstance(q[field], field_type, f"Question {qid} field '{field}' must be {field_type.__name__}")
            self.assertIn(q["type"], valid_types, f"Question {qid} has invalid type: {q['type']}")
            self.assertTrue(q["question"].strip(), f"Question {qid} text cannot be empty")
            self.assertTrue(q["explanation"].strip(), f"Question {qid} explanation cannot be empty")

    def test_question_options_and_correct_index(self) -> None:
        """Validates that every question has at least 2 options and a valid correctIndex."""
        for q in self.questions:
            qid = q.get("id", "unknown")
            options = q["options"]
            self.assertGreaterEqual(len(options), 2, f"Question {qid} must have at least 2 options")
            for idx, opt in enumerate(options):
                self.assertIsInstance(opt, str, f"Option {idx} in question {qid} must be string")
                self.assertTrue(opt.strip(), f"Option {idx} in question {qid} must not be empty")
            correct_idx = q["correctIndex"]
            self.assertIsInstance(correct_idx, int, f"Question {qid} correctIndex must be int")
            self.assertTrue(
                0 <= correct_idx < len(options),
                f"Question {qid} correctIndex {correct_idx} out of range (0-{len(options)-1})",
            )

    def test_since_years_are_valid_integers(self) -> None:
        """Validates that since years are valid integers within the modern traffic law era."""
        for q in self.questions:
            qid = q.get("id", "unknown")
            if "since" in q:
                since = q["since"]
                self.assertIsInstance(since, int, f"Question {qid} 'since' must be integer, got {type(since).__name__}")
                self.assertTrue(
                    1968 <= since <= 2026,
                    f"Question {qid} 'since' year {since} outside expected range (1968-2026)",
                )

    def test_all_questions_have_valid_source_url(self) -> None:
        """Validates that every question provides an authoritative, valid HTTP/HTTPS source link."""
        for q in self.questions:
            qid = q.get("id", "unknown")
            source = q.get("source", "")
            self.assertTrue(
                source.startswith("https://") or source.startswith("http://"),
                f"Question {qid} source must be an HTTP(S) URL, got: {source}",
            )

    def test_referenced_signs_exist_and_are_valid_svg(self) -> None:
        """Validates that every referenced sign file exists in assets/signs/ and is valid SVG."""
        referenced_signs = set()
        for q in self.questions:
            if "sign" in q:
                referenced_signs.add(q["sign"])
        self.assertTrue(referenced_signs, "Expected at least one question referencing a sign")

        for sign_rel_path in referenced_signs:
            sign_file = REPO_ROOT / sign_rel_path
            self.assertTrue(sign_file.exists(), f"Referenced sign file does not exist: {sign_file}")
            self.assertEqual(sign_file.suffix.lower(), ".svg", f"Sign file must be SVG: {sign_file}")
            try:
                tree = ET.parse(sign_file)
                root = tree.getroot()
                self.assertTrue("svg" in root.tag.lower(), f"Root element of {sign_file.name} is not svg: {root.tag}")
            except Exception as exc:
                self.fail(f"Sign SVG {sign_file} failed XML parsing: {exc}")

    def test_all_signs_in_assets_are_valid_svg(self) -> None:
        """Validates that all SVG files in assets/signs/ parse cleanly as valid SVG XML."""
        self.assertTrue(SIGNS_DIR.exists(), f"Missing signs directory: {SIGNS_DIR}")
        sign_files = list(SIGNS_DIR.glob("*.svg"))
        self.assertGreaterEqual(len(sign_files), 35, f"Expected at least 35 sign files, found {len(sign_files)}")
        for sign_file in sign_files:
            try:
                tree = ET.parse(sign_file)
                root = tree.getroot()
                self.assertTrue("svg" in root.tag.lower(), f"Root element of {sign_file.name} is not svg: {root.tag}")
            except Exception as exc:
                self.fail(f"Sign SVG {sign_file} failed XML parsing: {exc}")

    def test_referenced_situation_images_exist_and_are_valid_jpg(self) -> None:
        """Validates that every referenced situation image file exists and is valid JPEG."""
        situation_questions = [q for q in self.questions if q.get("type") == "situation"]
        self.assertGreaterEqual(len(situation_questions), 40, "Expected at least 40 situation questions")
        for q in situation_questions:
            qid = q.get("id", "unknown")
            self.assertIn("image", q, f"Situation question {qid} must have 'image' field")
            img_rel_path = q["image"]
            img_file = REPO_ROOT / img_rel_path
            self.assertTrue(img_file.exists(), f"Referenced situation image does not exist: {img_file}")
            self.assertIn(img_file.suffix.lower(), {".jpg", ".jpeg"}, f"Situation image must be JPEG: {img_file}")
            self.assertGreater(img_file.stat().st_size, 1000, f"Situation image file is too small: {img_file}")

    def test_no_questions_refer_to_unshown_signs(self) -> None:
        """Validates that questions do not refer to a traffic sign without displaying it via 'sign' or 'image'."""
        sign_code_pattern = re.compile(r"\b(?:bord|toelatingsbord|verkeersbord)?\s*\(?([A-F][0-9]+[a-z]?)\)?\b", re.IGNORECASE)
        for q in self.questions:
            qid = q.get("id", "unknown")
            q_text = q.get("question", "")
            q_type = q.get("type", "")
            has_sign = bool(q.get("sign") or q.get("image"))
            if not has_sign and q_type != "identify":
                self.assertNotIn("dit bord", q_text.lower(), f"Question {qid} refers to 'dit bord' without sign")
                self.assertNotIn("dit verkeersbord", q_text.lower(), f"Question {qid} refers to 'dit verkeersbord' without sign")
                match = sign_code_pattern.search(q_text)
                self.assertIsNone(match, f"Question {qid} mentions sign code without showing it via 'sign': {match.group(0) if match else ''}")


if __name__ == "__main__":
    unittest.main()


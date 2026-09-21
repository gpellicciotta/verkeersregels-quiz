"""Automated tests for separate localized road sign explanations in the carrousel."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = WORKTREE_ROOT / "data"
JS_DIR = WORKTREE_ROOT / "js"
SCRIPTS_DIR = WORKTREE_ROOT / "scripts"


class TestSignCarouselExplanation(unittest.TestCase):
    """Test suite validating dedicated signTitle and signExplanation in data, overlay, and JS."""

    @classmethod
    def setUpClass(cls) -> None:
        with open(DATA_DIR / "questions.json", "r", encoding="utf-8") as f:
            cls.questions_data = json.load(f)["questions"]
        with open(DATA_DIR / "translations.en.json", "r", encoding="utf-8") as f:
            cls.translations_en = json.load(f)

    def test_all_sign_questions_have_sign_title_and_sign_explanation(self) -> None:
        """Validates that all questions with a 'sign' attribute have non-empty signTitle and signExplanation."""
        sign_questions = [q for q in self.questions_data if "sign" in q]
        self.assertEqual(len(sign_questions), 198, "Expected exactly 198 questions with road signs")

        for q in sign_questions:
            qid = q["id"]
            self.assertIn("signTitle", q, f"Question {qid} missing 'signTitle'")
            self.assertIn("signExplanation", q, f"Question {qid} missing 'signExplanation'")
            self.assertIsInstance(q["signTitle"], str, f"Question {qid} 'signTitle' must be string")
            self.assertIsInstance(q["signExplanation"], str, f"Question {qid} 'signExplanation' must be string")
            self.assertTrue(q["signTitle"].strip(), f"Question {qid} 'signTitle' cannot be empty")
            self.assertTrue(q["signExplanation"].strip(), f"Question {qid} 'signExplanation' cannot be empty")

    def test_all_sign_questions_have_english_translations_for_sign_fields(self) -> None:
        """Validates that translations.en.json includes signTitle and signExplanation for all sign questions."""
        sign_questions = [q for q in self.questions_data if "sign" in q]

        for q in sign_questions:
            qid = q["id"]
            self.assertIn(qid, self.translations_en, f"Question {qid} missing in translations.en.json")
            en_item = self.translations_en[qid]
            self.assertIn("signTitle", en_item, f"Question {qid} missing 'signTitle' in translations.en.json")
            self.assertIn("signExplanation", en_item, f"Question {qid} missing 'signExplanation' in translations.en.json")
            self.assertTrue(en_item["signTitle"].strip(), f"Question {qid} 'signTitle' empty in translations.en.json")
            self.assertTrue(en_item["signExplanation"].strip(), f"Question {qid} 'signExplanation' empty in translations.en.json")

    def test_rule_questions_with_signs_have_custom_sign_explanations(self) -> None:
        """Validates that rule questions with signs do not use raw question answers as signTitle or explanation."""
        rule_sign_ids = [
            "rule-rotonde",
            "rule-speed-pedelec-d9-2022",
            "rule-fietsstraat-f111-2021",
            "rule-fietser-b22",
            "rule-fietser-b23",
        ]
        q_map = {q["id"]: q for q in self.questions_data}

        for qid in rule_sign_ids:
            self.assertIn(qid, q_map)
            q = q_map[qid]
            correct_ans = q["options"][q["correctIndex"]]
            self.assertNotEqual(
                q["signTitle"],
                correct_ans,
                f"Rule question {qid} should not use the raw quiz answer as signTitle",
            )
            self.assertNotEqual(
                q["signTitle"],
                q["question"],
                f"Rule question {qid} should not use question text as signTitle",
            )
            self.assertTrue(len(q["signExplanation"]) > 20)

    def test_carousel_js_uses_apply_translation_and_sign_fields(self) -> None:
        """Validates that js/carousel.js imports applyTranslation and uses signTitle and signExplanation."""
        carousel_code = (JS_DIR / "carousel.js").read_text(encoding="utf-8")
        self.assertIn("applyTranslation", carousel_code, "carousel.js must import applyTranslation")
        self.assertIn("item.signTitle", carousel_code, "carousel.js must check item.signTitle")
        self.assertIn("item.signExplanation", carousel_code, "carousel.js must check item.signExplanation")

    def test_quiz_js_exports_apply_translation_with_sign_fields(self) -> None:
        """Validates that js/quiz.js applies translation overlays for signTitle and signExplanation."""
        quiz_code = (JS_DIR / "quiz.js").read_text(encoding="utf-8")
        self.assertIn("export function applyTranslation", quiz_code)
        self.assertIn("signTitle: overlay.signTitle ?? q.signTitle", quiz_code)
        self.assertIn("signExplanation: overlay.signExplanation ?? q.signExplanation", quiz_code)

    def test_translate_questions_script_supports_sign_fields(self) -> None:
        """Validates that scripts/translate-questions.py includes signTitle and signExplanation in translation extraction."""
        script_code = (SCRIPTS_DIR / "translate-questions.py").read_text(encoding="utf-8")
        self.assertIn('q.get("signTitle")', script_code)
        self.assertIn('q.get("signExplanation")', script_code)
        self.assertIn('item_overlay["signTitle"]', script_code)
        self.assertIn('item_overlay["signExplanation"]', script_code)


if __name__ == "__main__":
    unittest.main()

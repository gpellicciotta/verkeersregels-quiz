"""Automated tests for non-color correct/wrong indicator and colorblind accessibility."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = WORKTREE_ROOT / "index.html"
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"
JS_DIR = WORKTREE_ROOT / "js"
DATA_DIR = WORKTREE_ROOT / "data"


def _read_js() -> str:
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))


class TestColorblindIndicator(unittest.TestCase):
    """Test suite validating non-color indicators on answer options and top header."""

    def test_index_html_contains_quiz_status_indicator(self) -> None:
        """Validates that index.html contains the quiz-status-indicator with ARIA live role."""
        html = INDEX_PATH.read_text(encoding="utf-8")
        self.assertIn('id="quiz-status-indicator"', html, "index.html must include quiz-status-indicator")
        self.assertIn('role="status"', html, "quiz-status-indicator must have role='status'")
        self.assertIn('aria-live="polite"', html, "quiz-status-indicator must have aria-live='polite'")

    def test_dom_js_caches_status_indicator(self) -> None:
        """Validates that dom.js caches the quizStatusIndicator element."""
        dom_js = (JS_DIR / "dom.js").read_text(encoding="utf-8")
        self.assertIn("quizStatusIndicator:", dom_js, "dom.js must cache quizStatusIndicator")

    def test_quiz_js_implements_option_and_status_indicators(self) -> None:
        """Validates that quiz.js implements createOptionIndicator and updates status indicator."""
        js = _read_js()
        self.assertIn("createOptionIndicator", js, "quiz.js must define createOptionIndicator")
        self.assertIn("option-indicator", js, "quiz.js must create option-indicator elements")
        self.assertIn("quiz-status-badge", js, "quiz.js must render quiz-status-badge in selectOption")
        self.assertIn("quizStatusIndicator", js, "quiz.js must update quizStatusIndicator")

    def test_css_defines_indicator_classes_and_tokens(self) -> None:
        """Validates that style.css styles the top status indicator and option badges."""
        css = CSS_PATH.read_text(encoding="utf-8")
        self.assertIn(".quiz-status-indicator", css, "style.css must style .quiz-status-indicator")
        self.assertIn(".quiz-status-badge", css, "style.css must style .quiz-status-badge")
        self.assertIn(".quiz-status-correct", css, "style.css must style .quiz-status-correct")
        self.assertIn(".quiz-status-wrong", css, "style.css must style .quiz-status-wrong")
        self.assertIn(".option-indicator", css, "style.css must style .option-indicator")
        self.assertIn(".option-indicator-correct", css, "style.css must style .option-indicator-correct")
        self.assertIn(".option-indicator-wrong", css, "style.css must style .option-indicator-wrong")

    def test_localization_contains_indicator_strings(self) -> None:
        """Validates that Dutch and English localization strings include indicator labels."""
        with open(DATA_DIR / "strings.nl.json", "r", encoding="utf-8") as f:
            nl = json.load(f)
        with open(DATA_DIR / "strings.en.json", "r", encoding="utf-8") as f:
            en = json.load(f)

        self.assertEqual(nl["quiz.indicator_correct"], "Juist")
        self.assertEqual(nl["quiz.indicator_wrong"], "Fout")
        self.assertEqual(nl["quiz.status_correct"], "Juist")
        self.assertEqual(nl["quiz.status_wrong"], "Fout")

        self.assertEqual(en["quiz.indicator_correct"], "Correct")
        self.assertEqual(en["quiz.indicator_wrong"], "Incorrect")
        self.assertEqual(en["quiz.status_correct"], "Correct")
        self.assertEqual(en["quiz.status_wrong"], "Incorrect")


if __name__ == "__main__":
    unittest.main()

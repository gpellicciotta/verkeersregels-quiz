"""Automated validation tests for responsive desktop and mobile UX layout."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = WORKTREE_ROOT / "index.html"
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"
JS_PATH = WORKTREE_ROOT / "js" / "app.js"


class TestUXLayout(unittest.TestCase):
    """Test suite validating two-panel desktop layout, mobile zero-scroll, and UX elements."""

    def test_index_html_contains_two_panel_semantic_structure(self) -> None:
        """Validates that index.html defines quiz-body, question pane, answer pane, and next button."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('class="quiz-body"', html, "index.html must define quiz-body container")
        self.assertIn('class="quiz-pane-question"', html, "index.html must define quiz-pane-question")
        self.assertIn('class="quiz-pane-answers"', html, "index.html must define quiz-pane-answers")
        self.assertIn('class="quiz-feedback-wrap"', html, "index.html must define quiz-feedback-wrap")
        self.assertIn('class="btn-next-text"', html, "btn-next must contain btn-next-text span")
        self.assertIn('class="next-icon"', html, "btn-next must include svg next-icon")
        self.assertIn('class="start-legal-hint"', html, "index.html must include start-legal-hint")

    def test_css_contains_responsive_two_panel_and_fab_rules(self) -> None:
        """Validates that style.css defines two-column grid, mobile FAB, and option-hidden styles."""
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn("grid-template-columns", css, "style.css must declare grid-template-columns")
        self.assertIn(".option-btn.option-hidden", css, "style.css must handle option-hidden class")
        self.assertIn(".explanation-link-pill", css, "style.css must style explanation-link-pill")
        self.assertIn(".explanation-header", css, "style.css must style explanation-header")
        self.assertIn("max-width: 960px", css, "style.css must expand desktop max-width to 960px")

    def test_js_app_implements_option_hiding_and_pill_link(self) -> None:
        """Validates that app.js implements option hiding and compact reference link pill."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        js = JS_PATH.read_text(encoding="utf-8")

        self.assertIn("option-hidden", js, "app.js must apply option-hidden class in selectOption")
        self.assertIn("explanation-link-pill", js, "app.js must generate explanation-link-pill")
        self.assertIn("updateNextButtonText", js, "app.js must define updateNextButtonText")

    def test_paired_result_badges_and_pill_sizing(self) -> None:
        """Validates that since badges remain with question on desktop and pair on mobile."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        js = JS_PATH.read_text(encoding="utf-8")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn("badge-since-desktop", js, "app.js must render desktop since badge in questionCell")
        self.assertIn("badge-since-mobile", js, "app.js must render mobile since badge in showResult")
        self.assertIn(".badge-since-desktop", css, "style.css must define .badge-since-desktop")
        self.assertIn(".badge-since-mobile", css, "style.css must define .badge-since-mobile")
        self.assertIn("result-badges-wrap", js, "app.js must wrap result badges in result-badges-wrap")
        self.assertIn(".result-badges-wrap", css, "style.css must declare .result-badges-wrap")
        self.assertIn("padding-right: 155px", css, "style.css must reserve padding for paired badges on mobile")


if __name__ == "__main__":
    unittest.main()

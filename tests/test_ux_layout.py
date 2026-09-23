"""Automated validation tests for responsive desktop and mobile UX layout."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = WORKTREE_ROOT / "index.html"
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"
JS_DIR = WORKTREE_ROOT / "js"


def _read_js() -> str:
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))


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
        """Validates that quiz.js implements option hiding and compact reference link pill."""
        self.assertTrue(JS_DIR.exists(), "js directory must exist")
        js = _read_js()

        self.assertIn("option-hidden", js, "quiz.js must apply option-hidden class in selectOption")
        self.assertIn("explanation-link-pill", js, "quiz.js must generate explanation-link-pill")
        self.assertIn("updateNextButtonText", js, "quiz.js must define updateNextButtonText")

    def test_paired_result_badges_and_pill_sizing(self) -> None:
        """Validates that since badges remain with question on desktop and pair on mobile."""
        self.assertTrue(JS_DIR.exists(), "js directory must exist")
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        js = _read_js()
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn("badge-since-desktop", js, "quiz.js must render desktop since badge in questionCell")
        self.assertIn("badge-since-mobile", js, "quiz.js must render mobile since badge in showResult")
        self.assertIn(".badge-since-desktop", css, "style.css must define .badge-since-desktop")
        self.assertIn(".badge-since-mobile", css, "style.css must define .badge-since-mobile")
        self.assertIn("result-badges-wrap", js, "quiz.js must wrap result badges in result-badges-wrap")
        self.assertIn(".result-badges-wrap", css, "style.css must declare .result-badges-wrap")
        self.assertIn("padding-right: 155px", css, "style.css must reserve padding for paired badges on mobile")

    def test_result_header_top_right_action_buttons(self) -> None:
        """Validates that result header positions action buttons in top-right on desktop."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn('class="result-header"', html, "index.html must define result-header")
        self.assertIn('class="result-header-text"', html, "index.html must define result-header-text")
        self.assertIn(".result-header", css, "style.css must declare .result-header")

    def test_quiz_report_button_responsive_layout(self) -> None:
        """Validates that quiz report button is styled sticky on mobile and centered on desktop."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertNotIn("btn-report-error-mobile", html, "Obsolete mobile header report button must be removed")
        self.assertIn('id="btn-report-error"', html, "index.html must define btn-report-error")
        self.assertIn('class="quiz-btn-report-round"', html, "btn-report-error must use quiz-btn-report-round class")
        self.assertIn(".quiz-btn-report-round", css, "style.css must style .quiz-btn-report-round")
        self.assertIn("position: fixed", css, "style.css must position mobile report button fixed")
        self.assertIn("left: 20px", css, "style.css must position mobile report button at left 20px")

    def test_config_save_button_sticky_positioning(self) -> None:
        """Validates that .config-actions is styled sticky at bottom for mobile and desktop."""
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn(".config-actions", css, "style.css must style .config-actions")
        self.assertIn("position: sticky", css, "style.css must declare position: sticky")
        self.assertIn("bottom: 0", css, "style.css must declare bottom: 0")

    def test_sticky_headers_and_modal_actions(self) -> None:
        """Validates that modal actions and screen headers maintain sticky positioning."""
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn(".modal-actions", css, "style.css must declare .modal-actions")
        self.assertIn(".config-header", css, "style.css must declare .config-header")
        self.assertIn(".about-header", css, "style.css must declare .about-header")
        self.assertIn(".carousel-header", css, "style.css must declare .carousel-header")
        self.assertIn(".result-header", css, "style.css must declare .result-header")
        self.assertIn(".start-bottom-meta", css, "style.css must declare .start-bottom-meta")


if __name__ == "__main__":
    unittest.main()



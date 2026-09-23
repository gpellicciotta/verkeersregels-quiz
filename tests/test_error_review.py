"""Automated tests for starting a quiz from past errors and retrying missed questions."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
JS_DIR = WORKTREE_ROOT / "js"


class TestErrorReview(unittest.TestCase):
    """Test suite validating the error-review start/retry flow and its settings checkbox."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.quiz_js = (JS_DIR / "quiz.js").read_text(encoding="utf-8")
        cls.app_js = (JS_DIR / "app.js").read_text(encoding="utf-8")
        cls.dom_js = (JS_DIR / "dom.js").read_text(encoding="utf-8")
        cls.state_js = (JS_DIR / "state.js").read_text(encoding="utf-8")
        cls.preferences_js = (JS_DIR / "preferences.js").read_text(encoding="utf-8")
        cls.config_view_js = (JS_DIR / "config-view.js").read_text(encoding="utf-8")
        cls.index_html = (WORKTREE_ROOT / "index.html").read_text(encoding="utf-8")
        cls.style_css = (WORKTREE_ROOT / "css" / "style.css").read_text(encoding="utf-8")

    def test_quiz_module_exports_error_review_entry_points(self) -> None:
        """Validates that quiz.js exposes the two new round-building entry points."""
        self.assertIn("export function startErrorReviewQuiz()", self.quiz_js)
        self.assertIn("export function restartWithWrongAnswers()", self.quiz_js)

    def test_start_error_review_quiz_uses_all_time_error_ids(self) -> None:
        """Validates the start-screen review button pulls from cumulative error stats, not one round."""
        self.assertIn("const ids = getErrorQuestionIds();", self.quiz_js)

    def test_restart_with_wrong_answers_uses_current_round_only(self) -> None:
        """Validates the result-screen retry button only reuses this round's wrong answers."""
        self.assertIn(
            "const wrongIds = state.answers.filter((a) => !a.correct).map((a) => String(a.id));",
            self.quiz_js,
        )

    def test_always_include_last_errors_merges_into_normal_start(self) -> None:
        """Validates startQuiz() forces in last quiz's wrong questions when the setting is enabled."""
        self.assertIn("function buildRoundWithForcedIds(pool, forcedIds, effectiveCount)", self.quiz_js)
        self.assertIn(
            "const round = state.alwaysIncludeLastErrors\n"
            "    ? buildRoundWithForcedIds(state.pool, getLastQuizWrongIds(), effectiveCount)",
            self.quiz_js,
        )

    def test_dom_registers_new_buttons_and_checkbox(self) -> None:
        """Validates dom.js exposes the new start/result buttons and the settings checkbox."""
        self.assertIn('btnStartErrors: document.getElementById("btn-start-errors"),', self.dom_js)
        self.assertIn(
            'btnResultRetryErrors: document.getElementById("btn-result-retry-errors"),', self.dom_js
        )
        self.assertIn(
            'configAlwaysIncludeErrors: document.getElementById("config-always-include-errors"),',
            self.dom_js,
        )

    def test_app_wires_click_handlers(self) -> None:
        """Validates app.js wires the two new buttons to their quiz.js entry points."""
        self.assertIn(
            "if (el.btnStartErrors) el.btnStartErrors.addEventListener(\"click\", startErrorReviewQuiz);",
            self.app_js,
        )
        self.assertIn(
            "if (el.btnResultRetryErrors) el.btnResultRetryErrors.addEventListener"
            "(\"click\", restartWithWrongAnswers);",
            self.app_js,
        )

    def test_start_screen_button_hidden_unless_errors_exist(self) -> None:
        """Validates the start-screen review button visibility follows hasStoredErrors()."""
        self.assertIn(
            'el.btnStartErrors.classList.toggle("hidden", !hasStoredErrors());', self.quiz_js
        )

    def test_result_screen_button_hidden_on_a_perfect_score(self) -> None:
        """Validates the result-screen retry button hides when every answer this round was correct."""
        self.assertIn(
            'el.btnResultRetryErrors.classList.toggle("hidden", correct === total);', self.quiz_js
        )

    def test_state_defines_always_include_last_errors_flag(self) -> None:
        """Validates state.js defines the default for the new setting."""
        self.assertIn("alwaysIncludeLastErrors: false,", self.state_js)

    def test_preferences_restore_always_include_last_errors(self) -> None:
        """Validates applyStoredPreferences restores the setting from localStorage."""
        self.assertIn(
            'if (typeof stored.alwaysIncludeLastErrors === "boolean") {', self.preferences_js
        )

    def test_config_view_persists_always_include_last_errors(self) -> None:
        """Validates the settings view reads and writes the new checkbox."""
        self.assertIn(
            "el.configAlwaysIncludeErrors.checked = !!state.alwaysIncludeLastErrors;",
            self.config_view_js,
        )
        self.assertIn(
            "state.alwaysIncludeLastErrors = !!el.configAlwaysIncludeErrors.checked;",
            self.config_view_js,
        )
        self.assertIn("alwaysIncludeLastErrors: state.alwaysIncludeLastErrors,", self.config_view_js)

    def test_index_html_defines_new_markup(self) -> None:
        """Validates index.html defines the start button, result button, and settings checkbox."""
        self.assertIn('id="btn-start-errors"', self.index_html)
        self.assertIn('id="btn-result-retry-errors"', self.index_html)
        self.assertIn('id="config-always-include-errors"', self.index_html)
        self.assertIn('class="config-checkbox-label"', self.index_html)

    def test_style_css_defines_config_checkbox_label(self) -> None:
        """Validates style.css defines .config-checkbox-label matching config label font styles."""
        self.assertIn(".config-checkbox-label {", self.style_css)
        self.assertIn("font-size: var(--font-size-sm);", self.style_css)
        self.assertIn("font-weight: 600;", self.style_css)


if __name__ == "__main__":
    unittest.main()

"""Automated tests for name query parameter support (aliases: name, naam, n)."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
JS_PATH = WORKTREE_ROOT / "js" / "app.js"
INDEX_PATH = WORKTREE_ROOT / "index.html"


class TestNameQueryParam(unittest.TestCase):
    """Test suite validating name query parameter aliases, DOM visibility, and quiz integration."""

    def test_js_defines_get_name_param(self) -> None:
        """Validates that app.js implements getNameParam helper with name, naam, and n aliases."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        js_code = JS_PATH.read_text(encoding="utf-8")

        self.assertIn("function getNameParam()", js_code, "app.js must define getNameParam()")
        self.assertIn('params.get("name")', js_code, "getNameParam must check 'name' parameter")
        self.assertIn('params.get("naam")', js_code, "getNameParam must check 'naam' alias")
        self.assertIn('params.get("n")', js_code, "getNameParam must check 'n' alias")
        self.assertIn("window.getNameParam = getNameParam", js_code, "getNameParam must be exported on window")

    def test_set_start_mode_hides_quiz_start_fields_when_name_given(self) -> None:
        """Validates that setStartMode hides quizStartFields when a name query parameter is present."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        js_code = JS_PATH.read_text(encoding="utf-8")

        self.assertIn("getNameParam()", js_code, "setStartMode must evaluate getNameParam()")
        self.assertIn('el.quizStartFields.classList.toggle("hidden", isCarousel || Boolean(nameParam))', js_code,
                      "setStartMode must hide quizStartFields when in carousel mode or when name query param is present")

    def test_start_quiz_uses_query_param_name(self) -> None:
        """Validates that startQuiz assigns playerName from getNameParam() before falling back to input value."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        js_code = JS_PATH.read_text(encoding="utf-8")

        self.assertIn("function startQuiz()", js_code, "app.js must define startQuiz()")
        self.assertIn("state.playerName = nameParam || (el.playerNameInput ? el.playerNameInput.value.trim() : \"\");", js_code,
                      "startQuiz must use nameParam when present")

    def test_restart_respects_name_query_param(self) -> None:
        """Validates that restart populates player-name and refreshes start mode visibility."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        js_code = JS_PATH.read_text(encoding="utf-8")

        self.assertIn("function restart()", js_code, "app.js must define restart()")
        self.assertIn("setStartMode(state.currentMode)", js_code, "restart must refresh start mode state")


if __name__ == "__main__":
    unittest.main()

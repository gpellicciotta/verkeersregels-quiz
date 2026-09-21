"""Automated tests for localStorage persistence of player name and configuration choices."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
JS_DIR = WORKTREE_ROOT / "js"


class TestPreferencesPersistence(unittest.TestCase):
    """Test suite validating preference storage helpers, write points, and query overrides."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.js_code = "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))

    def test_js_defines_storage_helpers(self) -> None:
        """Validates that app.js defines the preferences storage key and read/write helpers."""
        self.assertIn('const PREFS_STORAGE_KEY = "verkeersquiz_preferences";', self.js_code)
        self.assertIn("function getStoredPreferences()", self.js_code)
        self.assertIn("function setStoredPreferences(patch)", self.js_code)
        self.assertIn("function applyStoredPreferences()", self.js_code)

    def test_apply_stored_preferences_respects_query_overrides(self) -> None:
        """Validates that stored quiz config is only applied when no matching query param overrides it."""
        self.assertIn("getQuestionCountOverride() === null && stored.quizCount", self.js_code)
        self.assertIn("getTypeFilter() === null && stored.quizType", self.js_code)
        self.assertIn("getSinceFilter() === null && stored.quizSince", self.js_code)
        self.assertIn("!getNameParam() && stored.playerName", self.js_code)

    def test_apply_stored_preferences_restores_carousel_and_mode(self) -> None:
        """Validates that stored carousel delay, since filter, and mode are restored at startup."""
        self.assertIn("carouselState.delayMs = stored.carouselDelaySeconds * 1000;", self.js_code)
        self.assertIn("carouselState.filterSince = stored.carouselSince;", self.js_code)
        self.assertIn('if (!hasModeOverride && stored.mode === "carousel")', self.js_code)

    def test_start_quiz_persists_player_name_unless_query_override(self) -> None:
        """Validates that startQuiz stores the player name only when not driven by a query param."""
        self.assertIn(
            "if (!nameParam) {\n    setStoredPreferences({ playerName: state.playerName });\n  }",
            self.js_code,
        )

    def test_save_config_persists_quiz_and_carousel_choices(self) -> None:
        """Validates that saveConfig writes quiz and carousel configuration to storage."""
        self.assertIn("quizCount: state.configCount,", self.js_code)
        self.assertIn("quizType: state.configType,", self.js_code)
        self.assertIn("quizSince: state.configSince,", self.js_code)
        self.assertIn("carouselDelaySeconds: carouselState.delayMs / 1000,", self.js_code)
        self.assertIn("carouselSince: carouselState.filterSince,", self.js_code)

    def test_set_start_mode_only_persists_on_user_interaction(self) -> None:
        """Validates that setStartMode accepts a persist flag used only by direct user controls."""
        self.assertIn("function setStartMode(mode, persist)", self.js_code)
        self.assertIn("setStoredPreferences({ mode: state.currentMode });", self.js_code)
        self.assertIn('setStartMode("quiz", true)', self.js_code)
        self.assertIn('setStartMode("carousel", true)', self.js_code)
        self.assertIn("setStartMode(nextMode, true);", self.js_code)

    def test_startup_sequence_applies_stored_preferences_before_start_mode(self) -> None:
        """Validates that applyStoredPreferences runs right before the initial setStartMode call."""
        self.assertIn("applyStoredPreferences();\nsetStartMode(state.currentMode);", self.js_code)

    def test_js_exports_preference_functions(self) -> None:
        """Validates that preference helper functions are exposed on window object."""
        self.assertIn("window.getStoredPreferences = getStoredPreferences;", self.js_code)
        self.assertIn("window.setStoredPreferences = setStoredPreferences;", self.js_code)
        self.assertIn("window.applyStoredPreferences = applyStoredPreferences;", self.js_code)


if __name__ == "__main__":
    unittest.main()

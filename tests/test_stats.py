"""Automated tests for the localStorage-only play-stats and most-used-errors tracking."""

from __future__ import annotations

import subprocess
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
JS_DIR = WORKTREE_ROOT / "js"


class TestStats(unittest.TestCase):
    """Test suite validating stats.js storage helpers and their wiring into the quiz flow."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.stats_js = (JS_DIR / "stats.js").read_text(encoding="utf-8")
        cls.quiz_js = (JS_DIR / "quiz.js").read_text(encoding="utf-8")

    def test_stats_logic_runs_under_node(self) -> None:
        """Execute the pure accumulation/reset logic against a fake localStorage in Node."""
        result = subprocess.run(
            ["node", "--test", "tests/stats.test.cjs"],
            cwd=WORKTREE_ROOT, capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_stats_module_defines_storage_key_and_helpers(self) -> None:
        """Validates that stats.js defines the dedicated storage key and public API."""
        self.assertIn('const STATS_STORAGE_KEY = "verkeersquiz_stats";', self.stats_js)
        self.assertIn("export function getStoredStats()", self.stats_js)
        self.assertIn("export function recordQuizResult(answers)", self.stats_js)
        self.assertIn("export function getMostUsedErrors(limit = 10)", self.stats_js)
        self.assertIn("export function resetStats()", self.stats_js)
        self.assertIn("export function getErrorQuestionIds()", self.stats_js)
        self.assertIn("export function hasStoredErrors()", self.stats_js)
        self.assertIn("export function getLastQuizWrongIds()", self.stats_js)

    def test_stats_storage_key_is_distinct_from_preferences(self) -> None:
        """Guards against accidentally colliding with the existing preferences storage key."""
        prefs_js = (JS_DIR / "preferences.js").read_text(encoding="utf-8")
        self.assertIn('const PREFS_STORAGE_KEY = "verkeersquiz_preferences";', prefs_js)
        self.assertNotIn('"verkeersquiz_preferences"', self.stats_js)

    def test_quiz_result_screen_records_stats(self) -> None:
        """Validates that showResult() feeds the finished round's answers into recordQuizResult."""
        self.assertRegex(self.quiz_js, r'import \{[^}]*\brecordQuizResult\b[^}]*\} from "\./stats\.js";')
        self.assertIn("recordQuizResult(state.answers);", self.quiz_js)


if __name__ == "__main__":
    unittest.main()

"""Automated tests for the Apps Script daily summary-email logic in google-apps-script/Code.gs."""

from __future__ import annotations

import subprocess
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
CODE_GS_PATH = WORKTREE_ROOT / "google-apps-script" / "Code.gs"


class TestGasSummary(unittest.TestCase):
    """Test suite validating the twice-daily summary email built from the results/issues sheets."""

    def test_summary_logic_runs_under_node(self) -> None:
        """Execute the pure aggregation and trigger-setup logic against fixture data in Node."""
        result = subprocess.run(
            ["node", "--test", "tests/gas-summary.test.cjs"],
            cwd=WORKTREE_ROOT, capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_summary_email_recipient_is_a_placeholder_not_a_real_address(self) -> None:
        """Guard against accidentally committing a real personal email address."""
        source = CODE_GS_PATH.read_text(encoding="utf-8")
        self.assertIn("PUT_YOUR_EMAIL_HERE@example.com", source, "SUMMARY_EMAIL_TO must stay a placeholder in source control")

    def test_triggers_are_scheduled_for_07_and_19_utc(self) -> None:
        """Validates the daily trigger setup targets 07:00 and 19:00 UTC as required."""
        source = CODE_GS_PATH.read_text(encoding="utf-8")
        self.assertIn(".atHour(hour)", source)
        self.assertIn("[7, 19].forEach", source)
        self.assertIn(".inTimezone('Etc/UTC')", source)


if __name__ == "__main__":
    unittest.main()

"""Automated unit tests for scripts/devops.py CLI entry point."""

from __future__ import annotations

import io
import subprocess
import sys
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEVOPS_SCRIPT = REPO_ROOT / "scripts" / "devops.py"


class TestDevopsCli(unittest.TestCase):
    """Test suite validating scripts/devops.py subcommands, flags, and exit codes."""

    def test_devops_script_exists(self) -> None:
        """Validates that scripts/devops.py exists on disk."""
        self.assertTrue(DEVOPS_SCRIPT.exists(), f"Missing script: {DEVOPS_SCRIPT}")

    def test_version_flag_and_action(self) -> None:
        """Validates that --version and version action exit 0 with proper banner."""
        for flag in ["--version", "version"]:
            result = subprocess.run(
                [sys.executable, str(DEVOPS_SCRIPT), flag],
                cwd=str(REPO_ROOT),
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, f"Expected 0 for {flag}, got {result.returncode}")
            output = result.stdout.strip()
            self.assertTrue(
                output.startswith("devops v"),
                f"Banner must start with 'devops v', got: {output}",
            )
            self.assertIn("Giovanni Pellicciotta", output)

    def test_help_flag_and_action(self) -> None:
        """Validates that --help and help action exit 0 and document all actions."""
        for flag in ["--help", "-h", "help"]:
            result = subprocess.run(
                [sys.executable, str(DEVOPS_SCRIPT), flag],
                cwd=str(REPO_ROOT),
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, f"Expected 0 for {flag}, got {result.returncode}")
            output = result.stdout
            for action in ["test", "lint", "check", "serve", "sw", "versions", "production", "deploy"]:
                self.assertIn(action, output, f"Help screen missing action: {action}")
            self.assertIn("Exit codes:", output)

    def test_help_verbose(self) -> None:
        """Validates that help --verbose prints detailed documentation across actions."""
        result = subprocess.run(
            [sys.executable, str(DEVOPS_SCRIPT), "help", "--verbose"],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("Detailed Action Descriptions:", result.stdout)

    def test_invalid_action_exits_2(self) -> None:
        """Validates that invalid action names exit with code 2."""
        result = subprocess.run(
            [sys.executable, str(DEVOPS_SCRIPT), "nonexistent-action"],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 2, f"Expected 2 for invalid action, got {result.returncode}")

    def test_versions_subcommand(self) -> None:
        """Validates that the versions subcommand reports project version and checks drift."""
        result = subprocess.run(
            [sys.executable, str(DEVOPS_SCRIPT), "versions", "--check"],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, f"Expected 0 for versions --check, got {result.returncode}: {result.stderr}")
        self.assertIn("v3.", result.stdout)


if __name__ == "__main__":
    unittest.main()

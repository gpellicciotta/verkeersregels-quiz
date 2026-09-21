"""Automated tests for automatic service worker activation and client refresh on new releases."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
JS_DIR = WORKTREE_ROOT / "js"
SW_PATH = WORKTREE_ROOT / "sw.js"


class TestServiceWorkerUpdate(unittest.TestCase):
    """Test suite validating that new releases activate and refresh installed clients automatically."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.js_code = "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))
        cls.sw_code = SW_PATH.read_text(encoding="utf-8")

    def test_sw_activates_new_version_without_waiting(self) -> None:
        """Validates that sw.js skips waiting on install and claims clients on activate."""
        self.assertIn("self.skipWaiting()", self.sw_code, "sw.js must call skipWaiting() on install")
        self.assertIn("self.clients.claim()", self.sw_code, "sw.js must call clients.claim() on activate")

    def test_app_reloads_once_new_worker_takes_control(self) -> None:
        """Validates that app.js reloads open clients when the controlling worker changes."""
        self.assertIn(
            'navigator.serviceWorker.addEventListener("controllerchange"',
            self.js_code,
            "app.js must listen for controllerchange",
        )
        self.assertIn("window.location.reload()", self.js_code, "app.js must reload on controllerchange")
        self.assertIn(
            "refreshingAfterUpdate",
            self.js_code,
            "app.js must guard against reload loops with a refreshing flag",
        )

    def test_app_polls_for_updates_periodically_and_on_focus(self) -> None:
        """Validates that app.js checks for a new service worker on an interval and tab focus."""
        self.assertIn("SW_UPDATE_CHECK_INTERVAL_MS", self.js_code, "app.js must define an update check interval")
        self.assertIn("reg.update()", self.js_code, "app.js must call reg.update() to poll for new releases")
        self.assertIn(
            'document.addEventListener("visibilitychange"',
            self.js_code,
            "app.js must re-check for updates when the tab regains focus",
        )


if __name__ == "__main__":
    unittest.main()

"""Automated tests for automatic service worker activation and client refresh on new releases."""

from __future__ import annotations

import runpy
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

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

    def test_runtime_lifecycle(self) -> None:
        """Execute registration, update triggers, retry, and reload behavior in Node."""
        result = subprocess.run(
            ["node", "--test", "tests/pwa-runtime.cjs"],
            cwd=WORKTREE_ROOT, capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_registration_precedes_language_fetch(self) -> None:
        """A failed language request must not disable worker updates."""
        source = (JS_DIR / "app.js").read_text(encoding="utf-8")
        self.assertLess(source.index("registerServiceWorker();"), source.index("setLang(detectLang())"))

    def test_generated_worker_changes_with_asset_contents(self) -> None:
        """Detect changed asset bytes even when deployment reuses the version."""
        generator = runpy.run_path(str(WORKTREE_ROOT / "scripts" / "generate-sw.py"))
        build = generator["build_sw_content"]
        original, count = build("test")
        self.assertEqual((original, count), build("test"))
        read_bytes = Path.read_bytes

        def changed_bytes(path: Path) -> bytes:
            content = read_bytes(path)
            return content + b"\n/* changed */" if path.name == "style.css" else content

        with patch.object(Path, "read_bytes", changed_bytes):
            changed, changed_count = build("test")
        self.assertEqual(count, changed_count)
        self.assertNotEqual(original.splitlines()[1], changed.splitlines()[1])

    def test_precache_bypasses_http_cache(self) -> None:
        """Each installation downloads fresh assets before activating."""
        self.assertIn('new Request(asset, { cache: "reload" })', self.sw_code)

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

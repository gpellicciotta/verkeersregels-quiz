"""Automated tests for quiz result sharing via Web Share API and clipboard copy."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = WORKTREE_ROOT / "data"
JS_DIR = WORKTREE_ROOT / "js"
CSS_DIR = WORKTREE_ROOT / "css"
INDEX_PATH = WORKTREE_ROOT / "index.html"
SW_PATH = WORKTREE_ROOT / "sw.js"


class TestResultShare(unittest.TestCase):
    """Test suite validating quiz result sharing markup, logic, localization, and styling."""

    def test_result_screen_markup_contains_share_button_and_toast(self) -> None:
        """Validates that index.html contains #btn-share in result-actions and #share-toast."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('id="btn-share"', html, "index.html must define #btn-share button")
        self.assertIn('id="share-toast"', html, "index.html must define #share-toast notification container")
        self.assertIn('data-i18n-aria="result.btn_share_aria"', html)
        self.assertIn('data-i18n-tooltip="result.btn_share_tooltip"', html)
        self.assertIn('role="status"', html, "#share-toast must have role status")
        self.assertIn('aria-live="polite"', html, "#share-toast must have aria-live polite")

    def test_share_localization_keys_exist_in_all_dictionaries(self) -> None:
        """Validates that all supported dictionaries define required share keys."""
        nl_path = DATA_DIR / "strings.nl.json"
        fr_path = DATA_DIR / "strings.fr.json"
        de_path = DATA_DIR / "strings.de.json"
        it_path = DATA_DIR / "strings.it.json"
        en_path = DATA_DIR / "strings.en.json"

        with open(nl_path, "r", encoding="utf-8") as f:
            nl_data = json.load(f)
        with open(fr_path, "r", encoding="utf-8") as f:
            fr_data = json.load(f)
        with open(de_path, "r", encoding="utf-8") as f:
            de_data = json.load(f)
        with open(it_path, "r", encoding="utf-8") as f:
            it_data = json.load(f)
        with open(en_path, "r", encoding="utf-8") as f:
            en_data = json.load(f)

        required_keys = [
            "result.btn_share_aria",
            "result.btn_share_tooltip",
            "result.share_title",
            "result.share_text",
            "result.share_text_name",
            "result.share_copied",
            "result.share_copied_tooltip",
            "result.share_failed",
        ]

        for key in required_keys:
            self.assertIn(key, nl_data, f"Key {key} missing from strings.nl.json")
            self.assertIn(key, fr_data, f"Key {key} missing from strings.fr.json")
            self.assertIn(key, de_data, f"Key {key} missing from strings.de.json")
            self.assertIn(key, it_data, f"Key {key} missing from strings.it.json")
            self.assertIn(key, en_data, f"Key {key} missing from strings.en.json")
            self.assertTrue(nl_data[key].strip(), f"Key {key} empty in Dutch dictionary")
            self.assertTrue(fr_data[key].strip(), f"Key {key} empty in French dictionary")
            self.assertTrue(de_data[key].strip(), f"Key {key} empty in German dictionary")
            self.assertTrue(it_data[key].strip(), f"Key {key} empty in Italian dictionary")
            self.assertTrue(en_data[key].strip(), f"Key {key} empty in English dictionary")

    def test_share_module_exports_and_structure(self) -> None:
        """Validates that js/share.js exists and exports key functions."""
        share_path = JS_DIR / "share.js"
        self.assertTrue(share_path.exists(), "js/share.js must exist")
        code = share_path.read_text(encoding="utf-8")

        self.assertIn("export function getSharePayload(", code)
        self.assertIn("export async function copyToClipboard(", code)
        self.assertIn("export function showShareFeedback(", code)
        self.assertIn("export async function handleShare(", code)
        self.assertIn("navigator.share", code, "Must support Web Share API")
        self.assertIn("navigator.clipboard", code, "Must support Clipboard API")

    def test_dom_module_caches_share_elements(self) -> None:
        """Validates that js/dom.js caches btnShare and shareToast elements."""
        dom_path = JS_DIR / "dom.js"
        code = dom_path.read_text(encoding="utf-8")

        self.assertIn('btnShare: document.getElementById("btn-share")', code)
        self.assertIn('shareToast: document.getElementById("share-toast")', code)

    def test_app_module_wires_share_listener(self) -> None:
        """Validates that js/app.js imports handleShare and binds it to btnShare."""
        app_path = JS_DIR / "app.js"
        code = app_path.read_text(encoding="utf-8")

        self.assertIn('import { handleShare } from "./share.js"', code)
        self.assertIn("el.btnShare.addEventListener(\"click\", handleShare)", code)

    def test_sw_precaches_share_module(self) -> None:
        """Validates that sw.js PRECACHE_ASSETS contains js/share.js."""
        sw_path = SW_PATH
        code = sw_path.read_text(encoding="utf-8")

        self.assertIn('"js/share.js"', code, "sw.js must precache js/share.js")

    def test_css_defines_share_toast_and_copied_state_styles(self) -> None:
        """Validates that css/style.css defines .share-toast and .result-btn-round.btn-copied."""
        css_path = CSS_DIR / "style.css"
        code = css_path.read_text(encoding="utf-8")

        self.assertIn(".share-toast", code, "CSS must define .share-toast")
        self.assertIn(".result-btn-round.btn-copied", code, "CSS must define .result-btn-round.btn-copied")


if __name__ == "__main__":
    unittest.main()

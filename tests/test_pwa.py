"""Automated validation tests for PWA manifest, service worker, and icon suite."""

from __future__ import annotations

import json
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = REPO_ROOT / "manifest.webmanifest"
SW_PATH = REPO_ROOT / "sw.js"
INDEX_PATH = REPO_ROOT / "index.html"
FAVICON_PATH = REPO_ROOT / "assets" / "favicon.svg"
ICONS_DIR = REPO_ROOT / "assets" / "icons"


class TestPWA(unittest.TestCase):
    """Test suite validating PWA manifest, service worker, offline assets, and icon suite."""

    def test_manifest_file_exists_and_is_valid_json(self) -> None:
        """Validates that manifest.webmanifest exists and contains valid JSON."""
        self.assertTrue(MANIFEST_PATH.exists(), "manifest.webmanifest must exist")
        with open(MANIFEST_PATH, encoding="utf-8") as f:
            manifest = json.load(f)

        required_keys = {"name", "short_name", "start_url", "display", "icons", "background_color", "theme_color"}
        for key in required_keys:
            self.assertIn(key, manifest, f"Manifest missing required key: {key}")

        self.assertEqual(manifest["display"], "standalone", "Display mode must be standalone")
        self.assertTrue(manifest["start_url"], "start_url must not be empty")

    def test_manifest_icons_exist_and_have_correct_dimensions(self) -> None:
        """Validates that all icons declared in manifest exist and have correct sizes."""
        with open(MANIFEST_PATH, encoding="utf-8") as f:
            manifest = json.load(f)

        icons = manifest.get("icons", [])
        self.assertGreaterEqual(len(icons), 3, "Manifest must declare multiple icons")

        has_192 = False
        has_512 = False
        has_maskable = False

        for icon in icons:
            src = icon.get("src", "")
            icon_path = REPO_ROOT / src
            self.assertTrue(icon_path.exists(), f"Icon file does not exist: {src}")

            sizes = icon.get("sizes", "")
            purpose = icon.get("purpose", "")

            if "192x192" in sizes:
                has_192 = True
                with Image.open(icon_path) as im:
                    self.assertEqual(im.size, (192, 192), f"{src} size must be 192x192")

            if "512x512" in sizes:
                has_512 = True
                with Image.open(icon_path) as im:
                    self.assertEqual(im.size, (512, 512), f"{src} size must be 512x512")

            if "maskable" in purpose:
                has_maskable = True

        self.assertTrue(has_192, "Manifest must include at least one 192x192 icon")
        self.assertTrue(has_512, "Manifest must include at least one 512x512 icon")
        self.assertTrue(has_maskable, "Manifest must include a maskable icon")

    def test_apple_touch_icon_exists(self) -> None:
        """Validates that apple-touch-icon exists with 180x180 dimensions."""
        apple_icon_path = ICONS_DIR / "apple-touch-icon.png"
        self.assertTrue(apple_icon_path.exists(), "apple-touch-icon.png must exist in assets/icons/")
        with Image.open(apple_icon_path) as im:
            self.assertEqual(im.size, (180, 180), "apple-touch-icon.png must be 180x180")

    def test_favicon_svg_is_valid_xml_and_non_empty(self) -> None:
        """Validates that favicon.svg exists and parses cleanly as SVG."""
        self.assertTrue(FAVICON_PATH.exists(), "assets/favicon.svg must exist")
        tree = ET.parse(FAVICON_PATH)
        root = tree.getroot()
        self.assertTrue(root.tag.endswith("svg"), "Root tag must be svg")

    def test_icons_have_transparent_corners(self) -> None:
        """Validates that standard PWA icons have RGBA mode and transparent corners outside the sign."""
        for filename in ("icon-192.png", "icon-512.png"):
            icon_path = ICONS_DIR / filename
            self.assertTrue(icon_path.exists(), f"{filename} must exist")
            with Image.open(icon_path) as im:
                self.assertEqual(im.mode, "RGBA", f"{filename} must be in RGBA mode")
                w, h = im.size
                corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
                for pt in corners:
                    pixel = im.getpixel(pt)
                    self.assertEqual(pixel[3], 0, f"{filename} corner {pt} must be fully transparent (alpha=0), got {pixel}")

    def test_favicon_ico_exists_and_is_valid(self) -> None:
        """Validates that favicon.ico exists in repo root with transparency."""
        ico_path = REPO_ROOT / "favicon.ico"
        self.assertTrue(ico_path.exists(), "favicon.ico must exist at repository root")
        with Image.open(ico_path) as im:
            self.assertEqual(im.format, "ICO", "favicon.ico must be in ICO format")
            self.assertEqual(im.mode, "RGBA", "favicon.ico must be in RGBA mode")
            self.assertEqual(im.getpixel((0, 0))[3], 0, "favicon.ico corner (0,0) must be fully transparent")

    def test_service_worker_precaches_all_files(self) -> None:
        """Validates that all files listed in sw.js PRECACHE_ASSETS exist on disk."""
        self.assertTrue(SW_PATH.exists(), "sw.js must exist at repository root")
        content = SW_PATH.read_text(encoding="utf-8")

        # Extract PRECACHE_ASSETS array items
        match = re.search(r"const PRECACHE_ASSETS = \[(.*?)\];", content, re.DOTALL)
        self.assertIsNotNone(match, "Could not find PRECACHE_ASSETS in sw.js")

        assets_block = match.group(1)
        asset_paths = re.findall(r'"([^"]+)"', assets_block)

        self.assertGreater(len(asset_paths), 195, f"Expected >195 precached assets, found {len(asset_paths)}")

        missing = []
        for asset in asset_paths:
            if asset in (".", "./", "/"):
                continue
            file_path = REPO_ROOT / asset
            if not file_path.exists():
                missing.append(asset)

        self.assertEqual(missing, [], f"The following precached assets do not exist on disk: {missing}")

    def test_service_worker_precaches_all_situation_images(self) -> None:
        """Validates that sw.js PRECACHE_ASSETS includes all 20 situation photos."""
        content = SW_PATH.read_text(encoding="utf-8")
        match = re.search(r"const PRECACHE_ASSETS = \[(.*?)\];", content, re.DOTALL)
        self.assertIsNotNone(match, "Could not find PRECACHE_ASSETS in sw.js")
        asset_paths = set(re.findall(r'"([^"]+)"', match.group(1)))
        situations_dir = REPO_ROOT / "assets" / "situations"
        if situations_dir.exists():
            for sit_file in situations_dir.glob("*.jpg"):
                rel = f"assets/situations/{sit_file.name}"
                self.assertIn(rel, asset_paths, f"Situation image {rel} missing from sw.js PRECACHE_ASSETS")

    def test_index_html_contains_pwa_metadata_and_ui_elements(self) -> None:
        """Validates that index.html links to manifest, apple-touch-icon, and defines UI elements."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('rel="manifest"', html, "index.html must link to manifest")
        self.assertIn('name="theme-color"', html, "index.html must declare theme-color")
        self.assertIn('rel="apple-touch-icon"', html, "index.html must link to apple-touch-icon")
        self.assertIn('id="offline-indicator"', html, "index.html must include offline-indicator")
        self.assertIn('id="btn-install"', html, "index.html must include btn-install")


if __name__ == "__main__":
    unittest.main()

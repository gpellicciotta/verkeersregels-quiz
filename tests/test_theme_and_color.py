import os
import re
import unittest

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class TestThemeAndColor(unittest.TestCase):
    """Automated unit tests for dark theme and theme-color customization."""

    def setUp(self):
        self.html_path = os.path.join(PROJECT_ROOT, "index.html")
        self.css_path = os.path.join(PROJECT_ROOT, "css", "style.css")
        self.js_dir = os.path.join(PROJECT_ROOT, "js")

        with open(self.html_path, "r", encoding="utf-8") as f:
            self.html_content = f.read()

        with open(self.css_path, "r", encoding="utf-8") as f:
            self.css_content = f.read()

        js_parts = []
        for name in sorted(os.listdir(self.js_dir)):
            if name.endswith(".js"):
                with open(os.path.join(self.js_dir, name), "r", encoding="utf-8") as f:
                    js_parts.append(f.read())
        self.js_content = "\n".join(js_parts)

    def test_html_contains_early_theme_init_script(self):
        """Validates that index.html contains an early theme initialization script in head."""
        self.assertIn("data-theme", self.html_content)
        self.assertIn("data-theme-setting", self.html_content)
        self.assertIn("data-theme-color", self.html_content)
        self.assertIn("prefers-color-scheme", self.html_content)

    def test_js_app_defines_theme_functions(self):
        """Validates that app.js implements getThemeParam, getThemeColorParam, applyTheme, and initTheme."""
        self.assertIn("function getThemeParam()", self.js_content)
        self.assertIn("function getThemeColorParam()", self.js_content)
        self.assertIn("function applyTheme(", self.js_content)
        self.assertIn("function initTheme()", self.js_content)

    def test_js_app_exports_theme_functions(self):
        """Validates that theme helper functions are exposed on window object."""
        self.assertIn("window.getThemeParam = getThemeParam", self.js_content)
        self.assertIn("window.getThemeColorParam = getThemeColorParam", self.js_content)
        self.assertIn("window.applyTheme = applyTheme", self.js_content)
        self.assertIn("window.initTheme = initTheme", self.js_content)

    def test_js_theme_color_aliases(self):
        """Validates that getThemeColorParam supports yellow/geel, red/rood, and blue/blauw aliases."""
        self.assertIn('"yellow"', self.js_content)
        self.assertIn('"geel"', self.js_content)
        self.assertIn('"red"', self.js_content)
        self.assertIn('"rood"', self.js_content)
        self.assertIn('"blue"', self.js_content)
        self.assertIn('"blauw"', self.js_content)

    def test_css_defines_theme_variables_and_dark_mode(self):
        """Validates that style.css defines root tokens, theme-color variations, and dark theme tokens."""
        self.assertIn(':root[data-theme-color="yellow"]', self.css_content)
        self.assertIn(':root[data-theme-color="red"]', self.css_content)
        self.assertIn(':root[data-theme="dark"]', self.css_content)
        self.assertIn(':root[data-theme="dark"][data-theme-color="yellow"]', self.css_content)
        self.assertIn(':root[data-theme="dark"][data-theme-color="red"]', self.css_content)

    def test_css_action_buttons_and_links_use_theme_variables(self):
        """Validates that action buttons, external links, version badges, and progress bars use CSS variables."""
        self.assertIn("var(--color-primary)", self.css_content)
        self.assertIn("var(--color-primary-dark)", self.css_content)
        self.assertIn("var(--color-primary-tint)", self.css_content)
        self.assertIn("var(--color-primary-border)", self.css_content)
        self.assertIn("var(--color-primary-text)", self.css_content)


if __name__ == "__main__":
    unittest.main()

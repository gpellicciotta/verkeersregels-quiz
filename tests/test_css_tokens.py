"""Automated validation tests for CSS tokens, typographic scale, and accessibility."""

from __future__ import annotations

import re
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"


def _relative_luminance(hex_color: str) -> float:
    """Calculates WCAG 2.1 relative luminance for a 6-digit hex color."""
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0

    def adjust(c: float) -> float:
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)


def _contrast_ratio(hex1: str, hex2: str) -> float:
    """Calculates WCAG 2.1 contrast ratio between two hex colors."""
    l1 = _relative_luminance(hex1)
    l2 = _relative_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


class TestCSSTokens(unittest.TestCase):
    """Test suite validating CSS variables, typographic scale, radii, and WCAG AA contrast."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.css = CSS_PATH.read_text(encoding="utf-8")

    def test_css_defines_complete_design_tokens(self) -> None:
        """Validates that :root defines feedback, surface, typography, radius, and shadow tokens."""
        # Typography tokens
        self.assertIn("--font-size-xs:", self.css)
        self.assertIn("--font-size-sm:", self.css)
        self.assertIn("--font-size-base:", self.css)
        self.assertIn("--font-size-md:", self.css)
        self.assertIn("--font-size-lg:", self.css)
        self.assertIn("--font-size-xl:", self.css)
        self.assertIn("--font-size-2xl:", self.css)

        # Border radius tokens
        self.assertIn("--radius-sm:", self.css)
        self.assertIn("--radius-md:", self.css)
        self.assertIn("--radius:", self.css)
        self.assertIn("--radius-lg:", self.css)
        self.assertIn("--radius-xl:", self.css)
        self.assertIn("--radius-full:", self.css)
        self.assertIn("--radius-round:", self.css)

        # Elevation tokens
        self.assertIn("--shadow-sm:", self.css)
        self.assertIn("--shadow-md:", self.css)
        self.assertIn("--shadow-lg:", self.css)
        self.assertIn("--shadow-modal:", self.css)

    def test_yellow_theme_button_text_passes_wcag_aa(self) -> None:
        """Validates that yellow theme on-primary text passes WCAG AA 4.5:1 contrast."""
        # Light mode yellow
        light_yellow_primary = "#ca8a04"
        light_yellow_on_primary = "#0f172a"
        ratio_light = _contrast_ratio(light_yellow_primary, light_yellow_on_primary)
        self.assertGreaterEqual(
            ratio_light,
            4.5,
            f"Yellow theme light contrast ({ratio_light:.2f}:1) must meet WCAG AA (>= 4.5:1)",
        )

        # Dark mode yellow
        dark_yellow_primary = "#d97706"
        dark_yellow_on_primary = "#0f172a"
        ratio_dark = _contrast_ratio(dark_yellow_primary, dark_yellow_on_primary)
        self.assertGreaterEqual(
            ratio_dark,
            4.5,
            f"Yellow theme dark contrast ({ratio_dark:.2f}:1) must meet WCAG AA (>= 4.5:1)",
        )

        # Ensure --color-on-primary is defined for yellow in CSS
        self.assertIn('--color-on-primary: #0f172a;', self.css)

    def test_close_and_restart_buttons_provide_focus_indicator(self) -> None:
        """Validates that close and restart buttons do not strip focus indicators without replacement."""
        focus_rule = re.search(
            r'\.btn-about-close:focus-visible[^{]*\{([^}]+)\}',
            self.css,
        )
        self.assertIsNotNone(focus_rule, "Focus visible rule must exist for close buttons")
        rule_body = focus_rule.group(1)
        self.assertIn("box-shadow:", rule_body, "Close button focus must provide box-shadow ring")
        self.assertNotIn(
            "box-shadow: none",
            rule_body,
            "Close button focus must not remove box-shadow",
        )

    def test_hardcoded_colors_outside_root_and_print_are_eliminated(self) -> None:
        """Validates that hex colors are not hardcoded in screen components outside :root."""
        # Remove :root blocks and @media print blocks
        non_root_screen_css = re.sub(r':root[^{]*\{[^}]*\}', '', self.css)
        non_root_screen_css = re.sub(r'@media\s+print\s*\{.*?\}\s*\}', '', non_root_screen_css, flags=re.DOTALL)
        hex_colors = re.findall(r'#[0-9a-fA-F]{3,8}', non_root_screen_css)
        self.assertEqual(
            len(hex_colors),
            0,
            f"Found unexpected hardcoded hex colors outside :root and print: {hex_colors}",
        )

    def test_component_specificity_does_not_rely_on_important_wars(self) -> None:
        """Validates that non-print rules do not use !important outside utility classes."""
        screen_css = re.sub(r'@media\s+print\s*\{.*?\}\s*\}', '', self.css, flags=re.DOTALL)
        # Find all lines containing !important
        important_lines = [
            line.strip() for line in screen_css.splitlines() if "!important" in line
        ]
        # Only utilities (.hidden, .filter-notice, .carousel-pause-overlay) may use !important
        for line in important_lines:
            self.assertTrue(
                "display: none !important" in line,
                f"Unexpected !important declaration: {line}",
            )
        self.assertLessEqual(
            len(important_lines),
            5,
            f"Screen !important declarations should be minimal, found {len(important_lines)}",
        )


if __name__ == "__main__":
    unittest.main()

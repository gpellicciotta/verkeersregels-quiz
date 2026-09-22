"""Automated tests for the unified settings dialog (general, quiz, and carousel sections)."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
JS_DIR = WORKTREE_ROOT / "js"
INDEX_PATH = WORKTREE_ROOT / "index.html"


def _read_js() -> str:
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))


class TestUnifiedSettings(unittest.TestCase):
    """Test suite validating that one settings dialog covers general, quiz, and carousel settings."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.html = INDEX_PATH.read_text(encoding="utf-8")
        cls.js_code = _read_js()

    def test_modal_no_longer_toggles_sections_by_mode(self) -> None:
        """Validates that openConfigModal/saveConfig no longer hide sections based on currentMode."""
        self.assertNotIn('isCarousel = state.currentMode === "carousel"', self.js_code)
        self.assertNotIn("configSectionQuiz.classList.toggle(\"hidden\"", self.js_code)
        self.assertNotIn("configSectionCarousel.classList.toggle(\"hidden\"", self.js_code)

    def test_all_three_sections_present_and_unconditionally_visible(self) -> None:
        """Validates the dialog defines general/quiz/carousel sections, none hidden by default."""
        self.assertIn('id="config-section-general" class="config-section"', self.html)
        self.assertIn('id="config-section-quiz" class="config-section"', self.html)
        self.assertIn('id="config-section-carousel" class="config-section"', self.html)

    def test_general_fields_populated_from_live_state_on_open(self) -> None:
        """Validates that openConfigModal prefills name, language, theme, and theme-color."""
        self.assertIn("el.configName.value = state.playerName", self.js_code)
        self.assertIn("el.configLanguage.value = getLang();", self.js_code)
        self.assertIn('el.configTheme.value = document.documentElement.getAttribute("data-theme-setting")', self.js_code)
        self.assertIn('el.configThemeColor.value = document.documentElement.getAttribute("data-theme-color")', self.js_code)

    def test_save_config_writes_all_sections_regardless_of_mode(self) -> None:
        """Validates saveConfig always persists general, quiz, and carousel fields (no mode branch)."""
        self.assertIn("state.playerName = name;", self.js_code)
        self.assertIn("carouselState.delayMs = sec * 1000;", self.js_code)
        self.assertIn('state.configCount = val === "all" ? "all" : parseInt(val, 10);', self.js_code)

    def test_language_select_offers_all_supported_languages(self) -> None:
        """Validates the language select lists nl, fr, de, it, en options."""
        self.assertIn('id="config-language"', self.html)
        for value in ('value="nl"', 'value="fr"', 'value="de"', 'value="it"', 'value="en"'):
            self.assertIn(value, self.html)

    def test_theme_and_color_selects_offer_all_options(self) -> None:
        """Validates the theme select offers system/light/dark and color select offers blue/yellow/red."""
        self.assertIn('id="config-theme"', self.html)
        self.assertIn('value="system"', self.html)
        self.assertIn('value="light"', self.html)
        self.assertIn('value="dark"', self.html)
        self.assertIn('id="config-theme-color"', self.html)
        self.assertIn('value="blue"', self.html)
        self.assertIn('value="yellow"', self.html)
        self.assertIn('value="red"', self.html)

    def test_btn_lang_toggle_still_present(self) -> None:
        """Validates the standalone language toggle button is kept alongside the settings dialog."""
        self.assertIn('id="btn-lang"', self.html)
        self.assertIn('el.btnLang.addEventListener("click"', self.js_code)

    def test_early_theme_script_reads_stored_preferences(self) -> None:
        """Validates the pre-paint inline theme script falls back to localStorage before defaulting."""
        self.assertIn('localStorage.getItem("verkeersquiz_preferences")', self.html)
        self.assertIn("stored.theme || \"system\"", self.html)
        self.assertIn("stored.themeColor || \"blue\"", self.html)


if __name__ == "__main__":
    unittest.main()

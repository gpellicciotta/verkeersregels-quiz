"""Automated tests for minimal start screen, mode switch, and configuration modals."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = WORKTREE_ROOT / "index.html"
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"
JS_DIR = WORKTREE_ROOT / "js"


def _read_js() -> str:
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))


class TestMinimalStartScreen(unittest.TestCase):
    """Test suite validating minimal start screen layout, five circle buttons, and configuration modal."""

    def test_start_screen_elements_and_order(self) -> None:
        """Validates that start screen defines only title, description, inline row, divider, 5 buttons, and copyright."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        # 1. Heading line at top
        self.assertIn('id="start-title"', html, "index.html must define start-title")
        self.assertIn('class="start-title"', html, "index.html must define start-title class")

        # 2. Short explanation sentence (without "20")
        self.assertIn('id="start-desc"', html, "index.html must define start-desc")
        self.assertIn('class="start-desc"', html, "index.html must define start-desc class")
        self.assertNotIn('met 20 vragen', html, "start-desc must not hardcode 20 questions")

        # 3. Action row: player name + arrow start button on 1 line
        self.assertIn('class="start-action-row"', html, "index.html must define start-action-row")
        self.assertIn('id="quiz-start-fields"', html, "index.html must define quiz-start-fields")
        self.assertIn('id="player-name"', html, "index.html must define player-name input")
        self.assertIn('id="btn-start"', html, "index.html must define btn-start button")
        self.assertIn('btn-start-arrow', html, "btn-start must have btn-start-arrow class")

        # 4. Subtle line
        self.assertIn('class="start-divider"', html, "index.html must define start-divider")

        # 5. Circle buttons: actions on left, info on right, install button in action group
        self.assertIn('id="btn-mode-toggle"', html, "index.html must define btn-mode-toggle")
        self.assertIn('id="btn-config"', html, "index.html must define btn-config")
        self.assertIn('id="btn-about"', html, "index.html must define btn-about")
        self.assertIn('id="btn-install"', html, "index.html must define btn-install")
        self.assertIn('start-meta-btn-action', html, "Action circle buttons must have start-meta-btn-action")
        self.assertIn('start-meta-actions', html, "index.html must define start-meta-actions group")
        self.assertIn('start-meta-info', html, "index.html must define start-meta-info group")

        # 6. Subtle copyright
        self.assertIn('class="start-copyright"', html, "index.html must define start-copyright")
        self.assertIn('Giovanni Pellicciotta', html, "Copyright must credit Giovanni Pellicciotta")

    def test_config_view_structure_and_options(self) -> None:
        """Validates unified settings view markup for general, quiz, and carousel settings."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('id="screen-config"', html, "index.html must define the screen-config view")
        self.assertIn('id="config-title"', html, "index.html must define config-title")
        self.assertIn('>Instellingen<', html, "config-title must be 'Instellingen'")
        self.assertIn('id="btn-config-close"', html, "index.html must define btn-config-close")
        self.assertIn('id="btn-config-save"', html, "index.html must define btn-config-save")

        # General settings
        self.assertIn('id="config-section-general"', html, "index.html must define config-section-general")
        self.assertIn('id="config-name"', html, "index.html must define config-name")
        self.assertIn('id="config-language"', html, "index.html must define config-language")
        self.assertIn('id="config-theme"', html, "index.html must define config-theme")
        self.assertIn('id="config-theme-color"', html, "index.html must define config-theme-color")

        # Quiz settings
        self.assertIn('id="config-section-quiz"', html, "index.html must define config-section-quiz")
        self.assertIn('id="config-quiz-count"', html, "index.html must define config-quiz-count")
        self.assertIn('value="5"', html, "config-quiz-count must offer 5 questions option")
        self.assertIn('10 vragen', html, "config-quiz-count must label 10 questions as '10 vragen'")
        self.assertNotIn('10 oefenvragen', html, "config-quiz-count must not use '10 oefenvragen'")
        self.assertIn('value="50"', html, "config-quiz-count must offer 50 questions option")

        self.assertIn('id="config-quiz-type"', html, "index.html must define config-quiz-type")
        self.assertIn('Enkel verkeerssituaties', html, "Type options must prefix with 'Enkel '")
        self.assertIn('Enkel verkeersregels', html, "Type options must prefix with 'Enkel '")

        self.assertIn('id="config-quiz-since"', html, "index.html must define config-quiz-since")
        self.assertIn('Ouderdom van de regels', html, "Since label must be 'Ouderdom van de regels'")
        self.assertIn('Maakt niet uit', html, "Since options must include 'Maakt niet uit'")
        self.assertIn('Enkel ingevoerd na 2021', html, "Since options must include >= 10 questions options like 2021")
        self.assertNotIn('Enkel ingevoerd na 2025', html, "Since options must exclude < 10 questions options like 2025")
        self.assertNotIn('Enkel ingevoerd na 2022', html, "Since options must exclude < 10 questions options like 2022")
        self.assertIn('id="config-quiz-count-warning"', html, "index.html must define config-quiz-count-warning")

        # Carousel settings
        self.assertIn('id="config-section-carousel"', html, "index.html must define config-section-carousel")
        self.assertIn('id="carousel-delay-select"', html, "index.html must define carousel-delay-select")
        self.assertIn('id="config-carousel-since"', html, "index.html must define config-carousel-since")
        self.assertIn('Welke borden tonen', html, "Carousel since label must be 'Welke borden tonen'")
        self.assertIn('Alle 198 verkeersborden', html, "First carousel since option must be 'Alle 198 verkeersborden'")
        self.assertIn('Borden ingevoerd/gewijzigd vanaf 1990', html, "Carousel options must include 1990")
        self.assertIn('Borden ingevoerd/gewijzigd vanaf 2000', html, "Carousel options must include 2000")
        self.assertIn('Borden ingevoerd/gewijzigd vanaf 2010', html, "Carousel options must include 2010")

    def test_css_contains_minimal_start_and_config_styles(self) -> None:
        """Validates CSS rules for inline action row, arrow start button, 5 buttons, and config modal."""
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn(".start-action-row", css, "style.css must define .start-action-row")
        self.assertIn(".player-name-input", css, "style.css must define .player-name-input")
        self.assertIn(".btn-start-arrow", css, "style.css must define .btn-start-arrow")
        self.assertIn(".start-meta-btn", css, "style.css must define .start-meta-btn")
        self.assertIn(".start-meta-btn-action", css, "style.css must define .start-meta-btn-action")
        self.assertIn("#screen-config", css, "style.css must define #screen-config styles")
        self.assertIn(".config-header", css, "style.css must define .config-header")
        self.assertIn(".config-content", css, "style.css must define .config-content")
        self.assertIn(".config-field", css, "style.css must define .config-field")
        self.assertIn(".config-field-warning", css, "style.css must define .config-field-warning")
        self.assertIn(".config-label", css, "style.css must define .config-label")
        self.assertIn(".config-select", css, "style.css must define .config-select")
        self.assertIn(".config-section-title", css, "style.css must define .config-section-title")
        self.assertIn(".config-input", css, "style.css must define .config-input")
        self.assertIn(".config-actions", css, "style.css must define .config-actions")

    def test_carousel_and_result_round_buttons(self) -> None:
        """Validates close x buttons in about/carousel/result and centered controls and progress."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")
        css = CSS_PATH.read_text(encoding="utf-8")

        # About close x button
        self.assertIn('btn-about-close', html, "index.html must define btn-about-close")
        self.assertIn('.btn-about-close', css, "style.css must style .btn-about-close")

        # Carousel header, controls, close x and progress wrap
        self.assertIn('btn-carousel-close', html, "index.html must define btn-carousel-close")
        self.assertIn('.btn-carousel-close', css, "style.css must style .btn-carousel-close")
        self.assertIn('.btn-carousel-ctrl', css, "style.css must style .btn-carousel-ctrl")
        self.assertIn('.carousel-progress-wrap', css, "style.css must style .carousel-progress-wrap")
        self.assertIn('.carousel-bottom-meta', css, "style.css must style .carousel-bottom-meta")
        self.assertIn('.carousel-divider', css, "style.css must style .carousel-divider")

        # Bottom alignment for quiz and carousel meta
        self.assertIn('#screen-quiz', css, "style.css must define #screen-quiz flex rules")
        self.assertIn('#screen-carousel', css, "style.css must define #screen-carousel flex rules")

        # Quiz results title, spacer and buttons
        self.assertIn('Quiz Resultaat', html, "Result title must be 'Quiz Resultaat'")
        self.assertIn('result-header-spacer', html, "Result header must include spacer for centering")
        self.assertIn('result-btn-round', html, "index.html must define result-btn-round")
        self.assertIn('result-btn-close', html, "index.html must define result-btn-close")
        self.assertIn('.result-btn-round', css, "style.css must style .result-btn-round")
        self.assertIn('.result-btn-close', css, "style.css must style .result-btn-close")

        # Desktop quiz bottom report button
        self.assertIn('quiz-bottom-meta', html, "index.html must define quiz-bottom-meta")
        self.assertIn('quiz-btn-report-round', html, "index.html must define quiz-btn-report-round")
        self.assertIn('.quiz-btn-report-round', css, "style.css must style .quiz-btn-report-round")

    def test_js_app_implements_mode_toggle_and_config_view(self) -> None:
        """Validates JS logic for mode toggling, default 8s delay, carousel since filtering, and settings view."""
        self.assertTrue(JS_DIR.exists(), "js directory must exist")
        js = _read_js()

        self.assertIn("btnModeToggle", js, "dom.js must register btnModeToggle")
        self.assertIn("btnConfig", js, "dom.js must register btnConfig")
        self.assertIn("screenConfig", js, "dom.js must register screenConfig")
        self.assertIn("openConfigView", js, "config-view.js must define openConfigView")
        self.assertIn("closeConfigView", js, "config-view.js must define closeConfigView")
        self.assertIn("saveConfig", js, "config-view.js must define saveConfig")
        self.assertIn("updateConfigQuizWarning", js, "config-view.js must define updateConfigQuizWarning")
        self.assertIn("configQuizCountWarning", js, "dom.js must register configQuizCountWarning")
        self.assertIn("setStartMode", js, "ui-mode.js must define setStartMode")
        self.assertIn("delayMs: 8000", js, "state.js must default carousel delay to 8000ms")
        self.assertIn("carouselState.filterSince", js, "carousel.js must support filtering carousel by since year")
        self.assertIn("el.btnNext.focus()", js, "quiz.js must focus next button upon answer selection")
        self.assertIn("el.btnCarouselToggle.focus()", js, "carousel.js must focus carousel toggle button for keyboard enter")


if __name__ == "__main__":
    unittest.main()


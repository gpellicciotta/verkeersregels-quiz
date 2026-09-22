"""Automated tests for cleaned-up start screen and dedicated full-window About view."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = WORKTREE_ROOT / "index.html"
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"
JS_DIR = WORKTREE_ROOT / "js"


def _read_js() -> str:
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted(JS_DIR.glob("*.js")))


class TestAboutView(unittest.TestCase):
    """Test suite validating start screen cleanliness, metadata hint row, and About view."""

    def test_start_screen_clean_layout(self) -> None:
        """Validates that index.html defines the centered title, mode cards, hint icons, and copyright."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        # Centered title
        self.assertIn('class="start-title"', html, "index.html must define start-title")
        self.assertIn('Verkeersregels Quiz', html, "index.html must contain quiz title")

        # Inline action row with name input and arrow start button
        self.assertIn('class="start-action-row"', html, "index.html must define start-action-row")
        self.assertIn('id="player-name"', html, "index.html must define player-name input")
        self.assertIn('btn-start-arrow', html, "index.html must define btn-start-arrow")

        # Five circle buttons in start meta bar
        self.assertIn('id="btn-mode-toggle"', html, "index.html must define mode switch button")
        self.assertIn('id="btn-config"', html, "index.html must define configuration button")

        # Start and install buttons
        self.assertIn('id="btn-start"', html, "index.html must define btn-start")
        self.assertIn('id="btn-install"', html, "index.html must define btn-install")
        self.assertIn('class="start-divider"', html, "index.html must define subtle divider line")

        # Meta bar: 1 hint icon (law article) + 1 real report button + 1 Info/About button, all with tooltips
        self.assertIn('class="start-meta-bar"', html, "index.html must define start-meta-bar")
        self.assertIn('class="start-meta-item start-meta-hint"', html, "index.html must define the law article hint icon")
        self.assertIn('id="btn-report-start"', html, "index.html must define the real report button on the start screen")
        self.assertIn('id="btn-about"', html, "index.html must define btn-about")
        self.assertIn('data-tooltip="Bij elke vraag', html, "External link hint must provide tooltip")
        self.assertIn('data-tooltip="Meld fout"', html, "Report button must provide tooltip")
        self.assertIn('data-tooltip="Over deze app', html, "About button must provide tooltip")

        # Copyright notice
        self.assertIn('class="start-copyright"', html, "index.html must define start-copyright")
        self.assertIn('Giovanni Pellicciotta', html, "Copyright notice must credit Giovanni Pellicciotta")

    def test_screen_about_markup_and_content(self) -> None:
        """Validates that index.html defines the full-window screen-about section and its components."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('id="screen-about"', html, "index.html must define screen-about section")
        self.assertIn('id="btn-about-back"', html, "index.html must define btn-about-back button")
        self.assertIn('id="about-version-tag"', html, "index.html must define about-version-tag")
        self.assertIn('id="about-changelog-body"', html, "index.html must define about-changelog-body")
        self.assertIn('class="about-sources-card"', html, "index.html must define about-sources-card")
        self.assertIn('Belgische Wegcode', html, "About screen must reference Belgische Wegcode")
        self.assertIn('Overzicht wetswijzigingen', html, "About screen must reference wetswijzigingen")
        self.assertIn('Wikimedia Commons', html, "About screen must reference Wikimedia Commons")
        self.assertIn('class="about-copyright"', html, "About screen must define about-copyright")

        # Sources card must be presented before version history card
        sources_pos = html.index('class="about-sources-card"')
        version_pos = html.index('class="about-version-card"')
        self.assertLess(sources_pos, version_pos, "Gebruikte bronnen card must precede Versiegeschiedenis card")

    def test_css_contains_about_and_start_meta_styles(self) -> None:
        """Validates that style.css defines layout rules for the start meta row, tooltips, and About view."""
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn(".start-title", css, "style.css must define .start-title")
        self.assertIn(".start-bottom-meta", css, "style.css must define .start-bottom-meta")
        self.assertIn(".start-divider", css, "style.css must define .start-divider")
        self.assertIn(".start-meta-bar", css, "style.css must define .start-meta-bar")
        self.assertIn(".start-meta-item", css, "style.css must define .start-meta-item")
        self.assertIn("[data-tooltip]::after", css, "style.css must define tooltip bubble styles")
        self.assertIn("[data-tooltip]::before", css, "style.css must define tooltip arrow styles")
        self.assertIn("#screen-about", css, "style.css must define #screen-about styles")
        self.assertIn(".about-header", css, "style.css must define .about-header")
        self.assertIn(".btn-about-back", css, "style.css must define .btn-about-back")
        self.assertIn(".about-changelog-body", css, "style.css must define .about-changelog-body")

    def test_js_app_implements_about_screen_navigation(self) -> None:
        """Validates that the JS modules manage screen-about lifecycle and event listeners."""
        self.assertTrue(JS_DIR.exists(), "js directory must exist")
        js = _read_js()

        self.assertIn('screenAbout: document.getElementById("screen-about")', js, "dom.js must register screenAbout")
        self.assertIn('btnAbout: document.getElementById("btn-about")', js, "dom.js must register btnAbout")
        self.assertIn('btnAboutBack: document.getElementById("btn-about-back")', js, "dom.js must register btnAboutBack")
        self.assertIn('aboutChangelogBody: document.getElementById("about-changelog-body")', js, "dom.js must register aboutChangelogBody")
        self.assertIn('aboutVersionTag: document.getElementById("about-version-tag")', js, "dom.js must register aboutVersionTag")
        self.assertIn('quizModeDesc: document.getElementById("quiz-mode-desc")', js, "dom.js must register quizModeDesc")
        self.assertIn('el.quizModeDesc.textContent =', js, "quiz.js must update quizModeDesc dynamically")
        self.assertIn('showScreen("about")', js, "app.js must support showing about screen")
        self.assertIn('showScreen("start")', js, "app.js must support returning to start screen")


if __name__ == "__main__":
    unittest.main()

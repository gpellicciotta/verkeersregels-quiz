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

        # Meta bar: circle action buttons in order: mode, config, lang, report, stats, about (help ?)
        self.assertIn('class="start-meta-bar"', html, "index.html must define start-meta-bar")
        self.assertIn('id="btn-report-start"', html, "index.html must define the real report button on the start screen")
        self.assertIn('id="btn-stats"', html, "index.html must define btn-stats")
        self.assertIn('id="btn-about"', html, "index.html must define btn-about")
        self.assertIn('data-icon="help"', html, "btn-about must use the help ? icon")
        self.assertIn('data-tooltip="Meld fout"', html, "Report button must provide tooltip")
        self.assertIn('data-tooltip="Over deze app', html, "About button must provide tooltip")

        # Buttons order verification in start-meta-actions
        pos_mode = html.index('id="btn-mode-toggle"')
        pos_config = html.index('id="btn-config"')
        pos_lang = html.index('id="btn-lang"')
        pos_report = html.index('id="btn-report-start"')
        pos_stats = html.index('id="btn-stats"')
        pos_about = html.index('id="btn-about"')
        self.assertLess(pos_mode, pos_config, "mode button must precede config button")
        self.assertLess(pos_config, pos_lang, "config button must precede language button")
        self.assertLess(pos_lang, pos_report, "language button must precede report button")
        self.assertLess(pos_report, pos_stats, "report button must precede stats button")
        self.assertLess(pos_stats, pos_about, "stats button must precede about/help button")

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
        self.assertIn('class="about-icons-card"', html, "index.html must define about-icons-card")
        self.assertIn('class="about-sources-card"', html, "index.html must define about-sources-card")
        self.assertIn('class="about-support-card"', html, "index.html must define about-support-card")
        self.assertIn('id="about-support-github"', html, "About screen must define GitHub sponsor link")
        self.assertIn('id="about-support-donate"', html, "About screen must define donation link")
        self.assertIn('https://github.com/sponsors/gpellicciotta', html, "About screen must link to GitHub Sponsors")
        self.assertIn('Belgische Wegcode', html, "About screen must reference Belgische Wegcode")
        self.assertIn('Overzicht wetswijzigingen', html, "About screen must reference wetswijzigingen")
        self.assertIn('Wikimedia Commons', html, "About screen must reference Wikimedia Commons")
        self.assertIn('class="about-copyright"', html, "About screen must define about-copyright")

        # Icons card must be presented first, then sources, then support, then version history
        icons_pos = html.index('class="about-icons-card"')
        sources_pos = html.index('class="about-sources-card"')
        support_pos = html.index('class="about-support-card"')
        version_pos = html.index('class="about-version-card"')
        self.assertLess(icons_pos, sources_pos, "Iconen & Symbolen card must precede Gebruikte bronnen card")
        self.assertLess(sources_pos, support_pos, "Gebruikte bronnen card must precede Project ondersteunen card")
        self.assertLess(support_pos, version_pos, "Project ondersteunen card must precede Versiegeschiedenis card")

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
        self.assertIn("@media (hover: hover) and (pointer: fine)", css, "style.css must restrict hover tooltips to non-touch devices")
        self.assertIn("#screen-about", css, "style.css must define #screen-about styles")
        self.assertIn(".about-header", css, "style.css must define .about-header")
        self.assertIn(".btn-about-back", css, "style.css must define .btn-about-back")
        self.assertIn(".about-icons-card", css, "style.css must define .about-icons-card")
        self.assertIn(".about-support-card", css, "style.css must define .about-support-card")
        self.assertIn(".about-support-link", css, "style.css must define .about-support-link")
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
        self.assertIn('showScreen("about")', js, "app.js must support showing about screen")
        self.assertIn('showScreen("start")', js, "app.js must support returning to start screen")


if __name__ == "__main__":
    unittest.main()

"""Automated tests for traffic sign carousel mode with configurable delay and pause controls."""

from __future__ import annotations

import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = WORKTREE_ROOT / "index.html"
CSS_PATH = WORKTREE_ROOT / "css" / "style.css"
JS_PATH = WORKTREE_ROOT / "js" / "app.js"


class TestSignCarousel(unittest.TestCase):
    """Test suite validating sign carousel DOM structure, styling, and lifecycle logic."""

    def test_index_html_contains_carousel_markup(self) -> None:
        """Validates that index.html defines the carousel screen, stage, controls, and start link."""
        self.assertTrue(INDEX_PATH.exists(), "index.html must exist")
        html = INDEX_PATH.read_text(encoding="utf-8")

        self.assertIn('id="screen-carousel"', html, "index.html must define screen-carousel section")
        self.assertIn('id="carousel-stage"', html, "index.html must define carousel-stage container")
        self.assertIn('id="carousel-pause-overlay"', html, "index.html must define carousel-pause-overlay")
        self.assertIn('class="carousel-pause-banner"', html, "index.html must define carousel-pause-banner")
        self.assertIn('class="carousel-pause-badge"', html, "index.html must define carousel-pause-badge")
        self.assertIn('id="carousel-sign-img"', html, "index.html must define carousel-sign-img")
        self.assertIn('id="carousel-sign-title"', html, "index.html must define carousel-sign-title")
        self.assertIn('id="carousel-explanation"', html, "index.html must define carousel-explanation")
        self.assertIn('id="carousel-source-link"', html, "index.html must define carousel-source-link")
        self.assertIn('id="carousel-counter"', html, "index.html must define carousel-counter")
        self.assertIn('id="carousel-progress-fill"', html, "index.html must define carousel-progress-fill")
        self.assertIn('id="btn-carousel-prev"', html, "index.html must define btn-carousel-prev")
        self.assertIn('id="btn-carousel-toggle"', html, "index.html must define btn-carousel-toggle")
        self.assertIn('id="btn-carousel-next"', html, "index.html must define btn-carousel-next")
        self.assertIn('id="btn-carousel-exit"', html, "index.html must define btn-carousel-exit")
        self.assertIn('id="carousel-delay-info"', html, "index.html must define carousel-delay-info")
        self.assertIn('id="radio-mode-quiz"', html, "index.html must define radio-mode-quiz option")
        self.assertIn('id="radio-mode-carousel"', html, "index.html must define radio-mode-carousel option")
        self.assertIn('id="carousel-delay-select"', html, "index.html must define carousel-delay-select")

    def test_css_contains_carousel_styling_and_responsive_rules(self) -> None:
        """Validates that style.css defines carousel card layout, pause overlay, and progress bar."""
        self.assertTrue(CSS_PATH.exists(), "style.css must exist")
        css = CSS_PATH.read_text(encoding="utf-8")

        self.assertIn("#screen-carousel", css, "style.css must style #screen-carousel")
        self.assertIn(".carousel-stage", css, "style.css must style .carousel-stage")
        self.assertIn(".carousel-pause-overlay", css, "style.css must style .carousel-pause-overlay")
        self.assertIn(".carousel-pause-banner", css, "style.css must style .carousel-pause-banner")
        self.assertIn(".carousel-pause-badge", css, "style.css must style .carousel-pause-badge")
        self.assertIn(".carousel-progress-track", css, "style.css must style .carousel-progress-track")
        self.assertIn(".carousel-progress-fill", css, "style.css must style .carousel-progress-fill")
        self.assertIn(".btn-carousel-toggle.is-paused", css, "style.css must style paused toggle button")
        self.assertIn(".carousel-card-body", css, "style.css must define carousel-card-body layout")
        self.assertIn(".start-mode-selector", css, "style.css must define start-mode-selector layout")
        self.assertIn(".start-mode-card", css, "style.css must define start-mode-card styling")
        self.assertIn(".carousel-delay-select", css, "style.css must define carousel-delay-select styling")

    def test_js_app_implements_carousel_lifecycle_and_controls(self) -> None:
        """Validates that app.js implements query parsing, interval cycling, pause/resume, and keys."""
        self.assertTrue(JS_PATH.exists(), "app.js must exist")
        js = JS_PATH.read_text(encoding="utf-8")

        self.assertIn("getCarouselParams", js, "app.js must define getCarouselParams function")
        self.assertIn("sign-carrousel", js, "app.js must support sign-carrousel Dutch query parameter")
        self.assertIn("sign-carousel", js, "app.js must support sign-carousel English query parameter")
        self.assertIn('params.get("delay") || params.get("d")', js, "app.js must support d=N alias for delay")
        self.assertIn('=== "quiz"', js, "app.js must support mode=quiz parameter")
        self.assertIn("setStartMode", js, "app.js must define setStartMode function")
        self.assertIn("radioModeCarousel", js, "app.js must support start screen mode switching")
        self.assertIn("startCarousel", js, "app.js must define startCarousel lifecycle function")
        self.assertIn("stopCarousel", js, "app.js must define stopCarousel function")
        self.assertIn("toggleCarouselPause", js, "app.js must define toggleCarouselPause function")
        self.assertIn("nextCarouselSign", js, "app.js must define nextCarouselSign navigation")
        self.assertIn("prevCarouselSign", js, "app.js must define prevCarouselSign navigation")
        self.assertIn("renderCarouselCard", js, "app.js must define renderCarouselCard renderer")
        self.assertIn("carouselState", js, "app.js must manage carouselState object")
        self.assertIn('e.key === "ArrowLeft"', js, "app.js must support ArrowLeft for prev sign")
        self.assertIn('e.key === "ArrowRight"', js, "app.js must support ArrowRight for next sign")
        self.assertIn('e.code === "Space"', js, "app.js must support Space key for pause toggle")


if __name__ == "__main__":
    unittest.main()


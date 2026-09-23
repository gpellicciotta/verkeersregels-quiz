import { el } from "./dom.js";
import { carouselState } from "./state.js";
import { closeReportModal } from "./report-modal.js";
import { closeChangelogModal, loadChangelog } from "./changelog.js";
import { pauseCarouselTimer } from "./carousel.js";
import { renderStatsView } from "./stats.js";

/**
 * Show one top-level screen and hide all the others.
 *
 * Also closes any open modal, stops the carousel when leaving it and lazily
 * loads the changelog when the About screen becomes visible.
 *
 * @param {string} name - Screen key: "start", "quiz", "result", "carousel", "about", "config" or "stats".
 * @returns {void}
 */
export function showScreen(name) {
  closeReportModal();
  closeChangelogModal();
  el.screenStart.classList.toggle("hidden", name !== "start");
  el.screenQuiz.classList.toggle("hidden", name !== "quiz");
  el.screenResult.classList.toggle("hidden", name !== "result");
  if (el.screenCarousel) {
    el.screenCarousel.classList.toggle("hidden", name !== "carousel");
  }
  if (el.screenAbout) {
    el.screenAbout.classList.toggle("hidden", name !== "about");
  }
  if (el.screenConfig) {
    el.screenConfig.classList.toggle("hidden", name !== "config");
  }
  if (el.screenStats) {
    el.screenStats.classList.toggle("hidden", name !== "stats");
  }
  if (name !== "carousel" && carouselState.isActive) {
    pauseCarouselTimer();
    carouselState.isActive = false;
  }
  if (name === "about") {
    loadChangelog();
  }
  if (name === "stats") {
    renderStatsView();
  }
}

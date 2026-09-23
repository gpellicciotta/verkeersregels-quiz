import { el } from "./dom.js";
import { carouselState } from "./state.js";
import { closeReportModal } from "./report-modal.js";
import { closeChangelogModal, loadChangelog } from "./changelog.js";
import { pauseCarouselTimer } from "./carousel.js";

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
  if (name !== "carousel" && carouselState.isActive) {
    pauseCarouselTimer();
    carouselState.isActive = false;
  }
  if (name === "about") {
    loadChangelog();
  }
}

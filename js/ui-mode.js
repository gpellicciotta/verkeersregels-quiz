import { el } from "./dom.js";
import { state } from "./state.js";
import { getNameParam } from "./params.js";
import { setStoredPreferences } from "./preferences.js";
import { updateStartScreenNotice } from "./quiz.js";

export function setStartMode(mode, persist) {
  const isCarousel = mode === "carousel";
  state.currentMode = isCarousel ? "carousel" : "quiz";
  if (persist) {
    setStoredPreferences({ mode: state.currentMode });
  }
  const nameParam = getNameParam();

  if (el.radioModeQuiz) el.radioModeQuiz.checked = !isCarousel;
  if (el.radioModeCarousel) el.radioModeCarousel.checked = isCarousel;
  if (el.modeCardQuiz) el.modeCardQuiz.classList.toggle("is-selected", !isCarousel);
  if (el.modeCardCarousel) el.modeCardCarousel.classList.toggle("is-selected", isCarousel);
  if (el.quizStartFields) el.quizStartFields.classList.toggle("hidden", isCarousel || Boolean(nameParam));
  if (el.carouselStartFields) el.carouselStartFields.classList.toggle("hidden", !isCarousel);

  // Update title: 1 heading line at top
  if (el.startTitle) {
    el.startTitle.textContent = isCarousel ? "Verkeersborden Carrousel" : "Verkeersregels Quiz";
  }

  // Update explanation sentence: 1 line underneath
  updateStartScreenNotice();

  // Update start button label: smaller start button with arrow to right
  if (el.btnStartLabel) {
    el.btnStartLabel.textContent = isCarousel ? "Start carrousel" : "Start quiz";
  }
  if (el.btnStart) {
    el.btnStart.setAttribute("aria-label", isCarousel ? "Start carrousel" : "Start quiz");
    el.btnStart.setAttribute("title", isCarousel ? "Start carrousel" : "Start quiz");
  }

  // Update mode toggle button icon and tooltip
  if (el.btnModeToggle) {
    const tooltipText = isCarousel ? "Wissel naar quiz" : "Wissel naar carrousel";
    const ariaText = isCarousel ? "Wissel naar quiz" : "Wissel naar carrousel";
    el.btnModeToggle.setAttribute("data-tooltip", tooltipText);
    el.btnModeToggle.setAttribute("aria-label", ariaText);
  }
  if (el.modeIconCarousel) {
    el.modeIconCarousel.classList.toggle("hidden", isCarousel);
  }
  if (el.modeIconQuiz) {
    el.modeIconQuiz.classList.toggle("hidden", !isCarousel);
  }
}

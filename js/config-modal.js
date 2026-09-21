import { el } from "./dom.js";
import { state, carouselState, allQuestions } from "./state.js";
import { getQuestionCountOverride } from "./params.js";
import { setStoredPreferences } from "./preferences.js";
import { applyFilter, updateStartScreenNotice } from "./quiz.js";

export function openConfigModal() {
  const isCarousel = state.currentMode === "carousel";
  if (el.modalConfigTitle) {
    el.modalConfigTitle.textContent = isCarousel
      ? "Instellingen Carrousel"
      : "Instellingen Quiz";
  }
  if (el.configSectionQuiz) {
    el.configSectionQuiz.classList.toggle("hidden", isCarousel);
  }
  if (el.configSectionCarousel) {
    el.configSectionCarousel.classList.toggle("hidden", !isCarousel);
  }

  // Prepopulate quiz settings
  if (el.configQuizCount) {
    if (state.configCount === "all") {
      el.configQuizCount.value = "all";
    } else if (state.configCount) {
      el.configQuizCount.value = String(state.configCount);
    } else {
      const qOverride = getQuestionCountOverride();
      el.configQuizCount.value = qOverride ? String(qOverride) : "20";
    }
  }
  if (el.configQuizType) {
    el.configQuizType.value = state.filterType || "";
  }
  if (el.configQuizSince) {
    el.configQuizSince.value =
      state.filterSince !== null && state.filterSince !== undefined
        ? String(state.filterSince)
        : "";
  }

  // Prepopulate carousel settings
  if (el.carouselDelaySelect) {
    const delaySec = carouselState.delayMs ? Math.round(carouselState.delayMs / 1000) : 8;
    el.carouselDelaySelect.value = String(delaySec);
  }
  if (el.configCarouselSince) {
    el.configCarouselSince.value = carouselState.filterSince
      ? String(carouselState.filterSince)
      : "";
  }

  if (el.modalConfig) {
    el.modalConfig.classList.remove("hidden");
    updateConfigQuizWarning();
  }
}

export function updateConfigQuizWarning() {
  if (!el.configQuizCountWarning || !el.configQuizSince || !el.configQuizCount) return;
  const sinceVal = el.configQuizSince.value ? parseInt(el.configQuizSince.value, 10) : null;
  const countVal = el.configQuizCount.value;

  if (sinceVal !== null && !isNaN(sinceVal)) {
    const availableForSince = (allQuestions || []).filter(
      (q) => typeof q.since === "number" && q.since > sinceVal
    ).length;

    const requestedCount =
      countVal === "all" ? (allQuestions ? allQuestions.length : 304) : parseInt(countVal, 10);

    if (requestedCount > availableForSince) {
      el.configQuizCountWarning.textContent = `Er zijn slechts ${availableForSince} vragen mogelijk door de 'Ouderdom van de regels' keuze.`;
      el.configQuizCountWarning.classList.remove("hidden");
      return;
    }
  }

  el.configQuizCountWarning.textContent = "";
  el.configQuizCountWarning.classList.add("hidden");
}

export function closeConfigModal() {
  if (el.modalConfig) {
    el.modalConfig.classList.add("hidden");
  }
}

export function saveConfig() {
  if (state.currentMode === "carousel") {
    if (el.carouselDelaySelect) {
      const sec = parseInt(el.carouselDelaySelect.value, 10) || 8;
      carouselState.delayMs = sec * 1000;
    }
    if (el.configCarouselSince) {
      const sinceVal = el.configCarouselSince.value
        ? parseInt(el.configCarouselSince.value, 10)
        : null;
      carouselState.filterSince = sinceVal;
    }
    setStoredPreferences({
      carouselDelaySeconds: carouselState.delayMs / 1000,
      carouselSince: carouselState.filterSince,
    });
    updateStartScreenNotice();
  } else {
    if (el.configQuizCount) {
      const val = el.configQuizCount.value;
      state.configCount = val === "all" ? "all" : parseInt(val, 10);
    }
    if (el.configQuizType) {
      state.configType = el.configQuizType.value || null;
    }
    if (el.configQuizSince) {
      state.configSince = el.configQuizSince.value
        ? parseInt(el.configQuizSince.value, 10)
        : null;
    }
    setStoredPreferences({
      quizCount: state.configCount,
      quizType: state.configType,
      quizSince: state.configSince,
    });
    applyFilter();
  }
  closeConfigModal();
}

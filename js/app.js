import { el } from "./dom.js";
import { state, carouselState, setAllQuestions, allQuestions } from "./state.js";
import { getCarouselParams, getNameParam, getThemeParam, getThemeColorParam } from "./params.js";
import { initTheme, applyTheme } from "./theme.js";
import {
  getStoredPreferences,
  setStoredPreferences,
  applyStoredPreferences,
} from "./preferences.js";
import { drainReportQueue } from "./report-queue.js";
import { showScreen } from "./screens.js";
import {
  loadQuestions,
  loadTranslations,
  applyFilter,
  updateStartScreenNotice,
  startQuiz,
  startErrorReviewQuiz,
  restartWithWrongAnswers,
  selectOption,
  nextQuestion,
  showResult,
  restart,
} from "./quiz.js";
import { setStartMode } from "./ui-mode.js";
import {
  startCarousel,
  stopCarousel,
  toggleCarouselPause,
  nextCarouselSign,
  prevCarouselSign,
  renderCarouselCard,
} from "./carousel.js";
import {
  openConfigView,
  closeConfigView,
  saveConfig,
  updateConfigQuizWarning,
} from "./config-view.js";
import {
  openReportModal,
  closeReportModal,
  handleReportSubmit,
  toggleReportContextVisibility,
} from "./report-modal.js";
import { openChangelogModal, closeChangelogModal, loadChangelog } from "./changelog.js";
import { registerServiceWorker, updateOnlineStatus } from "./pwa.js";
import { setLang, detectLang, getLang, applyAll, t } from "./i18n.js";
import { handleShare } from "./share.js";
import { initQuizCancel } from "./quiz-cancel.js";
import { localizeSourceUrl } from "./utils.js";
import { renderDataIcons } from "./icons.js";

function hydrateAppIcons() {
  renderDataIcons(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hydrateAppIcons, { once: true });
} else {
  hydrateAppIcons();
}

initQuizCancel();

el.btnStart.addEventListener("click", () => {
  const isCarouselSelected = state.currentMode === "carousel" || (el.radioModeCarousel && el.radioModeCarousel.checked);
  if (isCarouselSelected) {
    const rawDelay = el.carouselDelaySelect ? el.carouselDelaySelect.value : "8";
    const delay = parseInt(rawDelay, 10) || (carouselState.delayMs ? carouselState.delayMs / 1000 : 8);
    startCarousel({ delay, since: carouselState.filterSince });
    return;
  }
  if (!state.pool || state.pool.length === 0) {
    el.startError.textContent = "Vragen konden niet geladen worden. Herlaad de pagina.";
    el.startError.classList.remove("hidden");
    return;
  }
  startQuiz();
});

if (el.playerNameInput) {
  el.playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!state.pool || state.pool.length === 0) {
        el.startError.textContent = "Vragen konden niet geladen worden. Herlaad de pagina.";
        el.startError.classList.remove("hidden");
        return;
      }
      startQuiz();
    }
  });
}
if (el.btnStartErrors) el.btnStartErrors.addEventListener("click", startErrorReviewQuiz);
el.btnNext.addEventListener("click", nextQuestion);
el.btnResultClose.addEventListener("click", restart);
if (el.btnResultRetryErrors) el.btnResultRetryErrors.addEventListener("click", restartWithWrongAnswers);
if (el.btnShare) el.btnShare.addEventListener("click", handleShare);
if (el.btnPrint) el.btnPrint.addEventListener("click", () => window.print());
if (el.btnReportError) el.btnReportError.addEventListener("click", openReportModal);
if (el.btnReportErrorMobile) el.btnReportErrorMobile.addEventListener("click", openReportModal);
if (el.btnReportStart) el.btnReportStart.addEventListener("click", openReportModal);
if (el.btnReportResult) el.btnReportResult.addEventListener("click", openReportModal);
if (el.btnReportCarousel) el.btnReportCarousel.addEventListener("click", openReportModal);
if (el.btnReportAbout) el.btnReportAbout.addEventListener("click", openReportModal);
if (el.btnReportConfig) el.btnReportConfig.addEventListener("click", openReportModal);
el.btnModalClose.addEventListener("click", closeReportModal);
el.btnModalCancel.addEventListener("click", closeReportModal);
el.formReport.addEventListener("submit", handleReportSubmit);
el.reportIncludeContext.addEventListener("change", toggleReportContextVisibility);
el.modalReport.addEventListener("click", (e) => {
  if (e.target === el.modalReport) closeReportModal();
});

if (el.btnVersion) {
  el.btnVersion.addEventListener("click", openChangelogModal);
}
if (el.btnChangelogClose) el.btnChangelogClose.addEventListener("click", closeChangelogModal);
if (el.btnChangelogDismiss) el.btnChangelogDismiss.addEventListener("click", closeChangelogModal);
if (el.modalChangelog) {
  el.modalChangelog.addEventListener("click", (e) => {
    if (e.target === el.modalChangelog) closeChangelogModal();
  });
}

if (el.btnAbout) {
  el.btnAbout.addEventListener("click", () => {
    showScreen("about");
  });
}
if (el.btnAboutBack) {
  el.btnAboutBack.addEventListener("click", () => {
    showScreen("start");
  });
}

if (el.carouselStage) {
  el.carouselStage.addEventListener("click", (e) => {
    if (e.target.closest("a") || e.target.closest("button")) return;
    toggleCarouselPause();
  });
}

if (el.btnCarouselToggle) {
  el.btnCarouselToggle.addEventListener("click", () => toggleCarouselPause());
}

if (el.btnCarouselPrev) {
  el.btnCarouselPrev.addEventListener("click", prevCarouselSign);
}

if (el.btnCarouselNext) {
  el.btnCarouselNext.addEventListener("click", nextCarouselSign);
}

if (el.btnCarouselExit) {
  el.btnCarouselExit.addEventListener("click", stopCarousel);
}

if (el.configQuizSince) {
  el.configQuizSince.addEventListener("change", updateConfigQuizWarning);
}

if (el.configQuizCount) {
  el.configQuizCount.addEventListener("change", updateConfigQuizWarning);
}

if (el.btnModeToggle) {
  el.btnModeToggle.addEventListener("click", () => {
    const nextMode = state.currentMode === "carousel" ? "quiz" : "carousel";
    setStartMode(nextMode, true);
  });
}

if (el.btnConfig) {
  el.btnConfig.addEventListener("click", openConfigView);
}

if (el.btnConfigClose) {
  el.btnConfigClose.addEventListener("click", closeConfigView);
}

if (el.btnConfigSave) {
  el.btnConfigSave.addEventListener("click", saveConfig);
}

if (el.radioModeQuiz) {
  el.radioModeQuiz.addEventListener("change", () => setStartMode("quiz", true));
}
if (el.radioModeCarousel) {
  el.radioModeCarousel.addEventListener("change", () => setStartMode("carousel", true));
}
if (el.modeCardQuiz) {
  el.modeCardQuiz.addEventListener("click", () => setStartMode("quiz", true));
}
if (el.modeCardCarousel) {
  el.modeCardCarousel.addEventListener("click", () => setStartMode("carousel", true));
}

document.addEventListener("keydown", (e) => {
  if (carouselState.isActive && el.screenCarousel && !el.screenCarousel.classList.contains("hidden")) {
    if (e.key === " " || e.code === "Space") {
      const targetTag = e.target && e.target.tagName;
      if (targetTag !== "INPUT" && targetTag !== "TEXTAREA") {
        e.preventDefault();
        toggleCarouselPause();
        return;
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevCarouselSign();
      return;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextCarouselSign();
      return;
    } else if (e.key === "Escape") {
      e.preventDefault();
      stopCarousel();
      return;
    }
  }

  if (e.key === "Escape") {
    if (el.screenConfig && !el.screenConfig.classList.contains("hidden")) {
      closeConfigView();
    }
    if (el.modalReport && !el.modalReport.classList.contains("hidden")) {
      closeReportModal();
    }
    if (el.modalChangelog && !el.modalChangelog.classList.contains("hidden")) {
      closeChangelogModal();
    }
  }
});

if (typeof window !== "undefined") {
  window.carouselState = carouselState;
  window.startCarousel = startCarousel;
  window.stopCarousel = stopCarousel;
  window.toggleCarouselPause = toggleCarouselPause;
  window.nextCarouselSign = nextCarouselSign;
  window.prevCarouselSign = prevCarouselSign;
  window.setStartMode = setStartMode;
  window.openConfigView = openConfigView;
  window.closeConfigView = closeConfigView;
  window.saveConfig = saveConfig;
  window.getNameParam = getNameParam;
  window.getThemeParam = getThemeParam;
  window.getThemeColorParam = getThemeColorParam;
  window.applyTheme = applyTheme;
  window.initTheme = initTheme;
  window.getStoredPreferences = getStoredPreferences;
  window.setStoredPreferences = setStoredPreferences;
  window.applyStoredPreferences = applyStoredPreferences;
}

function checkAutoStart() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("install") === "1" || params.get("pwa") === "1") {
    if (el.btnInstall) el.btnInstall.classList.remove("hidden");
  }
  if (params.get("opt") === "carousel" || params.get("keuze") === "carrousel") {
    setStartMode("carousel");
    if (params.get("modal") === "config" || params.get("config") === "1") {
      openConfigView();
    }
    return;
  }
  if (params.get("modal") === "config" || params.get("config") === "1") {
    openConfigView();
    return;
  }
  if (!allQuestions || allQuestions.length === 0) {
    if (params.get("view") === "about" || params.get("screen") === "about" || params.has("about")) {
      showScreen("about");
    } else if (params.get("modal") === "changelog" || params.get("autotest") === "changelog" || params.get("changelog") === "1") {
      openChangelogModal();
    }
    return;
  }
  const carouselParams = getCarouselParams();
  if (carouselParams.active) {
    startCarousel({ delay: carouselParams.delay });
    if (params.get("pause") === "1") {
      toggleCarouselPause(true);
    }
    return;
  }
  const autotest = params.get("autotest");
  if (autotest === "results" || autotest === "results-mixed") {
    startQuiz();
    while (state.currentIndex < state.round.length) {
      const q = state.round[state.currentIndex];
      if (autotest === "results-mixed" && state.currentIndex % 2 === 1) {
        selectOption((q.correctIndex + 1) % q.options.length);
      } else {
        selectOption(q.correctIndex);
      }
      state.currentIndex++;
    }
    showResult();
  } else if (params.get("autostart") === "1" || (params.get("mode") || "").toLowerCase().trim() === "quiz") {
    startQuiz();
    if (params.get("answer") === "correct") {
      const q = state.round[state.currentIndex];
      selectOption(q.correctIndex);
    } else if (params.get("answer") === "wrong") {
      const q = state.round[state.currentIndex];
      selectOption((q.correctIndex + 1) % q.options.length);
    }
    if (params.get("report") === "1") {
      openReportModal();
    }
  } else if (params.get("view") === "about" || params.get("screen") === "about" || params.has("about")) {
    showScreen("about");
  } else if (params.get("modal") === "changelog" || params.get("autotest") === "changelog" || params.get("changelog") === "1") {
    openChangelogModal();
  }
}

// ── Language switcher ─────────────────────────────────────────────────────────
const LANG_CYCLE = { nl: "fr", fr: "de", de: "it", it: "en", en: "nl" };
const LANG_ORDER = ["nl", "fr", "de", "it", "en"]; // display order, matches LANG_CYCLE traversal

// Builds "NL → [FR] → DE → IT → EN", bracketing the active language since the
// CSS tooltip renders plain text (attr()) and cannot bold a substring.
function buildLangCycleLabel(lang) {
  return LANG_ORDER.map((code) => {
    const upper = code.toUpperCase();
    return code === lang ? `[${upper}]` : upper;
  }).join(" → ");
}

// wegcode.be's own source links (About screen) follow the same NL/FR-only
// pattern as per-question sources — see localizeSourceUrl().
function updateAboutSourceLinks() {
  const lang = getLang();
  if (el.aboutSourceWegcode) {
    el.aboutSourceWegcode.href = localizeSourceUrl(el.aboutSourceWegcode.href, lang);
  }
  if (el.aboutSourceWegcodeChanges) {
    el.aboutSourceWegcodeChanges.href = localizeSourceUrl(el.aboutSourceWegcodeChanges.href, lang);
  }
}

function updateLangButton() {
  if (!el.btnLang) return;
  const lang = getLang();
  const labelEl = el.btnLang.querySelector(".btn-lang-label");
  if (labelEl) labelEl.textContent = lang.toUpperCase();
  const tooltip = t("start.btn_lang_tooltip", { cycle: buildLangCycleLabel(lang) });
  el.btnLang.setAttribute("aria-label", t("start.btn_lang_aria"));
  el.btnLang.setAttribute("data-tooltip", tooltip);
  el.btnLang.setAttribute("title", tooltip);
}

if (el.btnLang) {
  el.btnLang.addEventListener("click", () => {
    const current = getLang();
    const next = LANG_CYCLE[current] || "nl";
    setLang(next).then(() => {
      loadTranslations(next).then(() => {
        updateLangButton();
        updateAboutSourceLinks();
        // Re-render dynamic strings that aren't covered by data-i18n
        updateStartScreenNotice();
        setStartMode(state.currentMode);
        loadChangelog();
        if (carouselState.isActive) {
          renderCarouselCard();
        }
      });
    });
  });
}

// Re-render all dynamic strings on language change (covers module-local renders)
document.addEventListener("languagechange", () => {
  applyAll();
  updateLangButton();
  updateAboutSourceLinks();
  if (carouselState.isActive) {
    renderCarouselCard();
  }
});

// Dismiss any open [data-tooltip] popover on resize/orientation change: a tap-focused
// or touch-hover tooltip would otherwise keep showing (and be mispositioned) after layout changes.
function dismissOpenTooltips() {
  if (document.activeElement instanceof HTMLElement && document.activeElement.hasAttribute("data-tooltip")) {
    document.activeElement.blur();
  }
  document.body.classList.add("suppress-tooltips");
  window.requestAnimationFrame(() => {
    document.body.classList.remove("suppress-tooltips");
  });
}
window.addEventListener("resize", dismissOpenTooltips);
window.addEventListener("orientationchange", dismissOpenTooltips);

// ── Application startup ───────────────────────────────────────────────────────
registerServiceWorker();
setLang(detectLang())
  .then(() => {
    updateLangButton();
    updateAboutSourceLinks();
    initTheme();
    updateOnlineStatus();
    applyStoredPreferences();
    setStartMode(state.currentMode);
    updateStartScreenNotice();
    loadChangelog();
    checkAutoStart();

    return loadQuestions();
  })
  .then((questions) => {
    setAllQuestions(questions);
    applyFilter();
    const lang = getLang();
    if (lang !== "nl") {
      return loadTranslations(lang).then(() => { checkAutoStart(); drainReportQueue(); });
    }
    checkAutoStart();
    drainReportQueue();
  })
  .catch(async (err) => {
    console.error(err);
    if (el.startError) {
      el.startError.textContent = t("start.error_load_failed");
      el.startError.classList.remove("hidden");
    }
  });

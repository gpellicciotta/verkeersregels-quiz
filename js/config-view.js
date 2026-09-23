import { el } from "./dom.js";
import { state, carouselState, allQuestions } from "./state.js";
import { getQuestionCountOverride } from "./params.js";
import { setStoredPreferences } from "./preferences.js";
import { applyFilter, updateStartScreenNotice, loadTranslations } from "./quiz.js";
import { setStartMode } from "./ui-mode.js";
import { showScreen } from "./screens.js";
import { loadChangelog } from "./changelog.js";
import { applyTheme } from "./theme.js";
import { t, getLang, setLang, SUPPORTED_LANGS } from "./i18n.js";

/**
 * Open the settings view with all fields prepopulated from the current state.
 *
 * Fills in the general, quiz and carousel settings, shows the view and refreshes
 * the question count warning.
 *
 * @returns {void}
 */
export function openConfigView() {
  // Prepopulate general settings
  if (el.configName) {
    el.configName.value = state.playerName || (el.playerNameInput ? el.playerNameInput.value : "") || "";
  }
  if (el.configLanguage) {
    el.configLanguage.value = getLang();
  }
  if (el.configTheme) {
    el.configTheme.value = document.documentElement.getAttribute("data-theme-setting") || "system";
  }
  if (el.configThemeColor) {
    el.configThemeColor.value = document.documentElement.getAttribute("data-theme-color") || "blue";
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
  if (el.configAlwaysIncludeErrors) {
    el.configAlwaysIncludeErrors.checked = !!state.alwaysIncludeLastErrors;
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

  showScreen("config");
  updateConfigQuizWarning();
}

/**
 * Show a warning when the chosen question count exceeds what the year filter allows.
 *
 * @returns {void}
 */
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
      el.configQuizCountWarning.textContent = t("config.count_warning", { n: availableForSince });
      el.configQuizCountWarning.classList.remove("hidden");
      return;
    }
  }

  el.configQuizCountWarning.textContent = "";
  el.configQuizCountWarning.classList.add("hidden");
}

/**
 * Leave the settings view.
 *
 * Settings is a full-window view, so leaving it means going back to the start screen.
 *
 * @returns {void}
 */
export function closeConfigView() {
  showScreen("start");
}

/**
 * Apply the settings form to the runtime state and persist them.
 *
 * Applies the theme, updates the quiz and carousel settings, stores everything in the
 * preferences, refreshes the start screen and closes the view. A changed language is
 * loaded afterwards, which re-renders the strings, the start screen and the changelog.
 *
 * @returns {void}
 */
export function saveConfig() {
  // General settings
  let name = state.playerName || "";
  if (el.configName) {
    name = el.configName.value.trim();
    state.playerName = name;
    if (el.playerNameInput) el.playerNameInput.value = name;
  }

  let newLang = getLang();
  let languageChanged = false;
  if (el.configLanguage && SUPPORTED_LANGS.includes(el.configLanguage.value) && el.configLanguage.value !== getLang()) {
    newLang = el.configLanguage.value;
    languageChanged = true;
  }

  const themeSetting = el.configTheme ? el.configTheme.value || "system" : "system";
  const themeColor = el.configThemeColor ? el.configThemeColor.value || "blue" : "blue";
  applyTheme(themeSetting, themeColor);

  // Carousel settings
  if (el.carouselDelaySelect) {
    const sec = parseInt(el.carouselDelaySelect.value, 10) || 8;
    carouselState.delayMs = sec * 1000;
  }
  if (el.configCarouselSince) {
    const rawVal = el.configCarouselSince.value;
    if (rawVal === "errors") {
      carouselState.filterSince = "errors";
    } else if (rawVal) {
      carouselState.filterSince = parseInt(rawVal, 10);
    } else {
      carouselState.filterSince = null;
    }
  }

  // Quiz settings
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
  if (el.configAlwaysIncludeErrors) {
    state.alwaysIncludeLastErrors = !!el.configAlwaysIncludeErrors.checked;
  }

  setStoredPreferences({
    playerName: name,
    theme: themeSetting,
    themeColor,
    quizCount: state.configCount,
    quizType: state.configType,
    quizSince: state.configSince,
    alwaysIncludeLastErrors: state.alwaysIncludeLastErrors,
    carouselDelaySeconds: carouselState.delayMs / 1000,
    carouselSince: carouselState.filterSince,
  });

  applyFilter();
  updateStartScreenNotice();
  closeConfigView();

  if (languageChanged) {
    setLang(newLang).then(() => loadTranslations(newLang)).then(() => {
      setStartMode(state.currentMode);
      loadChangelog();
    });
  }
}

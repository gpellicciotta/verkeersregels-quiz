import { el } from "./dom.js";
import { state, carouselState } from "./state.js";
import {
  getNameParam,
  getQuestionCountOverride,
  getTypeFilter,
  getSinceFilter,
  getThemeQueryOverride,
  getThemeColorQueryOverride,
} from "./params.js";
import { applyTheme } from "./theme.js";

export const PREFS_STORAGE_KEY = "verkeersquiz_preferences";

export function getStoredPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("Kon voorkeuren niet lezen uit localStorage:", err);
    return {};
  }
}

export function setStoredPreferences(patch) {
  try {
    const prefs = getStoredPreferences();
    Object.assign(prefs, patch);
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn("Kon voorkeuren niet opslaan in localStorage:", err);
  }
}

export function applyStoredPreferences() {
  const stored = getStoredPreferences();

  if (!getNameParam() && stored.playerName && el.playerNameInput) {
    el.playerNameInput.value = stored.playerName;
  }

  if (getQuestionCountOverride() === null && stored.quizCount !== undefined && stored.quizCount !== null) {
    state.configCount = stored.quizCount;
  }
  if (getTypeFilter() === null && stored.quizType) {
    state.configType = stored.quizType;
  }
  if (getSinceFilter() === null && stored.quizSince !== undefined && stored.quizSince !== null) {
    state.configSince = stored.quizSince;
  }
  if (typeof stored.alwaysIncludeLastErrors === "boolean") {
    state.alwaysIncludeLastErrors = stored.alwaysIncludeLastErrors;
  }

  if (typeof stored.carouselDelaySeconds === "number" && stored.carouselDelaySeconds > 0) {
    carouselState.delayMs = stored.carouselDelaySeconds * 1000;
    if (el.carouselDelaySelect) {
      el.carouselDelaySelect.value = String(stored.carouselDelaySeconds);
    }
  }
  if (stored.carouselSince !== undefined && stored.carouselSince !== null) {
    carouselState.filterSince = stored.carouselSince;
  }

  const themeOverride = getThemeQueryOverride();
  const themeColorOverride = getThemeColorQueryOverride();
  if ((themeOverride === null && stored.theme) || (themeColorOverride === null && stored.themeColor)) {
    applyTheme(themeOverride || stored.theme, themeColorOverride || stored.themeColor);
  }

  const params = new URLSearchParams(window.location.search);
  const hasModeOverride =
    params.has("opt") || params.has("keuze") || params.has("mode") ||
    params.has("sign-carrousel") || params.has("sign-carousel");
  if (!hasModeOverride && stored.mode === "carousel") {
    state.currentMode = "carousel";
  }
}

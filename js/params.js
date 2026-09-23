/**
 * Read the "in force since" year filter from the query string.
 *
 * Accepts the "since", "sinds" and "s" parameter names.
 *
 * @returns {number|null} Year between 1900 and 2100, or null when absent or invalid.
 */
export function getSinceFilter() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const param = params.get("since") || params.get("sinds") || params.get("s");
  if (!param) return null;
  const year = parseInt(param, 10);
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

/**
 * Read the question type filter from the query string.
 *
 * Accepts the "type" and "t" parameter names with Dutch and English values.
 *
 * @returns {string|null} One of "situation", "recognize", "identify", "rule" or "sign",
 *          or null when absent or unrecognized.
 */
export function getTypeFilter() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("type") || params.get("t");
  if (!raw) return null;
  const val = raw.trim().toLowerCase();
  if (["situation", "situatie", "situaties", "foto", "photo", "fotos", "photos"].includes(val)) {
    return "situation";
  }
  if (["recognize", "herkennen"].includes(val)) {
    return "recognize";
  }
  if (["identify", "identificeren"].includes(val)) {
    return "identify";
  }
  if (["rule", "regel", "regels"].includes(val)) {
    return "rule";
  }
  if (["sign", "signs", "bord", "borden", "verkeersborden"].includes(val)) {
    return "sign";
  }
  return null;
}

/**
 * Read the theme from the query string, falling back to the system theme.
 *
 * @returns {string} "light", "dark" or "system".
 */
export function getThemeParam() {
  if (typeof window === "undefined" || !window.location) return "system";
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("theme");
  if (!raw) return "system";
  const val = raw.trim().toLowerCase();
  if (val === "dark") return "dark";
  if (val === "light") return "light";
  if (val === "system") return "system";
  return "system";
}

/**
 * Read the accent color from the query string, falling back to blue.
 *
 * Accepts the "theme-color", "themecolor" and "theme_color" parameter names with
 * Dutch and English values.
 *
 * @returns {string} "blue", "yellow" or "red".
 */
export function getThemeColorParam() {
  if (typeof window === "undefined" || !window.location) return "blue";
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("theme-color") || params.get("themecolor") || params.get("theme_color");
  if (!raw) return "blue";
  const val = raw.trim().toLowerCase();
  if (val === "yellow" || val === "geel") return "yellow";
  if (val === "red" || val === "rood") return "red";
  if (val === "blue" || val === "blauw") return "blue";
  return "blue";
}

/**
 * Read the theme from the query string without applying a default.
 *
 * Used to decide whether the URL overrides the stored preference.
 *
 * @returns {string|null} "light", "dark" or "system", or null when absent or invalid.
 */
export function getThemeQueryOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("theme");
  if (!raw) return null;
  const val = raw.trim().toLowerCase();
  return val === "dark" || val === "light" || val === "system" ? val : null;
}

/**
 * Read the accent color from the query string without applying a default.
 *
 * Used to decide whether the URL overrides the stored preference.
 *
 * @returns {string|null} "blue", "yellow" or "red", or null when absent or invalid.
 */
export function getThemeColorQueryOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("theme-color") || params.get("themecolor") || params.get("theme_color");
  if (!raw) return null;
  const val = raw.trim().toLowerCase();
  if (val === "yellow" || val === "geel") return "yellow";
  if (val === "red" || val === "rood") return "red";
  if (val === "blue" || val === "blauw") return "blue";
  return null;
}

/**
 * Read the pre-filled player name from the query string.
 *
 * Accepts the "name", "naam" and "n" parameter names.
 *
 * @returns {string|null} Trimmed name, or null when absent or empty.
 */
export function getNameParam() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("name") || params.get("naam") || params.get("n");
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Read the questions-per-round override from the query string.
 *
 * Accepts the "q" and "quantity" parameter names.
 *
 * @returns {number|null} Positive question count, or null when absent or invalid.
 */
export function getQuestionCountOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("q") || params.get("quantity");
  if (!raw) return null;
  const q = parseInt(raw, 10);
  return Number.isInteger(q) && q > 0 ? q : null;
}

/**
 * Read the carousel activation flag and slide delay from the query string.
 *
 * Accepts the "sign-carrousel" and "sign-carousel" flags or a "mode" value, plus
 * a "delay" or "d" value in seconds.
 *
 * @returns {{active: boolean, delay: number}} Whether to start in carousel mode and
 *          the slide delay in seconds.
 */
export function getCarouselParams() {
  if (typeof window === "undefined" || !window.location) {
    return { active: false, delay: 5 };
  }
  const params = new URLSearchParams(window.location.search);
  const mode = (params.get("mode") || "").toLowerCase().trim();
  const isCarrousel =
    params.has("sign-carrousel") ||
    params.has("sign-carousel") ||
    mode === "carrousel" ||
    mode === "carousel";

  const rawDelay = params.get("delay") || params.get("d");
  const parsedDelay = parseInt(rawDelay, 10);
  const delay = Number.isInteger(parsedDelay) && parsedDelay > 0 ? parsedDelay : 8;

  return {
    active: isCarrousel,
    delay,
  };
}

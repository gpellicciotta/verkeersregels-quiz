import { t } from "./i18n.js";

/**
 * Return a shuffled copy of an array, leaving the input untouched.
 *
 * @param {Array<*>} array - Source array to shuffle.
 * @returns {Array<*>} New array holding the same items in random order.
 */
export function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Build the presentation data for the "in force since <year>" badge.
 *
 * @param {number|null|undefined} since - Year the rule or sign took effect.
 * @returns {{year: number, text: string, className: string, isRecent: boolean}|null} Badge
 *          descriptor, or null when no usable year was supplied.
 */
export function getSinceBadge(since) {
  if (!since || typeof since !== "number") return null;
  const currentYear = new Date().getFullYear();
  const diff = currentYear - since;
  const isRecent = diff <= 5;
  return {
    year: since,
    text: t("badge.since", { year: since }),
    className: isRecent ? "badge-since badge-amber badge-since-amber" : "badge-since badge-blue badge-since-blue",
    isRecent,
  };
}

/**
 * Format a duration as a localized minutes and seconds label.
 *
 * @param {number} seconds - Duration in seconds; values below one second are clamped to one.
 * @returns {string} Localized duration text.
 */
export function formatDuration(seconds) {
  const s = Math.max(1, Math.round(seconds || 1));
  const min = Math.floor(s / 60);
  const remSec = s % 60;
  if (min === 0) {
    return t("duration.sec", { s: remSec });
  }
  if (remSec === 0) {
    return t("duration.min", { m: min });
  }
  return t("duration.min_sec", { m: min, s: remSec });
}

/**
 * Extract the traffic sign code from an SVG asset path.
 *
 * @param {string} path - Path or URL ending in the sign's SVG file name.
 * @returns {string} Sign code without extension, or an empty string when no code is present.
 */
export function getSignCode(path) {
  if (!path || typeof path !== "string") return "";
  const match = path.match(/([A-Za-z0-9_-]+)\.svg$/i);
  return match ? match[1] : "";
}

// wegcode.be publishes the consolidated Wegcode in Dutch and French (same
// URL structure and article anchors on both) but not in German or English,
// so those languages — and any future one — fall back to Dutch.
// Matches both directions so it stays correct when applied repeatedly to
// an already-swapped href (e.g. the About screen links toggling FR -> NL).
const WEGCODE_LANG_RE = /^(https:\/\/www\.wegcode\.be\/)(nl|fr)(\/.*)$/;

/**
 * Rewrite a wegcode.be source link so it points at the requested language.
 *
 * @param {string} url - Source URL, possibly already pointing at another language.
 * @param {string} lang - Target UI language code.
 * @returns {string} Localized URL, or the input unchanged when it is not a wegcode.be link.
 */
export function localizeSourceUrl(url, lang) {
  if (!url || typeof url !== "string") return url;
  const match = url.match(WEGCODE_LANG_RE);
  if (!match) return url;
  const target = lang === "fr" ? "fr" : "nl";
  return `${match[1]}${target}${match[3]}`;
}


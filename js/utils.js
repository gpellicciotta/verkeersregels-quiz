import { t } from "./i18n.js";

export function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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

export function localizeSourceUrl(url, lang) {
  if (!url || typeof url !== "string") return url;
  const match = url.match(WEGCODE_LANG_RE);
  if (!match) return url;
  const target = lang === "fr" ? "fr" : "nl";
  return `${match[1]}${target}${match[3]}`;
}


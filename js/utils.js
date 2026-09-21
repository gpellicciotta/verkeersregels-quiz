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

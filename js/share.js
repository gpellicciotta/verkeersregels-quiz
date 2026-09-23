import { el } from "./dom.js";
import { state } from "./state.js";
import { t } from "./i18n.js";
import { formatDuration } from "./utils.js";

let feedbackTimeoutId = null;

/**
 * Builds the payload dictionary for sharing quiz results.
 * @param {Object} [customState=state] - State override; defaults to the live quiz state.
 * @returns {{title: string, text: string, url: string}} Share title, localized result
 *          sentence and the application URL (empty outside a browser).
 */
export function getSharePayload(customState = state) {
  const total = customState.answers ? customState.answers.length : 0;
  const correct = customState.answers ? customState.answers.filter((a) => a.correct).length : 0;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const duration = formatDuration(customState.durationSeconds || 0);
  const name = customState.playerName ? customState.playerName.trim() : "";

  const title = t("result.share_title");
  const text = name
    ? t("result.share_text_name", { name, correct, total, pct, duration })
    : t("result.share_text", { correct, total, pct, duration });

  let url = "";
  if (typeof window !== "undefined" && window.location) {
    url = `${window.location.origin}${window.location.pathname}`;
  }

  return { title, text, url };
}

/**
 * Copies plain text to clipboard using navigator.clipboard or fallback textarea.
 * @param {string} text - Text to copy.
 * @returns {Promise<boolean>} True if copy succeeded, false otherwise.
 */
export async function copyToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Clipboard write failed, proceed to fallback
    }
  }

  // Fallback for browsers / environments without navigator.clipboard
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return Boolean(successful);
  } catch (_) {
    return false;
  }
}

/**
 * Shows temporary visual and accessible feedback for clipboard copy.
 *
 * The share button label, tooltip and toast revert automatically after 2.5 seconds.
 *
 * @param {boolean} [success=true] - Whether copying succeeded.
 * @returns {void}
 */
export function showShareFeedback(success = true) {
  if (feedbackTimeoutId) {
    clearTimeout(feedbackTimeoutId);
    feedbackTimeoutId = null;
  }

  const copiedTooltip = success ? t("result.share_copied_tooltip") : t("result.share_failed");
  const defaultTooltip = t("result.btn_share_tooltip");
  const defaultAria = t("result.btn_share_aria");

  if (el.btnShare) {
    el.btnShare.setAttribute("data-tooltip", copiedTooltip);
    el.btnShare.setAttribute("title", copiedTooltip);
    el.btnShare.setAttribute("aria-label", copiedTooltip);
    el.btnShare.classList.toggle("btn-copied", success);
  }

  if (el.shareToast) {
    el.shareToast.textContent = success ? t("result.share_copied") : t("result.share_failed");
    el.shareToast.classList.toggle("toast-error", !success);
    el.shareToast.classList.remove("hidden");
  }

  feedbackTimeoutId = setTimeout(() => {
    if (el.btnShare) {
      el.btnShare.setAttribute("data-tooltip", defaultTooltip);
      el.btnShare.setAttribute("title", defaultTooltip);
      el.btnShare.setAttribute("aria-label", defaultAria);
      el.btnShare.classList.remove("btn-copied");
    }
    if (el.shareToast) {
      el.shareToast.classList.add("hidden");
      el.shareToast.classList.remove("toast-error");
    }
    feedbackTimeoutId = null;
  }, 2500);
}

/**
 * Handles sharing results via Web Share API or clipboard copy fallback.
 *
 * @returns {Promise<{shared: boolean, method: string, aborted?: boolean}>} Whether the
 *          result was shared, which mechanism was used ("web-share" or "clipboard")
 *          and whether the user cancelled the native share sheet.
 */
export async function handleShare() {
  const payload = getSharePayload();

  // Try Web Share API first if supported
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return { shared: true, method: "web-share" };
    } catch (err) {
      if (err && err.name === "AbortError") {
        return { shared: false, method: "web-share", aborted: true };
      }
      // On any other error, fallback to clipboard
    }
  }

  // Fallback: Copy to clipboard
  const fullText = payload.url ? `${payload.text}\n${payload.url}` : payload.text;
  const copyOk = await copyToClipboard(fullText);
  showShareFeedback(copyOk);
  return { shared: copyOk, method: "clipboard" };
}

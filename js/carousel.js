import { el } from "./dom.js";
import { carouselState, allQuestions } from "./state.js";
import { shuffle, getSinceBadge, getSignCode, localizeSourceUrl } from "./utils.js";
import { showScreen } from "./screens.js";
import { t, getLang } from "./i18n.js";
import { applyTranslation } from "./quiz.js";
import { createIcon } from "./icons.js";
import { getErrorQuestionIds } from "./stats.js";

/**
 * Translate a sign category into its display name.
 *
 * @param {string|null|undefined} cat - Category key of a sign.
 * @returns {string} Translated category name, the capitalized key when no translation
 *          exists, or the default label when no category was supplied.
 */
export function formatCategoryName(cat) {
  if (!cat) return t("carousel.cat.default");
  const key = `carousel.cat.${cat}`;
  const translated = t(key);
  // If the key wasn't found, t() returns the key itself — fall back to capitalised cat
  return translated !== key ? translated : cat.charAt(0).toUpperCase() + cat.slice(1);
}

/**
 * Render the sign at the current carousel index.
 *
 * Fills the image with its alt text, the counter, the category and year badges, the
 * title, the explanation and the source link, and resets the progress bar.
 *
 * @returns {void}
 */
export function renderCarouselCard() {
  if (!carouselState.items || carouselState.items.length === 0) return;
  const rawItem = carouselState.items[carouselState.currentIndex];
  const item = applyTranslation(rawItem);

  if (el.carouselSignImg) {
    el.carouselSignImg.src = item.sign || "";
    const signCode = item.signCode || getSignCode(item.sign);
    el.carouselSignImg.alt = signCode
      ? t("carousel.sign_img_alt_code", { code: signCode })
      : (item.signTitle || (item.options && item.correctIndex != null ? item.options[item.correctIndex] : t("carousel.sign_img_alt")));
  }

  if (el.carouselCounter) {
    el.carouselCounter.textContent = t("carousel.counter", {
      n: carouselState.currentIndex + 1,
      total: carouselState.items.length,
    });
  }

  if (el.carouselCategoryBadge) {
    el.carouselCategoryBadge.textContent = formatCategoryName(item.category);
  }

  if (el.carouselSinceBadge) {
    const badge = getSinceBadge(item.since);
    if (badge) {
      el.carouselSinceBadge.textContent = badge.text;
      el.carouselSinceBadge.className = badge.className;
      el.carouselSinceBadge.classList.remove("hidden");
    } else {
      el.carouselSinceBadge.classList.add("hidden");
    }
  }

  if (el.carouselSignTitle) {
    const signTitle =
      item.signTitle ||
      (item.options && item.correctIndex != null ? item.options[item.correctIndex] : (item.question || ""));
    el.carouselSignTitle.textContent = signTitle;
  }

  if (el.carouselExplanation) {
    const signExplanation = item.signExplanation || item.explanation || "";
    el.carouselExplanation.textContent = signExplanation;
  }

  if (el.carouselSourceWrap && el.carouselSourceLink) {
    if (item.source) {
      el.carouselSourceLink.href = localizeSourceUrl(item.source, getLang());
      el.carouselSourceWrap.classList.remove("hidden");
    } else {
      el.carouselSourceWrap.classList.add("hidden");
    }
  }

  if (el.carouselProgressFill) {
    el.carouselProgressFill.style.width = "0%";
  }
}

/**
 * Start or resume the slide timer that drives the progress bar and advances the sign.
 *
 * Does nothing while the carousel is paused or inactive; time already elapsed before
 * a pause is taken into account.
 *
 * @returns {void}
 */
export function startCarouselTimer() {
  if (carouselState.animFrameId) {
    cancelAnimationFrame(carouselState.animFrameId);
    carouselState.animFrameId = null;
  }
  if (carouselState.isPaused || !carouselState.isActive) return;

  carouselState.slideStartTime = Date.now() - carouselState.elapsedBeforePause;

  /**
   * Advance the progress bar by one animation frame and move on when time is up.
   *
   * @returns {void}
   */
  function tick() {
    if (carouselState.isPaused || !carouselState.isActive) return;
    const now = Date.now();
    const elapsed = now - carouselState.slideStartTime;
    const pct = Math.min(100, (elapsed / carouselState.delayMs) * 100);
    if (el.carouselProgressFill) {
      el.carouselProgressFill.style.width = `${pct}%`;
    }
    if (elapsed >= carouselState.delayMs) {
      nextCarouselSign();
    } else {
      carouselState.animFrameId = requestAnimationFrame(tick);
    }
  }

  carouselState.animFrameId = requestAnimationFrame(tick);
}

/**
 * Stop the slide timer and remember how much of the current slide has elapsed.
 *
 * @returns {void}
 */
export function pauseCarouselTimer() {
  if (carouselState.animFrameId) {
    cancelAnimationFrame(carouselState.animFrameId);
    carouselState.animFrameId = null;
  }
  if (carouselState.slideStartTime) {
    carouselState.elapsedBeforePause = Math.min(
      carouselState.delayMs,
      Date.now() - carouselState.slideStartTime
    );
  }
}

/**
 * Show the next sign, reshuffling the deck once the end is reached.
 *
 * @returns {void}
 */
export function nextCarouselSign() {
  if (!carouselState.items || carouselState.items.length === 0) return;
  if (carouselState.animFrameId) {
    cancelAnimationFrame(carouselState.animFrameId);
    carouselState.animFrameId = null;
  }
  carouselState.elapsedBeforePause = 0;
  carouselState.slideStartTime = Date.now();
  carouselState.currentIndex++;
  if (carouselState.currentIndex >= carouselState.items.length) {
    carouselState.currentIndex = 0;
    carouselState.items = shuffle(carouselState.items);
  }
  renderCarouselCard();
  if (!carouselState.isPaused) {
    startCarouselTimer();
  }
  if (el.btnCarouselToggle) {
    el.btnCarouselToggle.focus();
  }
}

/**
 * Show the previous sign, wrapping around to the last one.
 *
 * @returns {void}
 */
export function prevCarouselSign() {
  if (!carouselState.items || carouselState.items.length === 0) return;
  if (carouselState.animFrameId) {
    cancelAnimationFrame(carouselState.animFrameId);
    carouselState.animFrameId = null;
  }
  carouselState.elapsedBeforePause = 0;
  carouselState.slideStartTime = Date.now();
  carouselState.currentIndex =
    (carouselState.currentIndex - 1 + carouselState.items.length) % carouselState.items.length;
  renderCarouselCard();
  if (!carouselState.isPaused) {
    startCarouselTimer();
  }
  if (el.btnCarouselToggle) {
    el.btnCarouselToggle.focus();
  }
}

/**
 * Render the pause and play icons of the toggle button, showing the applicable one.
 *
 * @param {boolean} isPaused - Whether the carousel is currently paused.
 * @returns {void}
 */
function renderCarouselToggleIcons(isPaused) {
  const container = el.carouselToggleIcon;
  if (!container) return;

  const pauseSvg = createIcon("pause", {
    className: "carousel-ctrl-svg icon-pause",
    width: 18,
    height: 18,
    fill: "currentColor",
    stroke: "none",
    strokeWidth: 0,
  });
  const playSvg = createIcon("play", {
    className: "carousel-ctrl-svg icon-play",
    width: 18,
    height: 18,
    fill: "currentColor",
    stroke: "none",
    strokeWidth: 0,
  });

  pauseSvg.classList.toggle("hidden", isPaused);
  playSvg.classList.toggle("hidden", !isPaused);
  playSvg.style.transform = "translateX(1px)";

  container.replaceChildren(pauseSvg, playSvg);
}

/**
 * Pause or resume the carousel and update the overlay, button and hint text.
 *
 * @param {boolean} [forceState] - Requested paused state; toggles the current one when omitted.
 * @returns {void}
 */
export function toggleCarouselPause(forceState) {
  if (!carouselState.isActive) return;
  const target = typeof forceState === "boolean" ? forceState : !carouselState.isPaused;
  if (target === carouselState.isPaused) return;

  carouselState.isPaused = target;
  if (carouselState.isPaused) {
    pauseCarouselTimer();
    if (el.carouselPauseOverlay) el.carouselPauseOverlay.classList.remove("hidden");
    if (el.btnCarouselToggle) {
      el.btnCarouselToggle.classList.add("is-paused");
      el.btnCarouselToggle.setAttribute("aria-label", t("carousel.btn_toggle_resume_aria"));
      el.btnCarouselToggle.setAttribute("title", t("carousel.btn_toggle_resume_tooltip"));
      el.btnCarouselToggle.setAttribute("data-tooltip", t("carousel.btn_toggle_resume_tooltip"));
      renderCarouselToggleIcons(true);
    }
    if (el.carouselToggleText) el.carouselToggleText.textContent = t("carousel.toggle_text_resume");
    if (el.carouselShortcutHint) {
      el.carouselShortcutHint.innerHTML = t("carousel.shortcut_hint_resume");
    }
  } else {
    if (el.carouselPauseOverlay) el.carouselPauseOverlay.classList.add("hidden");
    if (el.btnCarouselToggle) {
      el.btnCarouselToggle.classList.remove("is-paused");
      el.btnCarouselToggle.setAttribute("aria-label", t("carousel.btn_toggle_pause_aria"));
      el.btnCarouselToggle.setAttribute("title", t("carousel.btn_toggle_pause_tooltip"));
      el.btnCarouselToggle.setAttribute("data-tooltip", t("carousel.btn_toggle_pause_tooltip"));
      renderCarouselToggleIcons(false);
    }
    if (el.carouselToggleText) el.carouselToggleText.textContent = t("carousel.toggle_text_pause");
    if (el.carouselShortcutHint) {
      el.carouselShortcutHint.innerHTML = t("carousel.shortcut_hint_pause");
    }
    startCarouselTimer();
  }
  if (el.btnCarouselToggle) {
    el.btnCarouselToggle.focus();
  }
}

/**
 * Start the carousel with a shuffled set of signs and show its screen.
 *
 * A year or error filter that leaves no signs falls back to all signs, so the carousel always
 * has something to show.
 *
 * @param {Object} [options] - Startup overrides.
 * @param {number|string|null} [options.since] - Only show signs in force since this year or "errors" for error signs;
 *        defaults to the stored carousel filter.
 * @param {number} [options.delay] - Slide delay in seconds; defaults to the stored delay.
 * @returns {void}
 */
export function startCarousel(options = {}) {
  let signItems = allQuestions.filter((q) => Boolean(q.sign));
  const sinceFilter = options.since !== undefined ? options.since : carouselState.filterSince;
  if (sinceFilter === "errors") {
    const errorIds = new Set(getErrorQuestionIds());
    const wrongSigns = new Set(
      allQuestions
        .filter((q) => errorIds.has(String(q.id)) && q.sign)
        .map((q) => q.sign)
    );
    signItems = signItems.filter(
      (q) => errorIds.has(String(q.id)) || (q.sign && wrongSigns.has(q.sign))
    );
  } else if (sinceFilter !== null && sinceFilter !== undefined && sinceFilter !== "") {
    const minYear = typeof sinceFilter === "number" ? sinceFilter : parseInt(sinceFilter, 10);
    if (!isNaN(minYear)) {
      signItems = signItems.filter(
        (q) => typeof q.since === "number" && q.since >= minYear
      );
    }
  }
  if (signItems.length === 0) {
    signItems = allQuestions.filter((q) => Boolean(q.sign));
  }

  const delaySeconds = options.delay && options.delay > 0 ? options.delay : (carouselState.delayMs ? carouselState.delayMs / 1000 : 8);
  carouselState.isActive = true;
  carouselState.items = shuffle(signItems);
  carouselState.currentIndex = 0;
  carouselState.delayMs = delaySeconds * 1000;
  carouselState.isPaused = false;
  carouselState.elapsedBeforePause = 0;
  carouselState.slideStartTime = Date.now();

  if (el.carouselDelayInfo) {
    el.carouselDelayInfo.textContent = t("carousel.delay_info", { seconds: delaySeconds });
  }

  if (el.carouselPauseOverlay) {
    el.carouselPauseOverlay.classList.add("hidden");
  }

  if (el.btnCarouselToggle) {
    el.btnCarouselToggle.classList.remove("is-paused");
    el.btnCarouselToggle.setAttribute("aria-label", t("carousel.btn_toggle_pause_aria"));
    el.btnCarouselToggle.setAttribute("title", t("carousel.btn_toggle_pause_tooltip"));
    el.btnCarouselToggle.setAttribute("data-tooltip", t("carousel.btn_toggle_pause_tooltip"));
    renderCarouselToggleIcons(false);
  }
  if (el.carouselToggleText) el.carouselToggleText.textContent = t("carousel.toggle_text_pause");
  if (el.carouselShortcutHint) {
    el.carouselShortcutHint.innerHTML = t("carousel.shortcut_hint_pause");
  }

  showScreen("carousel");
  renderCarouselCard();
  startCarouselTimer();
  if (el.btnCarouselToggle) {
    el.btnCarouselToggle.focus();
  }
}

/**
 * Stop the carousel and return to the start screen.
 *
 * @returns {void}
 */
export function stopCarousel() {
  pauseCarouselTimer();
  carouselState.isActive = false;
  carouselState.isPaused = true;
  showScreen("start");
}

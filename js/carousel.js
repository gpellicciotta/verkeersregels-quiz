import { el } from "./dom.js";
import { carouselState, allQuestions } from "./state.js";
import { shuffle, getSinceBadge, getSignCode } from "./utils.js";
import { showScreen } from "./screens.js";
import { t } from "./i18n.js";
import { applyTranslation } from "./quiz.js";

export function formatCategoryName(cat) {
  if (!cat) return t("carousel.cat.default");
  const key = `carousel.cat.${cat}`;
  const translated = t(key);
  // If the key wasn't found, t() returns the key itself — fall back to capitalised cat
  return translated !== key ? translated : cat.charAt(0).toUpperCase() + cat.slice(1);
}

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
      el.carouselSourceLink.href = item.source;
      el.carouselSourceWrap.classList.remove("hidden");
    } else {
      el.carouselSourceWrap.classList.add("hidden");
    }
  }

  if (el.carouselProgressFill) {
    el.carouselProgressFill.style.width = "0%";
  }
}

export function startCarouselTimer() {
  if (carouselState.animFrameId) {
    cancelAnimationFrame(carouselState.animFrameId);
    carouselState.animFrameId = null;
  }
  if (carouselState.isPaused || !carouselState.isActive) return;

  carouselState.slideStartTime = Date.now() - carouselState.elapsedBeforePause;

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
      const pauseSvg = el.btnCarouselToggle.querySelector(".icon-pause");
      const playSvg = el.btnCarouselToggle.querySelector(".icon-play");
      if (pauseSvg && playSvg) {
        pauseSvg.classList.add("hidden");
        playSvg.classList.remove("hidden");
      }
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
      const pauseSvg = el.btnCarouselToggle.querySelector(".icon-pause");
      const playSvg = el.btnCarouselToggle.querySelector(".icon-play");
      if (pauseSvg && playSvg) {
        pauseSvg.classList.remove("hidden");
        playSvg.classList.add("hidden");
      }
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

export function startCarousel(options = {}) {
  let signItems = allQuestions.filter((q) => Boolean(q.sign));
  const sinceFilter = options.since !== undefined ? options.since : carouselState.filterSince;
  if (sinceFilter !== null && sinceFilter !== undefined) {
    signItems = signItems.filter(
      (q) => typeof q.since === "number" && q.since >= sinceFilter
    );
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
    const pauseSvg = el.btnCarouselToggle.querySelector(".icon-pause");
    const playSvg = el.btnCarouselToggle.querySelector(".icon-play");
    if (pauseSvg && playSvg) {
      pauseSvg.classList.remove("hidden");
      playSvg.classList.add("hidden");
    }
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

export function stopCarousel() {
  pauseCarouselTimer();
  carouselState.isActive = false;
  carouselState.isPaused = true;
  showScreen("start");
}

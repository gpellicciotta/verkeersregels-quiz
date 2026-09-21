import { el } from "./dom.js";
import { carouselState, allQuestions } from "./state.js";
import { shuffle, getSinceBadge } from "./utils.js";
import { showScreen } from "./screens.js";

export function formatCategoryName(cat) {
  const map = {
    gevaar: "Gevaar",
    voorrang: "Voorrang",
    verbod: "Verbod",
    gebod: "Gebod",
    parkeren: "Parkeren & Stilstaan",
    aanwijzing: "Aanwijzing",
    snelheid: "Snelheid",
    autosnelweg: "Autosnelweg",
    "fietsers-voetgangers": "Fietsers & Voetgangers",
  };
  return map[cat] || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "Verkeersbord");
}

export function renderCarouselCard() {
  if (!carouselState.items || carouselState.items.length === 0) return;
  const item = carouselState.items[carouselState.currentIndex];

  if (el.carouselSignImg) {
    el.carouselSignImg.src = item.sign || "";
    el.carouselSignImg.alt =
      item.options && item.correctIndex != null ? item.options[item.correctIndex] : "Verkeersbord";
  }

  if (el.carouselCounter) {
    el.carouselCounter.textContent = `Bord ${carouselState.currentIndex + 1} / ${carouselState.items.length}`;
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
    const signName =
      item.options && item.correctIndex != null ? item.options[item.correctIndex] : (item.question || "");
    el.carouselSignTitle.textContent = signName;
  }

  if (el.carouselExplanation) {
    el.carouselExplanation.textContent = item.explanation || "";
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
      el.btnCarouselToggle.setAttribute("aria-label", "Hervatten");
      el.btnCarouselToggle.setAttribute("title", "Hervatten (Spatiebalk)");
      el.btnCarouselToggle.setAttribute("data-tooltip", "Hervatten (Spatiebalk)");
      const pauseSvg = el.btnCarouselToggle.querySelector(".icon-pause");
      const playSvg = el.btnCarouselToggle.querySelector(".icon-play");
      if (pauseSvg && playSvg) {
        pauseSvg.classList.add("hidden");
        playSvg.classList.remove("hidden");
      }
    }
    if (el.carouselToggleText) el.carouselToggleText.textContent = "Hervatten";
    if (el.carouselShortcutHint) {
      el.carouselShortcutHint.innerHTML = 'Tip: klik op de kaart of druk op <kbd class="kbd-key">Spatie</kbd> om te hervatten';
    }
  } else {
    if (el.carouselPauseOverlay) el.carouselPauseOverlay.classList.add("hidden");
    if (el.btnCarouselToggle) {
      el.btnCarouselToggle.classList.remove("is-paused");
      el.btnCarouselToggle.setAttribute("aria-label", "Pauzeren");
      el.btnCarouselToggle.setAttribute("title", "Pauzeren (Spatiebalk)");
      el.btnCarouselToggle.setAttribute("data-tooltip", "Pauzeren (Spatiebalk)");
      const pauseSvg = el.btnCarouselToggle.querySelector(".icon-pause");
      const playSvg = el.btnCarouselToggle.querySelector(".icon-play");
      if (pauseSvg && playSvg) {
        pauseSvg.classList.remove("hidden");
        playSvg.classList.add("hidden");
      }
    }
    if (el.carouselToggleText) el.carouselToggleText.textContent = "Pauzeren";
    if (el.carouselShortcutHint) {
      el.carouselShortcutHint.innerHTML = 'Tip: klik op de kaart of druk op <kbd class="kbd-key">Spatie</kbd> om te pauzeren';
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
    el.carouselDelayInfo.textContent = `Wisselt elke ${delaySeconds} seconden`;
  }

  if (el.carouselPauseOverlay) {
    el.carouselPauseOverlay.classList.add("hidden");
  }

  if (el.btnCarouselToggle) {
    el.btnCarouselToggle.classList.remove("is-paused");
    el.btnCarouselToggle.setAttribute("aria-label", "Pauzeren");
    el.btnCarouselToggle.setAttribute("title", "Pauzeren (Spatiebalk)");
    el.btnCarouselToggle.setAttribute("data-tooltip", "Pauzeren (Spatiebalk)");
    const pauseSvg = el.btnCarouselToggle.querySelector(".icon-pause");
    const playSvg = el.btnCarouselToggle.querySelector(".icon-play");
    if (pauseSvg && playSvg) {
      pauseSvg.classList.remove("hidden");
      playSvg.classList.add("hidden");
    }
  }
  if (el.carouselToggleText) el.carouselToggleText.textContent = "Pauzeren";
  if (el.carouselShortcutHint) {
    el.carouselShortcutHint.innerHTML = 'Tip: klik op de kaart of druk op <kbd class="kbd-key">Spatie</kbd> om te pauzeren';
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

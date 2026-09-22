export function getSinceFilter() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const param = params.get("since") || params.get("sinds") || params.get("s");
  if (!param) return null;
  const year = parseInt(param, 10);
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

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

export function getThemeQueryOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("theme");
  if (!raw) return null;
  const val = raw.trim().toLowerCase();
  return val === "dark" || val === "light" || val === "system" ? val : null;
}

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

export function getNameParam() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("name") || params.get("naam") || params.get("n");
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getQuestionCountOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("q") || params.get("quantity");
  if (!raw) return null;
  const q = parseInt(raw, 10);
  return Number.isInteger(q) && q > 0 ? q : null;
}

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

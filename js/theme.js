import { getThemeParam, getThemeColorParam } from "./params.js";

export function applyTheme(themeSetting, themeColor) {
  if (typeof document === "undefined" || !document.documentElement) return;
  const setting = (themeSetting || getThemeParam() || "system").toLowerCase();
  const color = (themeColor || getThemeColorParam() || "blue").toLowerCase();

  let resolvedTheme = setting;
  if (setting === "system") {
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    resolvedTheme = prefersDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.setAttribute("data-theme-setting", setting);
  document.documentElement.setAttribute("data-theme-color", color);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    if (resolvedTheme === "dark") {
      metaThemeColor.setAttribute("content", "#0f172a");
    } else {
      if (color === "yellow") metaThemeColor.setAttribute("content", "#ca8a04");
      else if (color === "red") metaThemeColor.setAttribute("content", "#dc2626");
      else metaThemeColor.setAttribute("content", "#1a56db");
    }
  }
}

let themeMediaQueryListenerAttached = false;

export function initTheme() {
  const setting = getThemeParam();
  const color = getThemeColorParam();
  applyTheme(setting, color);

  if (!themeMediaQueryListenerAttached && typeof window !== "undefined" && window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const currentSetting = (document.documentElement && document.documentElement.getAttribute("data-theme-setting")) || getThemeParam();
      if (currentSetting === "system") {
        const currentColor = (document.documentElement && document.documentElement.getAttribute("data-theme-color")) || getThemeColorParam();
        applyTheme("system", currentColor);
      }
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
      themeMediaQueryListenerAttached = true;
    } else if (mql.addListener) {
      mql.addListener(handler);
      themeMediaQueryListenerAttached = true;
    }
  }
}

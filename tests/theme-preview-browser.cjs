/**
 * Real browser tests verifying instant theme and accent color preview in settings,
 * revert on close (x-button or Escape), and persistence on save.
 */
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

const screenshots = process.argv.includes("--screenshots");
const url = process.env.QUIZ_TEST_URL || "http://127.0.0.1:8073/";
const artifacts = path.resolve(__dirname, "../tasks");
const screenshotPrefix = process.env.QUIZ_SCREENSHOT_PREFIX || "T0073";

(async () => {
  console.log(`Theme preview browser PID ${process.pid}; server ${url}`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(`${url}?lang=nl`);
    assert.equal(response.status(), 200);
    await page.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);

    /**
     * Capture a task screenshot, unless the run was started without screenshots.
     *
     * @param {string} suffix - Screenshot name suffix after the task prefix.
     * @returns {Promise<void>} Resolves once the screenshot is written or skipped.
     */
    const snap = async (suffix) => {
      if (screenshots) {
        await page.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-${suffix}.png`), fullPage: true });
      }
    };

    // 1. Capture baseline start screen
    await snap("view-before");

    // 2. Open settings view
    await page.locator("#btn-config").click();
    await page.locator("#screen-config").waitFor({ state: "visible" });
    await snap("config-before");

    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    const initialThemeSetting = await page.evaluate(() => document.documentElement.getAttribute("data-theme-setting"));
    const initialThemeColor = await page.evaluate(() => document.documentElement.getAttribute("data-theme-color"));
    assert.equal(initialThemeSetting, "system");
    assert.equal(initialThemeColor, "blue");

    // 3. Change theme to dark and color to red -> check instant preview
    await page.locator("#config-theme").selectOption("dark");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme")), "dark");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-setting")), "dark");

    await page.locator("#config-theme-color").selectOption("red");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-color")), "red");

    await snap("preview-dark-red");

    // 4. Click close button (x-knop) -> should revert to initial settings
    await page.locator("#btn-config-close").click();
    await page.locator("#screen-start").waitFor({ state: "visible" });

    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme")), initialTheme);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-setting")), initialThemeSetting);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-color")), initialThemeColor);
    await snap("close-reverted");

    // 5. Reopen settings view -> verify select values match active theme
    await page.locator("#btn-config").click();
    await page.locator("#screen-config").waitFor({ state: "visible" });
    assert.equal(await page.locator("#config-theme").inputValue(), initialThemeSetting);
    assert.equal(await page.locator("#config-theme-color").inputValue(), initialThemeColor);

    // 6. Change to dark + yellow and press Escape -> should revert
    await page.locator("#config-theme").selectOption("dark");
    await page.locator("#config-theme-color").selectOption("yellow");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme")), "dark");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-color")), "yellow");

    await page.keyboard.press("Escape");
    await page.locator("#screen-start").waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme")), initialTheme);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-setting")), initialThemeSetting);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-color")), initialThemeColor);

    // 7. Reopen settings view, select dark + yellow, and click Opslaan -> should persist
    await page.locator("#btn-config").click();
    await page.locator("#screen-config").waitFor({ state: "visible" });
    await page.locator("#config-theme").selectOption("dark");
    await page.locator("#config-theme-color").selectOption("yellow");
    await page.locator("#btn-config-save").click();
    await page.locator("#screen-start").waitFor({ state: "visible" });

    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme")), "dark");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-setting")), "dark");
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-theme-color")), "yellow");

    // Check localStorage persistence
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("verkeersquiz_preferences") || "{}"));
    assert.equal(stored.theme, "dark");
    assert.equal(stored.themeColor, "yellow");

    await snap("view-after");

    assert.equal(errors.length, 0, `Page errors encountered: ${errors.join(", ")}`);
    console.log("Theme preview browser test PASSED with 0 errors.");
  } finally {
    await browser.close();
  }
})();

/** Exercise quiz cancellation in a real browser against the local review server. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

const baseline = process.argv.includes("--baseline");
const screenshots = baseline || process.argv.includes("--screenshots");
const url = process.env.QUIZ_TEST_URL || "http://127.0.0.1:8062/";
const artifacts = path.resolve(__dirname, "../tasks");
const screenshotPrefix = process.env.QUIZ_SCREENSHOT_PREFIX || "T0062";

(async () => {
  console.log(`Quiz cancellation browser PID ${process.pid}; server ${url}`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 667 }, { width: 320, height: 568 }]) {
      const mobile = viewport.width < 600;
      const context = await browser.newContext({ viewport, serviceWorkers: "block" });
      const page = await context.newPage();
      const errors = [];
      const posts = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await context.route("**/*", (route) => {
        if (route.request().method() === "POST") posts.push(route.request().url());
        return new URL(route.request().url()).origin === new URL(url).origin
          ? route.continue() : route.fulfill({ status: 200, body: "{}" });
      });
      await page.addInitScript(() => { Math.random = () => 0.5; });
      const response = await page.goto(`${url}?q=3&type=sign&lang=nl`);
      assert.equal(response.status(), 200);
      await page.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);
      await page.locator("#player-name").fill("Test Player");
      await page.locator("#btn-start").click();
      try {
        await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor({ timeout: 5000 });
      } catch (error) {
        console.log(await page.evaluate(() => ({ text: document.body.innerText, active: document.activeElement.id })), errors);
        throw error;
      }
      await page.locator("#question-image").evaluate((img) => img.decode());
      /**
       * Capture a task screenshot named after the viewport, unless screenshots are off.
       *
       * @param {string} suffix - Screenshot name suffix after the task prefix and viewport label.
       * @returns {Promise<void>} Resolves once the screenshot is written or skipped.
       */
      const snap = async (suffix) => {
        const label = viewport.width === 320 ? "narrow" : mobile ? "mobile" : "view";
        if (screenshots) await page.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-${label}-${suffix}.png`), fullPage: true });
      };
      await snap(baseline ? "before" : "after");
      if (baseline) {
        console.log(`PASS baseline: HTTP 200, visible question, ${viewport.width}x${viewport.height}`);
        await context.close();
        continue;
      }

      const dialog = page.locator("#modal-quiz-cancel");
      const close = page.locator("#btn-quiz-close");
      /**
       * Assert the quiz close button sits inside the card and overlaps no other control.
       *
       * @returns {Promise<Object>} Bounding box of the close button.
       */
      const checkClosePosition = async () => {
        const card = await page.locator("#app").boundingBox();
        const button = await close.boundingBox();
        assert.equal(await close.evaluate((el) => el.offsetParent.id), "app", "Anchor the close button to the ancestor card");
        assert.ok(Math.abs(button.y - card.y - 12) < 0.5, "Close button must sit 12px below the card top");
        assert.ok(Math.abs(card.x + card.width - button.x - button.width - 12) < 0.5, "Close button must sit 12px inside the card right edge");
        for (const selector of ["#quiz-score", "#quiz-progress", "#quiz-status-indicator"]) {
          const item = page.locator(selector);
          if (!(await item.isVisible())) continue;
          const rect = await item.boundingBox();
          const overlaps = button.x < rect.x + rect.width && button.x + button.width > rect.x &&
            button.y < rect.y + rect.height && button.y + button.height > rect.y;
          assert.equal(overlaps, false, `Close button must not overlap ${selector}`);
        }
        return button;
      };
      const quizCloseRect = await checkClosePosition();
      const keep = page.locator("#btn-quiz-continue");
      const stop = page.locator("#btn-quiz-stop");
      /**
       * Serialize the page's quiz state, so it can be compared before and after an action.
       *
       * @returns {Promise<string>} JSON representation of the quiz state.
       */
      const stateSnapshot = () => page.evaluate(async () => JSON.stringify((await import("./js/state.js")).state));
      const initial = await stateSnapshot();
      await close.click();
      await dialog.waitFor({ state: "visible" });
      assert.equal(await keep.evaluate((el) => el === document.activeElement), true);
      await page.keyboard.press("Enter");
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await stateSnapshot(), initial);

      await page.locator("#options .option-btn").first().click();
      await page.locator("#btn-next").click();
      await page.locator("#options .option-btn").first().click();
      const progress = await stateSnapshot();
      const question = await page.locator("#question-text").textContent();
      const prefs = await page.evaluate(() => JSON.stringify(localStorage));
      await checkClosePosition();
      for (const dismiss of ["continue", "escape", "close", "backdrop"]) {
        await close.click();
        await dialog.waitFor({ state: "visible" });
        if (dismiss === "continue") {
          for (let i = 0; i < 8; i++) {
            await page.keyboard.press(i < 4 ? "Tab" : "Shift+Tab");
            assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true);
          }
          await keep.click();
        } else if (dismiss === "escape") {
          await page.keyboard.press("Escape");
        } else if (dismiss === "close") {
          await page.locator("#btn-quiz-cancel-close").click();
        } else {
          await page.mouse.click(2, 2);
        }
        assert.equal(await dialog.isVisible(), false, dismiss);
        assert.equal(await stateSnapshot(), progress, dismiss);
        assert.equal(await page.locator("#question-text").textContent(), question);
        assert.equal(await close.evaluate((el) => el === document.activeElement), true);
      }
      await snap("answered");
      await close.click();
      await page.waitForTimeout(220);
      await snap("confirmation");
      await dialog.locator(".modal-desc").click();
      assert.equal(await dialog.isVisible(), true, "Dialog content must not dismiss it");
      await stop.click();
      await page.locator("#screen-start").waitFor({ state: "visible" });
      const stopped = JSON.parse(await stateSnapshot());
      assert.deepEqual(stopped.round, []);
      assert.deepEqual(stopped.answers, []);
      assert.equal(stopped.currentIndex, 0);
      assert.equal(stopped.startTime, null);
      assert.equal(stopped.endTime, null);
      assert.equal(stopped.durationSeconds, 0);
      assert.equal(stopped.playerName, "Test Player");
      assert.equal(await page.locator("#player-name").inputValue(), "Test Player");
      assert.equal(await page.evaluate(() => JSON.stringify(localStorage)), prefs);
      assert.equal(await page.locator("#btn-start").evaluate((el) => el === document.activeElement), true);
      assert.deepEqual(posts, [], "Abandoned rounds must not submit scores");
      await page.locator("#btn-start").click();
      const restarted = JSON.parse(await stateSnapshot());
      assert.equal(restarted.round.length, 3);
      assert.deepEqual(restarted.answers, []);
      assert.equal(restarted.currentIndex, 0);

      for (const lang of ["nl", "fr", "de", "it", "en"]) {
        assert.equal((await page.goto(`${url}?q=3&type=sign&autostart=1&lang=${lang}`)).status(), 200);
        await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
        await checkClosePosition();
        await close.click();
        const dict = await page.evaluate(async (lang) => (await fetch(`data/strings.${lang}.json`)).json(), lang);
        assert.equal(await dialog.locator("h3").textContent(), dict["quiz.cancel_title"]);
        assert.equal(await dialog.locator(".modal-desc").textContent(), dict["quiz.cancel_description"]);
        assert.equal(await keep.textContent(), dict["quiz.cancel_continue"]);
        assert.equal(await stop.textContent(), dict["quiz.cancel_confirm"]);
        assert.equal(await close.getAttribute("aria-label"), dict["quiz.btn_close_aria"]);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const rect = await dialog.boundingBox();
        assert.ok(rect.x >= 0 && rect.x + rect.width <= viewport.width);
        if (mobile && lang === "de") {
          await page.evaluate(async () => (await import("./js/theme.js")).applyTheme("dark"));
          await page.waitForTimeout(220);
          await snap("dark-de");
        }
        await keep.click();
      }
      await close.click();
      await stop.click();
      assert.equal(await page.locator("#screen-start").isVisible(), true);
      assert.deepEqual(posts, [], "Cancelling before the first answer must not submit results");
      await page.locator("#btn-start").click();
      // Completing a fresh round still reaches results and submits exactly once.
      for (let i = 0; i < 3; i++) {
        await page.locator("#options .option-btn").first().click();
        if (i === 2) {
          const last = await stateSnapshot();
          await close.click();
          await keep.click();
          assert.equal(await stateSnapshot(), last, "Keep the final answer when dismissing cancellation");
        }
        await page.locator("#btn-next").click();
      }
      await page.locator("#screen-result").waitFor({ state: "visible" });
      assert.equal(await close.isVisible(), false);
      const resultCloseRect = await page.locator("#btn-result-close").boundingBox();
      assert.equal(resultCloseRect.x, quizCloseRect.x, "Match the result close button's horizontal placement");
      // Mobile result pages may scroll; compare positions relative to the same card.
      assert.equal(await page.locator("#btn-result-close").evaluate((el) => getComputedStyle(el).top), "12px");
      assert.equal(resultCloseRect.width, quizCloseRect.width, "Match the existing close button size");
      assert.equal(posts.length, 1);
      assert.deepEqual(errors, []);
      console.log(`PASS ${viewport.width}x${viewport.height}: dismissal, keyboard focus, reset, preferences, five languages, completion, no abandoned score`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

/** Exercise the error-review start/retry flow in a real browser against the local review server. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

const screenshots = process.argv.includes("--screenshots") || process.argv.includes("--baseline");
const baseline = process.argv.includes("--baseline");
const url = process.env.QUIZ_TEST_URL || "http://127.0.0.1:8068/";
const artifacts = path.resolve(__dirname, "../tasks");
const screenshotPrefix = process.env.QUIZ_SCREENSHOT_PREFIX || "T0068";

/**
 * Answer the current question wrongly, so it lands in the stored error history.
 *
 * @param {import("playwright").Page} page - Page showing an active quiz question.
 * @returns {Promise<void>} Resolves once the wrong option has been clicked.
 */
async function answerWrong(page) {
  await page.evaluate(async () => {
    const { state } = await import("./js/state.js");
    const q = state.round[state.currentIndex];
    const wrongIndex = q.options.findIndex((_, i) => i !== q.correctIndex);
    document.querySelectorAll("#options .option-btn")[wrongIndex].click();
  });
}

(async () => {
  console.log(`Error-review browser PID ${process.pid}; server ${url}`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await context.route("**/*", (route) => {
      return new URL(route.request().url()).origin === new URL(url).origin
        ? route.continue() : route.fulfill({ status: 200, body: "{}" });
    });

    /**
     * Capture a task screenshot, unless the run was started without screenshots.
     *
     * @param {string} suffix - Screenshot name suffix after the task prefix.
     * @returns {Promise<void>} Resolves once the screenshot is written or skipped.
     */
    const snap = async (suffix) => {
      if (screenshots) await page.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-${suffix}.png`), fullPage: true });
    };

    // Baseline: fresh visitor, no stored errors yet -> review button must stay hidden.
    await page.goto(`${url}?q=3&type=sign&lang=nl`);
    await page.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);
    assert.equal(await page.locator("#btn-start-errors").isVisible(), false, "hidden with no error history");
    await snap(`start-${baseline ? "before" : "after"}`);
    if (baseline) {
      console.log("PASS baseline: HTTP 200, start screen renders, no review button without history");
      await context.close();
      await browser.close();
      return;
    }

    // 1. Play a perfect round: all correct -> retry button on result screen must stay hidden, and start button stays hidden.
    await page.locator("#btn-start").click();
    await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
    for (let i = 0; i < 3; i++) {
      await page.evaluate(async () => {
        const { state } = await import("./js/state.js");
        const q = state.round[state.currentIndex];
        document.querySelectorAll("#options .option-btn")[q.correctIndex].click();
      });
      await page.locator("#btn-next").click();
    }
    await page.locator("#screen-result").waitFor({ state: "visible" });
    assert.equal(await page.locator("#btn-result-retry-errors").isVisible(), false, "retry button hidden on perfect score");
    await page.locator("#btn-result-close").click();
    await page.locator("#screen-start").waitFor({ state: "visible" });
    assert.equal(await page.locator("#btn-start-errors").isVisible(), false, "start review button still hidden after perfect round");

    // 2. Answer one question wrong to build up error + last-quiz-wrong history.
    await page.locator("#btn-start").click();
    await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
    const wrongQuestionText = await page.evaluate(async () => {
      const { state } = await import("./js/state.js");
      return state.round[0].question;
    });
    await answerWrong(page);
    await page.locator("#btn-next").click();
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async () => {
        const { state } = await import("./js/state.js");
        const q = state.round[state.currentIndex];
        document.querySelectorAll("#options .option-btn")[q.correctIndex].click();
      });
      await page.locator("#btn-next").click();
    }
    await page.locator("#screen-result").waitFor({ state: "visible" });
    assert.equal(await page.locator("#btn-result-retry-errors").isVisible(), true, "retry button shows after a wrong answer");
    await snap("result-after");

    // Retry with only the wrong question from this round.
    await page.locator("#btn-result-retry-errors").click();
    await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
    const retryRound = await page.evaluate(async () => {
      const { state } = await import("./js/state.js");
      return state.round.map((q) => q.question);
    });
    assert.deepEqual(retryRound, [wrongQuestionText], "retry round must contain only the missed question");
    await answerWrong(page);
    await page.locator("#btn-next").click();
    await page.locator("#screen-result").waitFor({ state: "visible" });
    await page.locator("#btn-result-close").click();

    // Start screen: review-errors button now visible since stats has an error on record.
    await page.locator("#screen-start").waitFor({ state: "visible" });
    assert.equal(await page.locator("#btn-start-errors").isVisible(), true, "review button appears once an error is on record");
    await snap("start-after");

    await page.locator("#btn-start-errors").click();
    await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
    const reviewRound = await page.evaluate(async () => {
      const { state } = await import("./js/state.js");
      return state.round.map((q) => q.question);
    });
    assert.deepEqual(reviewRound, [wrongQuestionText], "error-review round must contain every all-time error question");
    await answerWrong(page);
    await page.locator("#btn-next").click();
    await page.locator("#screen-result").waitFor({ state: "visible" });
    await page.locator("#btn-result-close").click();
    await page.locator("#screen-start").waitFor({ state: "visible" });

    // Settings checkbox: enabling it must force last quiz's wrong question(s) into a fresh round.
    await page.locator("#btn-config").click();
    await page.locator("#screen-config").waitFor({ state: "visible" });
    await page.locator("#config-always-include-errors").check();
    await snap("config-after");
    await page.locator("#btn-config-save").click();
    assert.equal(
      await page.evaluate(() => JSON.parse(localStorage.getItem("verkeersquiz_preferences")).alwaysIncludeLastErrors),
      true,
    );

    await page.locator("#btn-start").click();
    await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
    const forcedRound = await page.evaluate(async () => {
      const { state } = await import("./js/state.js");
      return state.round.map((q) => q.question);
    });
    assert.ok(forcedRound.includes(wrongQuestionText), "always-include setting must force in the last quiz's wrong question");

    assert.deepEqual(errors, []);
    console.log("PASS: review button gating, error-review round, per-round retry, always-include-errors setting");
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

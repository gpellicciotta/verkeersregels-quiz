/** Exercise the "Report issue" button and its per-screen default context in a real browser. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

const screenshots = process.argv.includes("--screenshots");
const url = process.env.QUIZ_TEST_URL || "http://127.0.0.1:8063/";
const artifacts = path.resolve(__dirname, "../tasks");
const screenshotPrefix = process.env.QUIZ_SCREENSHOT_PREFIX || "T0069";

(async () => {
  console.log(`Report issue browser PID ${process.pid}; server ${url}`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    const posts = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await context.route("**/*", (route) => {
      const req = route.request();
      if (req.method() === "POST") posts.push({ url: req.url(), body: req.postData() });
      return new URL(req.url()).origin === new URL(url).origin
        ? route.continue() : route.fulfill({ status: 200, body: "{}" });
    });

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
      if (screenshots) await page.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-${suffix}.png`), fullPage: true });
    };

    /**
     * Decode a form-encoded request body into a plain object.
     *
     * @param {string} body - Form-encoded request body of an intercepted report.
     * @returns {Object} Submitted fields keyed by name.
     */
    const parseParams = (body) => Object.fromEntries(new URLSearchParams(body));

    // 1. Start screen: the former decorative hint icon is now a real report button.
    await snap("start-before");
    await page.locator("#btn-report-start").click();
    await page.locator("#modal-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#modal-question-id").isVisible(), false, "View context must not show a question-id prefix");
    assert.equal(await page.locator("#modal-question-text").textContent(), "Start scherm");
    await snap("start-modal");
    await page.locator("#report-remark").fill("Testmelding vanaf startscherm");
    await page.locator("#btn-modal-submit").click();
    await page.waitForTimeout(150);
    let last = parseParams(posts[posts.length - 1].body);
    assert.equal(last.vraagId, "");
    assert.equal(last.vraag, "Start scherm");
    assert.equal(last.opmerking, "Testmelding vanaf startscherm");
    assert.equal(await page.locator("#modal-report").isVisible(), false);

    // 2. Quiz screen: existing per-question report buttons keep working unchanged.
    await page.locator("#player-name").fill("Test Player");
    await page.locator("#btn-start").click();
    await page.locator("#question-text").filter({ hasText: /.+/ }).waitFor();
    const question = await page.locator("#question-text").textContent();
    await page.locator("#btn-report-error").click();
    await page.locator("#modal-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#modal-question-id").isVisible(), true, "Question context must show a Vraag id prefix");
    assert.equal(await page.locator("#modal-question-text").textContent(), question);
    await page.locator("#btn-modal-cancel").click();

    // 3. Carousel screen: default context is the currently shown traffic sign.
    await page.goto(`${url}?mode=carousel&pause=1&lang=nl`);
    await page.locator("#carousel-sign-title").filter({ hasText: /.+/ }).waitFor();
    const signTitle = await page.locator("#carousel-sign-title").textContent();
    await snap("carousel-before");
    await page.locator("#btn-report-carousel").click();
    await page.locator("#modal-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#modal-question-text").textContent(), signTitle);
    await snap("carousel-modal");
    await page.locator("#btn-modal-cancel").click();

    // 4. Result screen: default context is the view name "Quiz resultaten".
    await page.goto(`${url}?autotest=results&lang=nl`);
    await page.locator("#screen-result").waitFor({ state: "visible" });
    await snap("result-before");
    await page.locator("#btn-report-result").click();
    await page.locator("#modal-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#modal-question-text").textContent(), "Quiz resultaten");
    await snap("result-modal");
    await page.locator("#btn-modal-cancel").click();

    // 5. About screen: default context is the view name "Over deze app".
    await page.goto(`${url}?view=about&lang=nl`);
    await page.locator("#screen-about").waitFor({ state: "visible" });
    await snap("about-before");
    await page.locator("#btn-report-about").click();
    await page.locator("#modal-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#modal-question-text").textContent(), "Over deze app");
    await snap("about-modal");
    await page.locator("#btn-modal-cancel").click();

    // 6. Settings view: reachable from the start screen; default context is "Instellingen scherm"
    //    and the settings view must remain visible underneath the report modal.
    await page.goto(`${url}?lang=nl`);
    await page.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);
    await page.locator("#btn-config").click();
    await page.locator("#screen-config").waitFor({ state: "visible" });
    await snap("config-before");
    await page.locator("#btn-report-config").click();
    await page.locator("#modal-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#modal-question-text").textContent(), "Instellingen scherm");
    assert.equal(await page.locator("#screen-config").isVisible(), true, "Settings view must stay visible behind the report modal");
    await snap("config-modal");
    await page.locator("#btn-modal-cancel").click();
    assert.equal(await page.locator("#screen-config").isVisible(), true, "Closing the report modal must not leave the settings view");

    assert.deepEqual(errors, []);
    console.log("PASS: report button reachable and correctly contextualized on start, quiz, carousel, result, about, and settings");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

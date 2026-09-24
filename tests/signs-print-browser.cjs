/** Exercise the "print all road signs" button on the About page in a real browser. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

const screenshots = process.argv.includes("--screenshots") || process.argv.includes("--baseline");
const baseline = process.argv.includes("--baseline");
const url = process.env.QUIZ_TEST_URL || "http://127.0.0.1:8083/";
const artifacts = path.resolve(__dirname, "../tasks");
const screenshotPrefix = process.env.QUIZ_SCREENSHOT_PREFIX || "T0083";

(async () => {
  console.log(`Signs print browser PID ${process.pid}; server ${url}`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    /**
     * Capture a task screenshot, unless the run was started without screenshots.
     *
     * @param {string} suffix - Screenshot name suffix after the task prefix.
     * @returns {Promise<void>} Resolves once the screenshot is written or skipped.
     */
    const snap = async (suffix) => {
      if (screenshots) await page.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-${suffix}.png`), fullPage: true });
    };

    const response = await page.goto(`${url}?lang=nl`);
    assert.equal(response.status(), 200);
    await page.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);
    const originalTitle = await page.title();

    await page.locator("#btn-about").click();
    await page.locator("#screen-about").waitFor({ state: "visible" });
    await page.locator(".about-sources-card").scrollIntoViewIfNeeded();

    if (baseline) {
      await snap("view-before");
      assert.equal(await page.locator("#btn-print-signs").count(), 0, "print-signs button must not exist yet");
      console.log("PASS baseline: HTTP 200, About screen renders, print-signs button absent");
      await context.close();
      await browser.close();
      return;
    }

    await page.locator("#btn-print-signs").waitFor({ state: "visible" });
    await page.locator("#btn-print-signs").scrollIntoViewIfNeeded();
    await snap("view-after");

    // Stub window.print so the test does not block on a real OS print dialog.
    await page.evaluate(() => { window.__printCalled = false; window.print = () => { window.__printCalled = true; }; });

    await page.locator("#btn-print-signs").click();
    await page.waitForFunction(() => document.querySelectorAll("#print-signs-document tr").length > 0);
    // printSignsDocument() awaits every thumbnail's decode() before calling window.print(),
    // so wait for the print-mode class (added just before the call) rather than asserting immediately.
    await page.waitForFunction(() => document.body.classList.contains("printing-signs-doc"));

    assert.equal(await page.evaluate(() => window.__printCalled), true, "window.print() must be invoked");

    // Regression check for the "icons missing on first print" bug: every thumbnail must have
    // finished loading (successfully or not) by the time the print dialog is triggered.
    const incompleteThumbnails = await page.evaluate(
      () => [...document.querySelectorAll("#print-signs-document .signs-doc-thumb")].filter((img) => !img.complete).length
    );
    assert.equal(incompleteThumbnails, 0, "every sign thumbnail must finish loading before window.print() is called");

    // Every sign in the question bank with a `sign` field must appear exactly once.
    const expectedSignCount = await page.evaluate(async () => {
      const { allQuestions } = await import("./js/state.js");
      return new Set(allQuestions.filter((q) => q.sign).map((q) => q.sign)).size;
    });
    const rowCount = await page.locator("#print-signs-document tbody tr").count();
    assert.equal(rowCount, expectedSignCount, `must list every unique sign exactly once (${expectedSignCount} expected)`);

    // Series sections must appear in wegcode.be order: A, B, C, D, E, F.
    const seriesHeadings = await page.locator(".signs-doc-series-title").allTextContents();
    const seriesLetters = seriesHeadings.map((h) => h.trim().charAt(0));
    assert.deepEqual(seriesLetters, ["A", "B", "C", "D", "E", "F"], "series must appear in A-F Wegcode order");

    // Within a series, codes must be in ascending natural order (spot-check series A).
    const codesA = await page.locator(".signs-doc-table").first().locator("tbody tr td.signs-doc-col-code").allTextContents();
    assert.deepEqual(codesA.slice(0, 4), ["A1a", "A1b", "A1c", "A1d"], "series A must start A1a, A1b, A1c, A1d");

    // Every row must link to wegcode.be, showing the article number as its text.
    const sourceLinks = await page.evaluate(() =>
      [...document.querySelectorAll("#print-signs-document .signs-doc-col-source a")].map((a) => ({
        host: new URL(a.href).host,
        text: a.textContent.trim(),
      }))
    );
    assert.ok(sourceLinks.length > 0 && sourceLinks.every((l) => l.host === "www.wegcode.be"), "every row must link to wegcode.be");
    assert.ok(sourceLinks.every((l) => /^Artikel \d+/.test(l.text)), "every source link must show its article number");

    // The document title is temporarily replaced so a print-to-PDF suggests a descriptive filename.
    const printingTitle = await page.evaluate(() => document.title);
    assert.notEqual(printingTitle, originalTitle, "document title must change while the signs document is printing");
    assert.match(printingTitle, /VerkeersQuiz/, "printing title must use the app's short brand name");

    // Emulate print media so the screenshot shows the actual printed layout
    // (the document stays display:none under normal screen media).
    await page.emulateMedia({ media: "print" });
    await snap("printing");
    await page.emulateMedia({ media: "screen" });

    // afterprint cleans the body class and the document title back up.
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.waitForFunction(() => !document.body.classList.contains("printing-signs-doc"));
    assert.equal(await page.evaluate(() => document.title), originalTitle, "document title must be restored after printing");

    // The "Exporteren als PDF" button reuses the same print flow.
    await page.evaluate(() => { window.__printCalled = false; });
    await page.locator("#btn-export-signs-pdf").waitFor({ state: "visible" });
    await page.locator("#btn-export-signs-pdf").click();
    await page.waitForFunction(() => document.body.classList.contains("printing-signs-doc"));
    assert.equal(await page.evaluate(() => window.__printCalled), true, "the PDF export button must also invoke window.print()");
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.waitForFunction(() => !document.body.classList.contains("printing-signs-doc"));

    assert.equal(errors.length, 0, `Page errors encountered: ${errors.join(", ")}`);
    console.log(`Signs print browser test PASSED with 0 errors (${rowCount} signs across ${seriesHeadings.length} series).`);
  } finally {
    await browser.close();
  }
})();

/**
 * Real browser tests verifying the Statistics view, desktop & mobile button visibility,
 * and data reset functionality with Playwright.
 */
const assert = require("node:assert/strict");
const path = require("node:path");
const http = require("node:http");
const fs = require("node:fs");
const { chromium } = require("playwright");

const screenshots = process.argv.includes("--screenshots");
const artifacts = path.resolve(__dirname, "../tasks");
const screenshotPrefix = process.env.QUIZ_SCREENSHOT_PREFIX || "T0075";

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/") reqPath = "/index.html";
  const filePath = path.join(__dirname, "..", reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
});

const PORT = 8076;

server.listen(PORT, async () => {
  console.log(`Stats browser test server running on port ${PORT}`);
  const browser = await chromium.launch({ headless: true });

  try {
    // ── 1. Desktop Viewport (1024x768) ─────────────────────────────────────────
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(`http://127.0.0.1:${PORT}/?lang=nl`);
    await page.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);

    // Verify #btn-stats exists and is visible on desktop
    const btnStats = page.locator("#btn-stats");
    await assert.doesNotReject(async () => {
      await btnStats.waitFor({ state: "visible" });
    });

    // Populate fake stats in localStorage
    await page.evaluate(() => {
      const stats = {
        gamesPlayed: 5,
        questionsAnswered: 40,
        correctAnswers: 32,
        wrongAnswers: 8,
        totalTimePlayedSeconds: 450, // 7.5 min -> 8 min
        lastPlayedAt: "2026-09-23T12:00:00.000Z",
        errorCounts: { 1: 2 },
        lastQuizWrongIds: ["1"],
      };
      localStorage.setItem("verkeersquiz_stats", JSON.stringify(stats));
    });

    // Click #btn-stats to open stats screen
    await btnStats.click();
    const screenStats = page.locator("#screen-stats");
    await screenStats.waitFor({ state: "visible" });

    // Verify rendered values
    const gamesText = await page.locator("#stats-games-played").textContent();
    const timeText = await page.locator("#stats-total-time").textContent();
    const questionsText = await page.locator("#stats-questions-answered").textContent();
    const scoreText = await page.locator("#stats-average-score").textContent();
    const correctText = await page.locator("#stats-correct-answers").textContent();
    const wrongText = await page.locator("#stats-wrong-answers").textContent();

    assert.equal(gamesText, "5");
    assert.equal(timeText, "8");
    assert.equal(questionsText, "40");
    assert.equal(scoreText, "80%");
    assert.equal(correctText, "32");
    assert.equal(wrongText, "8");

    if (screenshots) {
      await page.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-view-after.png`), fullPage: true });
    }

    // Test reset functionality
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await page.locator("#btn-stats-reset").click();
    await page.waitForTimeout(100);

    assert.equal(await page.locator("#stats-games-played").textContent(), "0");
    assert.equal(await page.locator("#stats-total-time").textContent(), "0");
    assert.equal(await page.locator("#stats-questions-answered").textContent(), "0");
    assert.equal(await page.locator("#stats-average-score").textContent(), "0%");

    // Close stats view
    await page.locator("#btn-stats-back").click();
    await page.locator("#screen-start").waitFor({ state: "visible" });

    // ── 2. Mobile Viewport (375x667) ──────────────────────────────────────────
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      serviceWorkers: "block",
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://127.0.0.1:${PORT}/?lang=nl`);
    await mobilePage.waitForFunction(async () => (await import("./js/state.js")).state.pool.length > 0);

    // When install button is NOT visible (default) -> btn-stats is visible
    const mobileBtnStats = mobilePage.locator("#btn-stats");
    const mobileBtnInstall = mobilePage.locator("#btn-install");

    assert.equal(await mobileBtnInstall.evaluate((el) => el.classList.contains("hidden")), true);
    assert.equal(await mobileBtnStats.isVisible(), true);

    if (screenshots) {
      await mobilePage.screenshot({ path: path.join(artifacts, `${screenshotPrefix}-view-after-mobile.png`), fullPage: true });
    }

    // When install button IS visible on mobile -> btn-stats is hidden on mobile
    await mobilePage.evaluate(() => {
      const btn = document.getElementById("btn-install");
      btn.classList.remove("hidden");
      const meta = document.querySelector(".start-meta-actions");
      if (meta) meta.classList.add("has-install-btn");
    });

    assert.equal(await mobileBtnInstall.isVisible(), true);
    assert.equal(await mobileBtnStats.isVisible(), false);

    assert.equal(errors.length, 0, `Browser console errors: ${errors.join(", ")}`);
    console.log("All browser tests passed successfully.");
  } finally {
    await browser.close();
    server.close(() => {
      process.exit(0);
    });
  }
});

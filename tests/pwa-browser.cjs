/** Verify real service worker upgrades, HTTP caching, and offline startup in Chromium. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const artifacts = path.join(root, "work", "pwa-verification");
fs.mkdirSync(artifacts, { recursive: true });
const baseline = process.argv.includes("--baseline");
let release = "old";
let failInstall = false;
let installs = 0;
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end();
    return;
  }
  if (pathname === "/data/strings.nl.json") {
    // Reproduce language loading that finishes after window.load.
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (failInstall && pathname === "/data/questions.json") {
    res.writeHead(503).end("Simulated interrupted deployment");
    return;
  }
  let body = fs.readFileSync(file);
  if (pathname === "/sw.js") {
    installs += 1;
    body = Buffer.from(body.toString().replace(/const CACHE_NAME = "[^"]+"/, `const CACHE_NAME = "verkeersquiz-test-${release}"`));
  }
  if (pathname === "/css/style.css") {
    body = Buffer.concat([body, Buffer.from(`\n:root { --test-release: ${release}; }\n`)]);
  }
  res.writeHead(200, {
    "Content-Type": mime[path.extname(file)] || "application/octet-stream",
    "Cache-Control": pathname === "/sw.js" ? "no-cache" : "public, max-age=86400",
  });
  res.end(body);
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`Browser verification PID ${process.pid}; server ${url}`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(url);
    assert.equal(response.status(), 200);
    await page.locator("#btn-start").waitFor({ state: "visible" });
    await page.screenshot({ path: path.join(artifacts, `pwa-update-view-${baseline ? "before" : "after"}.png`) });
    if (baseline) {
      await page.waitForTimeout(1500);
      const registrations = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length);
      console.log(`Baseline: HTTP 200, visible quiz, registrations after delayed language fetch: ${registrations}`);
      return;
    }
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    assert.equal(await page.evaluate(() => performance.getEntriesByType("navigation")[0].type), "navigate", "First installation must not reload");
    await page.evaluate(() => localStorage.setItem("pwa-test-preference", "retained"));
    await page.evaluate(async () => { await caches.open("unrelated-app"); });
    release = "new";
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue("--test-release").trim() === "new");
    assert.equal(await page.evaluate(() => performance.getEntriesByType("navigation")[0].type), "reload");
    assert.equal(await page.evaluate(() => localStorage.getItem("pwa-test-preference")), "retained");
    const keys = await page.evaluate(() => caches.keys());
    assert.ok(keys.includes("unrelated-app"));
    assert.ok(!keys.includes("verkeersquiz-test-old"));
    assert.equal(await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).updateViaCache), "none");
    failInstall = true;
    release = "broken";
    await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      await new Promise((resolve, reject) => {
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          worker.addEventListener("statechange", () => { if (worker.state === "redundant") resolve(); });
        }, { once: true });
        reg.update().catch(reject);
      });
    });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--test-release").trim()), "new");
    await context.setOffline(true);
    await page.reload();
    await page.locator("#btn-start").waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--test-release").trim()), "new");
    assert.deepEqual(errors, []);
    console.log(`PASS: delayed startup, no first-install reload, automatic upgrade, fresh cached assets, preferences, cache isolation, failed install, offline reload (${installs} worker requests)`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => server.close());

/** Render a synthetic summary email and verify its desktop and mobile layout. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');

const baseline = process.argv.includes('--baseline');
const artifacts = path.resolve(__dirname, '../tasks/summary-daily-stats');
const url = 'http://127.0.0.1:8062/tasks/summary-daily-stats/';
const context = vm.createContext({ console });
vm.runInContext(fs.readFileSync(path.resolve(__dirname, '../google-apps-script/Code.gs'), 'utf8'), context);
context.TRACKED_PLAYERS_ = ['Voorbeeldspeler'];
const now = new Date('2026-09-26T12:00:00Z');
const results = [
  { when: new Date('2026-09-26T08:00:00Z'), who: 'Voorbeeldspeler', correct: 18, total: 20, percentage: 90, durationSec: 960 },
  { when: new Date('2026-09-25T08:00:00Z'), who: 'Voorbeeldspeler', correct: 8, total: 10, percentage: 80, durationSec: 900 },
];
const phase = baseline ? 'before' : 'after';
const summary = context.buildSummaryEmail_(results, [], now);
fs.mkdirSync(artifacts, { recursive: true });
fs.writeFileSync(path.join(artifacts, `${phase}.html`),
  '<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<title>Summary email preview</title><link rel="icon" href="data:,"><body style="margin:0">' + summary.htmlBody + '</body></html>');

(async () => {
  console.log(`Summary browser PID ${process.pid}`);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1000, 375]) {
      const page = await browser.newPage({ viewport: { width, height: 1100 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') {
          errors.push(message.text());
        }
      });
      const response = await page.goto(`${url}${phase}.html`);
      assert.equal(response.status(), 200);
      await page.getByText('Voorbeeldspeler', { exact: true }).waitFor();
      if (!baseline) {
        const table = page.locator('table[aria-label="Dagelijkse oefenstatistieken"]');
        assert.equal(await table.locator('tbody tr').count(), 3);
        assert.deepEqual(await table.locator('thead th').allTextContents(),
          ['Dag', 'Vragen beantwoord', 'Score', 'Minuten gespeeld', 'Voldoende geoefend (> 15 min/dag)']);
        assert.match(await table.locator('tbody tr').nth(0).innerText(), /Vandaag.*26\/09\/2026/s);
        assert.equal(await table.locator('[aria-label="Voldoende geoefend"]').count(), 1);
        assert.equal(await table.locator('[aria-label="Onvoldoende geoefend"]').count(), 2);
        const cells = await table.locator('th, td').evaluateAll(nodes => nodes.every(node => node.scrollWidth <= node.clientWidth));
        assert.ok(cells, 'daily table cells must not overflow');
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal scrolling');
      await page.screenshot({ path: path.join(artifacts, `${phase}-${width}.png`), fullPage: true });
      assert.deepEqual(errors, []);
      console.log(`PASS ${phase} ${width}px: HTTP 200, visible email, no overflow or browser errors`);
      await page.close();
    }
  }
  finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

/** Execute the Apps Script summary-email logic in Node, without a live Google account. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../google-apps-script/Code.gs"), "utf8");

/**
 * Evaluate the Apps Script source in a fresh sandbox with stubbed Google globals.
 *
 * @param {Object} [extraGlobals] - Google service stubs to expose to the script.
 * @returns {Object} Sandbox context holding the script's globals and functions.
 */
function loadContext(extraGlobals) {
  const context = vm.createContext(Object.assign({ console }, extraGlobals));
  vm.runInContext(source, context);
  return context;
}

const HOUR = 60 * 60 * 1000;
const NOW = new Date("2026-09-22T19:00:00.000Z");

/**
 * Build one quiz result row relative to the fixed test clock.
 *
 * @param {number} hoursAgo - How long before the test clock the round was played.
 * @param {Object} [overrides] - Fields overriding the defaults.
 * @returns {Object} Result row as the summary builder expects it.
 */
function result(hoursAgo, overrides) {
  return Object.assign(
    { when: new Date(NOW.getTime() - hoursAgo * HOUR), who: "Speler", correct: 8, total: 10, percentage: 80, durationSec: 300 },
    overrides
  );
}

/**
 * Build one reported issue row relative to the fixed test clock.
 *
 * @param {number} hoursAgo - How long before the test clock the issue was reported.
 * @param {Object} [overrides] - Fields overriding the defaults.
 * @returns {Object} Issue row as the summary builder expects it.
 */
function issue(hoursAgo, overrides) {
  return Object.assign(
    { when: new Date(NOW.getTime() - hoursAgo * HOUR), questionId: "q1", question: "Wat betekent dit bord?", who: "Speler", remark: "" },
    overrides
  );
}

test("empty results and issues produce zero counts and n.v.t. averages", () => {
  const { buildSummaryEmail_ } = loadContext();
  const summary = buildSummaryEmail_([], [], NOW);
  assert.match(summary.body, /Aantal spelbeurten: 0 totaal, 0 \(7d\), 0 \(24u\)/);
  assert.match(summary.body, /Gem\. vragen per beurt: n\.v\.t\. totaal, n\.v\.t\. \(7d\), n\.v\.t\. \(24u\)/);
  assert.match(summary.body, /Gemelde problemen: 0 totaal, \+0 \(7d\), \+0 \(24u\)/);
  assert.match(summary.body, /Laatste 3 meldingen:\n {2}\(geen\)/);
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}\(geen\)/);
});

test("counts plays within the 24h and 7d windows", () => {
  const { buildSummaryEmail_ } = loadContext();
  const results = [result(1), result(23), result(25), result(6 * 24), result(8 * 24)];
  const summary = buildSummaryEmail_(results, [], NOW);
  assert.match(summary.body, /Aantal spelbeurten: 5 totaal, 4 \(7d\), 2 \(24u\)/);
});

test("computes averages of questions, minutes, and score percentage", () => {
  const { buildSummaryEmail_ } = loadContext();
  const results = [
    result(1, { total: 10, durationSec: 120, percentage: 50 }),
    result(2, { total: 20, durationSec: 240, percentage: 100 }),
  ];
  const summary = buildSummaryEmail_(results, [], NOW);
  assert.match(summary.body, /Gem\. vragen per beurt: 15 totaal, 15 \(7d\), 15 \(24u\)/);
  assert.match(summary.body, /Gem\. speeltijd \(min\): 3 totaal, 3 \(7d\), 3 \(24u\)/);
  assert.match(summary.body, /Gem\. score: 75% totaal, 75% \(7d\), 75% \(24u\)/);
});

test("most used context reports the top-3 frequencies when contexts repeat", () => {
  const { buildSummaryEmail_ } = loadContext();
  const issues = [
    issue(1, { question: "Bord A" }),
    issue(2, { question: "Bord A" }),
    issue(3, { question: "Bord B" }),
    issue(4, { question: "Bord B" }),
    issue(5, { question: "Bord B" }),
    issue(6, { question: "Bord C" }),
  ];
  const summary = buildSummaryEmail_([], issues, NOW);
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}- q1 - Bord B \(3x\)\n {2}- q1 - Bord A \(2x\)\n {2}- q1 - Bord C \(1x\)/);
});

test("most used context falls back to the 3 latest when every context is unique", () => {
  const { buildSummaryEmail_ } = loadContext();
  const issues = [
    issue(1, { question: "Bord Nieuwste" }),
    issue(2, { question: "Bord Midden" }),
    issue(3, { question: "Bord Oudste" }),
    issue(4, { question: "Bord Nog Ouder" }),
  ];
  const summary = buildSummaryEmail_([], issues, NOW);
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}- q1 - Bord Nieuwste\n {2}- q1 - Bord Midden\n {2}- q1 - Bord Oudste/);
});

test("issue context combines the question ID and question text when both are present", () => {
  const { buildSummaryEmail_ } = loadContext();
  const issues = [issue(1, { questionId: "q42", question: "Wat betekent dit verkeersbord?" })];
  const summary = buildSummaryEmail_([], issues, NOW);
  assert.match(summary.body, /Laatste 3 meldingen:\n {2}.*q42 - Wat betekent dit verkeersbord\?/);
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}- q42 - Wat betekent dit verkeersbord\?/);
});

test("issue context falls back to whichever of question ID or question text is present", () => {
  const { buildSummaryEmail_ } = loadContext();
  const idOnly = buildSummaryEmail_([], [issue(1, { questionId: "q7", question: "" })], NOW);
  assert.match(idOnly.body, /Vaakst gemelde vragen:\n {2}- q7/);
  const questionOnly = buildSummaryEmail_([], [issue(1, { questionId: "", question: "Losse vraagtekst" })], NOW);
  assert.match(questionOnly.body, /Vaakst gemelde vragen:\n {2}- Losse vraagtekst/);
});

test("reports stats per tracked player individually, not combined", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = ["Mila", "Sami"];
  const results = [
    result(1, { who: " Mila ", percentage: 60, durationSec: 60 }),
    result(2, { who: "SAMI", percentage: 100, durationSec: 120 }),
    result(3, { who: "Iemand Anders", percentage: 0, durationSec: 600 }),
  ];
  const summary = context.buildSummaryEmail_(results, [], NOW);
  assert.match(summary.body, /Mila:\n[\s\S]*? {2}Spelbeurten: 1 totaal, 1 \(7d\), 1 \(24u\)\n {2}Gespeelde minuten: 1 totaal, 1 \(7d\), 1 \(24u\)\n {2}Gem\. score: 60% totaal, 60% \(7d\), 60% \(24u\)/);
  assert.match(summary.body, /Sami:\n[\s\S]*? {2}Spelbeurten: 1 totaal, 1 \(7d\), 1 \(24u\)\n {2}Gespeelde minuten: 2 totaal, 2 \(7d\), 2 \(24u\)\n {2}Gem\. score: 100% totaal, 100% \(7d\), 100% \(24u\)/);
  assert.doesNotMatch(summary.body, /Mila\/Sami/);
  assert.match(summary.htmlBody, />Mila</);
  assert.match(summary.htmlBody, />Sami</);
});

test("omits any tracked-player section when no player names are configured", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = [];
  const summary = context.buildSummaryEmail_([result(1, { who: "Iemand" })], [], NOW);
  assert.doesNotMatch(summary.body, /Gespeelde minuten/);
  assert.doesNotMatch(summary.htmlBody, /Dagelijkse oefenstatistieken/);
});

test("daily totals are weighted by questions and isolated by player before the existing table", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = ["Mila", "Sami"];
  const summary = context.buildSummaryEmail_([
    result(1, { who: " MILA ", correct: 1, total: 2, percentage: 50, durationSec: 600 }),
    result(2, { who: "mila", correct: 8, total: 8, percentage: 100, durationSec: 360 }),
    result(3, { who: "Sami", correct: 0, total: 10, percentage: 0, durationSec: 900 }),
    result(4, { who: "Other", correct: 0, total: 100, durationSec: 5000 }),
  ], [], NOW);
  assert.match(summary.body, /Mila:\n {2}Dag[^\n]+\n {2}Vandaag \(22\/09\/2026\) \| 10 \| 90% \| 16 \| ✓ Ja/);
  assert.match(summary.body, /Sami:\n {2}Dag[^\n]+\n {2}Vandaag \(22\/09\/2026\) \| 10 \| 0% \| 15 \| ✗ Nee/);
  const playerHtml = summary.htmlBody.split('>Mila</div>')[1].split('>Sami</div>')[0];
  assert.ok(playerHtml.indexOf('Dagelijkse oefenstatistieken') < playerHtml.indexOf('>Altijd<'));
  assert.match(playerHtml, />90%</);
  assert.match(playerHtml, /color:#15803d;">&#10003;/);
  assert.match(playerHtml, /color:#dc2626;">&#10007;/);
});

test("daily rows use Brussels midnight, include now, and exclude future and invalid dates", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = ["Speler"];
  /**
   * Create a result at an exact timestamp for calendar boundary checks.
   * @param {string} when - ISO timestamp or an intentionally invalid date.
   * @returns {Object} Parsed result fixture.
   */
  const at = (when) => result(0, { when: new Date(when) });
  const summary = context.buildSummaryEmail_([
    at('2026-09-21T22:00:00Z'), at('2026-09-22T19:00:00Z'),
    at('2026-09-21T21:59:59Z'), at('2026-09-20T22:00:00Z'),
    at('2026-09-19T22:00:00Z'), at('2026-09-19T21:59:59Z'),
    at('2026-09-22T19:00:01Z'), at('invalid'),
  ], [], NOW);
  assert.match(summary.body, /Vandaag \(22\/09\/2026\) \| 20 \| 80% \| 10 \| ✗ Nee/);
  assert.match(summary.body, /Gisteren \(21\/09\/2026\) \| 20 \| 80% \| 10 \| ✗ Nee/);
  assert.match(summary.body, /Eergisteren \(20\/09\/2026\) \| 10 \| 80% \| 5 \| ✗ Nee/);
});

test("practice threshold uses unrounded seconds and tolerates absent or invalid durations", () => {
  for (const [seconds, enough] of [[899, false], [900, false], [901, true], [null, false], [undefined, false], [NaN, false], [-1, false]]) {
    const context = loadContext();
    context.TRACKED_PLAYERS_ = ["Speler"];
    const summary = context.buildSummaryEmail_([result(1, { durationSec: seconds })], [], NOW);
    const today = summary.body.split('\n').find(line => line.includes('Vandaag ('));
    assert.ok(today.endsWith(enough ? '✓ Ja' : '✗ Nee'), `duration ${seconds}`);
    assert.doesNotMatch(today, /NaN|undefined|null/);
  }
});

test("empty days retain three dated rows, zero totals, unavailable scores, and red crosses", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = ["<Mila & Sami>"];
  const summary = context.buildSummaryEmail_([], [], NOW);
  const daily = summary.body.split('\n').filter(line => / \| 0 \| n\.v\.t\. \| 0 \| ✗ Nee$/.test(line));
  assert.equal(daily.length, 3);
  assert.match(daily[0], /Vandaag/);
  assert.match(daily[1], /Gisteren/);
  assert.match(daily[2], /Eergisteren/);
  assert.match(summary.htmlBody, /&lt;Mila &amp; Sami&gt;/);
});

test("calendar days handle both DST transitions and year boundaries", () => {
  for (const [now, times, dates] of [
    ['2026-03-30T00:30:00+02:00', ['2026-03-29T23:30:00+02:00', '2026-03-29T00:00:00+01:00'], ['30/03/2026', '29/03/2026', '28/03/2026']],
    ['2026-10-26T00:30:00+01:00', ['2026-10-25T23:30:00+01:00', '2026-10-25T00:00:00+02:00'], ['26/10/2026', '25/10/2026', '24/10/2026']],
    ['2027-01-01T00:30:00+01:00', ['2026-12-31T23:30:00+01:00', '2026-12-31T00:00:00+01:00'], ['01/01/2027', '31/12/2026', '30/12/2026']],
  ]) {
    const context = loadContext();
    context.TRACKED_PLAYERS_ = ["Speler"];
    const summary = context.buildSummaryEmail_(times.map(when => result(0, { when: new Date(when) })), [], new Date(now));
    assert.ok(summary.body.includes(`Vandaag (${dates[0]}) | 0 | n.v.t. | 0 | ✗ Nee`));
    assert.ok(summary.body.includes(`Gisteren (${dates[1]}) | 20 | 80% | 10 | ✗ Nee`));
    assert.ok(summary.body.includes(`Eergisteren (${dates[2]}) | 0 | n.v.t. | 0 | ✗ Nee`));
  }
});

test("last 3 issues are listed most-recent first with their remark", () => {
  const { buildSummaryEmail_ } = loadContext();
  const issues = [
    issue(5, { question: "Oudste", remark: "" }),
    issue(1, { question: "Nieuwste", remark: "klopt niet" }),
    issue(3, { question: "Midden", remark: "" }),
  ];
  const summary = buildSummaryEmail_([], issues, NOW);
  const lastIssuesBlock = summary.body.split("Laatste 3 meldingen:\n")[1].split("\n\n")[0];
  assert.match(lastIssuesBlock, /Nieuwste - klopt niet/);
  assert.ok(lastIssuesBlock.indexOf("Nieuwste") < lastIssuesBlock.indexOf("Midden"));
  assert.ok(lastIssuesBlock.indexOf("Midden") < lastIssuesBlock.indexOf("Oudste"));
});

test("sendDailySummaryEmail reads both sheets and emails the summary to SUMMARY_EMAIL_TO", () => {
  /**
   * Build a stub spreadsheet sheet serving a fixed header row and data rows.
   *
   * @param {Array<string>} headers - Column headers of the sheet.
   * @param {Array<Array<*>>} rows - Data rows below the headers.
   * @returns {Object} Stub exposing the sheet methods the script calls.
   */
  function fakeSheet(headers, rows) {
    return {
      getLastRow: () => rows.length + 1,
      getDataRange: () => ({ getValues: () => [headers].concat(rows) }),
    };
  }
  const resultatenSheet = fakeSheet(
    ["Wanneer", "Wie", "Juiste Antwoorden", "Aantal Vragen", "Percentage", "Duur (sec)", "Duur"],
    [[new Date().toISOString(), "Speler", 8, 10, 80, 300, "5:00"]]
  );
  const meldingenSheet = fakeSheet(
    ["Wanneer", "Vraag ID", "Vraag", "Wie", "Opmerking"],
    [[new Date().toISOString(), "q1", "Bord X", "Speler", "opmerking"]]
  );
  const sentEmails = [];
  const context = loadContext({
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: (name) => (name === "Resultaten" ? resultatenSheet : name === "Meldingen" ? meldingenSheet : null),
      }),
    },
    MailApp: { sendEmail: (options) => sentEmails.push(options) },
  });

  context.sendDailySummaryEmail();

  assert.equal(sentEmails.length, 1);
  assert.equal(sentEmails[0].to, context.SUMMARY_EMAIL_TO);
  assert.match(sentEmails[0].subject, /Verkeersregels Quiz Status Update/);
  assert.match(sentEmails[0].body, /Aantal spelbeurten: 1 totaal, 1 \(7d\), 1 \(24u\)/);
  assert.match(sentEmails[0].body, /Gemelde problemen: 1 totaal, \+1 \(7d\), \+1 \(24u\)/);
  assert.match(sentEmails[0].htmlBody, /Verkeersregels Quiz Status Update/);
});

test("createDailySummaryTriggers replaces existing triggers with 07:00 and 19:00 UTC ones", () => {
  const deleted = [];
  const created = [];
  /**
   * Build a stub trigger builder recording the hour each created trigger fires at.
   *
   * @param {Object} hourHolder - Scratch object the requested hour is stored on.
   * @returns {Object} Stub exposing the chained trigger builder methods.
   */
  function fakeTriggerBuilder(hourHolder) {
    return {
      timeBased: function () { return this; },
      atHour: function (hour) { hourHolder.hour = hour; return this; },
      everyDays: function () { return this; },
      inTimezone: function () { return this; },
      create: function () { created.push(hourHolder.hour); },
    };
  }
  const context = loadContext({
    ScriptApp: {
      getProjectTriggers: () => [{ getHandlerFunction: () => "sendDailySummaryEmail" }, { getHandlerFunction: () => "other" }],
      deleteTrigger: (trigger) => deleted.push(trigger),
      newTrigger: () => fakeTriggerBuilder({}),
    },
  });

  context.createDailySummaryTriggers();

  assert.equal(deleted.length, 1);
  assert.deepEqual(created.sort((a, b) => a - b), [7, 19]);
});

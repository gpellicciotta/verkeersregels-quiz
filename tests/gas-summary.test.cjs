/** Execute the Apps Script summary-email logic in Node, without a live Google account. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../google-apps-script/Code.gs"), "utf8");

function loadContext(extraGlobals) {
  const context = vm.createContext(Object.assign({ console }, extraGlobals));
  vm.runInContext(source, context);
  return context;
}

const HOUR = 60 * 60 * 1000;
const NOW = new Date("2026-09-22T19:00:00.000Z");

function result(hoursAgo, overrides) {
  return Object.assign(
    { when: new Date(NOW.getTime() - hoursAgo * HOUR), who: "Speler", correct: 8, total: 10, percentage: 80, durationSec: 300 },
    overrides
  );
}

function issue(hoursAgo, overrides) {
  return Object.assign(
    { when: new Date(NOW.getTime() - hoursAgo * HOUR), questionId: "q1", question: "Wat betekent dit bord?", who: "Speler", remark: "" },
    overrides
  );
}

test("empty results and issues produce zero counts and n.v.t. averages", () => {
  const { buildSummaryEmail_ } = loadContext();
  const summary = buildSummaryEmail_([], [], NOW);
  assert.match(summary.body, /Aantal spelbeurten: 0 totaal, 0 in de laatste 24u, 0 in de laatste 7 dagen/);
  assert.match(summary.body, /Gem\. vragen per beurt: n\.v\.t\. \(24u\), n\.v\.t\. \(7d\)/);
  assert.match(summary.body, /Gemelde problemen: 0 totaal, \+0 in de laatste 24u, \+0 in de laatste 7 dagen/);
  assert.match(summary.body, /Laatste 3 meldingen:\n {2}\(geen\)/);
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}\(geen\)/);
});

test("counts plays within the 24h and 7d windows", () => {
  const { buildSummaryEmail_ } = loadContext();
  const results = [result(1), result(23), result(25), result(6 * 24), result(8 * 24)];
  const summary = buildSummaryEmail_(results, [], NOW);
  assert.match(summary.body, /Aantal spelbeurten: 5 totaal, 2 in de laatste 24u, 4 in de laatste 7 dagen/);
});

test("computes averages of questions, minutes, and score percentage", () => {
  const { buildSummaryEmail_ } = loadContext();
  const results = [
    result(1, { total: 10, durationSec: 120, percentage: 50 }),
    result(2, { total: 20, durationSec: 240, percentage: 100 }),
  ];
  const summary = buildSummaryEmail_(results, [], NOW);
  assert.match(summary.body, /Gem\. vragen per beurt: 15 \(24u\), 15 \(7d\)/);
  assert.match(summary.body, /Gem\. speeltijd \(min\): 3 \(24u\), 3 \(7d\)/);
  assert.match(summary.body, /Gem\. score: 75% \(24u\), 75% \(7d\)/);
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
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}- Bord B \(3x\)\n {2}- Bord A \(2x\)\n {2}- Bord C \(1x\)/);
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
  assert.match(summary.body, /Vaakst gemelde vragen:\n {2}- Bord Nieuwste\n {2}- Bord Midden\n {2}- Bord Oudste/);
});

test("tracks configured player names case-insensitively and trimmed, ignoring other players", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = ["Mila", "Sami"];
  const results = [
    result(1, { who: " Mila ", percentage: 60, durationSec: 60 }),
    result(2, { who: "SAMI", percentage: 100, durationSec: 120 }),
    result(3, { who: "Iemand Anders", percentage: 0, durationSec: 600 }),
  ];
  const summary = context.buildSummaryEmail_(results, [], NOW);
  assert.match(summary.body, /Mila\/Sami - spelbeurten: 2 \(24u\), 2 \(7d\)/);
  assert.match(summary.body, /Mila\/Sami - gespeelde minuten: 3 \(24u\), 3 \(7d\)/);
  assert.match(summary.body, /Mila\/Sami - gem\. score: 80% \(24u\), 80% \(7d\)/);
  assert.match(summary.htmlBody, /Mila\/Sami/);
});

test("omits the tracked-players section entirely when no player names are configured", () => {
  const context = loadContext();
  context.TRACKED_PLAYERS_ = [];
  const summary = context.buildSummaryEmail_([result(1, { who: "Iemand" })], [], NOW);
  assert.doesNotMatch(summary.body, /spelbeurten: .* - /);
  assert.doesNotMatch(summary.body, / - gem\. score/);
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
  function fakeSheet(headers, rows) {
    return {
      getLastRow: () => rows.length + 1,
      getDataRange: () => ({ getValues: () => [headers].concat(rows) }),
    };
  }
  const resultatenSheet = fakeSheet(
    ["Wanneer", "Wie", "Juiste Antwoorden", "Aantal Vragen", "Percentage", "Duur (sec)", "Duur"],
    [[NOW.toISOString(), "Speler", 8, 10, 80, 300, "5:00"]]
  );
  const meldingenSheet = fakeSheet(
    ["Wanneer", "Vraag ID", "Vraag", "Wie", "Opmerking"],
    [[NOW.toISOString(), "q1", "Bord X", "Speler", "opmerking"]]
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
  assert.match(sentEmails[0].body, /Aantal spelbeurten: 1 totaal, 1 in de laatste 24u, 1 in de laatste 7 dagen/);
  assert.match(sentEmails[0].body, /Gemelde problemen: 1 totaal, \+1 in de laatste 24u, \+1 in de laatste 7 dagen/);
  assert.match(sentEmails[0].htmlBody, /Verkeersregels Quiz Status Update/);
});

test("createDailySummaryTriggers replaces existing triggers with 07:00 and 19:00 UTC ones", () => {
  const deleted = [];
  const created = [];
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

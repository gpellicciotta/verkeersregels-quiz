/** @OnlyCurrentDoc */
// Must match CONFIG.SHEET_SECRET in js/config.js. Not real security (it is readable
// in the public source code), just a barrier against generic bots/scanners.
var SHARED_SECRET = '8jd6H2Byuj0HaIqL';

// Recipient of the twice-daily summary email (see sendDailySummaryEmail below).
// Set this to a real address directly in the deployed Apps Script project;
// keep the checked-in placeholder here since this file is public source code.
var SUMMARY_EMAIL_TO = 'PUT_YOUR_EMAIL_HERE@example.com';

// Player names (case-insensitive, trimmed) singled out in the summary email.
var TRACKED_PLAYERS_ = ['noah', 'noahp'];

var RESULTATEN_HEADERS_ = ['Wanneer', 'Wie', 'Juiste Antwoorden', 'Aantal Vragen', 'Percentage', 'Duur (sec)', 'Duur'];
var MELDINGEN_HEADERS_ = ['Wanneer', 'Vraag ID', 'Vraag', 'Wie', 'Opmerking'];

function doPost(e) {
  var p = e.parameter;
  if (p.sleutel !== SHARED_SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'forbidden' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (p.actie === 'report_error') {
    var meldingenSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meldingen');
    if (!meldingenSheet) {
      meldingenSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Meldingen');
    }
    meldingenSheet.getRange(1, 1, 1, MELDINGEN_HEADERS_.length).setValues([MELDINGEN_HEADERS_]);
    meldingenSheet.appendRow([p.datum, p.vraagId, p.vraag, p.naam || 'Anoniem', p.opmerking || '']);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resultaten');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Resultaten');
  }
  sheet.getRange(1, 1, 1, RESULTATEN_HEADERS_.length).setValues([RESULTATEN_HEADERS_]);
  sheet.appendRow([p.datum, p.naam, p.score, p.totaal, p.percentage, p.duur || '', p.duur_tekst || '']);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * One-time (and re-runnable) setup: run manually from the Apps Script editor to
 * (re)install the time-driven triggers that call sendDailySummaryEmail at 07:00
 * and 19:00 UTC every day. Safe to re-run: it first removes any existing
 * sendDailySummaryEmail triggers so duplicates never accumulate.
 */
function createDailySummaryTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'sendDailySummaryEmail') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  [7, 19].forEach(function (hour) {
    ScriptApp.newTrigger('sendDailySummaryEmail')
      .timeBased()
      .atHour(hour)
      .everyDays(1)
      .inTimezone('Etc/UTC')
      .create();
  });
}

/** Reads a sheet's rows into plain objects keyed by its header row. */
function readSheetRows_(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (header, i) { obj[header] = row[i]; });
    return obj;
  });
}

function toResultRow_(row) {
  return {
    when: new Date(row['Wanneer']),
    who: row['Wie'],
    correct: Number(row['Juiste Antwoorden']),
    total: Number(row['Aantal Vragen']),
    percentage: Number(row['Percentage']),
    durationSec: Number(row['Duur (sec)']),
  };
}

function toIssueRow_(row) {
  return {
    when: new Date(row['Wanneer']),
    questionId: row['Vraag ID'],
    question: row['Vraag'],
    who: row['Wie'],
    remark: row['Opmerking'],
  };
}

/** Entry point for the time-driven triggers installed by createDailySummaryTriggers. */
function sendDailySummaryEmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var results = readSheetRows_(ss, 'Resultaten').map(toResultRow_);
  var issues = readSheetRows_(ss, 'Meldingen').map(toIssueRow_);
  var summary = buildSummaryEmail_(results, issues, new Date());
  MailApp.sendEmail({ to: SUMMARY_EMAIL_TO, subject: summary.subject, body: summary.body });
}

/**
 * Pure aggregation: turns already-parsed result/issue rows into an email
 * subject + body. Takes no Apps Script globals so it can run and be tested
 * under plain Node as well as inside the Apps Script V8 runtime.
 *
 * @param {Array<{when: Date, who: string, correct: number, total: number, percentage: number, durationSec: number}>} results
 * @param {Array<{when: Date, questionId: string, question: string, who: string, remark: string}>} issues
 * @param {Date} now
 */
function buildSummaryEmail_(results, issues, now) {
  var DAY_MS = 24 * 60 * 60 * 1000;
  var since24h = new Date(now.getTime() - DAY_MS);
  var since7d = new Date(now.getTime() - 7 * DAY_MS);

  function since(rows, cutoff) {
    return rows.filter(function (row) { return row.when >= cutoff; });
  }
  function sum(numbers) {
    return numbers.reduce(function (a, b) { return a + b; }, 0);
  }
  function avg(numbers) {
    return numbers.length === 0 ? null : sum(numbers) / numbers.length;
  }
  function fmtNum(value) {
    return value === null ? 'n/a' : (Math.round(value * 10) / 10).toString();
  }
  function fmtDate(date) {
    return date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  }
  function isTracked(who) {
    return TRACKED_PLAYERS_.indexOf((who || '').trim().toLowerCase()) !== -1;
  }
  function contextOf(issue) {
    return issue.question || issue.questionId || '(no context)';
  }
  function topContexts(allIssues, count) {
    var counts = {};
    var order = [];
    allIssues.forEach(function (issue) {
      var context = contextOf(issue);
      if (!(context in counts)) {
        counts[context] = 0;
        order.push(context);
      }
      counts[context] += 1;
    });
    var maxCount = order.reduce(function (m, c) { return Math.max(m, counts[c]); }, 0);
    if (maxCount <= 1) {
      return allIssues
        .slice()
        .sort(function (a, b) { return b.when - a.when; })
        .slice(0, count)
        .map(contextOf);
    }
    return order
      .slice()
      .sort(function (a, b) { return counts[b] - counts[a]; })
      .slice(0, count)
      .map(function (c) { return c + ' (' + counts[c] + 'x)'; });
  }

  var results24h = since(results, since24h);
  var results7d = since(results, since7d);
  var issues24h = since(issues, since24h);
  var issues7d = since(issues, since7d);
  var tracked24h = results24h.filter(function (r) { return isTracked(r.who); });
  var tracked7d = results7d.filter(function (r) { return isTracked(r.who); });
  var last3Issues = issues.slice().sort(function (a, b) { return b.when - a.when; }).slice(0, 3);
  var contexts = topContexts(issues, 3);

  var lines = [];
  lines.push('Plays: ' + results.length + ' total, ' + results24h.length + ' in the last 24h, ' + results7d.length + ' in the last 7 days');
  lines.push(
    'Avg questions/play: ' + fmtNum(avg(results24h.map(function (r) { return r.total; }))) + ' (24h), ' +
    fmtNum(avg(results7d.map(function (r) { return r.total; }))) + ' (7d)'
  );
  lines.push(
    'Avg play time (min): ' + fmtNum(avg(results24h.map(function (r) { return r.durationSec / 60; }))) + ' (24h), ' +
    fmtNum(avg(results7d.map(function (r) { return r.durationSec / 60; }))) + ' (7d)'
  );
  lines.push(
    'Avg score: ' + fmtNum(avg(results24h.map(function (r) { return r.percentage; }))) + '% (24h), ' +
    fmtNum(avg(results7d.map(function (r) { return r.percentage; }))) + '% (7d)'
  );
  lines.push('');
  lines.push('Issues reported: ' + issues.length + ' total, +' + issues24h.length + ' in the last 24h, +' + issues7d.length + ' in the last 7 days');
  lines.push('');
  lines.push('Last 3 issues:');
  if (last3Issues.length === 0) {
    lines.push('  (none)');
  } else {
    last3Issues.forEach(function (issue) {
      lines.push('  - ' + fmtDate(issue.when) + ' - ' + (issue.who || 'Anoniem') + ': ' + contextOf(issue) + (issue.remark ? ' - ' + issue.remark : ''));
    });
  }
  lines.push('');
  lines.push('Most used contexts:');
  if (contexts.length === 0) {
    lines.push('  (none)');
  } else {
    contexts.forEach(function (c) { lines.push('  - ' + c); });
  }
  lines.push('');
  lines.push('Noah/Noahp plays: ' + tracked24h.length + ' (24h), ' + tracked7d.length + ' (7d)');
  lines.push(
    'Noah/Noahp minutes played: ' + fmtNum(sum(tracked24h.map(function (r) { return r.durationSec / 60; }))) + ' (24h), ' +
    fmtNum(sum(tracked7d.map(function (r) { return r.durationSec / 60; }))) + ' (7d)'
  );
  lines.push(
    'Noah/Noahp avg score: ' + fmtNum(avg(tracked24h.map(function (r) { return r.percentage; }))) + '% (24h), ' +
    fmtNum(avg(tracked7d.map(function (r) { return r.percentage; }))) + '% (7d)'
  );

  return {
    subject: 'Verkeersregels-quiz summary - ' + fmtDate(now),
    body: lines.join('\n'),
  };
}

/** @OnlyCurrentDoc */
// Must match CONFIG.SHEET_SECRET in js/config.js. Not real security (it is readable
// in the public source code), just a barrier against generic bots/scanners.
var SHARED_SECRET = '8jd6H2Byuj0HaIqL';

// Recipient of the twice-daily summary email (see sendDailySummaryEmail below).
// Set this to a real address directly in the deployed Apps Script project;
// keep the checked-in placeholder here since this file is public source code.
var SUMMARY_EMAIL_TO = 'PUT_YOUR_EMAIL_HERE@example.com';

// Player names (case-insensitive, trimmed) singled out in the summary email with
// their own stats section. Add one or more names here, e.g. ['Jan', 'Marie'];
// leave empty to skip that section entirely.
var TRACKED_PLAYERS_ = [];

// Calendar days in the tracked-player tables follow Belgian local time.
var SUMMARY_TIME_ZONE_ = 'Europe/Brussels';

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
  MailApp.sendEmail({ to: SUMMARY_EMAIL_TO, subject: summary.subject, body: summary.body, htmlBody: summary.htmlBody });
}

/** Escapes text for safe inclusion in the HTML summary email body. */
function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

var SUMMARY_EMAIL_TITLE_ = 'Verkeersregels Quiz Status Update';

/**
 * Pure aggregation: turns already-parsed result/issue rows into an email
 * subject + plain-text body + HTML body. Takes no Apps Script globals (besides
 * TRACKED_PLAYERS_ and SUMMARY_TIME_ZONE_) so it can run under plain Node and
 * inside the Apps Script V8 runtime. Body text is in Dutch, matching the app's
 * audience; the HTML body mimics the app's light-theme blue styling.
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
    return value === null ? 'n.v.t.' : (Math.round(value * 10) / 10).toString();
  }
  function fmtPercent(value) {
    return value === null ? 'n.v.t.' : fmtNum(value) + '%';
  }
  function fmtDate(date) {
    return date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  }
  function matchesPlayer(who, name) {
    return (who || '').trim().toLowerCase() === name.trim().toLowerCase();
  }
  function contextOf(issue) {
    if (issue.questionId && issue.question) {
      return issue.questionId + ' - ' + issue.question;
    }
    return issue.questionId || issue.question || '(geen context)';
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
  var last3Issues = issues.slice().sort(function (a, b) { return b.when - a.when; }).slice(0, 3);
  var contexts = topContexts(issues, 3);

  var avgQuestionsAll = fmtNum(avg(results.map(function (r) { return r.total; })));
  var avgQuestions7d = fmtNum(avg(results7d.map(function (r) { return r.total; })));
  var avgQuestions24h = fmtNum(avg(results24h.map(function (r) { return r.total; })));
  var avgMinutesAll = fmtNum(avg(results.map(function (r) { return r.durationSec / 60; })));
  var avgMinutes7d = fmtNum(avg(results7d.map(function (r) { return r.durationSec / 60; })));
  var avgMinutes24h = fmtNum(avg(results24h.map(function (r) { return r.durationSec / 60; })));
  var avgScoreAll = fmtPercent(avg(results.map(function (r) { return r.percentage; })));
  var avgScore7d = fmtPercent(avg(results7d.map(function (r) { return r.percentage; })));
  var avgScore24h = fmtPercent(avg(results24h.map(function (r) { return r.percentage; })));

  function statsFor(rows) {
    return {
      count: rows.length,
      minutes: fmtNum(sum(rows.map(function (r) { return r.durationSec / 60; }))),
      score: fmtPercent(avg(rows.map(function (r) { return r.percentage; }))),
    };
  }
  var dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: SUMMARY_TIME_ZONE_, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  function calendarDate(date) {
    var parts = {};
    dateFormatter.formatToParts(date).forEach(function (part) { parts[part.type] = part.value; });
    return parts.year + '-' + parts.month + '-' + parts.day;
  }
  var today = new Date(calendarDate(now) + 'T00:00:00Z');
  var calendarDays = ['Vandaag', 'Gisteren', 'Eergisteren'].map(function (label, offset) {
    // Subtract from a UTC calendar-date surrogate, avoiding 23/25-hour DST days.
    var key = new Date(today.getTime() - offset * DAY_MS).toISOString().slice(0, 10);
    return { key: key, label: label, date: key.split('-').reverse().join('/') };
  });
  function dailyStatsFor(rows) {
    var datedRows = rows.filter(function (row) {
      return Number.isFinite(row.when.getTime()) && row.when <= now;
    }).map(function (row) { return { key: calendarDate(row.when), result: row }; });
    return calendarDays.map(function (day) {
      var daily = datedRows.filter(function (row) { return row.key === day.key; })
        .map(function (row) { return row.result; });
      var questions = sum(daily.map(function (row) { return row.total; }));
      var correct = sum(daily.map(function (row) { return row.correct; }));
      var seconds = sum(daily.map(function (row) {
        return Number.isFinite(row.durationSec) && row.durationSec > 0 ? row.durationSec : 0;
      }));
      return {
        label: day.label, date: day.date, questions: questions,
        score: fmtPercent(questions > 0 ? 100 * correct / questions : null),
        minutes: fmtNum(seconds / 60), enough: seconds > 15 * 60,
      };
    });
  }
  var playerStats = TRACKED_PLAYERS_.map(function (name) {
    var playerResults = results.filter(function (r) { return matchesPlayer(r.who, name); });
    return {
      name: name,
      daily: dailyStatsFor(playerResults),
      all: statsFor(playerResults),
      week: statsFor(results7d.filter(function (r) { return matchesPlayer(r.who, name); })),
      day: statsFor(results24h.filter(function (r) { return matchesPlayer(r.who, name); })),
    };
  });

  function issueLine(issue) {
    return fmtDate(issue.when) + ' - ' + (issue.who || 'Anoniem') + ': ' + contextOf(issue) + (issue.remark ? ' - ' + issue.remark : '');
  }

  var lines = [];
  lines.push('Aantal spelbeurten: ' + results.length + ' totaal, ' + results7d.length + ' (7d), ' + results24h.length + ' (24u)');
  lines.push('Gem. vragen per beurt: ' + avgQuestionsAll + ' totaal, ' + avgQuestions7d + ' (7d), ' + avgQuestions24h + ' (24u)');
  lines.push('Gem. speeltijd (min): ' + avgMinutesAll + ' totaal, ' + avgMinutes7d + ' (7d), ' + avgMinutes24h + ' (24u)');
  lines.push('Gem. score: ' + avgScoreAll + ' totaal, ' + avgScore7d + ' (7d), ' + avgScore24h + ' (24u)');
  lines.push('');
  lines.push('Gemelde problemen: ' + issues.length + ' totaal, +' + issues7d.length + ' (7d), +' + issues24h.length + ' (24u)');
  lines.push('');
  lines.push('Laatste 3 meldingen:');
  if (last3Issues.length === 0) {
    lines.push('  (geen)');
  } else {
    last3Issues.forEach(function (issue) { lines.push('  - ' + issueLine(issue)); });
  }
  lines.push('');
  lines.push('Vaakst gemelde vragen:');
  if (contexts.length === 0) {
    lines.push('  (geen)');
  } else {
    contexts.forEach(function (c) { lines.push('  - ' + c); });
  }
  playerStats.forEach(function (player) {
    lines.push('');
    lines.push(player.name + ':');
    lines.push('  Dag | Vragen beantwoord | Score | Minuten gespeeld | Voldoende geoefend (> 15 min/dag)');
    player.daily.forEach(function (day) {
      lines.push('  ' + day.label + ' (' + day.date + ') | ' + day.questions + ' | ' + day.score +
        ' | ' + day.minutes + ' | ' + (day.enough ? '✓ Ja' : '✗ Nee'));
    });
    lines.push('  Spelbeurten: ' + player.all.count + ' totaal, ' + player.week.count + ' (7d), ' + player.day.count + ' (24u)');
    lines.push('  Gespeelde minuten: ' + player.all.minutes + ' totaal, ' + player.week.minutes + ' (7d), ' + player.day.minutes + ' (24u)');
    lines.push('  Gem. score: ' + player.all.score + ' totaal, ' + player.week.score + ' (7d), ' + player.day.score + ' (24u)');
  });

  // HTML body mimics the app's light-theme/blue palette (see css/style.css :root).
  function htmlDailyTable(days) {
    var headers = ['Dag', 'Vragen beantwoord', 'Score', 'Minuten gespeeld', 'Voldoende geoefend (> 15 min/dag)'];
    var widths = [25, 24, 13, 18, 20];
    var header = headers.map(function (label, index) {
      return '<th scope="col" width="' + widths[index] + '%" style="padding:0 2px 8px;border-bottom:2px solid #cbd5e1;' +
        'color:#6b7280;font-size:11px;font-weight:600;text-align:' + (index === 0 ? 'left' : 'center') +
        ';vertical-align:bottom;overflow-wrap:anywhere;">' + escapeHtml_(label) + '</th>';
    }).join('');
    var body = days.map(function (day) {
      var cells = [
        escapeHtml_(day.label) + '<br><span style="font-size:10px;color:#6b7280;">' + escapeHtml_(day.date) + '</span>',
        escapeHtml_(day.questions), escapeHtml_(day.score), escapeHtml_(day.minutes),
        '<span aria-label="' + (day.enough ? 'Voldoende geoefend' : 'Onvoldoende geoefend') + '" title="' +
          (day.enough ? 'Voldoende geoefend' : 'Onvoldoende geoefend') + '" style="font-size:20px;font-weight:700;color:' +
          (day.enough ? '#15803d' : '#dc2626') + ';">' + (day.enough ? '&#10003;' : '&#10007;') + '</span>',
      ];
      return '<tr>' + cells.map(function (cell, index) {
        var tag = index === 0 ? 'th scope="row"' : 'td';
        return '<' + tag + ' style="padding:8px 4px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:12px;' +
          'font-weight:600;text-align:' + (index === 0 ? 'left' : 'center') + ';">' + cell + (index === 0 ? '</th>' : '</td>');
      }).join('') + '</tr>';
    }).join('');
    return '<table aria-label="Dagelijkse oefenstatistieken" width="100%" cellpadding="0" cellspacing="0" ' +
      'style="border-collapse:collapse;table-layout:fixed;margin-bottom:20px;"><thead><tr>' + header +
      '</tr></thead><tbody>' + body + '</tbody></table>';
  }
  function htmlStatsTable(rows) {
    var header = '<tr>' +
      '<td width="25%" style="padding:0 8px 8px 0;border-bottom:2px solid #cbd5e1;"></td>' +
      '<td width="25%" style="padding:0 8px 8px 8px;border-bottom:2px solid #cbd5e1;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;text-align:right;">Altijd</td>' +
      '<td width="25%" style="padding:0 8px 8px 8px;border-bottom:2px solid #cbd5e1;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;text-align:right;">Laatste week</td>' +
      '<td width="25%" style="padding:0 0 8px 8px;border-bottom:2px solid #cbd5e1;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;text-align:right;">Laatste 24u</td>' +
      '</tr>';
    var body = rows.map(function (row) {
      return '<tr>' +
        '<td width="25%" style="padding:6px 8px 6px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;">' + escapeHtml_(row[0]) + '</td>' +
        '<td width="25%" style="padding:6px 8px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;font-size:13px;text-align:right;white-space:nowrap;">' + escapeHtml_(row[1]) + '</td>' +
        '<td width="25%" style="padding:6px 8px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;font-size:13px;text-align:right;white-space:nowrap;">' + escapeHtml_(row[2]) + '</td>' +
        '<td width="25%" style="padding:6px 0 6px 8px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;font-size:13px;text-align:right;white-space:nowrap;">' + escapeHtml_(row[3]) + '</td>' +
        '</tr>';
    }).join('');
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;">' + header + body + '</table>';
  }
  function htmlListBlock(items) {
    if (items.length === 0) {
      return '<div style="color:#6b7280;font-size:13px;">(geen)</div>';
    }
    return '<ul style="margin:0;padding-left:18px;color:#1f2933;font-size:13px;line-height:1.6;">' +
      items.map(function (item) { return '<li>' + escapeHtml_(item) + '</li>'; }).join('') +
      '</ul>';
  }
  function htmlSection(title, innerHtml) {
    return '<div style="margin:0 0 20px 0;">' +
      '<div style="display:inline-block;background:#eff6ff;color:#0369a1;font-weight:600;font-size:11px;letter-spacing:.02em;text-transform:uppercase;padding:4px 10px;border-radius:9999px;margin-bottom:10px;">' + escapeHtml_(title) + '</div>' +
      innerHtml +
      '</div>';
  }

  var overviewSection = htmlSection('Overzicht', htmlStatsTable([
    ['Spelbeurten', String(results.length), String(results7d.length), String(results24h.length)],
    ['Gem. vragen per beurt', avgQuestionsAll, avgQuestions7d, avgQuestions24h],
    ['Gem. speeltijd (min)', avgMinutesAll, avgMinutes7d, avgMinutes24h],
    ['Gem. score', avgScoreAll, avgScore7d, avgScore24h],
  ]));

  var issuesSection = htmlSection('Gemelde problemen', htmlStatsTable([
    ['Totaal', String(issues.length), String(issues7d.length), String(issues24h.length)],
  ]) +
    '<div style="margin-top:12px;color:#6b7280;font-weight:600;font-size:12px;">Laatste 3 meldingen</div>' +
    '<div style="margin-top:6px;">' + htmlListBlock(last3Issues.map(issueLine)) + '</div>' +
    '<div style="margin-top:12px;color:#6b7280;font-weight:600;font-size:12px;">Vaakst gemelde vragen</div>' +
    '<div style="margin-top:6px;">' + htmlListBlock(contexts) + '</div>');

  var playerSections = playerStats.map(function (player) {
    return htmlSection(player.name, htmlDailyTable(player.daily) + htmlStatsTable([
      ['Spelbeurten', String(player.all.count), String(player.week.count), String(player.day.count)],
      ['Gespeelde minuten', player.all.minutes, player.week.minutes, player.day.minutes],
      ['Gem. score', player.all.score, player.week.score, player.day.score],
    ]));
  }).join('');

  var htmlBody =
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:24px 12px;font-family:system-ui,-apple-system,\'Segoe UI\',Roboto,sans-serif;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">' +
    '<tr><td style="background:#1a56db;color:#ffffff;padding:20px 24px;">' +
    '<div style="font-size:18px;font-weight:700;">' + escapeHtml_(SUMMARY_EMAIL_TITLE_) + '</div>' +
    '<div style="font-size:12px;opacity:0.85;margin-top:4px;">' + escapeHtml_(fmtDate(now)) + '</div>' +
    '</td></tr>' +
    '<tr><td style="padding:24px;color:#1f2933;">' +
    overviewSection + issuesSection + playerSections +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +
    '</table>';

  return {
    subject: SUMMARY_EMAIL_TITLE_,
    body: lines.join('\n'),
    htmlBody: htmlBody,
  };
}

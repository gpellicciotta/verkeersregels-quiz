/** @OnlyCurrentDoc */
// Must match CONFIG.SHEET_SECRET in js/config.js. Not real security (it is readable
// in the public source code), just a barrier against generic bots/scanners.
var SHARED_SECRET = '8jd6H2Byuj0HaIqL';

function doPost(e) {
  var p = e.parameter;
  if (p.sleutel !== SHARED_SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'forbidden' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (p.actie === 'report_error') {
    var meldingenHeaders = ['Wanneer', 'Vraag ID', 'Vraag', 'Wie', 'Opmerking'];
    var meldingenSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meldingen');
    if (!meldingenSheet) {
      meldingenSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Meldingen');
    }
    meldingenSheet.getRange(1, 1, 1, meldingenHeaders.length).setValues([meldingenHeaders]);
    meldingenSheet.appendRow([p.datum, p.vraagId, p.vraag, p.naam || 'Anoniem', p.opmerking || '']);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = ['Wanneer', 'Wie', 'Juiste Antwoorden', 'Aantal Vragen', 'Percentage', 'Duur (sec)', 'Duur'];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resultaten');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Resultaten');
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.appendRow([p.datum, p.naam, p.score, p.totaal, p.percentage, p.duur || '', p.duur_tekst || '']);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

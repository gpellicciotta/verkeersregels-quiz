/** @OnlyCurrentDoc */
// Moet overeenkomen met CONFIG.SHEET_SECRET in js/app.js. Geen echte beveiliging (staat
// leesbaar in de publieke broncode), enkel een drempel tegen generieke bots/scanners.
var SHARED_SECRET = '8jd6H2Byuj0HaIqL';

function doPost(e) {
  var p = e.parameter;
  if (p.sleutel !== SHARED_SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'forbidden' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resultaten');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Resultaten');
    sheet.appendRow(['Datum', 'Naam', 'Score', 'Totaal']);
  }
  sheet.appendRow([p.datum, p.naam, p.score, p.totaal]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

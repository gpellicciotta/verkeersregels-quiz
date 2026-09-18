/** @OnlyCurrentDoc */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resultaten');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Resultaten');
    sheet.appendRow(['Datum', 'Naam', 'Score', 'Totaal']);
  }
  var p = e.parameter;
  sheet.appendRow([p.datum, p.naam, p.score, p.totaal]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

# Verkeers-regels Quiz

Een simpele webquiz om te helpen bij het voorbereiden van het Belgische theoretisch rijexamen.
Geen server nodig: platte HTML/CSS/JS, te hosten via GitHub Pages.

## Hoe spelen

- Ga naar de hoofdpagina, vul optioneel een naam in en klik op "Start quiz".
- Je krijgt telkens 20 willekeurige vragen uit de vragenbank: soms een verkeersbord waarvan je
  de betekenis moet kiezen, soms een omschrijving waarbij je het juiste bord moet aanduiden,
  en soms een vraag over een verkeersregel.
- Na elk antwoord zie je meteen of het juist was, met een korte uitleg. Je kan niet terug naar
  een vorige vraag.
- Op het einde krijg je je score en een volledig overzicht van alle vragen, jouw antwoorden en
  de juiste antwoorden. Dat overzicht kan je printen of als PDF opslaan via de knop
  "Printen / opslaan als PDF" (gebruikt de browser-printfunctie).

## URL-parameters

De quiz ondersteunt optionele parameters in de URL:

- `?since=YYYY`: filtert de vragenpool op regels ingevoerd vanaf het opgegeven jaartal (bv. `?since=2022`).
- `?q=N`: stelt het aantal vragen per ronde in (standaard 20, bv. `?q=10` of `?since=2022&q=5`).

Vragen over recente wetswijzigingen (binnen 5 jaar) dragen een amberkleurige "Sinds YYYY" badge.
Oudere wetswijzigingen tonen een blauwe badge.

## Lokaal uittesten

Vanuit de projectmap:

```bash
python -m http.server 8420
```

Open dan <http://localhost:8420/index.html> in de browser.

## Vragenbank aanpassen

De vragen staan in [data/questions.json](data/questions.json), zie
[data/SOURCES.md](data/SOURCES.md) voor de gebruikte bronnen en verkeersbord-afbeeldingen.
Elke vraag heeft een `type`:

- `recognize` — toont een bord (`sign`), 4 tekstopties als mogelijke betekenis.
- `identify` — toont een omschrijving, 4 bord-afbeeldingen als opties.
- `rule` — pure tekstvraag over een verkeersregel, 4 tekstopties.

Verkeersbord-afbeeldingen staan in `assets/signs/`, genoemd naar hun officiële Wegcode-code
(bv. `A1a.svg`).

## Deployen naar GitHub Pages

1. Maak een GitHub-repository aan en push deze projectmap ernaartoe.
2. Ga naar Settings > Pages, kies branch `main` en map `/ (root)`.
3. Na een minuut is de site live op `https://<gebruikersnaam>.github.io/<repo-naam>/`.

Werkt met JavaScript zonder probleem: GitHub Pages is gewoon statische bestandshosting.

## Scores opslaan in een Google Sheet (optioneel)

1. Maak een nieuwe Google Sheet aan.
2. Ga naar Extensies > Apps Script, en plak de inhoud van
   [google-apps-script/Code.gs](google-apps-script/Code.gs) in het script-editorvenster.
3. Klik op Deployen > Nieuwe implementatie > type "Web app".
   - "Uitvoeren als": jouw account.
   - "Toegang": Iedereen.
4. Kopieer de gegenereerde web-app-URL.
5. Plak die URL als waarde van `SHEET_WEBAPP_URL` bovenaan in [js/app.js](js/app.js).
6. Elke afgeronde quiz voegt automatisch een rij toe aan het tabblad "Resultaten" van de Sheet.

Zolang `SHEET_WEBAPP_URL` op `null` staat, wordt dit gewoon overgeslagen — de quiz werkt ook
zonder deze stap.

### Rechten van het script

`Code.gs` bevat de annotatie `/** @OnlyCurrentDoc */`. Daardoor vraagt Google bij het autoriseren
enkel toegang tot deze ene gekoppelde Sheet (`spreadsheets.currentonly`), niet tot al je Google
Sheets. Als je het script al had geautoriseerd voordat deze annotatie werd toegevoegd, deed je dat
met de bredere toegang. Om dat recht te laten intrekken en te vervangen door de vernauwde versie:

1. Plak de bijgewerkte inhoud van `Code.gs` opnieuw in de script-editor en sla op.
2. Ga naar Deployen > Implementaties beheren > potlood-icoon > Versie: Nieuwe versie > Implementeren.
   Dit houdt dezelfde web-app-URL, maar draait de nieuwe (vernauwde) code.
3. Ga naar [myaccount.google.com/permissions](https://myaccount.google.com/permissions), zoek het
   script-project op en verwijder de bestaande toegang.
4. Doorloop de quiz opnieuw zodat het script opnieuw om toestemming vraagt — controleer dan of de
   vraag nu specifiek over "deze spreadsheet" gaat, niet over "al je spreadsheets".

### Gedeeld geheim tegen spam

`Code.gs` en `js/app.js` delen een `sleutel`-waarde (`SHARED_SECRET` / `CONFIG.SHEET_SECRET`) die
moet overeenkomen voor er een rij wordt toegevoegd. Dit is geen echte beveiliging — de waarde staat
gewoon leesbaar in de publieke broncode — maar houdt generieke bots tegen die lukraak Apps
Script-URL's aanschieten. Wijzig je de waarde in het ene bestand, wijzig ze dan ook in het andere
en herdeploy het script (zie vorige sectie, stap 2).

### Testen of de Sheet-koppeling werkt

1. Open de site en doorloop de quiz volledig tot het resultatenscherm.
2. Open de Google Sheet: er moet een tabblad "Resultaten" verschenen zijn met een nieuwe rij
   (datum, naam, score, totaal).
3. Zie je geen rij verschijnen, open dan de browserconsole (F12 > Console) tijdens het spelen —
   een mislukte aanroep logt daar een waarschuwing "Kon score niet naar Google Sheet sturen".
4. Wil je het los van de UI testen: open in de Apps Script-editor het menu Uitvoeringen
   (Executions, links in de zijbalk) na een testoproep, dat toont de laatste `doPost`-aanroepen
   en eventuele foutmeldingen.

## Open vragen / vervolgstappen

- Vragenbank uitbreiden met meer categorieen naarmate er tijd is.
- Overwegen om her-antwoorden van foutieve vragen als extra oefenronde toe te voegen.

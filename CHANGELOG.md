# Versioned Changes

A summarized overview of all changes, per version of this project.

> Entries will be added in reverse chronological order, so with the most recent at the top.
>
> The top-most version heading is always the active in-development version, identified by a `-pre`
> suffix on its version number (e.g. `## v1.1.1-pre`) instead of a status tag. Once a version is frozen
> or released, that suffix is replaced by one of these status codes:
> - `[{{date}}]` - frozen/finalized on {{date}}
> - `[released: {{date}}]` - released to package manager or production on {{date}}
> - `[broken]` - considered broken and not be used

---

## v3.1.1-pre
- FrontEnd: Added `scope="col"` to result table headers for correct screen-reader column announcement.
- DevEx: `app.js` opgesplitst in losse ES-modules die state, opslag en UI-logica scheiden.
- PWA: Geïnstalleerde app herlaadt nu automatisch zodra een nieuwe versie de service worker overneemt.
- FrontEnd: Introzin op startscherm blijft nu ongewijzigd bij moduswissel of aanpassen van instellingen.
- FrontEnd: Dark theme en thema-kleuren toegevoegd met automatische systeemvoorkeur en queryparameters voor thema en accentkleur.
- FrontEnd: Ondersteuning toegevoegd voor `name`-, `naam`- en `n`-queryparameters om het naaminvoerveld over te slaan.
- Inhoud: Twintig extra praktijkvragen met foto's van verkeerssituaties toegevoegd met bijgewerkte offline caching en tests.
- DevEx: Alle broncodecommentaar in HTML, JavaScript en CSS staat nu in het Engels.
- FrontEnd: Spelernaam en instellingenkeuzes worden nu bewaard in localStorage, met voorrang voor queryparameters.

## v3.1.0 [2026-09-21]
- FrontEnd: Startscherm geminimaliseerd met ronde actieknoppen, modusschakelaar, carrouselbediening en interactieve instellingendialogen.
- FrontEnd: Betere configuratiekeuzes, consistentere knoppen en vereenvoudigde interface-instructies.
- DevEx: Versienummering gekoppeld aan de changelog als centrale bron voor frontend en ontwikkelscripts.

## v3.0.0 [2026-09-19]
- FrontEnd: Startscherm opgeruimd en specifieke About-weergave toegevoegd met versiegeschiedenis, release notes, bronvermeldingen en copyright.
- FrontEnd: Applicatie-icoon en favicon buiten het ronde verkeersbord volledig transparant gemaakt met meervoudige resolutie-ico.
- FrontEnd: Verkeersborden-carrousel toegevoegd met instelbare wisselduur, pauzeerbediening en duidelijke pauze-indicator via URL-parameters en startknop.
- Inhoud: Alle 294 vragen herzien; 27 inhoudelijke fouten en 2 onbevestigde jaartallen gecorrigeerd.
- FrontEnd: Resultatenknoppen compact rechtsboven geplaatst op desktop en wetswijzigingslabels geharmoniseerd qua typografie.
- Inhoud: Twintig praktijkvragen met foto's van verkeerssituaties toegevoegd inclusief ondersteuning voor filteren via queryparameters.
- FrontEnd: Vraagtype-filter toegevoegd met visuele startmeldingen en responsieve fotoweergave voor praktijksituaties.
- FrontEnd: Tweepanelen-layout op desktop en scrollvrije mobiele weergave met zwevende actieknop en compacte wetslink geïmplementeerd.
- FrontEnd: Progressieve webapp geïnstalleerd met 100 procent offline ondersteuning, rotonde-pictogrammen en lokale foutenwachtrij.
- Test: Geautomatiseerde lay-outtests toegevoegd voor tweepanelenstructuur, mobiele optieverberging en compacte wetslink.
- Test: Geautomatiseerde verificatietesten toegevoegd voor webapp-manifest, pictogramgroottes en service worker-voorlaadbestanden.
- CLI: Alle ontwikkelscripts gestandaardiseerd naar actiegerichte CLI-richtlijnen met gestructureerde logging en kebab-case bestandsnamen.

## v2.0.0 [2026-09-18]
- Inhoud: Volledige dekking van alle Belgische verkeersborden gerealiseerd met 193 bordafbeeldingen en 284 vragen.
- FrontEnd: Foutmeldingsformulier geoptimaliseerd voor onmiddellijke achtergrondverzending zonder enige vertraging in de interface.
- FrontEnd: Voortgangsbalk gecorrigeerd zodat deze vanaf de eerste vraag evenredig oploopt tot 100 procent.
- Test: Testsuite uitgebreid met strenge controle op aanwezigheid van bordafbeeldingen bij alle bordvragen.

## v1.1.0 [2026-09-18]
- Documentatie: Visuele rondleiding met desktop- en mobiele schermafbeeldingen toegevoegd aan de README.
- FrontEnd: Blauw verkeersbord-favicon toegevoegd en knop bij de laatste vraag aangepast naar resultaat tonen.
- FrontEnd: Startmelding en voortgangsindicatoren tonen nu dynamische vragenaantallen begrensd op beschikbare vragen.
- FrontEnd: URL-queryparameters toegevoegd voor filteren op jaartal van wetswijziging en aantal vragen.
- FrontEnd: Officiële wetsartikelen en toelichtingslinks weergegeven na het beantwoorden van elke quizvraag.
- Inhoud: Vragenbank verdubbeld naar 126 vragen met volledige borddekking en regels van na 2022.

## v1.0.0 [2026-09-18]
- Documentatie: Standaard projectdocumentatie toegevoegd inclusief vereisten, DevOps-handleiding, licentie en documentatie-index.
- DevEx: Platformonafhankelijke bootstrap- en implementatiescripts toegevoegd met CLI-versie- en help-opties.
- Test: Geautomatiseerde testsuite toegevoegd voor verificatie van vraagstructuur, bordafbeeldingen en wetsjaren.
- FrontEnd: Verkeersborden en miniaturen op het resultatenoverzicht getoond voor bordgerelateerde vragen.
- FrontEnd: Interactieve versiebadge op het startscherm toegevoegd die bij aanklikken de changelog opent.
- FrontEnd: Foutmeldingsknop en dialoogvenster toegevoegd om feedback op vragen naar Google Sheets te sturen.
- FrontEnd: Quizduur van start tot finish bijgehouden, getoond bij resultaten en vastgelegd in Google Sheets.
- FrontEnd: Directe links naar de officiële geconsolideerde Wegcode en wetswijzigingen toegevoegd op het startscherm.
- FrontEnd: Resultatenoverzicht bij printen schermvullend gemaakt met paginascheidingsbeveiliging en herhalende koppen.
- FrontEnd: Mobiele resultaatkaarten compacter gemaakt met statusbadges rechtsboven en samengevoegde antwoordvelden.
- FrontEnd: Wetswijzigingsbadges en URL-parameters toegevoegd om recente verkeersregels gericht te oefenen.
- FrontEnd: Mobielvriendelijke Nederlandstalige quiz gebouwd met 20 willekeurige vragen en directe feedback.
- FrontEnd: Printbaar resultatenoverzicht met bordminiaturen en confetti bij een perfecte score toegevoegd.
- Inhoud: Vragen, antwoorden, toelichtingen en verkeersborden afgestemd op de huidige Belgische verkeerswetgeving.
- Inhoud: 63 geverifieerde examenvragen met bronvermeldingen en 35 Belgische verkeersborden toegevoegd.
- BackEnd: Optionele score-registratie in Google Sheets voor spelers via een beveiligd Apps Script-eindpunt.
- Documentatie: Instructies toegevoegd voor lokaal testen, GitHub Pages-publicatie en Google Sheet-configuratie.
- Documentatie: Officiële Wegcode en alle wijzigingsbesluiten sinds 2021 toegevoegd als juridische referentiebronnen.

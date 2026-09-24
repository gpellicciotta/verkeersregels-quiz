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

## v3.8.0 [released: 2026-09-24]
- FrontEnd: Bordpictogrammen ontbraken soms bij de eerste keer afdrukken; het afdrukken wacht nu tot alle iconen geladen zijn.
- FrontEnd: Verkeersbordenoverzicht toont nu het echte wetsartikel per bord, met paginaovergang per reeks en een herkenbare bestandsnaam.
- FrontEnd: Overbodige zin over het toelichtingsicoon verwijderd uit de kaart "Gebruikte bronnen & wetgeving".
- FrontEnd: Directe Stripe-betaallink toegevoegd naast Ko-fi en PayPal in het Over-scherm.
- FrontEnd: Knop toegevoegd in het Over-scherm om alle Belgische verkeersborden af te drukken, gegroepeerd en gesorteerd zoals op wegcode.be.
- BackEnd: 10 nieuwe examenvragen toegevoegd buiten borden en verkeerssituaties (pech, volgafstand, rijbewijzen, drugs, lading, helmen).
- BackEnd: 15 nieuwe situatievragen toegevoegd (`sit-41` t/m `sit-55`) met echte foto's van Wikimedia Commons.
- BackEnd: Vier ontbrekende wegwijzerborden F34b.1, F34b.2, F34c.1 en F34c.2 met vragen toegevoegd.
- BackEnd: Bronlinks van 50 vragen rechtstreeks naar het juiste wetsartikel of paragraaf gekoppeld.
- BackEnd: Bord E9i.svg gecorrigeerd van een rolstoelpictogram naar het correcte motorfietsparkeerbord.
- DevEx: Verkeersbordbronnen in SOURCES.md herverifieerd tegen Wikimedia Commons via inhoudshash.
- DevEx: Script check-sign-semantics.py toegevoegd dat foutief gelabelde Commons-bronbestanden opspoort.

## v3.7.0 [released: 2026-09-24]
- FrontEnd: Ondersteuningslinks in het Over-scherm bijgewerkt met directe Ko-fi- en PayPal.Me-knoppen.
- FrontEnd: De carrousel-tip is nu verwijderd aangezien hij niet echt nodig is en de UI complexer maakt.
- FrontEnd: Overzichtskaart voor alle gebruikte app-iconen toegevoegd aan het Over-scherm met exacte replica-knoppen.
- FrontEnd: Startscherm-voettekstknoppen herschikt en statische hint verwijderd voor een rustigere interface.
- FrontEnd: Tooltips uitgeschakeld op touch-schermen en z-index hersteld op desktopschermen.

## v3.6.0 [released: 2026-09-23]
- FrontEnd: Volledig scherm-indeling gestandaardiseerd met sticky headers, vaste actieknoppen en uniforme sluitknoppen rechtsboven.
- FrontEnd: Meld-foutknop uniform linksonder geplaatst op alle schermen met automatische contextdetectie van de actieve weergave.
- FrontEnd: Statistiekenweergave toegevoegd met lokaal bijgehouden speeltijd, spelaantallen, gemiddelde score en foutoverzichten inclusief data-resetoptie.
- FrontEnd: Oefenmodus en herhaalknoppen voor foutieve vragen toegevoegd aan startscherm, carrousel, instellingen en resultatenoverzicht.
- FrontEnd: Live voorbeeldweergave toegevoegd voor thema- en kleurwijzigingen in instellingen met herstel bij annuleren.
- FrontEnd: Kaart voor sponsoring en projectondersteuning toegevoegd aan het Over-scherm.
- DevEx: Ongebruikte moduskiezers en verborgen formulierelementen definitief opgeruimd in broncode en stijlen.
- DevEx: Script [`scripts/run-review-server.py`](scripts/run-review-server.py) toegevoegd voor lokale threaded HTTP-reviews en browsertests.
- DevEx: JSDoc-documentatie toegevoegd aan alle JavaScript-functies met geautomatiseerde regressiecontrole.
- DevEx: Console- en waarschuwingsberichten in de browser gestandaardiseerd naar het Engels in alle modules.
- BackEnd: Samenvattende e-mails uitgebreid met periodieke statistieken per speler en volledige vraagcontext bij foutmeldingen.

## v3.5.0 [released: 2026-09-22]
- BackEnd: Google Apps Script verstuurt nu elke dag om 7u en 19u UTC een Nederlandstalige, gestylede samenvattende e-mail met resultaten, meldingen en een instelbare lijst van te volgen spelers.
- FrontEnd: About screen now shows the changelog translated into the active interface language.
- FrontEnd: "Meld een fout" dialoog toont nu een titelicoon en een instelbare optionele vraagcontext.
- FrontEnd: Eén instellingendialoog met duidelijke Algemeen/Quiz/Carrousel-secties vervangt de twee losse dialogen.
- FrontEnd: Naam, taal, thema en themakleur zijn nu ook instelbaar en bewaard in localStorage.
- DevEx: Added `translate-markdown.py`, chunking Markdown by heading and paragraph before translating each release.

## v3.4.0 [released: 2026-09-22]
- FrontEnd: Quizvragen kregen een sluitknop rechtsboven op de kaart met bevestiging van voortgangsverlies in alle vijf talen.
- FrontEnd: Automatische PWA-updates gaan nu sneller gebeuren.
- FrontEnd: The iconset is nu apart gezet en overal consistent gebruikt.

## v3.3.0 [released: 2026-09-22]
- FrontEnd: Italiaanse vertalingen toegevoegd voor de gebruikersinterface, configuratiedialogen en vragenbank.
- FrontEnd: Duitse vertalingen toegevoegd voor de gebruikersinterface, configuratiedialogen en vragenbank.
- FrontEnd: Franse vertalingen toegevoegd voor de gebruikersinterface, configuratiedialogen en vragenbank.
- FrontEnd: De tooltip voor het wisselen van taal verduidelijkt; deze toont nu de volledige taalcyclus met de actieve taal gemarkeerd.
- FrontEnd: Wegcode-broncodelinks tonen nu de Franse versie bij Franse taalkeuze; Duits en Engels blijven op de Nederlandse versie, bij ontbreken van een officieel equivalent.
- FrontEnd: Allerlei andere kleine UI/UX verbeteringen

## v3.2.0 [2026-09-22]
- FrontEnd: Aparte, gelokaliseerde uitleg en titels voor verkeersborden toegevoegd aan de carrousel, inclusief volledige Nederlandse en Engelse vertalingen.
- FrontEnd: Algemene alt-teksten voor afbeeldingen vervangen door beschrijvende bordcodes in quizvragen, antwoordopties en de carrousel.
- FrontEnd: Mogelijkheid toegevoegd om quizresultaten te delen via de Web Share API, met een fallback naar kopiëren naar het klembord en 'toast'-meldingen.
- FrontEnd: Indicatiebadges (niet afhankelijk van kleur) toegevoegd aan antwoordopties en de koptekst om correcte en foutieve antwoorden aan te geven (toegankelijkheid voor kleurenblinden).
- FrontEnd: CSS geherstructureerd naar een modulaire 'mobile-first' stylesheet die voldoet aan audit-tokens en WCAG-contrastnormen.
- FrontEnd: Engelse vertaling en taalschakelaar toegevoegd voor de gebruikersinterface, configuratiedialogen en alle 324 vragen.
- FrontEnd: 'Scope'-attributen toegevoegd aan kolomkoppen in de resultatentabel voor toegankelijkheid via schermlezers.
- DevEx: JavaScript-architectuur gemodulariseerd tot afzonderlijke ES-modules, waarbij applicatiestatus, opslag en UI-presentatielogica van elkaar zijn gescheiden.
- FrontEnd: Automatische updates van de service worker-levenscyclus en herladen van de client ingeschakeld bij het uitrollen van nieuwe releases.
- FrontEnd: Introductietekst op het startscherm behouden bij het wisselen van quizmodus of wijzigen van configuratie.
- FrontEnd: Donker thema en configureerbare kleuraccenten toegevoegd, inclusief detectie van systeemvoorkeuren en ondersteuning voor queryparameters.
- FrontEnd: Ondersteuning toegevoegd voor queryparameters voor de spelersnaam (inclusief aliassen) om het invoerveld op het startscherm te omzeilen.
- FrontEnd: Twintig fotovragen over reële verkeerssituaties toegevoegd, inclusief verbeterde offline caching en geautomatiseerde tests.
- DevEx: Alle broncodecommentaren in HTML-, CSS- en JavaScript-modules gestandaardiseerd naar Amerikaans-Engels.
- FrontEnd: Spelersnaam en quizinstellingen opgeslagen in 'local storage', waarbij URL-queryparameters voorrang hebben.

## v3.1.0 [released: 2026-09-21]
- FrontEnd: Startscherm geminimaliseerd met ronde actieknoppen, modusschakelaar, carrouselbediening en interactieve instellingendialogen.
- FrontEnd: Betere configuratiekeuzes, consistentere knoppen en vereenvoudigde interface-instructies.
- DevEx: Versienummering gekoppeld aan de changelog als centrale bron voor frontend en ontwikkelscripts.

## v3.0.0 [released: 2026-09-19]
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

## v2.0.0 [released: 2026-09-18]
- Inhoud: Volledige dekking van alle Belgische verkeersborden gerealiseerd met 193 bordafbeeldingen en 284 vragen.
- FrontEnd: Foutmeldingsformulier geoptimaliseerd voor onmiddellijke achtergrondverzending zonder enige vertraging in de interface.
- FrontEnd: Voortgangsbalk gecorrigeerd zodat deze vanaf de eerste vraag evenredig oploopt tot 100 procent.
- Test: Testsuite uitgebreid met strenge controle op aanwezigheid van bordafbeeldingen bij alle bordvragen.

## v1.1.0 [released: 2026-09-18]
- Documentatie: Visuele rondleiding met desktop- en mobiele schermafbeeldingen toegevoegd aan de README.
- FrontEnd: Blauw verkeersbord-favicon toegevoegd en knop bij de laatste vraag aangepast naar resultaat tonen.
- FrontEnd: Startmelding en voortgangsindicatoren tonen nu dynamische vragenaantallen begrensd op beschikbare vragen.
- FrontEnd: URL-queryparameters toegevoegd voor filteren op jaartal van wetswijziging en aantal vragen.
- FrontEnd: Officiële wetsartikelen en toelichtingslinks weergegeven na het beantwoorden van elke quizvraag.
- Inhoud: Vragenbank verdubbeld naar 126 vragen met volledige borddekking en regels van na 2022.

## v1.0.0 [released: 2026-09-18]
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

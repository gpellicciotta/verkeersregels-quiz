# Sources and content notes

Content for the Belgian theoretical driving exam quiz, generated and verified on 2026-09-18.

## Question bank summary

Total questions: 324, stored in `data/questions.json`.

Breakdown by type:

- recognize: 193
- identify: 12
- rule: 79
- situation: 40

Breakdown by category:

- aanwijzing: 94
- voorrang: 44
- fietsers-voetgangers: 38
- verbod: 36
- gevaar: 31
- parkeren: 24
- algemeen: 20
- gebod: 10
- autosnelweg: 10
- snelheid: 9
- alcohol: 4
- gordel: 2
- telefoon: 2

Answer positions (`correctIndex`) are spread across options (84 for 0, 87 for 1, 81 for 2, 72 for 3) so the correct answer is not systematically in the same position.

## Rule sources

Every `rule`-type question with a numeric limit, exception or legal nuance carries a `source` field with a URL that was fetched and checked to confirm the fact. Sixteen distinct pages were used:

- [Wegcode.be - Snelheidsbeperkingen](https://www.wegcode.be/nl/verkeersreglement/uitleg-bij-het-verkeersreglement/snelheidsbeperkingen) - general speed limits (bebouwde kom, autosnelweg, zone 30)
- [VAB Magazine - Welke snelheidslimieten gelden in Vlaanderen?](https://magazine.vab.be/op-weg/mobiliteit/hoe-snel-mag-je-rijden/) - Flemish 70 km/u default outside built-up areas, motorway minimum speed
- [Veilig Verkeer - Alcohol limiet](https://www.veiligverkeer.be/veilig-rijden/rijden-onder-invloed/alcohol-limiet-hoeveel-promille-drinken-alcoholcontrole-boete-straffen/) - 0.5 promille general limit, 0.2 promille for professional drivers
- [PasseTonPermis - Het dragen van de veiligheidsgordel](https://passetonpermis.be/nl/blog/het-dragen-van-de-veiligheidsgordel) - seatbelt duty on every equipped seat (art. 35)
- [Veilig Verkeer - Kinderzitjes](https://www.veiligverkeer.be/veilig-rijden/gordel-en-kinderzitjes/regels-wetgeving-belgie-leeftijd-kind-vooraan-zitten-boete/) - child seat required below 1.35 m
- [Veilig Verkeer - GSM achter het stuur](https://www.veiligverkeer.be/veilig-rijden/afleiding/gsm-achter-het-stuur-regels-en-boetes/) - handheld phone ban while in traffic
- [MijnAdvocaten.be - Voorrang van rechts, art. 12.3.1](https://mijnadvocaten.be/verkeersrecht/voorrang-van-rechts-art-12-3-1-wegcode/) - priority to the right default rule and the "stopped driver keeps priority" nuance
- [Verkeerszaken.be - De regels voor rotondes en rondpunten](https://www.verkeerszaken.be/blog/artikel/a/432/De-regels-voor-rotondes-en-rondpunten) - roundabout (D5) priority to circulating traffic
- [Vias institute - Briefing: Prioritaire voertuigen (PDF)](https://www.vias.be/publications/Briefing%20-%20Prioritaire%20voertuigen/Briefing%20-%20Prioritaire%20voertuigen.pdf) - duty to yield to emergency vehicles (art. 38)
- [Wegcode.be - Fietsers en de wegcode](https://www.wegcode.be/nl/verkeersreglement/fietsers-en-de-wegcode) - lateral distance when overtaking cyclists (art. 40ter)
- [Veilig Verkeer - Voetgangers, waarop moeten bestuurders letten](https://www.veiligverkeer.be/weggebruikers/voetgangers/waarop-moeten-bestuurders-letten-in-de-buurt-van-voetgangers/) - pedestrian priority on a zebra crossing, cyclist walking a bike counts as pedestrian
- [Wegcode.be - WAM-wet regelgeving](https://www.wegcode.be/nl/regelgeving/1989011371~e9i0a75brp) - mandatory third-party liability insurance
- [Touring - Reddingsstrook verplicht](https://www.touring.be/nl/artikels/reddingsstrook-verplicht-1-oktober) - mandatory emergency corridor in traffic jams
- [Veilig Verkeer - Wanneer mistlichten aanzetten](https://www.veiligverkeer.be/weggebruikers/automobilisten/wanneer-mag-of-moet-je-je-mistlichten-aanzetten/) - rear fog light conditions (under 100 m visibility)
- [Mobilit.belgium.be - Voorlopig rijbewijs B](http://mobilit.belgium.be/nl/weg/rijden/rijbewijzen/belgisch-rijbewijs/voorlopige-rijbewijzen-categorie-b/voorlopig-rijbewijs-0) - official FPS Mobility page: minimum age 17 with an accompanying driver (8+ years licensed), 18 without
- [Evocaat.be - Een gesloten spooroverweg oversteken](https://www.evocaat.be/nl/themas/een-gesloten-spooroverweg-oversteken-wat-zijn-de-juridische-gevolgen) - level crossing stop duty once red lights flash

All 16 URLs were fetched with a standard browser user agent and returned HTTP 200 before being cited.

Sign-meaning questions (`recognize` and `identify`) carry direct authoritative links to the consolidated Wegcode articles governing each sign series (Articles 66 through 71 of KB 1 December 1975). Every quiz question displays a clickable external reference link upon being answered.

## Sign images

All 193 SVG files in `assets/signs/` come from Wikimedia Commons, drawn from the "Road signs of Belgium" categories (`Category:SVG warning/priority/prohibitory/mandatory/parking road signs of Belgium` and the `File:Belgian traffic sign F...` set). Every file was downloaded, checked for a valid, non-trivial SVG body, and spot-checked for correct shape and color coding (red danger triangles, red prohibition circles, blue mandatory/information signs, correct pictogram fills) before use.

The table below is generated by `scripts/generate-sign-sources.py`, which matches every local file to its Commons source page by exact SHA-1 content hash, so each row is proven against the actual committed bytes rather than guessed from a filename pattern. Re-run it after adding or replacing a sign asset to keep this table in sync.

License: all files are public domain under Belgian law, because official traffic signs are part of Belgian legislation (Belgian Copyright Act, art. 8, §2) - stated on each file's Commons description page. All files show the designs of the current Wegcode (KB 1 December 1975). The redesigned signs of the Royal Decree of 3 June 2024 ("KB-AR 03-06-2024" uploads) only become valid on 2027-06-01 and renumber some codes, so they are not used.

| Local file | Meaning (NL) | Wikimedia Commons source page |
|---|---|---|
| A1a.svg | Gevaarlijke bocht naar links | [File:Belgian traffic sign A1a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A1a.svg) |
| A1b.svg | Gevaarlijke bocht naar rechts | [File:Belgian traffic sign A1b.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A1b.svg) |
| A1c.svg | Gevaarlijke bocht: dubbele bocht of opeenvolging van meer dan twee bochten, de eerste naar links | [File:Belgian road sign A1c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A1c.svg) |
| A1d.svg | Gevaarlijke bocht: dubbele bocht of opeenvolging van meer dan twee bochten, de eerste naar rechts | [File:Belgian road sign A1d.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A1d.svg) |
| A3.svg | Gevaarlijke daling | [File:Belgian road sign A3.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A3.svg) |
| A5.svg | Steile helling | [File:Belgian road sign A5.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A5.svg) |
| A7a.svg | Rijbaanversmalling | [File:Belgian traffic sign A7a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A7a.svg) |
| A7b.svg | Rijbaanversmalling langs links | [File:Belgian traffic sign A7b.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A7b.svg) |
| A7c.svg | Rijbaanversmalling langs rechts | [File:Belgian road sign A7c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A7c.svg) |
| A9.svg | Beweegbare brug | [File:Belgian road sign A9.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A9.svg) |
| A11.svg | Uitweg op een kaai of een oever | [File:Belgian road sign A11.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A11.svg) |
| A13.svg | Uitholling overdwars of ezelsrug | [File:Belgian road sign A13.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A13.svg) |
| A14.svg | Verhoogde inrichting(en) | [File:Belgian road sign A14.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A14.svg) |
| A15.svg | Glibberige rijbaan | [File:Belgian road sign A15.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A15.svg) |
| A17.svg | Kiezelprojectie | [File:Belgian road sign A17.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A17.svg) |
| A19.svg | Vallende stenen | [File:Belgian road sign A19.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A19.svg) |
| A21.svg | Waarschuwing voor een oversteekplaats voor voetgangers | [File:Belgian traffic sign A21.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A21.svg) |
| A23.svg | Plaats waar veel kinderen komen, bijvoorbeeld een school | [File:Belgian traffic sign A23.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A23.svg) |
| A25.svg | Waarschuwing voor een oversteekplaats voor fietsers | [File:Belgian traffic sign A25.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A25.svg) |
| A27.svg | Doortocht van groot wild | [File:Belgian road sign A27.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A27.svg) |
| A29.svg | Doortocht van vee | [File:Belgian road sign A29.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A29.svg) |
| A31.svg | Wegenwerken | [File:Belgian traffic sign A31.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A31.svg) |
| A33.svg | Verkeerslichten | [File:Belgian road sign A33.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A33.svg) |
| A35.svg | Overtocht van vliegtuigen op geringe hoogte | [File:Belgian road sign A35.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A35.svg) |
| A37.svg | Zijwind | [File:Belgian road sign A37.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A37.svg) |
| A39.svg | Verkeer toegelaten in twee richtingen na een gedeelte van de rijbaan met eenrichtingsverkeer | [File:Belgian road sign A39.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A39.svg) |
| A41.svg | Overweg met slagbomen | [File:Belgian traffic sign A41.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A41.svg) |
| A43.svg | Overweg zonder slagbomen | [File:Belgian road sign A43.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A43.svg) |
| A45.svg | Overweg voor enkel spoor | [File:Belgian road sign A45.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A45.svg) |
| A47.svg | Overweg voor twee of meer sporen | [File:Belgian road sign A47.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A47.svg) |
| A49.svg | Kruising van een openbare weg door een of meer in de rijbaan aangelegde sporen | [File:Belgian road sign A49.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A49.svg) |
| A50.svg | File | [File:Belgian road sign A50.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A50.svg) |
| A51.svg | Gevaar dat niet door een speciaal symbool wordt bepaald | [File:Belgian road sign A51.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_A51.svg) |
| B1.svg | Voorrang verlenen | [File:Belgian traffic sign B1.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B1.svg) |
| B3.svg | Aankondiging van bord B1 (voorrang verlenen) op de aangeduide afstand | [File:Belgian road sign B3.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B3.svg) |
| B5.svg | Stoppen en voorrang verlenen | [File:Belgian traffic sign B5.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B5.svg) |
| B7.svg | Aankondiging van bord B5 (stoppen en voorrang verlenen) op de aangeduide afstand | [File:Belgian road sign B7.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B7.svg) |
| B9.svg | Voorrangsweg | [File:Belgian road sign B9.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B9.svg) |
| B11.svg | Einde van de voorrangsweg | [File:Belgian road sign B11.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B11.svg) |
| B13.svg | Aankondiging van het einde van de voorrangsweg op de aangeduide afstand | [File:Belgian road sign B13.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B13.svg) |
| B15.svg | Voorrang op het eerstvolgende kruispunt | [File:Belgian road sign B15.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B15.svg) |
| B17.svg | Kruispunt waar voorrang van rechts geldt | [File:Belgian traffic sign B17.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B17.svg) |
| B19.svg | Smalle doorgang waarbij je voorrang moet verlenen aan tegenliggers | [File:Belgian traffic sign B19.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B19.svg) |
| B21.svg | Smalle doorgang met voorrang ten opzichte van tegenliggers | [File:Belgian road sign B21.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B21.svg) |
| B22.svg | Toelating voor fietsers om rechts af te slaan bij rood licht | [File:Belgian road sign B22.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B22.svg) |
| B23.svg | Toelating voor fietsers om rechtdoor te rijden bij rood licht | [File:Belgian road sign B23.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B23.svg) |
| C1.svg | Verboden richting in te rijden | [File:Belgian traffic sign C1.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C1.svg) |
| C3.svg | Verboden toegang in beide richtingen voor elke bestuurder | [File:Belgian traffic sign C3.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C3.svg) |
| C5.svg | Verboden toegang voor bestuurders van motorvoertuigen met meer dan twee wielen en van motorfietsen met zijspan | [File:Belgian road sign C5.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C5.svg) |
| C7.svg | Verboden toegang voor bestuurders van motorfietsen | [File:Belgian road sign C7.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C7.svg) |
| C9.svg | Verboden toegang voor bestuurders van bromfietsen | [File:Belgian road sign C9.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C9.svg) |
| C11.svg | Verboden toegang voor bestuurders van rijwielen | [File:Belgian road sign C11.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C11.svg) |
| C13.svg | Verboden toegang voor bestuurders van gespannen | [File:Belgian road sign C13.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C13.svg) |
| C15.svg | Verboden toegang voor ruiters | [File:Belgian road sign C15.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C15.svg) |
| C17.svg | Verboden toegang voor bestuurders van handkarren | [File:Belgian road sign C17.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C17.svg) |
| C19.svg | Verboden toegang voor voetgangers | [File:Belgian road sign C19.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C19.svg) |
| C21.svg | Verboden toegang voor bestuurders van voertuigen waarvan de massa in beladen toestand hoger is dan de aangeduide massa | [File:Belgian road sign C21.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C21.svg) |
| C22.svg | Verboden toegang voor bestuurders van autocars | [File:Belgian road sign C22.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C22.svg) |
| C23.svg | Verboden toegang voor bestuurders van motorvoertuigen en slepen ontworpen en gebouwd voor het vervoer van goederen | [File:Belgian road sign C23.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C23.svg) |
| C24a.svg | Verboden toegang voor bestuurders van voertuigen die gevaarlijke goederen vervoeren | [File:Belgian road sign C24a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C24a.svg) |
| C24b.svg | Verboden toegang voor bestuurders van voertuigen die gevaarlijke ontvlambare of ontplofbare stoffen vervoeren | [File:Belgian road sign C24b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C24b.svg) |
| C24c.svg | Verboden toegang voor bestuurders van voertuigen die gevaarlijke verontreinigende stoffen vervoeren | [File:Belgian road sign C24c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C24c.svg) |
| C25.svg | Verboden toegang voor bestuurders van voertuigen of slepen waarvan de lengte, lading inbegrepen, groter is dan de aangeduide | [File:Belgian road sign C25.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C25.svg) |
| C27.svg | Verboden toegang voor bestuurders van voertuigen waarvan de breedte, lading inbegrepen, groter is dan de aangeduide | [File:Belgian road sign C27.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C27.svg) |
| C29.svg | Verboden toegang voor bestuurders van voertuigen waarvan de hoogte, lading inbegrepen, groter is dan de aangeduide | [File:Belgian road sign C29.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C29.svg) |
| C31b.svg | Verbod aan het volgend kruispunt af te slaan in de richting door de pijl aangegeven (rechts) | [File:Belgian traffic sign C31b.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C31b.svg) |
| C33.svg | Verbod om te keren (U-bocht maken) | [File:Belgian traffic sign C33.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C33.svg) |
| C35.svg | Verboden in te halen | [File:Belgian traffic sign C35.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C35.svg) |
| C37.svg | Einde van het verbod een gespan of een voertuig met meer dan twee wielen links in te halen | [File:Belgian road sign C37.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C37.svg) |
| C39.svg | Inhaalverbod voor vrachtwagens met een MTM van meer dan 3,5 ton | [File:Belgian traffic sign C39.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C39.svg) |
| C41.svg | Einde van het verbod voor goederenvoertuigen met een MTM van meer dan 3,5 ton om links in te halen | [File:Belgian road sign C41.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C41.svg) |
| C43-70.svg | Snelheidsbeperking van 70 km/u | [File:Belgian traffic sign C43 70.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C43_70.svg) |
| C43.svg | Verbod te rijden met een grotere snelheid dan deze die is aangeduid tot het volgend kruispunt | [File:Belgian road sign C43.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C43.svg) |
| C45.svg | Einde van de snelheidsbeperking opgelegd door het verkeersbord C43 | [File:Belgian road sign C45.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C45.svg) |
| C46.svg | Einde van alle plaatselijke verbodsbepalingen opgelegd aan de voertuigen in beweging | [File:Belgian road sign C46.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C46.svg) |
| C47.svg | Tolpost: verbod voorbij te rijden zonder te stoppen | [File:Belgian road sign C47.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_C47.svg) |
| D1a.svg | Verplichte rijrichting: rechtdoor | [File:Belgian traffic sign D1a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_D1a.svg) |
| D1b.svg | Verplichte rijrichting: links | [File:Belgian road sign D01b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D01b.svg) |
| D1c.svg | Verplichting om de hindernis langs links voorbij te rijden | [File:Belgian traffic sign D1c.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_D1c.svg) |
| D1d.svg | Verplichting om de hindernis langs rechts voorbij te rijden | [File:Belgian traffic sign D1d.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_D1d.svg) |
| D1e.svg | Verplichte rijrichting: links | [File:Belgian traffic sign D1e.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_D1e.svg) |
| D3.svg | Verplichting om één van de door de pijlen aangeduide richtingen te volgen | [File:Belgian road sign D03.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D03.svg) |
| D4.svg | Verplichte rijrichting voor voertuigen die gevaarlijke goederen vervoeren | [File:Belgian road sign D04.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D04.svg) |
| D5.svg | Verplicht rondgaand verkeer (rotonde) | [File:Belgian road sign D05.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D05.svg) |
| D7.svg | Verplicht fietspad | [File:Belgian road sign D07.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D07.svg) |
| D9.svg | Deel van de openbare weg voorbehouden voor voetgangers, fietsers en bromfietsers klasse A | [File:Belgian road sign D09.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D09.svg) |
| D10.svg | Deel van de openbare weg voorbehouden voor voetgangers en fietsers (zonder bromfietsen) | [File:Belgian road sign D10.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D10.svg) |
| D11.svg | Verplichte weg voor voetgangers (voetpad) | [File:Belgian road sign D11.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D11.svg) |
| D13.svg | Verplichte weg voor ruiters (ruiterpad) | [File:Belgian road sign D13.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D13.svg) |
| E1.svg | Verboden te parkeren | [File:Belgian traffic sign E1.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E1.svg) |
| E3.svg | Stilstaan en parkeren verboden | [File:Belgian traffic sign E3.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E3.svg) |
| E5.svg | Parkeerverbod van de 1e tot de 15e van de maand | [File:Belgian road sign E5.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E5.svg) |
| E7.svg | Parkeerverbod van de 16e tot het einde van de maand | [File:Belgian road sign E7.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E7.svg) |
| E9a.svg | Parkeerplaats voorbehouden voor personen met een handicap | [File:Belgian traffic sign E9a Handicap.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E9a_Handicap.svg) |
| E9b.svg | Parkeren uitsluitend voor motorfietsen, personenauto's, auto's voor dubbelgebruik en minibussen | [File:Belgian road sign E9b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9b.svg) |
| E9c.svg | Parkeren uitsluitend voor lichte vrachtauto's en vrachtauto's | [File:Belgian road sign E9c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9c.svg) |
| E9d.svg | Parkeren uitsluitend voor autocars | [File:Belgian road sign E9d.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9d.svg) |
| E9e.svg | Verplicht parkeren op de berm of op het trottoir | [File:Belgian road sign E9e.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9e.svg) |
| E9f.svg | Verplicht parkeren deels op de berm of op het trottoir | [File:Belgian road sign E9f.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9f.svg) |
| E9g.svg | Verplicht parkeren op de rijbaan | [File:Belgian road sign E9g.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9g.svg) |
| E9h.svg | Parkeren uitsluitend voor kampeerauto's | [File:Belgian road sign E9h.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9h.svg) |
| E9i.svg | Parkeren uitsluitend voor motorfietsen | [File:Belgian road sign E9i.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9i.svg) |
| E9j.svg | Wisselend parkeren met voorbehouden parkeertijd per categorie van voertuigen | [File:Belgian road sign E9j.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E9j.svg) |
| E11.svg | Halfmaandelijks parkeren in gans de bebouwde kom | [File:Belgian road sign E11.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_E11.svg) |
| F1a.svg | Begin van een bebouwde kom | [File:Belgian traffic sign F1a horizontaal.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F1a_horizontaal.svg) |
| F1b.svg | Begin van een bebouwde kom | [File:Belgian traffic sign F1b verticaal.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F1b_verticaal.svg) |
| F3a.svg | Einde van een bebouwde kom | [File:Belgian traffic sign F3a horizontaal.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F3a_horizontaal.svg) |
| F3b.svg | Einde van een bebouwde kom | [File:Belgian traffic sign F3b verticaal.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F3b_verticaal.svg) |
| F4a.svg | Begin van een zone met een snelheidsbeperking van 30 km per uur | [File:Belgian road sign F4a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F4a.svg) |
| F4b.svg | Einde van een zone met een snelheidsbeperking van 30 km per uur | [File:Belgian road sign F4b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F4b.svg) |
| F5.svg | Begin van een autosnelweg | [File:Belgian traffic sign F5.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F5.svg) |
| F7.svg | Einde van een autosnelweg | [File:Belgian road sign F7.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F7.svg) |
| F8.svg | Tunnel met een lengte van meer dan 500 meter | [File:Belgian road sign F8.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F8.svg) |
| F9.svg | Begin van een autoweg | [File:Belgian road sign F9.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F9.svg) |
| F11.svg | Einde van een autoweg | [File:Belgian road sign F11.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F11.svg) |
| F12a.svg | Begin van een woonerf of van een erf | [File:Belgian road sign F12a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F12a.svg) |
| F12b.svg | Einde van een woonerf of van een erf | [File:Belgian road sign F12b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F12b.svg) |
| F13.svg | Verkeersbord dat pijlen op de rijbaan aankondigt en de keuze van een rijstrook voorschrijft | [File:Belgian road sign F13.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F13.svg) |
| F14.svg | Opstelvak voor fietsers en bestuurders van tweewielige bromfietsen | [File:Belgian road sign F14.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F14.svg) |
| F15.svg | Verkeersbord dat de keuze van een richting voorschrijft | [File:Belgian road sign F15.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F15.svg) |
| F17.svg | Aanduiding van de rijstroken van een rijbaan met een strook voorbehouden voor autobussen | [File:Belgian road sign F17.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F17.svg) |
| F18.svg | Aanwijzing van een bijzondere overrijdbare bedding, voorbehouden aan het openbaar vervoer | [File:Belgian road sign F18.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F18.svg) |
| F19.svg | Weg met eenrichtingsverkeer | [File:Belgian traffic sign F19.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F19.svg) |
| F21.svg | Rechts of links voorbijrijden toegelaten | [File:Belgian road sign F21.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F21.svg) |
| F23a.svg | Nummer van een gewone weg | [File:Belgian road sign F23a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F23a.svg) |
| F23b.svg | Nummer van een autosnelweg | [File:Belgian road sign F23b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F23b.svg) |
| F23c.svg | Nummer van een internationale weg | [File:Belgian road sign F23c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F23c.svg) |
| F23d.svg | Nummer van een ring | [File:Belgian road sign F23d.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F23d.svg) |
| F25.svg | Voorwegwijzer | [File:Belgian road sign F25.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F25.svg) |
| F27.svg | Voorwegwijzer | [File:Belgian road sign F27.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F27.svg) |
| F29.svg | Wegwijzer die de te volgen richting aanduidt naar een bestemming | [File:Belgian road sign F29.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F29.svg) |
| F31.svg | Wegwijzer die een reisweg over een autosnelweg aanduidt | [File:Belgian road sign F31.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F31.svg) |
| F33a.svg | Bewegwijzeringsbord op afstand naar een openbaar of industrieel centrum | [File:Belgian road sign F33a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F33a.svg) |
| F33b.svg | Bewegwijzeringsbord op afstand naar een vallei of waterloop van toeristische aard | [File:Belgian road sign F33b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F33b.svg) |
| F33c.svg | Bewegwijzeringsbord op afstand naar een toeristische bezienswaardigheid of recreatiegebied | [File:Belgian road sign F33c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F33c.svg) |
| F34a.svg | Bewegwijzeringsbord in de nabijheid van een openbare inrichting of dienst van algemeen belang | [File:Belgian road sign F34a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F34a.svg) |
| F35.svg | Toeristische wegwijzer naar een monument, bezienswaardigheid of recreatiepark | [File:Belgian road sign F35.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F35.svg) |
| F37.svg | Toeristische wegwijzer naar een verblijfsaccommodatie, camping of jeugdherberg | [File:Belgian road sign F37.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F37.svg) |
| F39.svg | Voorwegwijzer die een omlegging aankondigt | [File:Belgian road sign F39.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F39.svg) |
| F41.svg | Wegwijzer die een omleggingsweg aanduidt | [File:Belgian road sign F41.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F41.svg) |
| F43.svg | Plaatsnaambord zonder snelheidsbeperking van een bebouwde kom | [File:Belgian road sign F43.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F43.svg) |
| F45.svg | Doodlopende weg | [File:Belgian traffic sign F45.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F45.svg) |
| F45b.svg | Doodlopende weg, uitgezonderd voor voetgangers en fietsers | [File:Belgian road sign F45b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F45b.svg) |
| F47.svg | Einde van de werken | [File:Belgian road sign F47.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F47.svg) |
| F49.svg | Plaats van een oversteekplaats voor voetgangers | [File:Belgian traffic sign F49.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F49.svg) |
| F50.svg | Oversteekplaats voor fietsers en bestuurders van tweewielige bromfietsen | [File:Belgian road sign F50.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F50.svg) |
| F50bis.svg | Bord dat bestuurders die van richting veranderen wijst op fietsers en bestuurders van tweewielige bromfietsen die dezelfde weg volgen | [File:Belgian road sign F50bis.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F50bis.svg) |
| F51.svg | Ondergrondse of bovengrondse oversteekplaats voor voetgangers | [File:Belgian road sign F51.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F51.svg) |
| F52.svg | Aankondiging van een nooduitgang in tunnels | [File:Belgian road sign F52.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F52.svg) |
| F52bis.svg | Vluchtroute naar de dichtstbijzijnde nooduitgang in tunnels met aanduiding van richting en afstand | [File:Belgian road sign F52bis.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F52bis.svg) |
| F53.svg | Verplegingsinrichting | [File:Belgian road sign F53.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F53.svg) |
| F55.svg | Hulppost | [File:Belgian road sign F55.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F55.svg) |
| F56.svg | Brandblusapparaat | [File:Belgian road sign F56.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F56.svg) |
| F57.svg | Waterloop | [File:Belgian road sign F57.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F57.svg) |
| F59.svg | Aankondiging van een parking | [File:Belgian road sign F59.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F59.svg) |
| F60.svg | Aankondiging van een overdekte parking | [File:Belgian road sign F60.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F60.svg) |
| F61.svg | Telefoon | [File:Belgian road sign F61.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F61.svg) |
| F62.svg | Noodtelefoon | [File:Belgian road sign F62.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F62.svg) |
| F63.svg | Tankstation | [File:Belgian road sign F63.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F63.svg) |
| F65.svg | Hotel of motel | [File:Belgian road sign F65.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F65.svg) |
| F67.svg | Restaurant | [File:Belgian road sign F67.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F67.svg) |
| F69.svg | Drankgelegenheid | [File:Belgian road sign F69.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F69.svg) |
| F71.svg | Kampeerterrein | [File:Belgian road sign F71.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F71.svg) |
| F73.svg | Caravanterrein | [File:Belgian road sign F73.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F73.svg) |
| F75.svg | Jeugdherberg | [File:Belgian road sign F75.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F75.svg) |
| F77.svg | Vereniging tot bevordering van het vreemdelingenverkeer, trefpunt voor toeristische informatie | [File:Belgian road sign F77.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F77.svg) |
| F79.svg | Voorwegwijzer die de vermindering van het aantal rijstroken aankondigt | [File:Belgian road sign F79.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F79.svg) |
| F81.svg | Voorwegwijzer die een uitwijking aankondigt | [File:Belgian road sign F81.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F81.svg) |
| F83.svg | Voorwegwijzer die een doorsteek van de middenberm aankondigt | [File:Belgian road sign F83.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F83.svg) |
| F85.svg | Verkeer toegelaten in beide richtingen op een deel van de rijbaan met eenrichtingsverkeer | [File:Belgian road sign F85.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F85.svg) |
| F87.svg | Verhoogde inrichting(en) | [File:Belgian road sign F87.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F87.svg) |
| F89.svg | Voorwegwijzer die een gevaar of een verkeersregel aankondigt die slechts van toepassing is op één of meerdere rijstroken | [File:Belgian road sign F89.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F89.svg) |
| F91.svg | Verkeersbord dat een gevaar aanduidt of een verkeersregel voorschrijft die slechts van toepassing is op één of meerdere rijstroken | [File:Belgian road sign F91.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F91.svg) |
| F93.svg | Verkeersbord dat een radio-omroep aanduidt waar verkeersinformatie gegeven wordt | [File:Belgian road sign F93.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F93.svg) |
| F95.svg | Noodstopstrook | [File:Belgian road sign F95.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F95.svg) |
| F97.svg | Verkeersbord dat een versmalling aanduidt die de omvang van een rijstrook heeft | [File:Belgian road sign F97.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F97.svg) |
| F98.svg | Vluchthaven | [File:Belgian road sign F98.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F98.svg) |
| F99a.svg | Begin van de weg of deel van de openbare weg voorbehouden voor het verkeer van voetgangers, fietsers, ruiters en bestuurders van speed pedelecs | [File:Belgian road sign F99a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F99a.svg) |
| F99b.svg | Begin van de weg voorbehouden voor voetgangers, fietsers, ruiters en bestuurders van speed pedelecs met aanduiding van het deel van de weg bestemd voor de verschillende categorieën | [File:Belgian road sign F99b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F99b.svg) |
| F99c.svg | Begin van de weg voorbehouden voor het verkeer van landbouwvoertuigen, voetgangers, fietsers, ruiters en bestuurders van speed pedelecs | [File:Belgian road sign F99c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F99c.svg) |
| F101a.svg | Einde van de weg of van het deel van de openbare weg voorbehouden voor het verkeer van voetgangers, fietsers, ruiters en bestuurders van speed pedelecs | [File:Belgian road sign F101a.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F101a.svg) |
| F101b.svg | Einde van de weg voorbehouden voor voetgangers, fietsers, ruiters en bestuurders van speed pedelecs met aanduiding van het deel van de weg bestemd voor de verschillende categorieën | [File:Belgian road sign F101b.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F101b.svg) |
| F101c.svg | Einde van de weg voorbehouden voor het verkeer van landbouwvoertuigen, voetgangers, fietsers, ruiters en bestuurders van speed pedelecs | [File:Belgian road sign F101c.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F101c.svg) |
| F103.svg | Begin van een voetgangerszone | [File:Belgian traffic sign F103.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F103.svg) |
| F105.svg | Einde van een voetgangerszone | [File:Belgian road sign F105.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F105.svg) |
| F111.svg | Begin van een fietszone | [File:Belgian road sign F111.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F111.svg) |
| F113.svg | Einde van een fietszone | [File:Belgian road sign F113.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_F113.svg) |
| F117.svg | Begin van een lage-emissiezone | [File:Belgian traffic sign F117.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F117.svg) |
| F118.svg | Einde van een lage-emissiezone | [File:Belgian traffic sign F118.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F118.svg) |
| F119.svg | Begin van een luchthavengebied | [File:Belgian traffic sign F119.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F119.svg) |
| F120.svg | Einde van een luchthavengebied | [File:Belgian traffic sign F120.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F120.svg) |

> **Unresolved:** no exact Commons content match found for: C6.svg, C31a.svg. Kept out of the table above rather than guessed; needs manual research.

Cross-reference used to confirm which code matches which meaning and shape: the Dutch Wikipedia series articles ["Serie A: Gevaarsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_A:_Gevaarsborden), ["Serie B: Voorrangsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_B:_Voorrangsborden), ["Serie C: Verbodsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_C:_Verbodsborden), ["Serie D: Gebodsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_D:_Gebodsborden), ["Serie E: Parkeren- en stilstaanborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_E:_Parkeren-_en_stilstaanborden) and ["Serie F: Aanwijzingsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_F:_Aanwijzingsborden), which cite the same Royal Decree of 1 December 1975 (B.S. 09.12.1975) as the Commons file descriptions. verkeersbord.be was checked only as a secondary confirmation of code/shape/meaning, never as an image source.

## Manual review recommended

- `rule-snelheid-bebouwd`: general limit is 50 km/u in Flanders and Wallonia (art. 11.1), but 30 km/u in Brussels; question explicitly targets Flanders.
- `rule-snelheid-buiten-vl`: the 70 km/u default outside built-up areas applies in Flanders and Brussels (art. 11.2); only Wallonia still uses 90 km/u.
- `iden-d10` / `rec-d7`: the distinction between D9 (shared path incl. class-A mopeds) and D10 (pedestrians and cyclists only) matches the official Wegcode codes.
- Everything else in the bank was verified against a live, fetched source (either the Wikimedia Commons file/category pages for sign meanings, or one of the 16 rule sources above) and is not flagged for further review.

## Correction log

- 2026-09-24: regenerated the Sign images table for task T0080, since it had only ever documented the
  first 35 signs and silently went stale as sign coverage grew to 193. `scripts/generate-sign-sources.py`
  matched 191 of 193 local files to their Commons source page by exact SHA-1 content hash. `C31a.svg`
  and `C6.svg` did not match anything on Commons by hash; the nearest name-based candidates
  (`File:Belgian traffic sign C31a.svg` and `File:Belgian road sign C6.svg`) exist but have materially
  different SVG source (different editor metadata and structure, not just whitespace), so they were not
  used. Left both out of the table as unresolved rather than guessed; their sign meanings and
  explanations in `questions.json` are unaffected.

- 2026-09-18: found that `C31.svg` and `D10.svg` were downloaded from a Wikimedia Commons upload
  batch ("KB-AR 03-06-2024") whose own file descriptions did not match the code used in the
  filename: the file saved as `C31.svg` was actually captioned "verboden toegang voor
  kampeerwagens" (camper vans forbidden) on Commons, and the file saved as `D10.svg` was actually
  captioned "einde van het deel... klasse A" (end of the D9a shared path). Both were replaced with
  separately-sourced files whose own captions match the intended meaning (see table above); the
  question text and explanations were already correct and did not need changes. Re-verified against
  the current (Aug 2026) Dutch Wikipedia C- and D-series articles, which do not show any renumbering
  for these codes. The rest of the "KB-AR 03-06-2024" batch was spot-checked against the same
  Wikipedia articles and matched.

- 2026-09-18: replaced the remaining 22 images from the "KB-AR 03-06-2024" batch with the designs of the
  current Wegcode, because that decree only takes effect on 2027-06-01. Each new file was compared with the
  image shown next to the current law text on wegcode.be (C39, C43 and D1a have no image there).

- 2026-09-18: B9 uses the yellow "Belgian road sign B9.svg" upload, because the orange "Belgian traffic sign B9.svg"
  upload does not match the yellow B9 on wegcode.be. Commons files all pre-2024 designs under "historic" categories;
  in Belgian law they stay the valid designs until 2027-06-01.

- 2026-09-18: reviewed all 54 questions against the consolidated Wegcode for task T0002:
  - `rule-snelheid-bebouwd`: restricted question scope to Flanders (50 km/u, art. 11.1) and noted Brussels general 30 km/u limit in explanation.
  - `rule-snelheid-buiten-vl`: corrected explanation to clarify that Brussels also uses 70 km/u (art. 11.2), and only Wallonia uses 90 km/u.
  - `rule-gsm`: corrected distractor to remove requirement for an engine switch-off; cited article 8.4 and definition of stilstaan/parkeren (art. 2.22/2.23).
  - `rule-mistlichten`: updated question and explanation from optional ("mag") to mandatory ("moeten verplicht branden") under article 30.1.2°.
  - `iden-c31`: renamed `C31.svg` to `C31a.svg` to match Wegcode art. 68.3; updated question and explanation to specify left turn prohibition.
  - `iden-d10`: renamed `D9a.svg` to `D9.svg` to match official Wegcode art. 69.3 designation; updated references in `questions.json`.
  - Added specific Wegcode article citations across all 23 rule question explanations.

- 2026-09-18: annotated amendment years and added 9 questions for recent Wegcode reforms under task T0006:
  - Annotated seventeen historical questions with `since` metadata based on amending acts.
  - Added question on e-step helmet requirement above 20 km/u (KB 27 augustus 2026).
  - Added question on motor quadricycle helmet requirements (KB 24 januari 2024).
  - Added question on driving rules for central lanes (KB 30 juli 2022).
  - Added questions on e-step age limits and passenger bans (Wet 15 mei 2022).
  - Added question on speed pedelecs on shared D9 paths (KB 30 juli 2022).
  - Added question on velomobile safety flag visibility rules (KB 9 oktober 2022).
  - Added question on bicycle street F111 junction validity (KB 8 juni 2021).
  - Added question on Brussels default 30 km/u speed limit (BRBHG 22 september 2021).

- 2026-09-18: completed full coverage of all Belgian traffic signs under tasks T0019–T0025:
  - Expanded question bank from 126 to 284 questions with 193 validated SVG traffic sign assets.
  - Sourced, verified, and added questions for 25 warning signs in Series A (A1c through A51).
  - Sourced, verified, and added questions for 8 priority signs in Series B (B3 through B23) and 8 mandatory signs in Series D (D1b through D13).
  - Sourced, verified, and added questions for 25 prohibitory signs in Series C (C5 through C47).
  - Sourced, verified, and added questions for 12 parking and stopping signs in Series E (E5 through E11).
  - Sourced, verified, and added questions for 80 indication signs in Series F (F1a through F120).
  - 2026-09-19: integrated 10 real-live traffic situation photo questions under task T0032:
  - Sourced 10 real-world photographic traffic situations from De Grote Verkeerstoets (VSV / Vlaamse overheid).
  - Stored high-resolution photos in `assets/situations/` and registered new `situation` question type.
  - Linked each question directly to its governing Belgian Wegcode article (Articles 4, 6, 12, 22novies, 40, 67, 76).
  - Maintained balanced answer distribution across options.

- 2026-09-19: fixed 18 confirmed issues found by the T0033 content review, verified against `data/law/wegcode-kb-1975-12-01-consolidated.pdf`:
  - Corrected 13 wrong article/subsection citations where the answer itself was already right: `rule-estep-leeftijd-2022` (8.2, 7°), `rule-estep-passagier-2022` (44.2), `rule-fietser-aan-hand` (2.46), `rule-overweg` (20.3, 2°), `rule-parkeren-kruispunt-afstand` (24, 7°), `rule-ritsen-locatie` and `rule-ritsen-voorrang` (12bis), `rule-inhalen-kruispunt` (17.2, 2°a), `rule-inhalen-oversteekplaats` (17.2, 5°), `sit-08-licht-boven-bord` (6.3), `rule-snelheid-woonerf` (22bis, 3°), `rule-voorrang-tram-voetganger` (12.1), `rule-rotonde-pinker` (19.2, 1°, and swapped its source to the official wegcode.be article instead of a third-party blog).
  - Corrected `rule-velomobiel-2022` and `rule-velomobiel-hoogte-2022`: both invented a "safety flag + 1.40m height" rule under art. 82bis (which covers e-steps, not velomobiles); the real rule (art. 82.1.2, 6°) is a reflective side strip, with no height threshold. Rewrote both questions around the real rule.
  - Corrected `rec-f27`: the law gives F27 the same bare "voorwegwijzer" meaning as F25; the motorway-route badge is an optional overlay on several sign types (art. 71.2), not F27's inherent meaning.
  - Corrected `rule-parkeren-brandkraan`: no fire-hydrant parking rule exists anywhere in the consolidated Wegcode; replaced with the real 1-meter rule from adjacent parked vehicles (art. 25.1, 1°).
  - Corrected `rule-estep-parkeren-2022`: no e-step "dropzone" rule exists federally (cited art. 75.3 is about central-lane markings); replaced with the real rule that mobility devices must be parked outside the roadway without hindering other road users (art. 23.3).
  - 11 further items flagged as uncertain by the review are still open; see `tasks/T0033-review-all-questions.md`.

- 2026-09-19: resolved 9 of the 11 uncertain T0033 findings after further research (amendment PDFs in `data/law/amendments/` and targeted web lookups); 2 remain genuinely unverifiable (see "Manual review recommended" above):
  - `rule-middenrijbaan-2022`: the driving rule isn't a standalone article; it's the combination of the middenrijbaan/zijdelingse strook definitions (art. 2.71-2.72) with the crossing and overtaking rules (art. 15.3, 16.5), confirmed against `kb-2022-07-30.pdf`'s own explanatory memorandum.
  - `rule-vierwieler-helm-2024`: the real KB 2 oktober 2023 rule exempts small agricultural quadricycles (≤40 km/u, no motorcycle-style handlebars) from the helmet duty (art. 36, eerste lid) — not a general "seatbelt + rollbar" exemption, which doesn't exist. Rewrote the question around the real rule, confirmed against `kb-2023-10-02.pdf`.
  - `rule-fietsstraat-f111-2021`: superseded finding — the KB 12 maart 2023 amendment renamed "fietsstraat" to "fietszone" and removed the "ends at next intersection" default entirely; a fietszone now runs until sign F113, and can span multiple streets (art. 2.61). Rewrote the question to reflect current law, confirmed against `kb-2023-03-12.pdf`.
  - `rule-rijbewijs-begeleider` / `rule-begeleider-ervaring`: both cited the wrong decree. The provisional-license rules (17 jaar with a begeleider, 8 jaar license experience for the begeleider) come from KB 10 juli 2006 (art. 2-4 and art. 3, § 2, b), not "KB 10 juli 1998" (that date/decree doesn't govern these provisions); confirmed via wegcode.be's KB 10-07-2006 page. Both now cite `since: 2007`.
  - `rule-verlichting-tunnels`: the Wegcode has no tunnel-specific clause; reworded the explanation to ground the claim in the actual trigger (the general <200m visibility rule of art. 30.1), which in practice almost always applies in a tunnel, rather than claiming an explicit tunnel rule that isn't in the text.
  - `rule-voorrang-aardeweg`: removed "verharde" (paved), a qualifier not present in art. 12.3.1, b); the rule applies to any road with a rijbaan, not only paved ones. Swapped the source to the official wegcode.be article.
  - `rule-estep-trottoir-2022`: corrected the citation to art. 7bis (as amended by Wet 15 mei 2022, art. 3), which is the actual provision equating motorized mobility device users with cyclists; the previously cited "art. 9.1.2°" governs cycle-path use, not this equivalence.
  - `rec-d1b` / `rec-d1e`: cross-checked against the Dutch Wikipedia D-series article (already used elsewhere in this file as a secondary source). D1c/D1d's "pass the obstacle left/right" framing was already correct. D1b and D1e, however, both just mean "verplichte rijrichting: links" (two alternate icon designs for the same rule) — removed the invented "op het kruispunt" / "vóór het verkeersbord" distinction, which Wikipedia's table doesn't support.
  - `rec-f49`: recategorized from `fietsers-voetgangers` to `aanwijzing` to match its closest sibling signs (F50, F51, F14, F45b), which are all `aanwijzing`.

- 2026-09-19: removed the `since` field from `iden-d10` (was 2014) and `iden-e9a` (was 1990): both years
  were unverifiable (pre-2021, and the government page that might date them is CAPTCHA-gated), but the sign
  meanings and explanations in both questions are correct and were not changed. Closes T0033.

- 2026-09-24: fixed article-anchor links for task T0079, after fetching every distinct source page's
  raw HTML and confirming which `#`-anchors genuinely exist server-side:
  - Added the missing `#art-N` fragment to 40 questions whose `source` already pointed at the
    consolidated Wegcode or WAM-wet text but cited a single article without a fragment.
  - Repointed 5 questions from a `wegcode.be` explainer/news page (no anchors) to the consolidated
    law text page's matching `#art-N`, since both pages are on `wegcode.be` and only the law text
    exposes real per-article anchors.
  - Added a verified in-page heading anchor on the already-used third-party page for 5 questions:
    `verkeerszaken.be` (rotondes, 2 questions), `touring.be` (reddingsstrook, 1) and the `wegcode.be`
    cyclist brochure (fietssuggestiestrook and naast-elkaar-fietsen, 2), after confirming each
    heading's own text matches the cited fact.
  - Left 3 questions' links unanchored on purpose: `rule-reddingsstrook-vorming-2022` and
    `rule-autosnelweg-pechstrook` each cite two unrelated articles (a definition plus an operative
    rule), so a single `#art-N` would misrepresent which one is "the" reference; `rule-brussel-stad30-2021`
    cites "art. 11.2" of a *Brussels regional decree*, not the Wegcode, so a wegcode.be `#art-11`
    anchor would point at unrelated text. No replacement source was fabricated for these three.
  - Verified every other candidate source domain (16 third-party pages from the "Rule sources" list
    above) for heading-level anchors; all but the three used above have none, so those links are
    left as bare page URLs, per the "no HTML anchor" exception.

- 2026-09-21: integrated 20 additional real traffic situation photo questions under task T0044:
  - Sourced and validated 20 authentic photographic traffic situations covering roundabouts, level crossings, bus lanes, woonerven, priority vehicles, continuous lines, and cyclist interactions.
  - Stored high-resolution photos in `assets/situations/` and registered questions `sit-21` through `sit-40` in `data/questions.json`.
  - Linked each question directly to its governing Belgian Wegcode article (Articles 4, 6, 7bis, 9, 12, 19, 20, 22bis, 22decies, 24, 38, 40, 40ter, 64, 65, 67, 72, 77).
  - Maintained balanced answer distribution across options and updated Service Worker precache suite to 247 assets.

## Situation photo sources

The 40 real-world traffic situation photographs in `assets/situations/` originate from *De Grote Verkeerstoets*, the official public traffic safety educational initiative organized by the Flemish Foundation for Traffic Knowledge ([VSV](https://www.vsv.be)) in partnership with the Flemish Government ([Departement Mobiliteit en Openbare Werken](https://www.vlaanderen.be/departement-mobiliteit-en-openbare-werken)).

In accordance with Belgian copyright law (Wetboek van economisch recht, Art. XI.189 §1, 1° & 2°), the non-commercial use of short illustrative excerpts for educational road safety testing (*onderwijsexceptie* and *citaatrecht*) is permitted with proper attribution to the author and source.

| Local file | Situation | Wegcode legal basis | Source reference |
|---|---|---|---|
| `sit-01-b5-stop.jpg` | STOP-bord (B5) met stopstreep | Art. 67.3 & Art. 12.1 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-02-b17-voorrang-rechts.jpg` | Kruispunt met voorrang van rechts (B17) | Art. 67.1 & Art. 12.3.1 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-03-b1-haaientanden.jpg` | Voorrang verlenen bord B1 met haaientanden | Art. 67.2 & Art. 76.1 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-04-b22-rechtsaf-rood.jpg` | Bord B22 rechtsaf vrij voor fietsers bij rood | Art. 67.3 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-05-f49-zebrapad-fietser.jpg` | Voetgangersoversteekplaats (F49) en fietser | Art. 40.4.1 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-06-b19-smalle-doorgang.jpg` | Smalle doorgang voorrang tegenligger (B19) | Art. 67.4 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-07-kruispunt-drie-fietsers.jpg` | Gelijkwaardig kruispunt met 3 fietsers | Art. 12.3.1 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-08-licht-boven-bord.jpg` | Verkeerslicht op groen boven STOP-bord B5 | Art. 6.3 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-09-fietszone-f111.jpg` | Fietsstraat / fietszone (F111) inhaalverbod | Art. 22novies | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-10-politieagent-halt.jpg` | Bevoegd persoon met armen horizontaal gestrekt | Art. 4.1 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-11-plaats-geen-fietspad.jpg` | Positie fietser op rijbaan bij ontbreken fietspad | Art. 9.1.2 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-12-step-trottoir.jpg` | Voortbewegingstoestel (step) op trottoir / fietspad | Art. 7bis | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-13-bebouwde-kom-naast-elkaar.jpg` | Twee fietsers naast elkaar in bebouwde kom | Art. 43.2 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-14-fietspad-d7-enkelrichting.jpg` | Rijrichting fietspad bord D7 | Art. 9.1.2.1° & Art. 69.1 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-15-kind-voetpad.jpg` | Kind tot 10 jaar fietsen op voetpad | Art. 9.1.2.3° | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-16-voetganger-links-rijbaan.jpg` | Voetganger links op de rijbaan bij ontbreken stoep/berm | Art. 42.2.1° | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-17-b9-voorrangsweg.jpg` | Voorrangsweg bord B9 | Art. 67.3 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-18-b21-voorrang-tegenliggers.jpg` | Smalle doorgang voorrang op tegenligger (bord B21) | Art. 67.4 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-19-f19-beperkt-eenrichting.jpg` | Beperkt eenrichtingsverkeer bord F19 met onderbord M2 | Art. 65.2 & Art. 71 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-20-f4a-zone-30.jpg` | Zone 30 beginbord F4a | Art. 71 & Art. 22quater | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-21-rotonde-voorrang.jpg` | Rotonde met bord D5 en B1 voorrang verlenen | Art. 12.3.1 & Art. 67.2 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-22-overweg-slagbomen.jpg` | Spooroverweg met knipperende rode lichten en slagbomen | Art. 20.3, 2° | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-23-voorsorteren-pijlen.jpg` | Voorsorteren op kruispunt met voorsorteerpijlen | Art. 77.1 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-24-fietssuggestiestrook.jpg` | Rood-okerkleurige fietssuggestiestrook op rijbaan | Art. 2.62 & Art. 9.1.2 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-25-erf-woonerf-f12a.jpg` | Woonerf / erf aangeduid met bord F12a | Art. 22bis | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-26-prioritair-voertuig.jpg` | Naderend prioritair voertuig met blauwe zwaailichten en sirene | Art. 38 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-27-doorlopende-witte-streep.jpg` | Inhaalverbod over doorlopende witte streep | Art. 72.2 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-28-parkeren-trottoir-verbod.jpg` | Parkeerverbod op het trottoir zonder toelatingsbord E9b | Art. 24.1° & Art. 23.1 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-29-busstrook-f17.jpg` | Busstrook / bijzondere overrijdbare bedding bord F17 | Art. 72.5 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-30-blindengeleidehond-oversteken.jpg` | Voorrangsplicht voor blinde voetganger met stok of geleidehond | Art. 40.2 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-31-rechtsaf-fietser-voorrang.jpg` | Afslaande bestuurder verleent voorrang aan rechtdoorgaande fietser | Art. 19.3.2° | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-32-knipperlicht-beweegbare-brug.jpg` | Beurtelings knipperende rode lichten bij beweegbare brug | Art. 64.1 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-33-geel-knipperlicht-kruispunt.jpg` | Oranjegeel knipperlicht op kruispunt (voorrang van rechts) | Art. 6.3 & Art. 12.3.1 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-34-fietsopstelvak-f107.jpg` | Fietsopstelvak (OFOS) bij verkeerslichten bord F107 | Art. 77.8 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-35-schoolstraat-c3.jpg` | Schoolstraat afgesloten met bord C3 en onderbord | Art. 2.68 & Art. 22decies | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-36-spitsstrook-matrixbord.jpg` | Geopende spitsstrook op autosnelweg aangeduid met groene pijl | Art. 9.7 & Art. 65.4 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-37-tram-halte-uitstappen.jpg` | Stoppen voor uitstappende passagiers bij tramhalte op rijbaan | Art. 40.1 | [De Grote Verkeerstoets - Voorrang](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/voorrang) |
| `sit-38-bevoegd-persoon-arm-omhoog.jpg` | Bevoegd persoon met verticaal opgeheven arm (stop voor iedereen) | Art. 4.1 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-39-afstand-inhalen-fietser.jpg` | Minimumafstand 1,5 meter bij inhalen fietser buiten bebouwde kom | Art. 40ter | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |
| `sit-40-reddingsstrook-file.jpg` | Vorming van reddingsstrook bij file op autosnelweg | Art. 2.70 & Art. 9.8 | [De Grote Verkeerstoets - Plaats op de weg](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas) |

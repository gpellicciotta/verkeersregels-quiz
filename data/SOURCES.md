# Sources and content notes

Content for the Belgian theoretical driving exam quiz, generated and verified on 2026-09-18.

## Question bank summary

Total questions: 294, stored in `data/questions.json`.

Breakdown by type:

- recognize: 193
- identify: 12
- rule: 79
- situation: 10

Breakdown by category:

- aanwijzing: 89
- voorrang: 36
- verbod: 34
- gevaar: 31
- fietsers-voetgangers: 29
- parkeren: 23
- algemeen: 17
- gebod: 10
- snelheid: 9
- autosnelweg: 8
- alcohol: 4
- gordel: 2
- telefoon: 2

Answer positions (`correctIndex`) are spread across options (73 for 0, 75 for 1, 74 for 2, 72 for 3) so the correct answer is not systematically in the same position.

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

All 35 SVG files in `assets/signs/` come from Wikimedia Commons, drawn from the "Road signs of Belgium" categories (`Category:SVG warning/priority/prohibitory/mandatory/parking road signs of Belgium` and the `File:Belgian traffic sign F...` set). Every file was downloaded, checked for a valid, non-trivial SVG body, and spot-checked for correct shape and color coding (red danger triangles, red prohibition circles, blue mandatory/information signs, correct pictogram fills) before use.

License: all files are public domain under Belgian law, because official traffic signs are part of Belgian legislation (Belgian Copyright Act, art. 8, §2) - stated on each file's Commons description page. All files show the designs of the current Wegcode (KB 1 December 1975). The redesigned signs of the Royal Decree of 3 June 2024 ("KB-AR 03-06-2024" uploads) only become valid on 2027-06-01 and renumber some codes, so they are not used.

| Local file | Meaning (NL) | Wikimedia Commons source page |
|---|---|---|
| A1a.svg | Gevaarlijke bocht naar links | [File:Belgian traffic sign A1a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A1a.svg) |
| A1b.svg | Gevaarlijke bocht naar rechts | [File:Belgian traffic sign A1b.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A1b.svg) |
| A7a.svg | Rijbaanversmalling | [File:Belgian traffic sign A7a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A7a.svg) |
| A21.svg | Waarschuwing oversteekplaats voetgangers | [File:Belgian traffic sign A21.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A21.svg) |
| A23.svg | Plaats met veel kinderen (schoolomgeving) | [File:Belgian traffic sign A23.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A23.svg) |
| A25.svg | Waarschuwing oversteekplaats fietsers | [File:Belgian traffic sign A25.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A25.svg) |
| A31.svg | Wegenwerken | [File:Belgian traffic sign A31.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A31.svg) |
| A41.svg | Overweg met slagbomen | [File:Belgian traffic sign A41.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A41.svg) |
| B1.svg | Voorrang verlenen | [File:Belgian traffic sign B1.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B1.svg) |
| B5.svg | Stoppen en voorrang verlenen | [File:Belgian traffic sign B5.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B5.svg) |
| B9.svg | Voorrangsweg | [File:Belgian road sign B9.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_B9.svg) |
| B17.svg | Kruispunt met voorrang van rechts | [File:Belgian traffic sign B17.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B17.svg) |
| B19.svg | Smalle doorgang, voorrang verlenen aan tegenliggers | [File:Belgian traffic sign B19.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B19.svg) |
| C1.svg | Verboden richting in te rijden | [File:Belgian traffic sign C1.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C1.svg) |
| C3.svg | Verboden toegang in beide richtingen | [File:Belgian traffic sign C3.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C3.svg) |
| C31a.svg | Verbod aan het volgend kruispunt links af te slaan (C31a) | [File:Belgian traffic sign C31a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C31a.svg) |
| C33.svg | Verbod om te keren | [File:Belgian traffic sign C33.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C33.svg) |
| C35.svg | Verbod in te halen | [File:Belgian traffic sign C35.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C35.svg) |
| C39.svg | Verbod voor vrachtwagens om in te halen | [File:Belgian traffic sign C39.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C39.svg) |
| C43-70.svg | Snelheidsbeperking 70 km/u | [File:Belgian traffic sign C43 70.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C43_70.svg) |
| D1a.svg | Verplichte rijrichting rechtdoor | [File:Belgian traffic sign D1a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_D1a.svg) |
| D5.svg | Verplicht rondgaand verkeer (rotonde) | [File:Belgian road sign D05.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D05.svg) |
| D7.svg | Verplicht fietspad | [File:Belgian road sign D07.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D07.svg) |
| D9.svg | Deel van de openbare weg voorbehouden voor voetgangers, fietsen en bromfietsen klasse A (D9) | [File:Belgian road sign D09.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D09.svg) |
| D10.svg | Gedeeld pad voetgangers en fietsers | [File:Belgian road sign D10.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D10.svg) |
| E1.svg | Verboden te parkeren | [File:Belgian traffic sign E1.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E1.svg) |
| E3.svg | Verboden te parkeren en te stilstaan | [File:Belgian traffic sign E3.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E3.svg) |
| E9a.svg | Voorbehouden parkeerplaats voor personen met een handicap | [File:Belgian traffic sign E9a Handicap.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E9a_Handicap.svg) |
| F1b.svg | Begin van een bebouwde kom | [File:Belgian traffic sign F1b verticaal.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F1b_verticaal.svg) |
| F3b.svg | Einde van een bebouwde kom | [File:Belgian traffic sign F3b verticaal.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F3b_verticaal.svg) |
| F5.svg | Begin van een autosnelweg | [File:Belgian traffic sign F5.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F5.svg) |
| F19.svg | Eenrichtingsverkeer | [File:Belgian traffic sign F19.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F19.svg) |
| F45.svg | Doodlopende weg | [File:Belgian traffic sign F45.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F45.svg) |
| F49.svg | Oversteekplaats voor voetgangers | [File:Belgian traffic sign F49.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F49.svg) |
| F103.svg | Begin van een voetgangerszone | [File:Belgian traffic sign F103.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_F103.svg) |

Cross-reference used to confirm which code matches which meaning and shape: the Dutch Wikipedia series articles ["Serie A: Gevaarsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_A:_Gevaarsborden), ["Serie B: Voorrangsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_B:_Voorrangsborden), ["Serie C: Verbodsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_C:_Verbodsborden), ["Serie D: Gebodsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_D:_Gebodsborden), ["Serie E: Parkeren- en stilstaanborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_E:_Parkeren-_en_stilstaanborden) and ["Serie F: Aanwijzingsborden"](https://nl.wikipedia.org/wiki/Verkeersborden_in_Belgi%C3%AB_-_Serie_F:_Aanwijzingsborden), which cite the same Royal Decree of 1 December 1975 (B.S. 09.12.1975) as the Commons file descriptions. verkeersbord.be was checked only as a secondary confirmation of code/shape/meaning, never as an image source.

## Manual review recommended

- `rule-snelheid-bebouwd`: general limit is 50 km/u in Flanders and Wallonia (art. 11.1), but 30 km/u in Brussels; question explicitly targets Flanders.
- `rule-snelheid-buiten-vl`: the 70 km/u default outside built-up areas applies in Flanders and Brussels (art. 11.2); only Wallonia still uses 90 km/u.
- `iden-d10` / `rec-d7`: the distinction between D9 (shared path incl. class-A mopeds) and D10 (pedestrians and cyclists only) matches the official Wegcode codes.
- Everything else in the bank was verified against a live, fetched source (either the Wikimedia Commons file/category pages for sign meanings, or one of the 16 rule sources above) and is not flagged for further review.

## Correction log

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

## Situation photo sources

The 10 real-world traffic situation photographs in `assets/situations/` originate from *De Grote Verkeerstoets*, the official public traffic safety educational initiative organized by the Flemish Foundation for Traffic Knowledge ([VSV](https://www.vsv.be)) in partnership with the Flemish Government ([Departement Mobiliteit en Openbare Werken](https://www.vlaanderen.be/departement-mobiliteit-en-openbare-werken)).

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
| `sit-08-licht-boven-bord.jpg` | Verkeerslicht op groen boven STOP-bord B5 | Art. 6.2 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-09-fietszone-f111.jpg` | Fietsstraat / fietszone (F111) inhaalverbod | Art. 22novies | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |
| `sit-10-politieagent-halt.jpg` | Bevoegd persoon met armen horizontaal gestrekt | Art. 4.1 | [De Grote Verkeerstoets - Verkeerstekens](https://www.degroteverkeerstoets.be/aan-de-slag-in-de-klas/verkeerstekens) |

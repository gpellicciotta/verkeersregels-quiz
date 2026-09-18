# Sources and content notes

Content for the Belgian theoretical driving exam quiz, generated and verified on 2026-09-18.

## Question bank summary

Total questions: 54, stored in `data/questions.json`.

Breakdown by type:

- recognize: 22
- identify: 9
- rule: 23

Breakdown by category:

- voorrang: 9
- fietsers-voetgangers: 8
- gevaar: 6
- verbod: 5
- algemeen: 5
- snelheid: 4
- aanwijzing: 4
- autosnelweg: 4
- gebod: 2
- parkeren: 2
- alcohol: 2
- gordel: 2
- telefoon: 1

Answer positions (`correctIndex`) are spread across all four slots (roughly 12-15 questions per index) so the correct answer is not systematically in the same position.

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

Sign-meaning questions (`recognize` and `identify`) do not carry a `source` field, since the pictogram meanings are unambiguous and confirmed directly against the official Belgian sign catalogue (see below), not against a secondary explainer site.

## Sign images

All 35 SVG files in `assets/signs/` come from Wikimedia Commons, drawn from the "Road signs of Belgium" categories (`Category:SVG warning/priority/prohibitory/mandatory/parking road signs of Belgium` and the `File:Belgian traffic sign F...` set). Every file was downloaded, checked for a valid, non-trivial SVG body, and spot-checked for correct shape and color coding (red danger triangles, red prohibition circles, blue mandatory/information signs, correct pictogram fills) before use.

License: all files are public domain under Belgian law, because official traffic signs are part of Belgian legislation (Belgian Copyright Act, art. 8, §2) - stated on each file's Commons description page. Most A/B/C/D/E-series files reproduce the June 3, 2024 Royal Decree annex ("KB-AR 03-06-2024" uploads); the F-series and a few D/E files are the long-standing plain Commons uploads for those codes.

| Local file | Meaning (NL) | Wikimedia Commons source page |
|---|---|---|
| A1a.svg | Gevaarlijke bocht naar links | [File:Belgian traffic sign A1a KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A1a_KB-AR_03-06-2024.svg) |
| A1b.svg | Gevaarlijke bocht naar rechts | [File:Belgian traffic sign A1b KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A1b_KB-AR_03-06-2024.svg) |
| A7a.svg | Rijbaanversmalling | [File:Belgian traffic sign A7a KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A7a_KB-AR_03-06-2024.svg) |
| A21.svg | Waarschuwing oversteekplaats voetgangers | [File:Belgian traffic sign A21 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A21_KB-AR_03-06-2024.svg) |
| A23.svg | Plaats met veel kinderen (schoolomgeving) | [File:Belgian traffic sign A23 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A23_KB-AR_03-06-2024.svg) |
| A25.svg | Waarschuwing oversteekplaats fietsers | [File:Belgian traffic sign A25 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A25_KB-AR_03-06-2024.svg) |
| A31.svg | Wegenwerken | [File:Belgian traffic sign A31 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A31_KB-AR_03-06-2024.svg) |
| A41.svg | Overweg met slagbomen | [File:Belgian traffic sign A41 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_A41_KB-AR_03-06-2024.svg) |
| B1.svg | Voorrang verlenen | [File:Belgian traffic sign B1 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B1_KB-AR_03-06-2024.svg) |
| B5.svg | Stoppen en voorrang verlenen | [File:Belgian traffic sign B5 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B5_KB-AR_03-06-2024.svg) |
| B9.svg | Voorrangsweg | [File:Belgian traffic sign B9 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B9_KB-AR_03-06-2024.svg) |
| B17.svg | Kruispunt met voorrang van rechts | [File:Belgian traffic sign B17 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B17_KB-AR_03-06-2024.svg) |
| B19.svg | Smalle doorgang, voorrang verlenen aan tegenliggers | [File:Belgian traffic sign B19 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_B19_KB-AR_03-06-2024.svg) |
| C1.svg | Verboden richting in te rijden | [File:Belgian traffic sign C1 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C1_KB-AR_03-06-2024.svg) |
| C3.svg | Verboden toegang in beide richtingen | [File:Belgian traffic sign C3 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C3_KB-AR_03-06-2024.svg) |
| C31.svg | Verbod om links af te slaan (C31a) | [File:Belgian traffic sign C31a.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C31a.svg) |
| C33.svg | Verbod om te keren | [File:Belgian traffic sign C33 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C33_KB-AR_03-06-2024.svg) |
| C35.svg | Verbod in te halen | [File:Belgian traffic sign C35 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C35_KB-AR_03-06-2024.svg) |
| C39.svg | Verbod voor vrachtwagens om in te halen | [File:Belgian traffic sign C39 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C39_KB-AR_03-06-2024.svg) |
| C43-70.svg | Snelheidsbeperking 70 km/u | [File:Belgian traffic sign C43 70 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_C43_70_KB-AR_03-06-2024.svg) |
| D1a.svg | Verplichte rijrichting rechtdoor | [File:Belgian traffic sign D1a KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_D1a_KB-AR_03-06-2024.svg) |
| D5.svg | Verplicht rondgaand verkeer (rotonde) | [File:Belgian road sign D05.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D05.svg) |
| D7.svg | Verplicht fietspad | [File:Belgian road sign D07.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D07.svg) |
| D9a.svg | Gedeeld pad voetgangers/fietsers/bromfiets klasse A | [File:Belgian road sign D09.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D09.svg) |
| D10.svg | Gedeeld pad voetgangers en fietsers | [File:Belgian road sign D10.svg](https://commons.wikimedia.org/wiki/File:Belgian_road_sign_D10.svg) |
| E1.svg | Verboden te parkeren | [File:Belgian traffic sign E1 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E1_KB-AR_03-06-2024.svg) |
| E3.svg | Verboden te parkeren en te stilstaan | [File:Belgian traffic sign E3 KB-AR 03-06-2024.svg](https://commons.wikimedia.org/wiki/File:Belgian_traffic_sign_E3_KB-AR_03-06-2024.svg) |
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

- `rule-snelheid-buiten-vl`: the 70 km/u default outside built-up areas is specific to the Flemish Region (Wallonia and Brussels still use 90 km/u); the question text names Vlaanderen explicitly, but double-check it still matches the app's target audience.
- `iden-d10` / `rec-d7`: the distinction between D9a (shared path incl. class-A mopeds) and D10 (pedestrians and cyclists only) is a fine legal nuance; worth a quick read-through since it is easy to misremember.
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

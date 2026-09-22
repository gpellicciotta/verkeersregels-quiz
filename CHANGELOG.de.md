# Versionierte Änderungen

Eine zusammenfassende Übersicht aller Änderungen pro Version dieses Projekts.

> Einträge werden in umgekehrter chronologischer Reihenfolge hinzugefügt, sodass der neueste Eintrag ganz oben steht.
>
> Die oberste Versionsüberschrift ist immer die aktive in der Entwicklung befindliche Version, gekennzeichnet durch ein `-pre`
> Suffix auf seiner Versionsnummer (z. B. `## v1.1.1-pre`) anstelle eines Status-Tags. Sobald eine Version eingefroren ist
> Oder freigegeben, wird dieses Suffix durch einen dieser Statuscodes ersetzt:
> – `[{{date}}]` – eingefroren/abgeschlossen am {{date}}
> – `[released: {{date}}]` – für Paketmanager oder Produktion auf {{date}} freigegeben
> – `[broken]` – gilt als defekt und wird nicht verwendet

---

## v3.5.1-pre
- FrontEnd: Die Schaltfläche „Fehler melden“ ist jetzt eine echte, allgegenwärtige Schaltfläche mit automatischem Bildschirmkontext.
- BackEnd: Die zusammenfassende E-Mail zeigt jetzt eine eigene Tabelle für jeden verfolgten Spieler mit gleichmäßig aufgeteilten Spalten „Immer“, „Letzte Woche“ und „Letzte 24 Stunden“.
- BackEnd: Gemeldete Probleme zeigen jetzt sowohl die Frage-ID als auch den Fragentext statt nur einer.

## v3.5.0 [released: 2026-09-22]
- BackEnd: Google Apps Script sendet jetzt täglich um 7:00 Uhr und 19:00 Uhr UTC eine zusammenfassende E-Mail im niederländischen Stil mit Ergebnissen, Benachrichtigungen und einer anpassbaren Liste der Spieler, denen man folgen kann.
- FrontEnd: Der Info-Bildschirm zeigt nun das Änderungsprotokoll in der Sprache der aktiven Benutzeroberfläche an.
- FrontEnd: Das Dialogfeld „Fehler melden“ zeigt jetzt ein Titelsymbol und einen konfigurierbaren optionalen Fragenkontext an.
- FrontEnd: Ein Einstellungsdialog mit klaren Abschnitten „Allgemein/Quiz/Karussell“ ersetzt die beiden separaten Dialoge.
- FrontEnd: Name, Sprache, Theme und Theme-Farbe sind nun ebenfalls anpassbar und werden im localStorage gespeichert.
- DevEx: `translate-markdown.py` hinzugefügt, wobei Markdown vor der Übersetzung jeder Veröffentlichung nach Überschrift und Absatz aufgeteilt wird.

## v3.4.0 [released: 2026-09-22]
- FrontEnd: Quizfragen wurde oben rechts auf der Karte eine Schaltfläche zum Schließen angezeigt, die den Fortschrittsverlust in allen fünf Sprachen bestätigt.
- FrontEnd: Automatische PWA-Updates erfolgen jetzt schneller.
- FrontEnd: Das Iconset wird jetzt beiseite gelegt und durchgehend verwendet.

## v3.3.0 [released: 2026-09-22]
- FrontEnd: Italienische Übersetzungen für die Benutzeroberfläche, Konfigurationsdialoge und Fragenbank hinzugefügt.
- FrontEnd: Deutsche Übersetzungen für die Benutzeroberfläche, Konfigurationsdialoge und Fragenbank hinzugefügt.
- FrontEnd: Französische Übersetzungen für die Benutzeroberfläche, Konfigurationsdialoge und Fragenbank hinzugefügt.
- FrontEnd: Der Tooltip zur Sprachumschaltung wurde präzisiert; Es zeigt jetzt den gesamten Sprachzyklus mit hervorgehobener aktiver Sprache.
- FrontEnd: Straßenverkehrsordnung-Quellcode-Links zeigen jetzt die französische Version an, wenn die französische Sprache ausgewählt wird; Deutsch und Englisch bleiben in der niederländischen Version erhalten, da es keine offizielle Entsprechung gibt.
- FrontEnd: Alle möglichen anderen kleineren UI/UX-Verbesserungen

## v3.2.0 [2026-09-22]
- FrontEnd: Dem Karussell wurden separate, lokalisierte Erklärungen und Titel für Verkehrszeichen hinzugefügt, einschließlich vollständiger niederländischer und englischer Übersetzungen.
- FrontEnd: In Quizfragen, Antwortoptionen und im Karussell wurden generische Alternativtexte mit Bildern durch beschreibende Board-Codes ersetzt.
- FrontEnd: Es wurde die Möglichkeit hinzugefügt, Quizergebnisse über die Web Share API zu teilen, mit einem Fallback zum Kopieren in die Zwischenablage und Toastbenachrichtigungen.
- FrontEnd: Den Antwortoptionen und der Kopfzeile wurden Hinweisschilder (unabhängig von der Farbe) hinzugefügt, um richtige und falsche Antworten anzuzeigen (Barrierefreiheit für Farbenblinde).
- FrontEnd: CSS wurde zu einem modularen „Mobile-First“-Stylesheet umgestaltet, das Audit-Tokens und WCAG-Kontraststandards entspricht.
- FrontEnd: Englische Übersetzung und Sprachumschaltung für die Benutzeroberfläche, Konfigurationsdialoge und alle 324 Fragen hinzugefügt.
- FrontEnd: Den Spaltenüberschriften in der Ergebnistabelle wurden „Scope“-Attribute hinzugefügt, um die Barrierefreiheit für Bildschirmleser zu gewährleisten.
- DevEx: Die JavaScript-Architektur ist in separate ES-Module modularisiert und trennt Anwendungsstatus, Speicher und UI-Präsentationslogik.
- FrontEnd: Automatische Aktualisierungen des Service-Worker-Lebenszyklus und Neuladen des Clients bei der Einführung neuer Versionen aktiviert.
- FrontEnd: Behalten Sie den Einführungstext auf dem Startbildschirm bei, wenn Sie den Quizmodus wechseln oder Konfigurationen ändern.
- FrontEnd: Dunkles Design und konfigurierbare Farbakzente hinzugefügt, einschließlich Systempräferenzerkennung und Unterstützung für Abfrageparameter.
- FrontEnd: Unterstützung für Abfrageparameter für Spielernamen (einschließlich Aliase) hinzugefügt, um das Eingabefeld auf dem Startbildschirm zu umgehen.
- FrontEnd: Zwanzig Fotofragen zu realen Verkehrssituationen hinzugefügt, einschließlich verbessertem Offline-Caching und automatisierten Tests.
- DevEx: Alle Quellcodekommentare in HTML-, CSS- und JavaScript-Modulen, standardisiert auf amerikanisches Englisch.
- FrontEnd: Spielername und Quizeinstellungen werden im lokalen Speicher gespeichert, wobei URL-Abfrageparameter Vorrang haben.

## v3.1.0 [released: 2026-09-21]
- FrontEnd: Startbildschirm minimiert mit runden Aktionstasten, Modusschalter, Karussellsteuerung und interaktiven Einstellungsdialogen.
- FrontEnd: Bessere Konfigurationsmöglichkeiten, konsistentere Schaltflächen und vereinfachte Schnittstellenanweisungen.
- DevEx: Versionsnummerierung verknüpft mit dem Changelog als zentrale Quelle für Frontend- und Entwicklungsskripte.

## v3.0.0 [released: 2026-09-19]
- FrontEnd: Der Startbildschirm wurde aufgeräumt und eine spezielle Info-Ansicht mit Versionsverlauf, Versionshinweisen, Quellenangaben und Urheberrecht hinzugefügt.
- FrontEnd: Anwendungssymbol und Favicon außerhalb des runden Straßenschilds, vollständig transparent mit ICO mit mehreren Auflösungen.
- FrontEnd: Verkehrszeichenkarussell mit einstellbarer Änderungsdauer, Pausensteuerung und klarer Pausenanzeige über URL-Parameter und Starttaste hinzugefügt.
- Inhoud: Alle 294 Fragen überarbeitet; 27 inhaltliche Fehler und 2 unbestätigte Jahre korrigiert.
- FrontEnd: Ergebnisschaltflächen kompakt oben rechts auf dem Desktop platziert und Beschriftungen für rechtliche Änderungen typografisch harmonisiert.
- Inhoud: Zwanzig Übungsfragen mit Fotos von Verkehrssituationen hinzugefügt, inklusive Unterstützung für die Filterung über Abfrageparameter.
- FrontEnd: Fragetypfilter mit visuellen Startaufforderungen und reaktionsfähiger Fotoanzeige für reale Situationen hinzugefügt.
- FrontEnd: Zwei-Panel-Layout auf dem Desktop und mobile Ansicht ohne Scrollen mit schwebender Aktionsschaltfläche und kompaktem Gesetzeslink implementiert.
- FrontEnd: Progressive Web-App mit 100-prozentiger Offline-Unterstützung, Kreisverkehrsymbolen und lokaler Fehlerwarteschlange installiert.
- Test: Automatisierte Layouttests für die Zwei-Panel-Struktur, das Ausblenden mobiler Optionen und den kompakten Rechtslink hinzugefügt.
- Test: Automatisierte Verifizierungstests für Web-App-Manifest, Symbolgrößen und Service-Worker-Preload-Dateien hinzugefügt.
- CLI: Standardisierung aller Entwicklungsskripte nach umsetzbaren CLI-Richtlinien mit strukturierter Protokollierung und Kebab-Case-Dateinamen.

## v2.0.0 [released: 2026-09-18]
- Inhoud: Vollständige Abdeckung aller belgischen Verkehrszeichen mit 193 Schilderbildern und 284 Fragen.
- FrontEnd: Fehlerberichtsformular, optimiert für sofortiges Senden im Hintergrund ohne Schnittstellenverzögerung.
- FrontEnd: Der Fortschrittsbalken wurde korrigiert und erhöht sich proportional von der ersten Frage auf 100 Prozent.
- Test: Die Testsuite wurde um strenge Prüfungen auf das Vorhandensein von Board-Bildern für alle Board-Fragen erweitert.

## v1.1.0 [released: 2026-09-18]
- Documentatie: Visuelle Tour mit Desktop- und Mobil-Screenshots zur README-Datei hinzugefügt.
- FrontEnd: Blaues Verkehrszeichen-Favicon hinzugefügt und Schaltfläche für die letzte Frage geändert, um Ergebnisse anzuzeigen.
- FrontEnd: Startbenachrichtigungen und Fortschrittsanzeigen zeigen jetzt dynamische Fragenanzahlen an, die auf verfügbare Fragen beschränkt sind.
- FrontEnd: URL-Abfrageparameter zum Filtern nach Jahr der Gesetzesänderung und Anzahl der Fragen hinzugefügt.
- FrontEnd: Offizielle Gesetzesartikel und erklärende Links werden nach der Beantwortung jeder Quizfrage angezeigt.
- Inhoud: Fragendatenbank verdoppelt auf 126 Fragen mit vollständiger Abdeckung des Vorstands und Regeln für die Zeit nach 2022.

## v1.0.0 [released: 2026-09-18]
- Documentatie: Standard-Projektdokumentation einschließlich Anforderungen, DevOps-Leitfaden, Lizenz und Dokumentationsindex hinzugefügt.
- DevEx: Plattformübergreifende Bootstrap- und Bereitstellungsskripte mit CLI-Version und Hilfeoptionen hinzugefügt.
- Test: Automatisierte Testsuite zur Überprüfung der Fragenstruktur, Board-Bilder und Gesetzesjahre hinzugefügt.
- FrontEnd: Verkehrszeichen und Miniaturansichten werden in der Ergebnisübersicht für Fragen zu Schildern angezeigt.
- FrontEnd: Interaktives Versions-Badge auf dem Startbildschirm hinzugefügt, das beim Klicken das Änderungsprotokoll öffnet.
- FrontEnd: Schaltfläche und Dialog zur Fehlerberichterstattung hinzugefügt, um Fragen-Feedback an Google Sheets zu senden.
- FrontEnd: Quizdauer von Anfang bis Ende verfolgt, mit Ergebnissen angezeigt und in Google Sheets aufgezeichnet.
- FrontEnd: Direkte Links zur offiziellen konsolidierten Straßenverkehrsordnung und Gesetzesänderungen wurden dem Startbildschirm hinzugefügt.
- FrontEnd: Ergebnisübersicht beim Drucken im Vollbildmodus mit Seitentrennungsschutz und sich wiederholenden Überschriften.
- FrontEnd: Mobile Ergebniskarten kompakter gestaltet mit Statusabzeichen oben rechts und zusammengeführten Antwortfeldern.
- FrontEnd: Gesetzesänderungs-Badges und URL-Parameter hinzugefügt, um aktuelle Verkehrsregeln gezielt umzusetzen.
- FrontEnd: Mobilfreundliches niederländisches Quiz mit 20 zufälligen Fragen und sofortigem Feedback.
- FrontEnd: Druckbare Ergebnisübersicht mit Miniaturansichten der Tafel und Konfetti für eine perfekte Punktzahl hinzugefügt.
- Inhoud: Fragen, Antworten, Erklärungen und Verkehrszeichen, zugeschnitten auf die aktuelle belgische Verkehrsgesetzgebung.
- Inhoud: 63 verifizierte Prüfungsfragen mit Quellenangaben und 35 hinzugefügten belgischen Verkehrszeichen.
- BackEnd: Optionale Punkteverfolgung in Google Sheets für Spieler über einen sicheren Apps Script-Endpunkt.
- Documentatie: Anweisungen für lokale Tests, GitHub Pages-Veröffentlichung und Google Sheet-Konfiguration hinzugefügt.
- Documentatie: Offizielle Straßenverkehrsordnung und alle Änderungen seit 2021 als rechtliche Referenzquellen hinzugefügt.

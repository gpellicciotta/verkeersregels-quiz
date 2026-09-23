# Modifiche alla versione

Una panoramica riepilogativa di tutte le modifiche, per versione di questo progetto.

> Le voci verranno aggiunte in ordine cronologico inverso, quindi con la più recente in alto.
>
> L'intestazione della versione più in alto è sempre la versione attiva in fase di sviluppo, identificata da `-pre`
> Suffisso sul numero di versione (ad esempio `## v1.1.1-pre`) invece di un tag di stato. Una volta che una versione è congelata
> O rilasciato, il suffisso viene sostituito da uno di questi codici di stato:
> - `[{{date}}]` - congelato/finalizzato il {{date}}
> - `[released: {{date}}]` - rilasciato al gestore pacchetti o alla produzione il {{date}}
> - `[broken]` - considerato rotto e non utilizzato

---

## v3.5.1-pre
- FrontEnd: I pulsanti di azione ora sono fissi su mobile e il pulsante salva anche su desktop.
- FrontEnd: Pulsante segnala errore nella visualizzazione quiz mobile spostato in una posizione fissa in basso a sinistra con design rotondo predefinito.
- DevEx: Standardizzati tutti i messaggi di registrazione della console del browser e di avviso di runtime in inglese su tutti i moduli client.
- DevEx: Tutte le funzioni JavaScript ora dispongono di documentazione JSDoc con parametri e valore restituito, monitorati da un test di regressione.
- DevEx: Il nuovo script `run-review-server.py` serve il progetto tramite HTTP con thread per la revisione e il test del browser.
- FrontEnd: Impostazioni ora si apre a schermo intero, con il pulsante segnala errore in alto a sinistra come in Informazioni su questa app.
- FrontEnd: I nuovi pulsanti avviano un quiz con le domande errate precedenti o ripetono successivamente solo le domande errate.
- FrontEnd: L'istituto aggiunge automaticamente le domande errate del quiz precedente a un nuovo round.
- FrontEnd: Il tempo di gioco totale, le statistiche di gioco e le domande con risposte errate più frequenti vengono ora monitorate localmente in localStorage.
- FrontEnd: Il pulsante Segnala un bug ora è un pulsante reale e onnipresente con contesto sullo schermo automatico.
- BackEnd: L'e-mail di riepilogo ora mostra la propria tabella per ciascun giocatore seguito con colonne equamente divise Sempre/Ultima settimana/Ultime 24 ore.
- BackEnd: I problemi segnalati ora mostrano sia l'ID domanda che il testo della domanda invece di uno solo.

## v3.5.0 [released: 2026-09-22]
- BackEnd: Google Apps Script ora invia un'email di riepilogo in stile olandese ogni giorno alle 7:00 e alle 19:00 UTC con risultati, notifiche e un elenco personalizzabile di giocatori da seguire.
- FrontEnd: La schermata Informazioni ora mostra il registro delle modifiche tradotto nella lingua dell'interfaccia attiva.
- FrontEnd: La finestra di dialogo "Segnala un bug" ora mostra un'icona del titolo e un contesto di domanda opzionale configurabile.
- FrontEnd: Una finestra di dialogo delle impostazioni con sezioni Generali/Quiz/Carosello chiare sostituisce le due finestre di dialogo separate.
- FrontEnd: Nome, lingua, tema e colore del tema ora possono essere modificati e salvati in localStorage.
- DevEx: Aggiunto `translate-markdown.py`, suddividendo Markdown per titolo e paragrafo prima di tradurre ogni versione.

## v3.4.0 [released: 2026-09-22]
- FrontEnd: Le domande del quiz hanno ricevuto un pulsante di chiusura in alto a destra della scheda che conferma la perdita di progressi in tutte e cinque le lingue.
- FrontEnd: Gli aggiornamenti automatici PWA ora avverranno più velocemente.
- FrontEnd: Il set di icone è ora messo da parte e utilizzato in modo coerente ovunque.

## v3.3.0 [released: 2026-09-22]
- FrontEnd: Aggiunte traduzioni in italiano per l'interfaccia utente, le finestre di dialogo di configurazione e la banca delle domande.
- FrontEnd: Aggiunte traduzioni in tedesco per l'interfaccia utente, le finestre di dialogo di configurazione e la banca delle domande.
- FrontEnd: Aggiunte traduzioni francesi per l'interfaccia utente, le finestre di dialogo di configurazione e la banca delle domande.
- FrontEnd: Chiarito il tooltip per il cambio di lingua; ora mostra l'intero ciclo linguistico con la lingua attiva evidenziata.
- FrontEnd: I collegamenti al codice sorgente Codice della strada ora mostrano la versione francese quando si seleziona la lingua francese; Il tedesco e l'inglese rimangono nella versione olandese, in assenza di un equivalente ufficiale.
- FrontEnd: Tutti i tipi di altri miglioramenti minori dell'interfaccia utente/UX

## v3.2.0 [2026-09-22]
- FrontEnd: Spiegazioni e titoli separati e localizzati per i segnali stradali aggiunti al carosello, comprese le traduzioni complete in olandese e inglese.
- FrontEnd: Sostituiti i testi alternativi generici delle immagini con codici descrittivi della scheda nelle domande dei quiz, nelle opzioni di risposta e nel carosello.
- FrontEnd: Aggiunta la possibilità di condividere i risultati dei quiz tramite l'API Web Share, con possibilità di copiare negli appunti e notifiche di avviso popup.
- FrontEnd: Aggiunti badge indicatori (non dipendenti dal colore) per le opzioni di risposta e l'intestazione per indicare le risposte corrette e errate (accessibilità daltonica).
- FrontEnd: CSS rifattorizzato in un foglio di stile modulare "mobile-first" conforme ai token di controllo e agli standard di contrasto WCAG.
- FrontEnd: Aggiunta la traduzione in inglese e il cambio di lingua per l'interfaccia utente, le finestre di dialogo di configurazione e tutte le 324 domande.
- FrontEnd: Aggiunti gli attributi 'Ambito' alle intestazioni delle colonne nella tabella dei risultati per l'accessibilità allo screen reader.
- DevEx: Architettura JavaScript modulare in moduli ES separati, che separano lo stato dell'applicazione, l'archiviazione e la logica di presentazione dell'interfaccia utente.
- FrontEnd: Abilitati gli aggiornamenti automatici del ciclo di vita dei service work e i ricariche dei client durante l'implementazione di nuove versioni.
- FrontEnd: Mantieni il testo introduttivo sulla schermata iniziale quando cambi modalità quiz o modifichi le configurazioni.
- FrontEnd: Aggiunto tema scuro e accenti di colore configurabili, incluso il rilevamento delle preferenze di sistema e il supporto dei parametri di query.
- FrontEnd: Aggiunto supporto per i parametri di query del nome del giocatore (inclusi gli alias) per ignorare il campo di input nella schermata principale.
- FrontEnd: Aggiunte venti domande fotografiche su situazioni di traffico reale, inclusa una migliore memorizzazione nella cache offline e test automatizzati.
- DevEx: Tutti i commenti del codice sorgente nei moduli HTML, CSS e JavaScript sono standardizzati in inglese americano.
- FrontEnd: Nome del giocatore e impostazioni del quiz salvate nella memoria locale, con i parametri di query dell'URL che hanno la precedenza.

## v3.1.0 [released: 2026-09-21]
- FrontEnd: Schermata Home ridotta a icona con pulsanti di azione rotondi, cambio di modalità, controlli carosello e finestre di dialogo delle impostazioni interattive.
- FrontEnd: Migliori scelte di configurazione, pulsanti più coerenti e istruzioni di interfaccia semplificate.
- DevEx: Numerazione delle versioni collegata al registro delle modifiche come fonte centrale per frontend e script di sviluppo.

## v3.0.0 [released: 2026-09-19]
- FrontEnd: Pulita la schermata iniziale e aggiunta una visualizzazione specifica Informazioni con cronologia delle versioni, note sulla versione, citazioni delle fonti e copyright.
- FrontEnd: Icona dell'applicazione e favicon all'esterno del segnale stradale rotondo rese completamente trasparenti con ico multi-risoluzione.
- FrontEnd: Aggiunto carosello di segnali stradali con durata di modifica regolabile, controllo della pausa e chiaro indicatore di pausa tramite parametri URL e pulsante di avvio.
- Inhoud: Tutte le 294 domande riviste; Corretti 27 errori sostanziali e 2 anni non confermati.
- FrontEnd: Pulsanti dei risultati posizionati in modo compatto in alto a destra sul desktop ed etichette di modifica legale armonizzate in termini di tipografia.
- Inhoud: Sono state aggiunte venti domande pratiche con foto di situazioni di traffico, incluso il supporto per il filtraggio tramite parametri di query.
- FrontEnd: Aggiunto filtro del tipo di domanda con istruzioni di avvio visive e visualizzazione di foto reattive per situazioni del mondo reale.
- FrontEnd: Layout a due pannelli su desktop e visualizzazione mobile senza scorrimento con pulsante di azione mobile e collegamento alla legge compatto implementato.
- FrontEnd: Applicazione Web progressiva installata con supporto offline al 100%, icone rotonde e coda di errori locale.
- Test: Aggiunti test di layout automatizzati per la struttura a due pannelli, l'occultamento delle opzioni mobili e il collegamento alle leggi compatto.
- Test: Aggiunti test di verifica automatizzati per il manifest dell'app Web, le dimensioni delle icone e i file di precaricamento dei lavoratori del servizio.
- CLI: Standardizzati tutti gli script di sviluppo in linee guida CLI utilizzabili con registrazione strutturata e nomi di file kebab-case.

## v2.0.0 [released: 2026-09-18]
- Inhoud: Copertura completa di tutti i segnali stradali belgi ottenuta con 193 immagini di segnali e 284 domande.
- FrontEnd: Modulo di segnalazione errori ottimizzato per l'invio istantaneo in background senza alcun ritardo dell'interfaccia.
- FrontEnd: Barra di avanzamento corretta per aumentare proporzionalmente dalla prima domanda al 100%.
- Test: Suite di test ampliata con controlli rigorosi per la presenza di immagini della bacheca per tutte le domande della bacheca.

## v1.1.0 [released: 2026-09-18]
- Documentatie: Tour visivo con screenshot di desktop e dispositivi mobili aggiunti al file README.
- FrontEnd: Aggiunta favicon del segnale stradale blu e pulsante per l'ultima domanda modificato per mostrare i risultati.
- FrontEnd: La notifica di avvio e gli indicatori di progresso ora mostrano il conteggio dinamico delle domande limitato alle domande disponibili.
- FrontEnd: Aggiunti parametri di interrogazione URL per filtrare per anno di legge e numero di domande.
- FrontEnd: Articoli giuridici ufficiali e collegamenti esplicativi visualizzati dopo aver risposto a ciascuna domanda del quiz.
- Inhoud: Banca delle domande raddoppiata a 126 domande con copertura completa e regole post-2022.

## v1.0.0 [released: 2026-09-18]
- Documentatie: Aggiunta la documentazione standard del progetto inclusi requisiti, guida DevOps, licenza e indice della documentazione.
- DevEx: Aggiunti script di bootstrap e distribuzione multipiattaforma con versione CLI e opzioni di guida.
- Test: Aggiunta suite di test automatizzata per la verifica della struttura delle domande, delle immagini della bacheca e degli anni di giurisprudenza.
- FrontEnd: Segnali stradali e miniature mostrate nella panoramica dei risultati per le domande relative ai segnali.
- FrontEnd: Aggiunto badge della versione interattiva sulla schermata iniziale che apre il registro delle modifiche quando viene cliccato.
- FrontEnd: Aggiunto pulsante di segnalazione errori e finestra di dialogo per inviare feedback sulle domande a Fogli Google.
- FrontEnd: Durata del quiz monitorata dall'inizio alla fine, mostrata con i risultati e registrata in Fogli Google.
- FrontEnd: Collegamenti diretti al Codice della strada consolidato ufficiale e alle modifiche legislative aggiunti nella schermata iniziale.
- FrontEnd: Panoramica dei risultati una volta stampati a schermo intero con protezione della separazione delle pagine e intestazioni ripetute.
- FrontEnd: Schede dei risultati mobili rese più compatte con badge di stato in alto a destra e campi di risposta uniti.
- FrontEnd: Aggiunti badge di modifica della legge e parametri URL per mettere in pratica le recenti regole del traffico in modo mirato.
- FrontEnd: Quiz olandese ottimizzato per dispositivi mobili con 20 domande casuali e feedback immediato.
- FrontEnd: Aggiunta panoramica dei risultati stampabili con miniature delle schede e coriandoli per un punteggio perfetto.
- Inhoud: Domande, risposte, spiegazioni e segnali stradali adeguati all'attuale legislazione belga sulla circolazione stradale.
- Inhoud: 63 domande d'esame verificate con riferimenti alla fonte e aggiunti 35 segnali stradali belgi.
- BackEnd: Monitoraggio opzionale del punteggio in Fogli Google per i giocatori tramite un endpoint sicuro di Apps Script.
- Documentatie: Aggiunte istruzioni per test locali, pubblicazione di pagine GitHub e configurazione di Fogli Google.
- Documentatie: Codice della strada ufficiale e tutte le modifiche dal 2021 aggiunte come fonti legali di riferimento.

-- Guida originale in italiano per il nodo Web Security Course.
begin;

do $migration$
declare
  course_node_id uuid;
begin
  select id
  into course_node_id
  from public.nodes
  where slug in ('web-security', 'web-security-course')
     or lower(label) in ('web security course', 'web security couse')
  order by case
    when slug = 'web-security' then 0
    when slug = 'web-security-course' then 1
    else 2
  end
  limit 1;

  if course_node_id is null then
    raise exception 'Nodo web-security non trovato: verificare slug ed etichetta prima di applicare la migrazione.';
  end if;

  insert into public.node_content_sections (node_id, sort_order, title, type, payload)
  select
    course_node_id,
    section.sort_order + coalesce((
      select max(existing.sort_order) + 1
      from public.node_content_sections existing
      where existing.node_id = course_node_id
        and existing.title not in (
          '1. Fondamenti della sicurezza',
          '2. Pilastri e principi di sicurezza',
          '3. Protocollo HTTP',
          '4. Sicurezza Web',
          '5. Sicurezza lato server',
          '6. SQL injection',
          '7. Vulnerabilità logiche',
          '8. Sicurezza lato client',
          '9. Glossario tecnico'
        )
    ), 0),
    section.title,
    'text',
    section.payload
  from jsonb_to_recordset($course_sections$
  [
    {
      "sort_order": 0,
      "title": "1. Fondamenti della sicurezza",
      "payload": {
        "subtitle": "Dagli asset al rischio: un percorso per ragionare sulle minacce e definire un perimetro di lavoro responsabile.",
        "blocks": [
          {
            "type": "text",
            "payload": {
              "text": "La sicurezza web protegge persone, informazioni e servizi durante tutto il loro ciclo di vita. Non consiste nel rendere impossibile ogni attacco: consiste nel ridurre la probabilità e l'impatto degli incidenti, rilevarli e recuperare in modo controllato. Ogni valutazione parte da ciò che ha valore e dal contesto in cui viene usato."
            }
          },
          {
            "type": "list",
            "payload": {
              "items": [
                "Passo 1. Identifica gli asset: account, dati personali, credenziali, codice, disponibilità e reputazione del servizio.",
                "Passo 2. Individua minacce e attori: errori accidentali, abuso interno, criminalità, automazione opportunistica o guasti.",
                "Passo 3. Cerca vulnerabilità e condizioni che le rendono raggiungibili, compresi configurazioni, dipendenze e processi.",
                "Passo 4. Stima probabilità e impatto, tenendo conto di utenti coinvolti, esposizione e conseguenze operative.",
                "Passo 5. Scegli controlli proporzionati, verifica che funzionino e aggiorna la valutazione quando cambia il sistema."
              ]
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Termine", "Significato"],
              "rows": [
                ["Minaccia", "Circostanza o attore capace di causare un danno."],
                ["Vulnerabilità", "Debolezza tecnica, organizzativa o procedurale sfruttabile o soggetta a errore."],
                ["Rischio", "Combinazione di probabilità, esposizione e impatto su un asset."],
                ["Superficie d'attacco", "Punti di ingresso, componenti e flussi che possono essere raggiunti o influenzati."]
              ]
            }
          },
          {
            "type": "callout",
            "payload": {
              "variant": "warning",
              "title": "Perimetro e autorizzazione",
              "text": "Analisi e test si svolgono solo su sistemi propri o con autorizzazione esplicita. Definisci prima asset, ambiente, account, metodi consentiti, orari, limiti, contatti e condizioni di arresto; registra le evidenze senza raccogliere dati non necessari."
            }
          }
        ]
      }
    },
    {
      "sort_order": 1,
      "title": "2. Pilastri e principi di sicurezza",
      "payload": {
        "subtitle": "Disponibilità, riservatezza e integrità si rafforzano con identità verificate, permessi minimi e controlli sovrapposti.",
        "blocks": [
          {
            "type": "text",
            "payload": {
              "text": "Il modello CIA descrive tre obiettivi complementari. La riservatezza limita la lettura ai soggetti autorizzati; l'integrità protegge correttezza e provenienza delle informazioni; la disponibilità mantiene dati e funzioni accessibili quando servono. La sicurezza reale dipende anche da autenticazione, autorizzazione, tracciabilità e capacità di recupero."
            }
          },
          {
            "type": "list",
            "payload": {
              "items": [
                "Fase 1. Verifica l'identità con autenticazione adeguata al rischio e proteggi le credenziali.",
                "Fase 2. Autorizza ogni operazione sulla risorsa specifica; autenticazione e autorizzazione sono controlli distinti.",
                "Fase 3. Concedi solo i permessi indispensabili, per il tempo necessario e con separazione dei ruoli.",
                "Fase 4. Applica più difese indipendenti, impostazioni sicure predefinite e registrazione utile degli eventi.",
                "Fase 5. Verifica backup e procedure di risposta: la resilienza comprende rilevamento, contenimento e ripristino."
              ]
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Obiettivo", "Domanda di controllo"],
              "rows": [
                ["Riservatezza", "Chi può vedere questo dato e in quale contesto?"],
                ["Integrità", "Chi può modificarlo e come si verifica la modifica?"],
                ["Disponibilità", "Quali dipendenze o guasti possono impedire il servizio?"],
                ["Autenticità e tracciabilità", "Possiamo attribuire l'azione a un'identità e ricostruire gli eventi?"]
              ]
            }
          },
          {
            "type": "callout",
            "payload": {
              "variant": "note",
              "title": "Crittografia: obiettivo e gestione",
              "text": "La cifratura protegge la riservatezza; hash e firme digitali supportano verifiche d'integrità o autenticità. HTTPS protegge il trasporto, non corregge autorizzazioni errate né rende sicuri dati salvati o applicazioni vulnerabili. Chiavi, certificati, rotazione e recupero fanno parte del progetto."
            }
          }
        ]
      }
    },
    {
      "sort_order": 2,
      "title": "3. Protocollo HTTP",
      "payload": {
        "subtitle": "Sequenza di una richiesta: dal contesto del browser al server e ritorno, con attenzione a stato, metadati e trasporto.",
        "blocks": [
          {
            "type": "list",
            "payload": {
              "items": [
                "Passo 1. Il client individua origine e risorsa tramite schema, host, porta e percorso dell'URL.",
                "Passo 2. Prepara metodo, header e, se previsto, body con dati e tipo di contenuto.",
                "Passo 3. La richiesta attraversa la rete; HTTPS aggiunge TLS per autenticare il server e proteggere il trasporto.",
                "Passo 4. Il server interpreta la richiesta, applica controlli e regole, poi produce status, header e body.",
                "Passo 5. Il browser interpreta la risposta; cookie, cache e redirect possono influenzare le richieste successive."
              ]
            }
          },
          {
            "type": "text",
            "payload": {
              "text": "HTTP è un protocollo applicativo a richiesta e risposta. È stateless: ogni richiesta deve contenere il contesto necessario; cookie e sessioni sono meccanismi aggiunti per mantenere stato tra richieste. I metodi comunicano l'intento (per esempio GET per leggere, POST per inviare o creare, PUT/PATCH per aggiornare, DELETE per rimuovere); il server deve comunque verificare permessi e regole."
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Parte", "Uso e cautela"],
              "rows": [
                ["Metodo e percorso", "Descrivono l'azione richiesta e la risorsa, ma non autorizzano l'operazione."],
                ["Header", "Trasportano metadati come tipo del contenuto, cookie e direttive di cache."],
                ["Body", "Contiene dati; non è intrinsecamente affidabile perché proviene dal client."],
                ["Status", "Indica l'esito HTTP, non deve rivelare dettagli interni o segreti."],
                ["Cookie", "Possono trasportare un identificatore di sessione; proteggerli con Secure, HttpOnly e SameSite."]
              ]
            }
          },
          {
            "type": "code",
            "payload": {
              "language": "text",
              "code": "POST /api/profili HTTP/1.1\nHost: esempio.it\nContent-Type: application/json\nCookie: sessione=<identificatore>\n\n{\"nome\":\"Ada\"}\n\nHTTP/1.1 201 Created\nContent-Type: application/json\nCache-Control: no-store"
            }
          }
        ]
      }
    },
    {
      "sort_order": 3,
      "title": "4. Sicurezza Web",
      "payload": {
        "subtitle": "Un percorso difensivo dal browser all'applicazione: origini, confini di fiducia e protezioni coordinate.",
        "blocks": [
          {
            "type": "list",
            "payload": {
              "items": [
                "Fase 1. Mappa origini, dati e confini di fiducia: browser, API, servizi esterni e archivi.",
                "Fase 2. Definisci quali origini possono comunicare; la same-origin policy limita l'accesso tra origini diverse.",
                "Fase 3. Applica autenticazione, autorizzazione e protezione delle sessioni lato server.",
                "Fase 4. Valida i dati in ingresso e codifica l'output in base al contesto di utilizzo.",
                "Fase 5. Aggiungi HTTPS, intestazioni di sicurezza, logging e test per verificare l'intero flusso."
              ]
            }
          },
          {
            "type": "text",
            "payload": {
              "text": "Un'origine è la combinazione di schema, host e porta. La same-origin policy isola documenti e risposte; CORS è un meccanismo esplicito con cui il server autorizza alcune letture cross-origin da parte dei browser. CORS non è autenticazione e non impedisce a qualunque client di inviare richieste. CSRF sfrutta credenziali inviate automaticamente dal browser: token anti-CSRF, cookie SameSite e verifica del contesto aiutano a difendere le operazioni che cambiano stato."
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Controllo", "Ruolo"],
              "rows": [
                ["Content-Security-Policy", "Riduce le sorgenti e i contesti di esecuzione ammessi; non sostituisce la correzione di XSS."],
                ["Strict-Transport-Security", "Indica al browser di usare HTTPS per il dominio secondo la policy configurata."],
                ["X-Content-Type-Options", "Evita l'interpretazione opportunistica di tipi MIME in contesti supportati."],
                ["Frame-ancestors", "Limita quali siti possono incorporare le pagine e riduce il rischio di clickjacking."]
              ]
            }
          },
          {
            "type": "callout",
            "payload": {
              "variant": "warning",
              "title": "Le difese devono corrispondere al contesto",
              "text": "CORS non sostituisce il controllo degli accessi; HTTPS non protegge da un endpoint vulnerabile; la validazione client-side non protegge il server. Ogni controllo va applicato nel componente che possiede la decisione e verificato sul flusso completo."
            }
          }
        ]
      }
    },
    {
      "sort_order": 4,
      "title": "5. Sicurezza lato server",
      "payload": {
        "subtitle": "Fasi di elaborazione affidabile: il server valida, autorizza, tratta i dati in sicurezza e lascia tracce utili.",
        "blocks": [
          {
            "type": "list",
            "payload": {
              "items": [
                "Fase 1. Considera non attendibile ogni input, anche se il browser lo ha già validato.",
                "Fase 2. Controlla schema, tipo, limiti e semantica dei dati prima di usarli.",
                "Fase 3. Autentica il chiamante e autorizza l'azione sulla specifica risorsa richiesta.",
                "Fase 4. Usa API sicure e privilegi minimi per database, file, processi e servizi esterni.",
                "Fase 5. Restituisci errori controllati, registra eventi significativi e monitora anomalie."
              ]
            }
          },
          {
            "type": "text",
            "payload": {
              "text": "Le verifiche lato server sono l'autorità finale. Evita di concatenare input in query, comandi o percorsi; separa dati e istruzioni con API parametrizzate e allowlist contestuali. Per upload, limita dimensione e tipi, assegna nomi controllati, conserva i file fuori dalle aree eseguibili e verifica l'accesso. Per richieste verso URL o servizi esterni, limita destinazioni e protocolli e applica timeout e controlli di rete."
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Area", "Controllo difensivo"],
              "rows": [
                ["Sessioni", "Identificatori imprevedibili, cookie protetti, scadenza e invalidazione al logout o a eventi sensibili."],
                ["File e percorsi", "Directory consentite, nomi generati dal server, limiti e separazione dei permessi."],
                ["Segreti", "Conservazione in secret manager o configurazione protetta; mai nel codice client o nei log."],
                ["Errori", "Messaggi pubblici essenziali; dettagli tecnici solo in log protetti e correlabili."],
                ["Dipendenze", "Inventario, aggiornamenti controllati, provenienza e rimozione dei componenti non necessari."]
              ]
            }
          },
          {
            "type": "callout",
            "payload": {
              "variant": "note",
              "title": "Osservabilità senza esposizione",
              "text": "Registra eventi con timestamp, richiesta correlabile, identità disponibile ed esito; riduci o maschera credenziali, token e dati personali. Definisci accesso ai log, conservazione, allarmi e procedura di risposta."
            }
          }
        ]
      }
    },
    {
      "sort_order": 5,
      "title": "6. SQL injection",
      "payload": {
        "subtitle": "Procedura sicura per separare i dati dalla struttura SQL, verificare i privilegi e ridurre l'impatto degli errori.",
        "blocks": [
          {
            "type": "list",
            "payload": {
              "items": [
                "Passo 1. Riconosci il confine: i valori ricevuti dall'utente sono dati, mai frammenti di query fidati.",
                "Passo 2. Usa statement preparati e parametri legati dal driver o dall'ORM.",
                "Passo 3. Per identificatori non parametrizzabili, scegli da una allowlist di nomi previsti.",
                "Passo 4. Assegna all'account database solo i privilegi richiesti dalla funzione applicativa.",
                "Passo 5. Verifica casi validi e non validi in un ambiente autorizzato; controlla log e gestione degli errori."
              ]
            }
          },
          {
            "type": "text",
            "payload": {
              "text": "La SQL injection nasce quando un'applicazione costruisce istruzioni SQL mescolando testo di controllo e input senza una separazione sicura. Può alterare il significato della query e compromettere riservatezza, integrità o disponibilità in base ai privilegi e ai dati raggiungibili. Il filtraggio di caratteri non è una difesa generale: la prevenzione principale è la parametrizzazione coerente."
            }
          },
          {
            "type": "code",
            "payload": {
              "language": "js",
              "code": "const result = await db.query(\n  \"SELECT id, email FROM users WHERE id = $1\",\n  [userId],\n);"
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Approccio", "Valutazione"],
              "rows": [
                ["Query parametrizzata", "I valori restano separati dalla sintassi SQL."],
                ["ORM usato tramite API sicure", "Riduce la composizione manuale; le query raw richiedono comunque parametri."],
                ["Escape manuale o blacklist", "Fragile: dipende da driver, codifica, contesto e dialetto."],
                ["Account database privilegiato", "Amplifica l'impatto di una vulnerabilità; applicare il minimo privilegio."]
              ]
            }
          }
        ]
      }
    },
    {
      "sort_order": 6,
      "title": "7. Vulnerabilità logiche",
      "payload": {
        "subtitle": "Procedura di verifica delle regole di business: ricostruire lo stato, l'attore, la risorsa e le transizioni consentite.",
        "blocks": [
          {
            "type": "list",
            "payload": {
              "items": [
                "Passo 1. Descrivi l'obiettivo legittimo e gli stati possibili dell'operazione.",
                "Passo 2. Per ogni transizione, identifica attore, risorsa, precondizioni e autorizzazione.",
                "Passo 3. Verifica limiti, ripetizioni, ordine delle azioni e coerenza tra richieste concorrenti.",
                "Passo 4. Applica le regole sul server e tratta le transizioni come operazioni atomiche quando necessario.",
                "Passo 5. Prova casi limite in un ambiente di test e controlla che audit e recupero siano possibili."
              ]
            }
          },
          {
            "type": "text",
            "payload": {
              "text": "Una vulnerabilità logica permette un risultato non previsto senza necessariamente rompere una primitiva tecnica. Esempi di classi di errore sono controlli di proprietà mancanti (IDOR/BOLA), aggiornamenti di campi non consentiti (mass assignment), salti di passaggi obbligatori, riuso di azioni o token e condizioni di gara. Il difetto spesso emerge dall'interazione tra endpoint, ruoli e stati."
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Scenario da modellare", "Regola da far rispettare"],
              "rows": [
                ["Risorsa identificata dal client", "Verificare sul server la proprietà o il permesso per quella risorsa."],
                ["Prezzi, sconti e quantità", "Ricalcolare valori e limiti sul server usando dati autorevoli."],
                ["Flusso multi-step", "Consentire soltanto transizioni valide dallo stato corrente."],
                ["Richieste ripetute o concorrenti", "Usare idempotenza, vincoli e transazioni per evitare effetti duplicati o incoerenti."]
              ]
            }
          },
          {
            "type": "callout",
            "payload": {
              "variant": "warning",
              "title": "Non fidarti dello stato presentato dal client",
              "text": "Campi nascosti, pulsanti disabilitati e controlli JavaScript migliorano l'esperienza, ma non impongono regole. Il server deve ricalcolare, autorizzare e validare ogni operazione, anche quando il flusso normale dell'interfaccia sembra corretto."
            }
          }
        ]
      }
    },
    {
      "sort_order": 7,
      "title": "8. Sicurezza lato client",
      "payload": {
        "subtitle": "Fasi di gestione sicura dei contenuti nel browser: distinguere dati, markup e codice in ogni contesto.",
        "blocks": [
          {
            "type": "list",
            "payload": {
              "items": [
                "Fase 1. Traccia la provenienza dei dati: form, URL, API, archiviazione locale e contenuti di terze parti.",
                "Fase 2. Preferisci rendering testuale e API del framework con escaping automatico.",
                "Fase 3. Se HTML è indispensabile, usa sanitizzazione mantenuta e limita i tag e gli attributi ammessi.",
                "Fase 4. Proteggi sessioni, richieste e incorporamento con controlli server-side e policy browser appropriate.",
                "Fase 5. Aggiorna dipendenze e verifica il comportamento con test, CSP e strumenti di sviluppo."
              ]
            }
          },
          {
            "type": "text",
            "payload": {
              "text": "Cross-Site Scripting (XSS) è l'esecuzione di contenuto non fidato nel contesto di una pagina. Può derivare da contenuti persistenti, riflessi nella risposta o manipolazioni del DOM sul client. La difesa richiede codifica d'output corretta per il contesto, API sicure e sanitizzazione quando si accetta HTML; una Content Security Policy è una difesa aggiuntiva. Evita sink che interpretano stringhe come markup o codice."
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Rischio o funzione", "Misura di protezione"],
              "rows": [
                ["Inserimento di contenuto", "Usare textContent o rendering escapato; non concatenare markup non fidato."],
                ["Richieste con credenziali", "Valutare CSRF, cookie SameSite e token secondo il modello di sessione."],
                ["Archiviazione nel browser", "Non conservare segreti non necessari; JavaScript sullo stesso origin può leggere molte forme di storage."],
                ["Dipendenze esterne", "Ridurre script di terze parti, aggiornare i pacchetti e verificare provenienza e integrità."],
                ["Clickjacking e policy", "Limitare l'incorporamento con frame-ancestors e configurare intestazioni coerenti."]
              ]
            }
          },
          {
            "type": "code",
            "payload": {
              "language": "js",
              "code": "const message = document.createElement(\"p\");\nmessage.textContent = userSuppliedText;\ncontainer.append(message);"
            }
          }
        ]
      }
    },
    {
      "sort_order": 8,
      "title": "9. Glossario tecnico",
      "payload": {
        "subtitle": "Lessico essenziale per leggere i flussi, discutere i rischi e documentare le contromisure.",
        "blocks": [
          {
            "type": "table",
            "payload": {
              "columns": ["Termine", "Definizione"],
              "rows": [
                ["Asset", "Dato, servizio, identità o risorsa che ha valore e richiede protezione."],
                ["Attore della minaccia", "Persona o sistema che può causare intenzionalmente o accidentalmente un evento dannoso."],
                ["Autenticazione", "Verifica dell'identità dichiarata da un soggetto."],
                ["Autorizzazione", "Decisione su quali azioni un'identità può compiere su una risorsa."],
                ["Disponibilità", "Possibilità di usare dati o servizi quando necessario."],
                ["Integrità", "Garanzia che dati e processi non siano alterati in modo non autorizzato."],
                ["Riservatezza", "Accesso alle informazioni limitato ai soggetti autorizzati."],
                ["Least privilege", "Principio per cui ogni componente riceve soltanto i permessi indispensabili."],
                ["Defense in depth", "Uso di controlli sovrapposti, così che una singola misura non sia l'unica barriera."],
                ["Superficie d'attacco", "Insieme di ingressi, dipendenze e funzionalità raggiungibili o influenzabili."]
              ]
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Termine", "Definizione"],
              "rows": [
                ["HTTP", "Protocollo applicativo basato su richieste e risposte tra client e server."],
                ["HTTPS", "HTTP trasportato tramite TLS per proteggere il canale e autenticare il server."],
                ["TLS", "Protocollo che protegge la comunicazione in transito con cifratura e controlli d'identità."],
                ["Origine", "Combinazione di schema, host e porta usata dal browser per applicare le sue regole di isolamento."],
                ["Same-origin policy", "Regola del browser che limita l'accesso tra documenti e risorse di origini differenti."],
                ["CORS", "Meccanismo HTTP con cui un server dichiara quali origini browser possono leggere una risposta cross-origin."],
                ["Cookie", "Piccolo dato inviato dal browser secondo ambito, scadenza e attributi configurati."],
                ["Sessione", "Stato applicativo associato a richieste successive, spesso tramite un identificatore nel cookie."],
                ["CSRF", "Richiesta non voluta avviata dal browser di un utente autenticato verso un servizio che si fida delle sue credenziali."],
                ["CSP", "Content Security Policy: regole browser che limitano fonti e contesti di caricamento o esecuzione."]
              ]
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Termine", "Definizione"],
              "rows": [
                ["XSS", "Cross-Site Scripting: esecuzione nel browser di contenuto non fidato nel contesto di una pagina."],
                ["SQL injection", "Alterazione della struttura di una query dovuta alla commistione non sicura tra input e sintassi SQL."],
                ["Query parametrizzata", "Istruzione SQL in cui valori e sintassi sono trasmessi separatamente al driver."],
                ["ORM", "Object-Relational Mapper: strumento che collega modelli applicativi e operazioni su database relazionali."],
                ["IDOR / BOLA", "Difetto di autorizzazione in cui l'accesso a un oggetto non viene verificato per il soggetto corrente."],
                ["Mass assignment", "Assegnazione automatica di campi inviati dal client senza limitarli a quelli modificabili."],
                ["Race condition", "Esito scorretto dovuto all'ordine o alla concorrenza di operazioni che condividono stato."],
                ["Idempotenza", "Proprietà per cui ripetere un'operazione produce lo stesso effetto osservabile previsto."],
                ["Validazione", "Controllo che i dati rispettino tipo, formato, limiti e regole previste."],
                ["Sanitizzazione", "Trasformazione o rimozione di contenuti per renderli sicuri in uno specifico contesto."]
              ]
            }
          },
          {
            "type": "table",
            "payload": {
              "columns": ["Termine", "Definizione"],
              "rows": [
                ["Escaping / codifica d'output", "Rappresentazione di caratteri speciali in modo che siano trattati come dati nel contesto di destinazione."],
                ["Content-Type", "Header che dichiara il tipo dei dati trasmessi nel body HTTP."],
                ["Header di sicurezza", "Direttiva HTTP che influenza comportamenti di sicurezza del browser o della cache."],
                ["Hash", "Funzione che produce un'impronta a lunghezza definita; non è cifratura né prova, da solo, l'identità della fonte."],
                ["Cifratura", "Trasformazione reversibile con chiave per proteggere la riservatezza."],
                ["Firma digitale", "Meccanismo crittografico che supporta verifica di integrità e provenienza tramite chiavi."],
                ["Log", "Registrazione di eventi utili per diagnosi, audit e risposta agli incidenti."],
                ["Rate limiting", "Controllo che limita frequenza o volume di richieste secondo criteri definiti."],
                ["Minimo privilegio", "Limitazione di accessi e capacità al livello strettamente necessario."],
                ["Perimetro di test", "Sistemi, account, tecniche, finestre temporali e limiti coperti dall'autorizzazione."],
                ["Mitigazione", "Misura che riduce probabilità, esposizione o impatto di un rischio."],
                ["Incidente", "Evento che compromette o minaccia riservatezza, integrità o disponibilità di sistemi o dati."]
              ]
            }
          }
        ]
      }
    }
  ]$course_sections$::jsonb) as section(sort_order integer, title text, payload jsonb)
  where not exists (
    select 1
    from public.node_content_sections existing
    where existing.node_id = course_node_id
      and existing.title = section.title
  );
end;
$migration$;

commit;

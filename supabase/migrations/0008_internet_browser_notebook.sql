-- Le sezioni originali vengono conservate integralmente per un eventuale ripristino.
create table if not exists public.internet_browser_section_backup (
  section_id uuid primary key,
  section_data jsonb not null,
  backed_up_at timestamptz not null default now()
);

alter table public.internet_browser_section_backup enable row level security;
revoke all on public.internet_browser_section_backup from public, anon, authenticated;

-- Richiamabile dagli script di provisioning anche se il nodo viene creato
-- dopo le migrazioni. Non è un'API accessibile dai client.
create or replace function public.install_internet_browser_theory()
returns void
language plpgsql
set search_path = public
as $$
declare
  target_node uuid;
  legacy_count integer;
  installed_count integer;
begin
  select id into target_node from public.nodes
  where slug = 'internet-browser' for update;
  if target_node is null then
    return;
  end if;

  select count(*) into installed_count from public.node_content_sections
  where node_id = target_node and payload->>'internetBrowserTheoryVersion' = '1';
  if installed_count = 4 then
    return;
  elsif installed_count <> 0 then
    raise exception 'Teoria Internet & Browser incompleta: controllare le sezioni prima di riprovare.';
  end if;

  select count(*) into legacy_count from public.node_content_sections
  where node_id = target_node and title in (
    '1. Risoluzione DNS',
    '2. Handshake di Rete',
    '3. Ciclo di Richiesta e Risposta HTTP/HTTPS',
    '4. Il Ciclo di Rendering del Browser'
  );
  if legacy_count not in (0, 4) or (
    legacy_count = 4 and (
      select count(distinct title) from public.node_content_sections
      where node_id = target_node and title in (
        '1. Risoluzione DNS', '2. Handshake di Rete',
        '3. Ciclo di Richiesta e Risposta HTTP/HTTPS', '4. Il Ciclo di Rendering del Browser'
      )
    ) <> 4
  ) then
    raise exception 'Sezioni originali Internet & Browser inattese: controllare i dati prima della sostituzione.';
  end if;

  insert into public.internet_browser_section_backup (section_id, section_data)
  select id, to_jsonb(s) from public.node_content_sections s
  where node_id = target_node and title in (
    '1. Risoluzione DNS', '2. Handshake di Rete',
    '3. Ciclo di Richiesta e Risposta HTTP/HTTPS', '4. Il Ciclo di Rendering del Browser'
  );

  delete from public.node_content_sections
  where node_id = target_node and title in (
    '1. Risoluzione DNS', '2. Handshake di Rete',
    '3. Ciclo di Richiesta e Risposta HTTP/HTTPS', '4. Il Ciclo di Rendering del Browser'
  );

  update public.node_content_sections set sort_order = sort_order + 4
  where node_id = target_node;

  insert into public.node_content_sections (node_id, sort_order, title, type, payload)
  values
    (target_node, 0, 'Internet e Web', 'text', jsonb_build_object(
      'internetBrowserTheoryVersion', 1,
      'text', $text$Internet è una rete globale di reti: collega dispositivi diversi tramite infrastrutture e protocolli condivisi. I dati sono suddivisi in pacchetti che attraversano router e reti per raggiungere la destinazione. Gli indirizzi IP identificano gli interlocutori sulla rete; TCP e UDP sono esempi di protocolli di trasporto.

Il World Wide Web è uno dei servizi che usano Internet, non è un sinonimo di Internet. Il Web collega documenti e applicazioni accessibili tramite URL e HTTP; anche email, messaggistica e altri servizi possono usare la stessa rete senza essere pagine web.

Nel modello client-server, il client avvia una comunicazione e il server offre una risorsa o un servizio. Un sito può coinvolgere più server, servizi e reti di distribuzione dei contenuti (CDN).$text$
    )),
    (target_node, 1, 'Indirizzi, DNS e protocolli', 'text', jsonb_build_object(
      'internetBrowserTheoryVersion', 1,
      'text', $text$Una URL identifica una risorsa: in https://esempio.it/articoli, https è lo schema, esempio.it è il dominio e /articoli è il percorso. Una URL può includere anche porta, parametri di query e frammento.

Il DNS associa i nomi di dominio a informazioni come gli indirizzi IP. Se la risposta non è già disponibile in cache, un resolver può interrogare la gerarchia DNS fino ai server autorevoli. Cache, configurazione e rete influenzano il percorso effettivo.

HTTP definisce richieste e risposte: il client invia un metodo, come GET, e il server risponde con un codice di stato, header e, quando previsto, un corpo. HTTPS protegge HTTP mediante TLS, che cifra la comunicazione e permette di verificare l'identità del server tramite il certificato. HTTP/1.1 e HTTP/2 usano normalmente TCP; HTTP/3 usa QUIC su UDP. Cache, redirect o errori possono modificare il percorso di una richiesta.$text$
    )),
    (target_node, 2, 'Che cos’è un browser', 'text', jsonb_build_object(
      'internetBrowserTheoryVersion', 1,
      'text', $text$Un browser è un programma che permette di accedere a risorse web: interpreta gli indirizzi, gestisce richieste e risposte, elabora HTML e CSS, esegue JavaScript e presenta la pagina. Offre inoltre strumenti come schede, cronologia, preferiti, impostazioni di privacy e strumenti per sviluppatori.

Tra i browser più diffusi ci sono Chrome, Edge, Firefox e Safari. Non sono motori di ricerca: Google, Bing e DuckDuckGo sono esempi di servizi di ricerca accessibili anche tramite browser.

Il motore del browser interpreta e visualizza i contenuti. Chrome ed Edge usano Blink, Firefox usa Gecko e Safari usa WebKit. Gli standard web favoriscono la compatibilità, ma funzionalità, versioni e comportamento possono differire: è utile verificare accessibilità e resa su browser e dispositivi diversi.$text$
    )),
    (target_node, 3, 'Dalla risposta alla pagina', 'text', jsonb_build_object(
      'internetBrowserTheoryVersion', 1,
      'text', $text$Il browser analizza l'HTML e costruisce il DOM, una rappresentazione ad albero del documento. I fogli CSS descrivono l'aspetto e contribuiscono agli stili calcolati; il CSSOM rappresenta le regole CSS. JavaScript può aggiungere interattività e modificare documento o stili.

Per visualizzare la pagina, il browser determina quali elementi generano box visibili, ne calcola dimensioni e posizioni (layout), prepara le operazioni di disegno (paint) e compone i livelli per mostrare il risultato. È un modello semplificato: caricamento, analisi e rendering possono sovrapporsi e aggiornarsi più volte.

Apri gli Appunti Visivi per seguire un esempio dall'indirizzo ai pixel, inclusi DNS, connessione, HTTP e le fasi del rendering.$text$
    ));
end;
$$;

revoke all on function public.install_internet_browser_theory() from public, anon, authenticated;
select public.install_internet_browser_theory();

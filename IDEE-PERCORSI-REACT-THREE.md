# Idee per percorsi con React Three Fiber

Il 3D ha senso quando aiuta a vedere una struttura, attraversare livelli o seguire una trasformazione. Per sequenze lineari e diagrammi con molte etichette, gli Appunti Visivi 2D restano spesso più chiari.

## Proposte

| Percorso | Cosa si potrebbe mostrare in 3D | Perché può aiutare |
| --- | --- | --- |
| **Dentro il PC** | Componenti fisici come scheda madre, CPU, RAM, SSD e batteria. | Un esploratore 3D opzionale permette di selezionare e osservare i componenti; il notebook 2D rimane disponibile per leggere le spiegazioni. |
| **Sistema operativo, kernel e driver** | Come applicazioni e software di sistema collaborano per usare le risorse e i dispositivi. | Un percorso separato in 2D distingue i livelli logici dai componenti fisici. |
| **Dal click alla pagina renderizzata** | La richiesta parte dal browser, attraversa rete e server e torna per diventare DOM, stili e pixel. | Si presta a seguire un viaggio e poi ingrandire i passaggi interni del rendering. |
| **Dentro una query al database** | Una query attraversa parsing, piano di esecuzione, indici, accesso ai dati e risultato. | Una visualizzazione può confrontare la ricerca tramite indice con la scansione di molte righe, chiarendo il costo delle operazioni. |
| **Come React aggiorna l'interfaccia** | Stato, nuovo albero di elementi, confronto e aggiornamenti del DOM. | Una scena per livelli può mostrare quali parti cambiano dopo un'interazione, senza suggerire che l'intero DOM venga ricreato sempre. |
| **Dal codice alla pubblicazione** | Repository, build, artefatti, container e deploy agli ambienti. | Rende visibile il passaggio dall'artefatto locale al servizio distribuito; una pipeline 2D può comunque essere sufficiente per i passaggi lineari. |
| **Frontend, API e database** | Una richiesta attraversa i confini tra browser, API e database e la risposta torna al frontend. | L'esplorazione spaziale aiuta a distinguere responsabilità e confini dei componenti in un'app full-stack. |
| **Il flusso di lavoro con Git** | Modifiche nella working tree, staging, commit, branch, remote, merge o pull request; gestione di divergenze e conflitti. | Le diramazioni possono rendere più intuitive le relazioni tra branch e i punti in cui le storie si uniscono. |
| **Linguaggi compilati e interpretati** | Codice sorgente, compilatore o runtime, eventuale bytecode/JIT e istruzioni eseguite dalla CPU. | Una vista a livelli può confrontare i percorsi senza ridurli a una contrapposizione assoluta: molti runtime combinano interpretazione e compilazione. |

## Criteri per scegliere il prossimo

- Preferire argomenti con livelli o trasformazioni che beneficiano di zoom e prospettiva.
- Mantenere testo, spiegazioni e controlli nell'interfaccia HTML, leggibili anche senza WebGL.
- Separare i modelli didattici dalle simulazioni reali e dichiarare le semplificazioni.
- Valutare il risultato su schermi piccoli e con la preferenza di movimento ridotto.

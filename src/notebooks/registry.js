// slug notebook -> loader lazy della config.
// In futuro: affiancare/sostituire con fetch da Supabase (stesso formato JSON).
const loaders = {
  "prisma-orm": () => import("./configs/prismaFlowConfig.js"),
  "internet-browser": () => import("./configs/internetBrowserConfig.js"),
  "http-protocol": () => import("./configs/httpProtocolConfig.js"),
  "dentro-il-pc": () => import("./configs/dentroIlPcConfig.js"),
  "sistema-operativo": () => import("./configs/sistemaOperativoConfig.js"),
  "linguaggi-programmazione": () => import("./configs/linguaggiProgrammazioneConfig.js"),
  "web-foundations": () => import("./configs/webFoundationsConfig.js"),
};

const notebookCatalog = [
  {
    slug: "dentro-il-pc",
    title: "Dentro il PC",
    description:
      "Esplora i componenti fisici del computer: scheda madre, CPU, RAM, SSD, GPU, alimentazione e periferiche.",
    nodeLabel: "Dentro il PC",
    parentLabel: null,
  },
  {
    slug: "sistema-operativo",
    title: "Sistema operativo, kernel e driver",
    description:
      "Scopri come applicazioni, sistema operativo, kernel e driver collaborano per usare le risorse e i dispositivi del computer.",
    nodeLabel: "Sistema operativo",
    parentLabel: null,
  },
  {
    slug: "internet-browser",
    title: "Internet & Browser",
    description:
      "Segui il percorso dall'indirizzo e dalla risoluzione DNS fino a HTTP, HTML, CSS, JavaScript e ai pixel mostrati dal browser.",
    nodeLabel: "Internet & Browser",
    parentLabel: null,
  },
  {
    slug: "http-protocol",
    title: "Il ciclo di una richiesta Web",
    description:
      "Segui una chiamata dal frontend all'API e al database, poi osserva la risposta tornare al browser per aggiornare l'interfaccia.",
    nodeLabel: "HTTP & Protocolli Web",
    parentLabel: "Internet & Browser",
  },
  {
    slug: "prisma-orm",
    title: "Prisma ORM",
    description:
      "Segui una richiesta Express attraverso Prisma Client e SQL parametrizzato fino alla riga creata nel database e alla risposta al client.",
    nodeLabel: "Prisma ORM",
    parentLabel: "Librerie ORM & ODM (Prisma, Mongoose)",
  },
  {
    slug: "linguaggi-programmazione",
    title: "Linguaggi di programmazione",
    description:
      "Segui il percorso dal codice sorgente alle strategie di compilazione, ai runtime e alle istruzioni eseguite dalla CPU.",
    nodeLabel: "Linguaggi Backend Multiparadigma",
    parentLabel: null,
  },
  {
    slug: "web-foundations",
    title: "Professioni e infrastruttura del Web",
    description:
      "Conosci i ruoli di un team Web e segui le richieste dai server ai data center, alle server farm e ai servizi cloud.",
    nodeLabel: "Professioni e infrastruttura del Web",
    parentLabel: null,
  },
];

export const getNotebookCatalog = () => notebookCatalog;

export const hasNotebook = (slug) =>
  Boolean(slug) && Object.hasOwn(loaders, slug);

export async function loadNotebookConfig(slug) {
  if (!hasNotebook(slug)) return null;
  const module = await loaders[slug]();
  return module.default;
}

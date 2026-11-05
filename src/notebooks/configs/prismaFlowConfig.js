// Config JSON pura (niente funzioni/JSX): salvabile 1:1 su Supabase.
// Ogni step attiva una fase (`phase`) e mostra i suoi `panels`.

const expressCode = `import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  const { email, name } = req.body;

  const user = await prisma.user.create({
    data: { email, name },
  });

  res.status(201).json(user);
});`;

const prismaCode = `const user = await prisma.user.create({
  data: {
    email: "ada@example.com",
    name: "Ada Lovelace",
  },
});`;

const sqlCode = `INSERT INTO "public"."User" ("id", "email", "name", "createdAt")
VALUES ($1, $2, $3, $4)
RETURNING "id", "email", "name", "createdAt";

-- $1 = 'a1f3…'  $2 = 'ada@example.com'
-- $3 = 'Ada Lovelace'  $4 = NOW()`;

export const prismaFlowConfig = {
  slug: "prisma-orm",
  title: "Prisma ORM",
  subtitle: "Dal codice Express alla riga nel database",
  phases: [
    { id: "express", label: "Express", hint: "Richiesta HTTP", icon: "server" },
    { id: "prisma", label: "Prisma Client", hint: "Query type-safe", icon: "code" },
    { id: "sql", label: "SQL", hint: "Traduzione", icon: "terminal" },
    { id: "database", label: "Database", hint: "Postgres / Supabase", icon: "database" },
  ],
  steps: [
    {
      id: "request",
      phase: "express",
      illustration: "prisma-flow",
      title: "Richiesta in arrivo",
      description:
        "Il client invia POST /users con un JSON. Express esegue il parsing del body e passa il controllo all'handler della rotta.",
      panels: [
        {
          kind: "code",
          label: "server.js",
          language: "js",
          content: expressCode,
          highlightLines: [7, 8, 9],
        },
        {
          kind: "text",
          label: "Richiesta HTTP",
          content:
            'POST /users\nContent-Type: application/json\n\n{ "email": "ada@example.com", "name": "Ada Lovelace" }',
        },
      ],
    },
    {
      id: "client-call",
      phase: "prisma",
      illustration: "prisma-flow",
      title: "Chiamata a Prisma Client",
      description:
        "L'handler chiama prisma.user.create(). Il client è generato dallo schema, quindi `data` è tipizzato e validato prima di toccare il database.",
      panels: [
        {
          kind: "code",
          label: "Prisma Client",
          language: "js",
          content: prismaCode,
          highlightLines: [1, 2, 3, 4, 5, 6],
        },
      ],
    },
    {
      id: "translation",
      phase: "sql",
      illustration: "prisma-flow",
      title: "Traduzione in SQL",
      description:
        "Il query engine converte la chiamata in una query SQL parametrizzata: i valori viaggiano come parametri, non concatenati (niente SQL injection).",
      panels: [
        { kind: "code", label: "Prisma Client", language: "js", content: prismaCode },
        { kind: "code", label: "Query generata", language: "sql", content: sqlCode },
      ],
    },
    {
      id: "write",
      phase: "database",
      illustration: "prisma-flow",
      title: "Scrittura sul database",
      description:
        "Postgres esegue l'INSERT. La riga compare nella tabella User e RETURNING restituisce il record creato.",
      panels: [
        {
          kind: "table",
          label: 'Tabella "User"',
          columns: ["id", "email", "name", "createdAt"],
          rows: [
            ["c0b2…", "grace@example.com", "Grace Hopper", "2026-11-04 09:12"],
            ["a1f3…", "ada@example.com", "Ada Lovelace", "2026-11-05 17:48"],
          ],
          highlightRows: [1],
        },
      ],
    },
    {
      id: "response",
      phase: "express",
      illustration: "prisma-flow",
      title: "Risposta al client",
      description:
        "Prisma restituisce l'oggetto creato; Express risponde con 201 e il JSON del nuovo utente.",
      panels: [
        {
          kind: "text",
          label: "Risposta HTTP",
          content:
            'HTTP/1.1 201 Created\nContent-Type: application/json\n\n{ "id": "a1f3…", "email": "ada@example.com", "name": "Ada Lovelace" }',
        },
      ],
    },
  ],
};

export default prismaFlowConfig;

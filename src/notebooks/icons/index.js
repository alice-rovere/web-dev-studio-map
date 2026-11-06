// Registro delle icone di nodo riutilizzabili da tutti i visualizer.
// Chiave = slug del nodo Supabase (o id generico: browser, server, terminal, database).
// Per aggiungerne una: crea `NomeIcon.jsx` in questa cartella (box 64x64 centrato
// sull'origine, props x/y/stroke) e registrala qui.
import ApiIcon from "./ApiIcon.jsx";
import BrowserIcon from "./BrowserIcon.jsx";
import CssIcon from "./CssIcon.jsx";
import DatabaseIcon from "./DatabaseIcon.jsx";
import ExpressIcon from "./ExpressIcon.jsx";
import HtmlIcon from "./HtmlIcon.jsx";
import HttpIcon from "./HttpIcon.jsx";
import JavaScriptIcon from "./JavaScriptIcon.jsx";
import NodeJsIcon from "./NodeJsIcon.jsx";
import PrismaIcon from "./PrismaIcon.jsx";
import ServerIcon from "./ServerIcon.jsx";
import TerminalIcon from "./TerminalIcon.jsx";

export const NODE_ICONS = {
  // Nodi Supabase
  javascript: JavaScriptIcon,
  html: HtmlIcon,
  css: CssIcon,
  "api-architettura": ApiIcon,
  "rest-api": ApiIcon,
  "http-protocol": HttpIcon,
  nodejs: NodeJsIcon,
  expressjs: ExpressIcon,
  "prisma-orm": PrismaIcon,
  "internet-browser": BrowserIcon,
  "database-relazionali": DatabaseIcon,
  // Generiche
  browser: BrowserIcon,
  server: ServerIcon,
  terminal: TerminalIcon,
  database: DatabaseIcon,
  prisma: PrismaIcon,
};

export const hasNodeIcon = (id) => Object.hasOwn(NODE_ICONS, id);

// Icona di ripiego se l'id non è registrato.
export const getNodeIcon = (id) => NODE_ICONS[id] ?? DatabaseIcon;

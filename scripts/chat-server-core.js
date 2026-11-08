import { createServer } from "node:http";
import { createClient } from "@supabase/supabase-js";

export const CHAT_PORT = 43175;
export const DEFAULT_ORIGINS = [
  "https://web-dev-studio-map.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const MAX_BODY_BYTES = 26000;

export function validateChatBody(body) {
  if (!body || typeof body !== "object" || typeof body.message !== "string" ||
      !body.message.trim() || body.message.length > 2000 ||
      !Array.isArray(body.history) || body.history.length > 4 ||
      !body.history.every((item) => item && ["user", "assistant"].includes(item.role) &&
        typeof item.content === "string" && item.content.length <= 3000) ||
      !Array.isArray(body.sources) || body.sources.length > 5 ||
      !body.sources.every((item) => item && typeof item.name === "string" && item.name.length <= 200 &&
        typeof item.content === "string" && item.content.length <= 3500)) {
    throw new Error("Richiesta non valida o troppo lunga.");
  }
  return body;
}

export async function verifyAdmin(token, url, key) {
  const client = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: userData, error: authError } = await client.auth.getUser(token);
  if (authError) {
    if (authError.status === 401 || authError.status === 403) return false;
    throw new Error("Verifica del token Supabase non riuscita.", { cause: authError });
  }
  if (!userData.user) return false;
  const { data, error } = await client.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
  if (error) throw new Error("Verifica del ruolo Supabase non riuscita.");
  return data?.role === "admin";
}

export function createChatServer({ origins = DEFAULT_ORIGINS, authorize, answer, reserve }) {
  let busy = false;
  let lastRequest = 0;
  const server = createServer(async (req, res) => {
    const origin = req.headers.origin;
    const hostAllowed = req.headers.host === `127.0.0.1:${server.address().port}`;
    if (!hostAllowed || !origins.includes(origin)) {
      res.writeHead(403).end();
      return;
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
      res.setHeader("Access-Control-Allow-Private-Network", "true");
      res.writeHead(204).end();
      return;
    }
    const send = (status, data) => {
      if (!res.destroyed) {
        res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(data));
      }
    };
    if (req.method !== "POST" || req.url !== "/chat" || !/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] ?? "")) {
      send(404, { error: "Endpoint non disponibile." });
      return;
    }
    const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization ?? "");
    if (!match) {
      send(401, { error: "Accedi come amministratrice." });
      return;
    }
    if (busy) {
      send(429, { error: "Una richiesta è già in corso." });
      return;
    }
    busy = true;
    const controller = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) controller.abort();
    });
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_BODY_BYTES) {
          send(413, { error: "Richiesta troppo grande." });
          return;
        }
        chunks.push(chunk);
      }
      let body;
      try {
        body = validateChatBody(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        send(400, { error: "Richiesta non valida o troppo lunga." });
        return;
      }
      if (!await authorize(match[1])) {
        send(403, { error: "Accesso riservato agli amministratori." });
        return;
      }
      if (Date.now() - lastRequest < 10000) {
        send(429, { error: "Attendi qualche secondo prima di riprovare." });
        return;
      }
      if (controller.signal.aborted) return;
      const remaining = await reserve();
      lastRequest = Date.now();
      const content = await answer(body, controller.signal);
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("Risposta del modello vuota o non valida.");
      }
      send(200, { content, remaining });
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Errore servizio chat:", error.message);
        send(error.code === "CHAT_LIMIT" ? 429 : 503, {
          error: error.code === "CHAT_LIMIT" ? error.message : "Servizio chat non disponibile. Controlla il terminale del servizio e riprova.",
        });
      }
    } finally {
      busy = false;
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

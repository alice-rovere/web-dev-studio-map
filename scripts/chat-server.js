import { execFile } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { CopilotClient } from "@github/copilot-sdk";
import { createChatServer, CHAT_PORT, verifyAdmin } from "./chat-server-core.js";
import { createQuotaReservation } from "./chat-quota.js";
import { answerWithCopilot } from "./chat-copilot.js";

const execFileAsync = promisify(execFile);
const url = process.env.VITE_SUPABASE_URL?.trim();
const key = process.env.VITE_SUPABASE_ANON_KEY?.trim();
if (!url || !key || !URL.canParse(url)) throw new Error("Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY in .env.");

const { stdout: tokenOutput } = await execFileAsync("gh", ["auth", "token"], { windowsHide: true });
const token = tokenOutput.trim();
if (!token) throw new Error("Login GitHub CLI mancante: esegui gh auth login.");

const client = new CopilotClient({
  mode: "empty",
  gitHubToken: token,
  sessionFs: { initialCwd: "/workspace", sessionStatePath: "/sessions", conventions: "posix" },
});
await client.start();
const auth = await client.getAuthStatus();
const models = await client.listModels();
if (!auth.isAuthenticated || !models.some((model) => model.id === "auto")) {
  await client.stop();
  throw new Error("Account Copilot o modello auto non disponibili per GitHub CLI.");
}

const reserve = createQuotaReservation(join(homedir(), ".devskillmap-chat", "quota.json"));

const server = createChatServer({
  authorize: (jwt) => verifyAdmin(jwt, url, key),
  answer: (body, signal) => answerWithCopilot(client, body, signal),
  reserve,
});
server.listen(CHAT_PORT, "127.0.0.1", () => {
  console.log(`Chat locale attiva su 127.0.0.1:${CHAT_PORT}; Copilot: ${auth.login ?? "account autenticato"}, modello auto. Ctrl+C per arrestare.`);
});
server.on("error", (error) => {
  console.error("Avvio servizio chat fallito:", error.message);
  client.stop().finally(() => { process.exitCode = 1; });
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    server.close(async () => {
      const errors = await client.stop();
      if (errors.length) {
        console.error("Arresto Copilot incompleto:", errors.map((error) => error.message).join("; "));
        process.exitCode = 1;
      }
    });
  });
}

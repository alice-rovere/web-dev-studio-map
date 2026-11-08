import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export function createQuotaReservation(quotaPath, limit = 10, now = () => new Date()) {
  return async () => {
    await mkdir(dirname(quotaPath), { recursive: true });
    let quota;
    try {
      quota = JSON.parse(await readFile(quotaPath, "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw new Error("Impossibile leggere il contatore locale: verifica quota.json.", { cause: error });
      quota = null;
    }
    const day = now().toISOString().slice(0, 10);
    if (quota && (typeof quota.day !== "string" || !Number.isInteger(quota.count) || quota.count < 0)) {
      throw new Error("Contatore locale non valido: verifica quota.json.");
    }
    const count = quota?.day === day ? quota.count : 0;
    if (count >= limit) {
      const error = new Error(`Limite locale di ${limit} richieste giornaliere raggiunto (giorno UTC).`);
      error.code = "CHAT_LIMIT";
      throw error;
    }
    const temp = `${quotaPath}.tmp`;
    await writeFile(temp, JSON.stringify({ day, count: count + 1 }), { mode: 0o600 });
    await rename(temp, quotaPath);
    return limit - count - 1;
  };
}

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Inbox, Link2, Save, Search, Trash2 } from "lucide-react";
import {
  addInboxLink,
  addNodeStudyUrl,
  deleteInboxLink,
  fetchInboxLinks,
  fetchMapGraph,
} from "../services/mapService";

const RECENT_KEY = "quick-add-recent-nodes";
const MAX_RECENT = 5;
const URL_PATTERN = /https?:\/\/[^\s]+/i;

function extractUrl(...candidates) {
  for (const value of candidates) {
    const match = value?.match(URL_PATTERN);
    if (match) return match[0];
  }
  return "";
}

function normalizeUrl(value) {
  try {
    const parsed = new URL(value.trim());
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

function loadRecent() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rememberNode(nodeId) {
  const next = [nodeId, ...loadRecent().filter((id) => id !== nodeId)];
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, MAX_RECENT)));
  } catch {
    // le preferenze locali non sono essenziali
  }
}

export default function QuickAdd() {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState(() =>
    extractUrl(
      searchParams.get("url"),
      searchParams.get("text"),
      searchParams.get("title"),
    ),
  );
  const [nodes, setNodes] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchMapGraph(), fetchInboxLinks()])
      .then(([graph, links]) => {
        if (cancelled) return;
        setNodes(graph.nodes);
        setInbox(links);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleNodes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term) {
      return nodes
        .filter((node) => node.label.toLowerCase().includes(term))
        .slice(0, 30);
    }
    const byId = new Map(nodes.map((node) => [node.id, node]));
    return loadRecent()
      .map((id) => byId.get(id))
      .filter(Boolean);
  }, [nodes, query]);

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  async function run(action, message) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await action();
      setSuccess(message);
      return true;
    } catch (actionError) {
      setError(actionError.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  function validUrl() {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Inserisci un URL valido (http o https).");
      setSuccess("");
    }
    return normalized;
  }

  async function handleSaveToNode() {
    const normalized = validUrl();
    if (!normalized || !selectedNode) return;

    const ok = await run(
      () => addNodeStudyUrl(selectedNode.id, normalized),
      `Link aggiunto a "${selectedNode.label}".`,
    );
    if (ok) {
      rememberNode(selectedNode.id);
      setUrl("");
    }
  }

  async function handleSaveToInbox() {
    const normalized = validUrl();
    if (!normalized) return;

    const ok = await run(
      () => addInboxLink(normalized),
      "Link salvato nell'inbox.",
    );
    if (ok) {
      setUrl("");
      setInbox(await fetchInboxLinks().catch(() => inbox));
    }
  }

  async function handleAssign(link) {
    if (!selectedNode) return;

    const ok = await run(async () => {
      await addNodeStudyUrl(selectedNode.id, link.url);
      await deleteInboxLink(link.id);
    }, `Link assegnato a "${selectedNode.label}".`);
    if (ok) {
      rememberNode(selectedNode.id);
      setInbox((items) => items.filter((item) => item.id !== link.id));
    }
  }

  async function handleRemove(link) {
    const ok = await run(
      () => deleteInboxLink(link.id),
      "Link rimosso dall'inbox.",
    );
    if (ok) setInbox((items) => items.filter((item) => item.id !== link.id));
  }

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
        <header>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500">
            &gt;_ quick add
          </p>
          <h1 className="text-xl font-bold text-white">Aggiungi link rapido</h1>
        </header>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b9c5d6]">
            URL
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-[#33445d] bg-[#0b1120] px-3 py-2 focus-within:border-cyan-500/60">
            <Link2 className="text-slate-500" size={15} />
            <input
              className="w-full bg-transparent text-sm text-[#e8edf5] outline-none placeholder:text-[#53657d]"
              disabled={busy}
              inputMode="url"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
              type="url"
              value={url}
            />
          </span>
        </label>

        <section className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b9c5d6]">
            Nodo
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-[#33445d] bg-[#0b1120] px-3 py-2 focus-within:border-cyan-500/60">
            <Search className="text-slate-500" size={15} />
            <input
              className="w-full bg-transparent text-sm text-[#e8edf5] outline-none placeholder:text-[#53657d]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca un nodo…"
              type="search"
              value={query}
            />
          </span>

          {loading ? (
            <p className="font-mono text-xs text-slate-400">Caricamento…</p>
          ) : (
            <>
              {!query.trim() && visibleNodes.length > 0 && (
                <p className="text-[11px] text-slate-500">Usati di recente</p>
              )}
              {visibleNodes.length === 0 && (
                <p className="text-xs text-slate-500">
                  {query.trim()
                    ? "Nessun nodo trovato."
                    : "Cerca un nodo per iniziare."}
                </p>
              )}
              <ul className="flex flex-col gap-1.5">
                {visibleNodes.map((node) => (
                  <li key={node.id}>
                    <button
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        node.id === selectedId
                          ? "border-cyan-400 bg-cyan-950/30 text-cyan-200"
                          : "border-[#33445d] bg-[#0e1624] text-slate-300 hover:border-cyan-500/40"
                      }`}
                      onClick={() => setSelectedId(node.id)}
                      type="button"
                    >
                      {node.label}
                      {node.id === selectedId && <Check size={14} />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {error && (
          <p
            className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
            role="alert"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            aria-live="polite"
            className="rounded-md border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-300"
          >
            {success}
          </p>
        )}

        <div className="flex gap-2">
          <button
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || !selectedNode || !url.trim()}
            onClick={handleSaveToNode}
            type="button"
          >
            <Save size={15} />
            Salva nel nodo
          </button>
          <button
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#33445d] text-sm font-semibold text-slate-200 hover:border-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || !url.trim()}
            onClick={handleSaveToInbox}
            type="button"
          >
            <Inbox size={15} />
            Salva in inbox
          </button>
        </div>

        <section className="flex flex-col gap-2 pb-6">
          <h2 className="text-sm font-semibold text-white">
            Inbox ({inbox.length})
          </h2>
          {inbox.length === 0 && !loading && (
            <p className="text-xs text-slate-500">Nessun link da smistare.</p>
          )}
          <ul className="flex flex-col gap-2">
            {inbox.map((link) => (
              <li
                className="rounded-lg border border-[#33445d] bg-[#0e1624] p-3"
                key={link.id}
              >
                <a
                  className="block break-all text-xs text-cyan-300 hover:underline"
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.url}
                </a>
                <div className="mt-2 flex gap-2">
                  <button
                    className="rounded-md bg-cyan-400 px-2.5 py-1 text-xs font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={busy || !selectedNode}
                    onClick={() => handleAssign(link)}
                    title={
                      selectedNode
                        ? undefined
                        : "Seleziona prima un nodo qui sopra"
                    }
                    type="button"
                  >
                    {selectedNode
                      ? `Assegna a ${selectedNode.label}`
                      : "Seleziona un nodo"}
                  </button>
                  <button
                    aria-label="Rimuovi dall'inbox"
                    className="rounded-md border border-[#33445d] px-2 text-slate-400 hover:text-rose-300 disabled:opacity-40"
                    disabled={busy}
                    onClick={() => handleRemove(link)}
                    type="button"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

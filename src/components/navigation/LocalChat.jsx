import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircle, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { collectChatContext } from "../../services/chatContext";

const ENDPOINT = "http://127.0.0.1:43175/chat";

export default function LocalChat() {
  const { session, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const controller = useRef(null);

  useEffect(() => {
    const handleSelection = (event) => setSelectedNodeId(event.detail);
    window.addEventListener("devskillmap:chat-selection", handleSelection);
    return () => {
      window.removeEventListener("devskillmap:chat-selection", handleSelection);
      controller.current?.abort();
    };
  }, []);

  function reset() {
    controller.current?.abort();
    controller.current = null;
    setPending(false);
    setMessage("");
    setMessages([]);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text || pending) return;
    const abort = new AbortController();
    controller.current = abort;
    setPending(true);
    setError("");
    try {
      const sources = await collectChatContext(text, selectedNodeId);
      if (abort.signal.aborted) return;
      const history = messages.slice(-4).map(({ role, content }) => ({ role, content: content.slice(0, 3000) }));
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, sources }),
        signal: abort.signal,
      });
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error("Risposta non valida dal servizio locale.");
      }
      if (!response.ok) throw new Error(payload.error || "Errore del servizio locale.");
      if (typeof payload.content !== "string" || !payload.content.trim()) throw new Error("Risposta del modello non valida.");
      if (controller.current !== abort) return;
      setMessages((previous) => [
        ...previous,
        { role: "user", content: text },
        { role: "assistant", content: payload.content, sources: sources.map((source) => source.name), remaining: payload.remaining },
      ]);
      setMessage("");
    } catch (requestError) {
      if (!abort.signal.aborted && controller.current === abort) {
        setError(requestError instanceof TypeError
          ? "Servizio locale non raggiungibile. Avvialo e consenti al browser l'accesso alla rete locale."
          : requestError.message);
      }
    } finally {
      if (controller.current === abort) {
        controller.current = null;
        setPending(false);
      }
    }
  }

  if (!session || !isAdmin) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="fixed right-4 bottom-4 z-40 flex min-h-11 items-center gap-2 rounded-full bg-cyan-400 px-4 font-semibold text-slate-950 shadow-lg hover:bg-cyan-300" type="button">
          <MessageCircle size={19} /> Chat studio
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70" />
        <Dialog.Content className="fixed inset-x-2 bottom-2 z-50 flex h-[min(42rem,calc(100dvh-1rem))] flex-col rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-xl sm:inset-x-auto sm:right-4 sm:w-120">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-semibold">Chat studio locale</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-slate-400">
                Solo amministratori. Richiede il servizio sullo stesso computer. Nessuna modifica viene salvata.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button aria-label="Chiudi chat" className="rounded p-2 hover:bg-slate-800" type="button"><X size={20} /></button>
            </Dialog.Close>
          </div>
          <div aria-live="polite" className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
            {messages.length === 0 && <p className="text-sm text-slate-400">Fai una domanda di studio. La domanda e un estratto pertinente della mappa saranno inviati a Copilot.</p>}
            {messages.map((item, index) => (
              <div key={index} className={`rounded-lg p-3 text-sm ${item.role === "user" ? "ml-6 bg-cyan-950" : "mr-6 bg-slate-800"}`}>
                <p className="mb-1 text-xs font-semibold text-cyan-300">{item.role === "user" ? "Tu" : "Copilot"}</p>
                <p className="whitespace-pre-wrap wrap-break-word">{item.content}</p>
                {item.role === "assistant" && (
                  <p className="mt-3 text-xs text-slate-400">
                    {item.sources.length ? `Fonti inviate: ${item.sources.join(", ")}.` : "Nessuna fonte pertinente trovata nella mappa; verifica la risposta."}
                    {Number.isInteger(item.remaining) && ` Richieste locali rimaste oggi: ${item.remaining}.`}
                  </p>
                )}
              </div>
            ))}
            {pending && <p className="text-sm text-slate-400" role="status">Attendere la risposta…</p>}
          </div>
          {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
          <form className="mt-3 space-y-2" onSubmit={submit}>
            <label className="block text-xs text-slate-300" htmlFor="local-chat-message">Domanda</label>
            <textarea className="min-h-20 w-full resize-y rounded border border-slate-600 bg-slate-950 p-2 text-sm" id="local-chat-message" maxLength={2000} onChange={(event) => setMessage(event.target.value)} value={message} />
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50" disabled={pending || !message.trim()} type="submit">Invia</button>
              {pending && <button className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={() => controller.current?.abort()} type="button">Annulla</button>}
              <button className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={reset} type="button">Nuova conversazione</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

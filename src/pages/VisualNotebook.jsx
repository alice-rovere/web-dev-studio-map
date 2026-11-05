import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VisualNotebookLayout from "../components/notebook/VisualNotebookLayout.jsx";
import { loadNotebookConfig } from "../notebooks/registry.js";

export default function VisualNotebook() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ slug: null, config: null, error: null });

  useEffect(() => {
    let cancelled = false;
    loadNotebookConfig(slug)
      .then((config) => {
        if (cancelled) return;
        setState({
          slug,
          config,
          error: config ? null : "Appunti visivi non trovati.",
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            slug,
            config: null,
            error: "Impossibile caricare gli appunti visivi.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleClose = useCallback(() => {
    const knowledgeNodeId = location.state?.knowledgeNodeId;
    if (knowledgeNodeId) {
      navigate("/", { replace: true, state: { knowledgeNodeId } });
    } else if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }, [location.key, location.state, navigate]);

  if (state.slug !== slug) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
        Caricamento…
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
        <p role="alert">{state.error}</p>
        <button
          className="cursor-pointer rounded border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
          onClick={handleClose}
          type="button"
        >
          Torna indietro
        </button>
      </div>
    );
  }

  return <VisualNotebookLayout config={state.config} onClose={handleClose} />;
}

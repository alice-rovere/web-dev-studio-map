import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VisualGridLayout from "../components/notebook/VisualGridLayout";
import { fetchVisualGrid } from "../services/visualGridService";

export default function VisualGrid() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ slug: null, grid: null, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    fetchVisualGrid(slug).then((grid) => {
      if (active) setState({ slug, grid, error: grid ? null : "Griglia visiva non trovata." });
    }).catch((error) => { if (active) setState({ slug, grid: null, error: error.message }); });
    return () => { active = false; };
  }, [slug, attempt]);
  function close() {
    if (location.state?.knowledgeNodeId) navigate("/", { replace: true, state: { knowledgeNodeId: location.state.knowledgeNodeId } });
    else if (location.state?.redirectedFromNotebook) navigate("/percorso-guidato", { replace: true });
    else if (location.key !== "default") navigate(-1);
    else navigate("/percorso-guidato", { replace: true });
  }
  if (state.slug !== slug) return <p className="p-6 text-sm text-slate-400">Caricamento…</p>;
  if (state.error) return <div className="space-y-3 p-6 text-sm"><p role="alert" className="text-rose-300">{state.error}</p><button className="mr-3 underline" onClick={() => setAttempt((value) => value + 1)} type="button">Riprova</button><button className="underline" onClick={close} type="button">Torna indietro</button></div>;
  return <VisualGridLayout key={slug} grid={state.grid} onClose={close} />;
}

import { useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GUIDED_LESSONS, getFlowGraph } from "../data/fullStackData";
import "@xyflow/react/dist/style.css";

// Custom Node component stilato con Tailwind
function FlowPathNode({ data }) {
  const borderClass = data.isFocused
    ? "border-blue-500 ring-4 ring-blue-500/20 bg-slate-800"
    : "border-slate-700 bg-slate-900 opacity-40";

  return (
    <article
      className={`p-4 rounded-xl border transition-all duration-300 w-64 shadow-lg ${borderClass} text-slate-200`}
    >
      {/* PORTE DI SINISTRA */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className=" bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        className=" bg-slate-500"
      />

      {/* PORTE DI DESTRA */}
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        className=" bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className=" bg-slate-500"
      />

      {/* PORTE IN ALTO */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className=" bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        className=" bg-slate-500"
      />

      {/* PORTE IN BASSO */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        className=" bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className=" bg-slate-500"
      />

      <span className="text-xs uppercase tracking-wider font-semibold text-blue-400 block mb-1">
        {data.category}
      </span>
      <h3 className="text-base font-bold text-white mb-1">{data.label}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        {data.description}
      </p>
    </article>
  );
}

// Edge personalizzato per le curve di ritorno complesse senza sovrapposizioni
export function CustomRouteEdge({
  id,
  label,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
}) {
  const midpointY = (sourceY + targetY) / 2 + 50;
  const path = `M ${sourceX} ${sourceY} V ${midpointY} H ${targetX} V ${targetY}`;

  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={path} style={style} />
      <EdgeLabelRenderer>
        <span
          className="absolute text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: (sourceX + targetX) / 2,
            top: midpointY,
          }}
        >
          {label}
        </span>
      </EdgeLabelRenderer>
    </>
  );
}

function PathCanvas({ graph }) {
  const { fitView } = useReactFlow();
  const nodeTypes = useMemo(() => ({ flowPathNode: FlowPathNode }), []);
  const edgeTypes = useMemo(() => ({ customRouteEdge: CustomRouteEdge }), []);

  useEffect(() => {
    // Inquadra automaticamente i nodi attivi al cambio dello step
    fitView({ duration: 400 });
  }, [graph, fitView]);

  return (
    <div className="w-full h-full min-h-137.5 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesConnectable={false}
        nodesDraggable={false}
        fitView
      >
        <Background color="#334155" gap={24} size={1} variant="dots" />
        <Controls className=" bg-slate-900  border-slate-700  fill-slate-400 [&_button]:border-slate-800" />
      </ReactFlow>
    </div>
  );
}

export default function FullStackPathPage() {
  const [activeStep, setActiveStep] = useState(0);

  const graph = useMemo(() => getFlowGraph(activeStep), [activeStep]);
  const currentLesson = GUIDED_LESSONS[activeStep];

  const handlePrev = () => setActiveStep((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setActiveStep((prev) => Math.min(GUIDED_LESSONS.length - 1, prev + 1));

  return (
    <main className="w-full min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col gap-6 font-sans">
      {/* Header statico */}
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Il ciclo di vita di una Richiesta Web
        </h1>
      </header>

      {/* Layout a due colonne: Controllo lezione a sinistra, Canvas a destra */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start flex-1">
        {/* Pannello Descrittivo */}
        <section className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full min-h-75">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Passo {activeStep + 1} di {GUIDED_LESSONS.length}
            </span>
            <h2 className="text-lg font-bold text-white mb-3">
              {currentLesson.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentLesson.description}
            </p>
          </div>

          {/* Bottoni di Navigazione */}
          <div className="flex gap-3 mt-6 border-t border-slate-800 pt-4">
            <button
              disabled={activeStep === 0}
              onClick={handlePrev}
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-colors border border-slate-700"
            >
              <ChevronLeft size={16} />
              Indietro
            </button>
            <button
              disabled={activeStep === GUIDED_LESSONS.length - 1}
              onClick={handleNext}
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white transition-colors shadow-lg shadow-blue-600/10"
            >
              Avanti
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Canvas React Flow */}
        <div className="xl:col-span-3 h-162.5 w-full">
          <ReactFlowProvider>
            <PathCanvas graph={graph} />
          </ReactFlowProvider>
        </div>
      </div>
    </main>
  );
}

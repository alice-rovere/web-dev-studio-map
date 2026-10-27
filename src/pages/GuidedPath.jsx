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
function CustomRouteEdge({
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
    <div className="h-full min-h-0 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 sm:rounded-2xl">
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesConnectable={false}
        nodesDraggable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        zoomOnPinch
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
    <main className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-slate-900 p-4 font-sans text-slate-100 sm:gap-6 sm:p-6">
      {/* Header statico */}
      <header className="border-b border-slate-800 pb-4">
        <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
          Il ciclo di vita di una Richiesta Web
        </h1>
      </header>

      {/* Layout a due colonne: Controllo lezione a sinistra, Canvas a destra */}
      <div className="grid flex-1 grid-cols-1 items-start gap-4 sm:gap-6 xl:grid-cols-4">
        {/* Pannello Descrittivo */}
        <section className="flex h-full min-h-0 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-5 xl:col-span-1">
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
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
              Indietro
            </button>
            <button
              disabled={activeStep === GUIDED_LESSONS.length - 1}
              onClick={handleNext}
              type="button"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/10 transition-colors hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600"
            >
              Avanti
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Canvas React Flow */}
        <div className="h-[60dvh] min-h-[360px] w-full xl:col-span-3 xl:h-162.5">
          <ReactFlowProvider>
            <PathCanvas graph={graph} />
          </ReactFlowProvider>
        </div>
      </div>
    </main>
  );
}

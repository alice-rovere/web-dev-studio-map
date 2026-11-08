import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { COMPUTER_EXPLORER_PARTS, getExplorableSteps } from "../../notebooks/computerExplorerParts.js";

function PartBox({ position, size, color, selected, onSelect, children }) {
  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} emissive={selected ? "#125c68" : "#000000"} roughness={0.65} />
      </mesh>
      {children}
    </group>
  );
}

function BoardDetail({ position, size, color = "#c29a52" }) {
  return (
    <mesh position={position} raycast={() => null}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

function MotherboardDetails() {
  const traces = [
    { position: [-1.65, 0.09, -0.5], size: [0.8, 0.012, 0.035] },
    { position: [-1.25, 0.09, -0.72], size: [0.035, 0.012, 0.45] },
    { position: [-1.05, 0.09, -0.95], size: [0.4, 0.012, 0.035] },
    { position: [-0.1, 0.09, -1.05], size: [0.035, 0.012, 0.6] },
    { position: [1.25, 0.09, -0.25], size: [0.7, 0.012, 0.035] },
    { position: [1.6, 0.09, -0.75], size: [0.035, 0.012, 1] },
    { position: [-1.45, 0.09, 1.55], size: [1, 0.012, 0.035] },
    { position: [0.2, 0.09, 1.7], size: [1.6, 0.012, 0.035] },
  ];

  return (
    <group>
      <BoardDetail position={[-0.9, 0.115, -0.5]} size={[1.58, 0.05, 1.58]} color="#94a3b8" />
      {[-1.65, -0.15].map((x) => (
        <BoardDetail
          key={`socket-contact-${x}`}
          position={[x, 0.145, -0.5]}
          size={[0.07, 0.012, 0.72]}
        />
      ))}

      {[0, 0.3, 0.8, 1.1].map((x) => (
        <group key={`ram-slot-${x}`}>
          <BoardDetail position={[x, 0.105, -0.4]} size={[0.29, 0.035, 2.38]} color="#111827" />
          {[-1.58, 0.78].map((z) => (
            <BoardDetail
              key={`ram-latch-${x}-${z}`}
              position={[x, 0.13, z]}
              size={[0.34, 0.045, 0.08]}
              color="#64748b"
            />
          ))}
        </group>
      ))}

      <BoardDetail position={[-2, 0.15, 0.55]} size={[0.62, 0.12, 0.62]} color="#334155" />
      <BoardDetail position={[-2, 0.22, 0.55]} size={[0.42, 0.04, 0.42]} color="#64748b" />
      {[-2.13, -2, -1.87].map((x) => (
        <BoardDetail
          key={`chipset-fin-${x}`}
          position={[x, 0.26, 0.55]}
          size={[0.035, 0.04, 0.36]}
          color="#94a3b8"
        />
      ))}

      {traces.map((trace, index) => (
        <BoardDetail
          key={`trace-${index}`}
          position={trace.position}
          size={trace.size}
          color={index % 3 === 0 ? "#c29a52" : "#2dd4bf"}
        />
      ))}

      {[-1.45, -0.95, -0.45, 1.45].map((x) => (
        <BoardDetail
          key={`edge-connector-${x}`}
          position={[x, 0.14, -1.98]}
          size={[0.3, 0.12, 0.38]}
          color="#334155"
        />
      ))}
      <BoardDetail position={[2.22, 0.16, -0.85]} size={[0.28, 0.18, 0.82]} color="#475569" />
      <BoardDetail position={[2.22, 0.255, -0.85]} size={[0.12, 0.025, 0.58]} color="#111827" />
    </group>
  );
}

function HardwareModel({ selected, onSelect }) {
  const part = (id) => () => onSelect(id);
  return (
    <group>
      <PartBox color="#155b4c" position={[0, 0, 0]} size={[5.2, 0.16, 4.4]} selected={selected === "scheda-madre"} onSelect={part("scheda-madre")} />
      <MotherboardDetails />

      <PartBox color="#cbd5e1" position={[-0.9, 0.25, -0.5]} size={[1.3, 0.25, 1.3]} selected={selected === "cpu"} onSelect={part("cpu")}>
        <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.95, 0.06, 0.95]} /><meshStandardMaterial color="#64748b" /></mesh>
      </PartBox>

      {[0.3, 0.8].map((x) => (
        <PartBox key={x} color="#1e293b" position={[x, 0.36, -0.4]} size={[0.24, 0.48, 2.3]} selected={selected === "ram"} onSelect={part("ram")}>
          {[-0.75, -0.25, 0.25, 0.75].map((z) => (
            <mesh position={[0.125, 0, z]} key={z}><boxGeometry args={[0.02, 0.3, 0.32]} /><meshStandardMaterial color="#334155" /></mesh>
          ))}
        </PartBox>
      ))}

      <PartBox color="#245c6b" position={[1.4, 0.2, 1.15]} size={[0.65, 0.16, 1.55]} selected={selected === "archiviazione"} onSelect={part("archiviazione")}>
        {[0, 0.4, -0.4].map((z) => (
          <mesh key={z} position={[0, 0.09, z]}><boxGeometry args={[0.4, 0.04, 0.26]} /><meshStandardMaterial color="#172033" /></mesh>
        ))}
      </PartBox>

      <PartBox color="#374151" position={[-0.7, 0.6, 1.2]} size={[2.3, 0.65, 0.65]} selected={selected === "gpu"} onSelect={part("gpu")}>
        {[-0.55, 0.55].map((x) => (
          <mesh position={[x, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]} key={x}>
            <circleGeometry args={[0.23, 24]} /><meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </PartBox>

      <PartBox color="#374151" position={[3.65, 0.23, 0.3]} size={[1.6, 0.4, 2.6]} selected={selected === "batteria"} onSelect={part("batteria")}>
        {[-0.65, 0, 0.65].map((z) => (
          <mesh key={z} position={[0, 0.21, z]}><boxGeometry args={[1.25, 0.03, 0.47]} /><meshStandardMaterial color="#64748b" /></mesh>
        ))}
      </PartBox>

      <PartBox color="#94a3b8" position={[-2.4, 0.35, -1.3]} size={[0.5, 0.5, 1.5]} selected={selected === "periferiche"} onSelect={part("periferiche")}>
        {[-0.4, 0, 0.4].map((z) => (
          <mesh key={z} position={[-0.26, 0, z]}><boxGeometry args={[0.02, 0.18, 0.22]} /><meshStandardMaterial color="#1e293b" /></mesh>
        ))}
      </PartBox>

      {[[-2.1, -1.8], [2.1, -1.8], [-2.1, 1.8], [2.1, 1.8]].map(([x, z]) => (
        <mesh position={[x, 0.09, z]} rotation={[-Math.PI / 2, 0, 0]} key={`${x}-${z}`}>
          <ringGeometry args={[0.07, 0.11, 16]} /><meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
}

function SceneControls({ selected, reducedMotion, controlsRef }) {
  const { camera, gl } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const desiredPosition = useMemo(() => new Vector3(), []);
  const transition = useRef(true);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.enablePan = false;
    controlsRef.current = controls;
    const stopTransition = () => { transition.current = false; };
    controls.addEventListener("start", stopTransition);
    return () => {
      controls.removeEventListener("start", stopTransition);
      controls.dispose();
      controlsRef.current = null;
      document.body.style.cursor = "";
    };
  }, [camera, gl, controlsRef]);

  useEffect(() => {
    const focus = COMPUTER_EXPLORER_PARTS[selected];
    if (!focus) return;
    target.fromArray(focus.position);
    desiredPosition.fromArray(focus.camera);
    transition.current = true;
  }, [selected, desiredPosition, target]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (transition.current) {
      const factor = reducedMotion ? 1 : 1 - Math.exp(-4 * delta);
      camera.position.lerp(desiredPosition, factor);
      controls.target.lerp(target, factor);
      if (camera.position.distanceTo(desiredPosition) < 0.01 && controls.target.distanceTo(target) < 0.01) {
        transition.current = false;
      }
    }
    controls.update();
  });
  return null;
}

export default function ComputerExplorer({ steps, stepId, onSelect, onClose, reducedMotion }) {
  const availableSteps = getExplorableSteps(steps);
  const initialStep = availableSteps.find((step) => step.id === stepId)?.id ?? availableSteps[0]?.id;
  const [selected, setSelected] = useState(initialStep);
  const [webglAvailable, setWebglAvailable] = useState(null);
  const [cameraRevision, setCameraRevision] = useState(0);
  const controlsRef = useRef(null);
  const closeRef = useRef(null);
  const selectedStep = availableSteps.find((step) => step.id === selected);

  useEffect(() => {
    closeRef.current?.focus();
    const frame = requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      setWebglAvailable(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const selectPart = (id) => {
    if (!availableSteps.some((step) => step.id === id)) return;
    setSelected(id);
    setCameraRevision((value) => value + 1);
    onSelect(id);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex flex-col bg-[#0b1120] text-slate-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="computer-explorer-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") event.stopPropagation();
        if (event.key === "Tab") {
          const focusable = event.currentTarget.querySelectorAll("button:not(:disabled), [href], [tabindex]:not([tabindex='-1'])");
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}
    >
      <header className="flex items-center justify-between gap-3 border-b border-cyan-500/20 px-4 py-3">
        <div><h2 id="computer-explorer-title" className="text-base font-bold text-cyan-200">Esplora il computer</h2><p className="text-xs text-slate-400">Modello didattico stilizzato, non in scala</p></div>
        <button ref={closeRef} type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800">Torna agli appunti</button>
      </header>
      <div className="grid min-h-0 grow overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="flex min-h-0 flex-col gap-3 p-4" aria-label="Modello interattivo">
          <p className="text-sm text-slate-300">Trascina per ruotare, usa la rotella o due dita per lo zoom. Seleziona un componente nel modello o nell’elenco.</p>
          <div className="relative min-h-64 grow overflow-hidden rounded-xl border border-cyan-500/20 bg-[#101b2c] lg:min-h-96">
            {webglAvailable === null && <p className="p-4 text-sm text-slate-400">Caricamento modello 3D…</p>}
            {webglAvailable === false && <p role="alert" className="p-4 text-sm text-amber-200">Il 3D non è disponibile su questo dispositivo. Puoi usare l’elenco e tornare allo schema 2D degli appunti.</p>}
            {webglAvailable && (
              <Canvas camera={{ position: [6, 8, 8], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "low-power" }} fallback={<p role="alert">Il 3D non è disponibile: torna agli appunti 2D.</p>}>
                <ambientLight intensity={1.7} />
                <directionalLight position={[4, 8, 5]} intensity={2.5} />
                <gridHelper args={[16, 16, "#334155", "#1e293b"]} position={[0, -0.2, 0]} />
                <HardwareModel selected={selected} onSelect={selectPart} />
                <SceneControls key={cameraRevision} selected={selected} reducedMotion={reducedMotion} controlsRef={controlsRef} />
              </Canvas>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setCameraRevision((value) => value + 1)} className="rounded border border-cyan-500/40 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/10">Centra componente</button>
            <button type="button" onClick={() => selectPart("scheda-madre")} disabled={!availableSteps.some((step) => step.id === "scheda-madre")} className="rounded border border-slate-600 px-3 py-2 text-xs hover:bg-slate-800 disabled:opacity-40">Vista d’insieme</button>
          </div>
        </section>
        <aside className="space-y-4 border-t border-cyan-500/20 p-4 lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <h3 className="font-semibold text-cyan-200">Componenti</h3>
          <div className="flex flex-wrap gap-2" aria-label="Seleziona un componente">
            {availableSteps.map((step) => (
              <button key={step.id} type="button" aria-pressed={selected === step.id} onClick={() => selectPart(step.id)} className={`rounded-lg border px-3 py-2 text-left text-xs ${selected === step.id ? "border-cyan-400 bg-cyan-400/15 text-cyan-100" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}>
                {step.title}
              </button>
            ))}
          </div>
          {selectedStep ? (
            <section aria-live="polite" className="rounded-xl border border-fuchsia-500/20 bg-slate-900/70 p-4">
              <h3 className="font-semibold text-fuchsia-200">{selectedStep.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedStep.description}</p>
              {selected === "batteria" && <p className="mt-2 text-xs text-slate-400">Batteria illustrata separatamente come esempio di portatile; nei computer fissi l’alimentazione è diversa.</p>}
            </section>
          ) : <p className="text-sm text-slate-400">Seleziona un componente dall’elenco.</p>}
        </aside>
      </div>
    </div>
  );
}

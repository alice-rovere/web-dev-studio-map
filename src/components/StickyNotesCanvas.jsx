// src/components/StickyNotesCanvas.jsx
import { useRef, useState } from "react";
import { Plus, Trash2, GripHorizontal } from "lucide-react";
import { useStickyNotes } from "../hooks/useStickyNotes";

export function StickyNotesCanvas({ boardId }) {
  // L'hook è integrato di nuovo direttamente nel canvas per la massima comodità d'uso
  const { notes, loading, addNote, updateNoteFields, focusNote, deleteNote } =
    useStickyNotes(boardId);

  if (loading) return null;

  return (
    <div className="hidden md:block">
      {/* 
        BOTTONE FISSO IN BASSO A DESTRA: 
        Ridisegnato in linea con la UI di DevSkillMap (Sfondo scuro ardesia, bordo e testo indaco)
      */}
      <div className="fixed bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] right-[calc(1.5rem_+_env(safe-area-inset-right))] z-50">
        <button
          onClick={addNote}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={14} /> Nota Fluttuante
        </button>
      </div>

      {/* Render dei Post-it fluttuanti */}
      {notes.map((note) => (
        <StickyNoteItem
          key={note.id}
          note={note}
          onFocus={() => focusNote(note.id)}
          onDelete={() => deleteNote(note.id)}
          onUpdate={(fields) => updateNoteFields(note.id, fields)}
        />
      ))}
    </div>
  );
}

function StickyNoteItem({ note, onFocus, onDelete, onUpdate }) {
  const noteRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDownDrag = (e) => {
    if (e.target.closest(".delete-btn") || e.target.closest("textarea")) return;
    onFocus();
    setIsDragging(true);

    dragStart.current = {
      x: e.clientX - note.x_pos,
      y: e.clientY - note.y_pos,
    };

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - dragStart.current.x;
      const newY = moveEvent.clientY - dragStart.current.y;

      if (noteRef.current) {
        noteRef.current.style.left = `${newX}px`;
        noteRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = (upEvent) => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      const finalX = upEvent.clientX - dragStart.current.x;
      const finalY = upEvent.clientY - dragStart.current.y;
      onUpdate({ x_pos: finalX, y_pos: finalY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDownResize = () => {
    const handleMouseUpResize = () => {
      if (noteRef.current) {
        onUpdate({
          width: noteRef.current.offsetWidth,
          height: noteRef.current.offsetHeight,
        });
      }
      window.removeEventListener("mouseup", handleMouseUpResize);
    };

    window.addEventListener("mouseup", handleMouseUpResize);
  };

  return (
    <div
      ref={noteRef}
      onMouseDown={onFocus}
      style={{
        position: "absolute",
        left: `${note.x_pos}px`,
        top: `${note.y_pos}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        zIndex: note.z_index,
      }}
      className="flex flex-col bg-amber-500/10 text-amber-200 border border-amber-500/30 backdrop-blur-md p-3 rounded-xl shadow-2xl resize overflow-auto min-w-30 min-h-25 group select-none transition-shadow duration-200 focus-within:border-amber-400/60 focus-within:shadow-amber-500/5"
    >
      <div
        onMouseDown={handleMouseDownDrag}
        className={`flex items-center justify-between pb-2 mb-1 border-b border-amber-500/10 text-amber-400/40 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <GripHorizontal
          size={14}
          className="group-hover:text-amber-400/70 transition-colors"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="delete-btn opacity-0 group-hover:opacity-100 text-amber-400/40 hover:text-red-400 p-0.5 rounded transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <textarea
        value={note.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Prendi un appunto..."
        className="w-full h-full bg-transparent resize-none border-none outline-none py-1 text-xs font-medium leading-relaxed text-amber-100 placeholder:text-amber-400/30 focus:ring-0"
      />

      <div
        onMouseDown={handleMouseDownResize}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
      />
    </div>
  );
}

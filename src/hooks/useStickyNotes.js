import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase'; // Adegua il path al tuo client Supabase

export function useStickyNotes(boardId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica i post-it associati a questa board/nodo
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('sticky_notes')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setNotes(data);
      }
      setLoading(false);
    }

    if (boardId) fetchNotes();
  }, [boardId]);

  // Crea un nuovo post-it
  const addNote = async () => {
    const maxZ = notes.length > 0 ? Math.max(...notes.map(n => n.z_index)) : 0;
    const newNote = {
      board_id: boardId,
      content: '',
      x_pos: 60,
      y_pos: 60,
      z_index: maxZ + 1
    };

    const { data, error } = await supabase
      .from('sticky_notes')
      .insert([newNote])
      .select()
      .single();

    if (!error && data) {
      setNotes(prev => [...prev, data]);
    }
  };

  // Aggiorna le proprietà (es: testo, posizione, dimensione)
  const updateNoteFields = async (id, fields) => {
    // Aggiornamento ottimistico locale per fluidità UI
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...fields } : n));
    
    // Aggiorna Supabase in background
    await supabase.from('sticky_notes').update(fields).eq('id', id);
  };

  // Sposta in primo piano al click
  const focusNote = (id) => {
    const maxZ = notes.length > 0 ? Math.max(...notes.map(n => n.z_index)) : 0;
    const currentNote = notes.find(n => n.id === id);
    if (currentNote && currentNote.z_index < maxZ) {
      updateNoteFields(id, { z_index: maxZ + 1 });
    }
  };

  // Elimina la nota
  const deleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await supabase.from('sticky_notes').delete().eq('id', id);
  };

  return { notes, loading, addNote, updateNoteFields, focusNote, deleteNote };
}

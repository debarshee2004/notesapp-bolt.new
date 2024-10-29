'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { NotebooksSidebar } from '@/components/notebooks-sidebar';
import { NotesSidebar } from '@/components/notes-sidebar';
import { NoteEditor } from '@/components/note-editor';
import { ThemeToggle } from '@/components/theme-toggle';
import { Note, Notebook } from '@/lib/types';
import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotesPage() {
  const { notebooks, notes, saveNotebooks, saveNotes } = useLocalStorage();
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [showNotebooksSidebar, setShowNotebooksSidebar] = useState(true);
  const [showNotesSidebar, setShowNotesSidebar] = useState(true);

  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId);
  const activeNote = notes.find((n) => n.id === activeNoteId);
  const notebookNotes = notes.filter((n) => n.notebookId === activeNotebookId);

  const createNotebook = () => {
    const newNotebook: Notebook = {
      id: crypto.randomUUID(),
      title: 'New Notebook',
      createdAt: new Date().toISOString(),
    };
    saveNotebooks([...notebooks, newNotebook]);
    setActiveNotebookId(newNotebook.id);
    toast.success('Notebook created');
  };

  const updateNotebook = (updatedNotebook: Notebook) => {
    const updatedNotebooks = notebooks.map((nb) =>
      nb.id === updatedNotebook.id ? updatedNotebook : nb
    );
    saveNotebooks(updatedNotebooks);
    toast.success('Notebook updated');
  };

  const deleteNotebook = (id: string) => {
    saveNotebooks(notebooks.filter((nb) => nb.id !== id));
    saveNotes(notes.filter((n) => n.notebookId !== id));
    if (activeNotebookId === id) {
      setActiveNotebookId(null);
      setActiveNoteId(null);
    }
    toast.success('Notebook deleted');
  };

  const createNote = () => {
    if (!activeNotebookId) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      content: '',
      notebookId: activeNotebookId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
    toast.success('Note created');
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((n) =>
      n.id === updatedNote.id ? updatedNote : n
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
    toast.success('Note deleted');
  };

  // const toggleNotebooksSidebar = () => {
  //   setShowNotebooksSidebar(!showNotebooksSidebar);
  //   if (window.innerWidth < 768) {
  //     setShowNotesSidebar(false);
  //   }
  // };

  // const toggleNotesSidebar = () => {
  //   setShowNotesSidebar(!showNotesSidebar);
  //   if (window.innerWidth < 768) {
  //     setShowNotebooksSidebar(false);
  //   }
  // };

  return (
    <main className="flex h-screen bg-background">
      <div
        className={cn(
          'fixed inset-y-0 z-20 transition-transform duration-300 md:relative',
          showNotebooksSidebar ? 'translate-x-0' : '-translate-x-64'
        )}
      >
        <NotebooksSidebar
          notebooks={notebooks}
          activeNotebookId={activeNotebookId}
          onNotebookSelect={(id) => {
            setActiveNotebookId(id);
            if (window.innerWidth < 768) {
              setShowNotebooksSidebar(false);
              setShowNotesSidebar(true);
            }
          }}
          onCreateNotebook={createNotebook}
          onUpdateNotebook={updateNotebook}
          onDeleteNotebook={deleteNotebook}
        />
      </div>

      {activeNotebook && (
        <div
          className={cn(
            'fixed inset-y-0 left-64 z-20 transition-transform duration-300 md:relative md:left-0',
            showNotesSidebar ? 'translate-x-0' : '-translate-x-72'
          )}
        >
          <NotesSidebar
            notes={notebookNotes}
            activeNoteId={activeNoteId}
            onNoteSelect={(id) => {
              setActiveNoteId(id);
              if (window.innerWidth < 768) {
                setShowNotesSidebar(false);
              }
            }}
            onCreateNote={createNote}
            onDeleteNote={deleteNote}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-2 h-10">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotebooksSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotebooksSidebar}
              className="hidden md:inline-flex"
            >
              {showNotebooksSidebar ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </Button>
            {activeNotebook && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotesSidebar}
                className="hidden md:inline-flex"
              >
                {showNotesSidebar ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
              </Button>
            )} */}
          </div>
          {/* <ThemeToggle /> */}
        </div>
        <NoteEditor note={activeNote} onUpdate={updateNote} />
      </div>
    </main>
  );
}

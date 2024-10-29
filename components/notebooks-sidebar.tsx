"use client"

import { PlusCircle, Book, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Notebook } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NotebooksSidebarProps {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  onNotebookSelect: (id: string) => void;
  onCreateNotebook: () => void;
  onUpdateNotebook: (notebook: Notebook) => void;
  onDeleteNotebook: (id: string) => void;
}

export function NotebooksSidebar({
  notebooks,
  activeNotebookId,
  onNotebookSelect,
  onCreateNotebook,
  onUpdateNotebook,
  onDeleteNotebook,
}: NotebooksSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState<string | null>(null);

  const handleRename = (notebook: Notebook, newTitle: string) => {
    onUpdateNotebook({
      ...notebook,
      title: newTitle.trim() || 'Untitled Notebook',
    });
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    setNotebookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (notebookToDelete) {
      onDeleteNotebook(notebookToDelete);
      setDeleteDialogOpen(false);
      setNotebookToDelete(null);
    }
  };

  return (
    <div className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={onCreateNotebook} className="w-full" variant="secondary">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Notebook
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {notebooks.map((notebook) => (
            <div
              key={notebook.id}
              className={cn(
                "flex items-center justify-between px-2 py-1 rounded-lg mb-1 hover:bg-secondary/50 transition-colors group",
                activeNotebookId === notebook.id && "bg-secondary"
              )}
            >
              {editingId === notebook.id ? (
                <Input
                  autoFocus
                  defaultValue={notebook.title}
                  className="h-8 text-sm"
                  onBlur={(e) => handleRename(notebook, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename(notebook, e.currentTarget.value);
                    }
                  }}
                />
              ) : (
                <button
                  onClick={() => onNotebookSelect(notebook.id)}
                  className="flex items-center flex-1 px-2 py-1 text-sm"
                >
                  <Book className="h-4 w-4 mr-2" />
                  {notebook.title}
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingId(notebook.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteClick(notebook.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notebook</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this notebook and all its notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
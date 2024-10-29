"use client"

import { useState, useEffect } from 'react';
import { Note } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (note: Note) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (note) {
      onUpdate({
        ...note,
        title: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (note) {
      onUpdate({
        ...note,
        content: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select or create a note to start writing
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="text-lg font-medium border-none shadow-none focus-visible:ring-0"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
            className="min-h-[calc(100vh-12rem)] resize-none border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </ScrollArea>
    </div>
  );
}
"use client"

import { useState, useEffect } from 'react';
import { Note, Notebook } from '@/lib/types';

export function useLocalStorage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotebooks = localStorage.getItem('notebooks');
    const savedNotes = localStorage.getItem('notes');
    
    if (savedNotebooks) setNotebooks(JSON.parse(savedNotebooks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  const saveNotebooks = (newNotebooks: Notebook[]) => {
    setNotebooks(newNotebooks);
    localStorage.setItem('notebooks', JSON.stringify(newNotebooks));
  };

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  return {
    notebooks,
    notes,
    saveNotebooks,
    saveNotes,
  };
}
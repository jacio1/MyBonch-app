'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from './useDatabase';
import { useAuth } from './AuthContext';
import { Assignment, Note, Subject } from '@/src/types';

export function useLocalData() {
  const { user } = useAuth();
  const db = useDatabase();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных при входе пользователя
  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setAssignments([]);
      setNotes([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [subjectsData, assignmentsData, notesData] = await Promise.all([
          db.getSubjects(),
          db.getAssignments(),
          db.getNotes(),
        ]);

        setSubjects(subjectsData);
        setAssignments(assignmentsData);
        setNotes(notesData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки данных';
        setError(message);
        console.error('Data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, db]);

  // Функции для работы с предметами
  const addSubjectLocal = async (subject: Omit<Subject, 'id'>) => {
    try {
      const newSubject = await db.addSubject(subject);
      setSubjects([...subjects, newSubject]);
      return newSubject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка добавления предмета';
      setError(message);
      throw err;
    }
  };

  const updateSubjectLocal = async (id: number, subject: Partial<Subject>) => {
    try {
      const updated = await db.updateSubject(id, subject);
      setSubjects(subjects.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления предмета';
      setError(message);
      throw err;
    }
  };

  const deleteSubjectLocal = async (id: number) => {
    try {
      await db.deleteSubject(id);
      setSubjects(subjects.filter(s => s.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка удаления предмета';
      setError(message);
      throw err;
    }
  };

  // Функции для работы с заданиями
  const addAssignmentLocal = async (assignment: Omit<Assignment, 'id'>) => {
    try {
      const newAssignment = await db.addAssignment(assignment);
      setAssignments([...assignments, newAssignment]);
      return newAssignment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка добавления задания';
      setError(message);
      throw err;
    }
  };

  const updateAssignmentLocal = async (id: number, assignment: Partial<Assignment>) => {
    try {
      const updated = await db.updateAssignment(id, assignment);
      setAssignments(assignments.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления задания';
      setError(message);
      throw err;
    }
  };

  const deleteAssignmentLocal = async (id: number) => {
    try {
      await db.deleteAssignment(id);
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка удаления задания';
      setError(message);
      throw err;
    }
  };

  // Функции для работы с заметками
  const addNoteLocal = async (note: Omit<Note, 'id'>) => {
    try {
      const newNote = await db.addNote(note);
      setNotes([...notes, newNote]);
      return newNote;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка добавления заметки';
      setError(message);
      throw err;
    }
  };

  const updateNoteLocal = async (id: number, note: Partial<Note>) => {
    try {
      const updated = await db.updateNote(id, note);
      setNotes(notes.map(n => n.id === id ? updated : n));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления заметки';
      setError(message);
      throw err;
    }
  };

  const deleteNoteLocal = async (id: number) => {
    try {
      await db.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка удаления заметки';
      setError(message);
      throw err;
    }
  };

  return {
    subjects,
    assignments,
    notes,
    loading,
    error,
    // Subject operations
    addSubject: addSubjectLocal,
    updateSubject: updateSubjectLocal,
    deleteSubject: deleteSubjectLocal,
    // Assignment operations
    addAssignment: addAssignmentLocal,
    updateAssignment: updateAssignmentLocal,
    deleteAssignment: deleteAssignmentLocal,
    // Note operations
    addNote: addNoteLocal,
    updateNote: updateNoteLocal,
    deleteNote: deleteNoteLocal,
  };
}
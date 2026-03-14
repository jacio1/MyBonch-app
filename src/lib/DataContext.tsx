'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { Assignment, Note, Subject } from '@/src/types';

interface DataContextType {
  subjects: Subject[];
  assignments: Assignment[];
  notes: Note[];
  loading: boolean;
  error: string | null;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<Subject>;
  updateSubject: (id: number, subject: Partial<Subject>) => Promise<Subject>;
  deleteSubject: (id: number) => Promise<void>;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Promise<Assignment>;
  updateAssignment: (id: number, assignment: Partial<Assignment>) => Promise<Assignment>;
  deleteAssignment: (id: number) => Promise<void>;
  addNote: (note: Omit<Note, 'id'>) => Promise<Note>;
  updateNote: (id: number, note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Глобальный кеш данных
let cachedData = {
  userId: null as string | null,
  subjects: null as Subject[] | null,
  assignments: null as Assignment[] | null,
  notes: null as Note[] | null,
  loading: false,
  loadPromise: null as Promise<void> | null,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ГЛАВНОЕ: загружаем данные ТОЛЬКО при изменении user, и ОДИН РАЗ
  useEffect(() => {
    if (!user) {
      cachedData = {
        userId: null,
        subjects: null,
        assignments: null,
        notes: null,
        loading: false,
        loadPromise: null,
      };
      setSubjects([]);
      setAssignments([]);
      setNotes([]);
      setLoading(false);
      return;
    }

    // Если уже загружали для этого пользователя - используем кеш
    if (cachedData.userId === user.id && cachedData.subjects !== null) {
      console.log('💾 Используем кешированные данные');
      setSubjects(cachedData.subjects);
      setAssignments(cachedData.assignments ?? []);
      setNotes(cachedData.notes ?? []);
      setLoading(false);
      return;
    }

    // Если уже идет загрузка - ждем
    if (cachedData.loading && cachedData.loadPromise) {
      console.log('⏳ Загрузка уже в процессе, ждем...');
      cachedData.loadPromise.then(() => {
        setSubjects(cachedData.subjects!);
        setAssignments(cachedData.assignments!);
        setNotes(cachedData.notes!);
        setLoading(false);
      });
      return;
    }

    // Загружаем данные
    cachedData.userId = user.id;
    cachedData.loading = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Загружаем данные для user:', user.id);

        const [subjectsRes, assignmentsRes, notesRes] = await Promise.all([
          supabase.from('subjects').select('*').eq('user_id', user.id),
          supabase.from('assignments').select('*').eq('user_id', user.id),
          supabase.from('notes').select('*').eq('user_id', user.id),
        ]);

        const subjectsData = subjectsRes.data || [];
        const assignmentsData = assignmentsRes.data || [];
        const notesData = notesRes.data || [];

        // Сохраняем в кеш
        cachedData.subjects = subjectsData;
        cachedData.assignments = assignmentsData;
        cachedData.notes = notesData;
        cachedData.loading = false;

        setSubjects(subjectsData);
        setAssignments(assignmentsData);
        setNotes(notesData);

        console.log('✅ Данные загружены успешно');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки';
        setError(message);
        console.error('❌ Ошибка:', err);
        cachedData.loading = false;
      } finally {
        setLoading(false);
      }
    };

    cachedData.loadPromise = loadData();
  }, [user]); // ОЧЕНЬ ВАЖНО: зависит ТОЛЬКО от user!

  // Функции для работы с данными
  const addSubject = useCallback(
    async (subject: Omit<Subject, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('subjects')
        .insert([{ ...subject, user_id: user.id }])
        .select();

      if (err) throw err;

      const newSubject = data?.[0];
      if (newSubject) {
        // Обновляем локальное состояние
        setSubjects((prev) => [...prev, newSubject]);
        // Обновляем кеш
        if (cachedData.subjects) {
          cachedData.subjects = [...cachedData.subjects, newSubject];
        }
      }
      return newSubject;
    },
    [user]
  );

  const updateSubject = useCallback(
    async (id: number, subject: Partial<Subject>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('subjects')
        .update(subject)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (err) throw err;

      const updated = data?.[0];
      if (updated) {
        setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
        if (cachedData.subjects) {
          cachedData.subjects = cachedData.subjects.map((s) => (s.id === id ? updated : s));
        }
      }
      return updated;
    },
    [user]
  );

  const deleteSubject = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase.from('subjects').delete().eq('id', id).eq('user_id', user.id);

      if (err) throw err;

      setSubjects((prev) => prev.filter((s) => s.id !== id));
      if (cachedData.subjects) {
        cachedData.subjects = cachedData.subjects.filter((s) => s.id !== id);
      }
    },
    [user]
  );

  const addAssignment = useCallback(
    async (assignment: Omit<Assignment, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('assignments')
        .insert([{ ...assignment, user_id: user.id }])
        .select();

      if (err) throw err;

      const newAssignment = data?.[0];
      if (newAssignment) {
        setAssignments((prev) => [...prev, newAssignment]);
        if (cachedData.assignments) {
          cachedData.assignments = [...cachedData.assignments, newAssignment];
        }
      }
      return newAssignment;
    },
    [user]
  );

  const updateAssignment = useCallback(
    async (id: number, assignment: Partial<Assignment>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('assignments')
        .update(assignment)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (err) throw err;

      const updated = data?.[0];
      if (updated) {
        setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
        if (cachedData.assignments) {
          cachedData.assignments = cachedData.assignments.map((a) => (a.id === id ? updated : a));
        }
      }
      return updated;
    },
    [user]
  );

  const deleteAssignment = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase.from('assignments').delete().eq('id', id).eq('user_id', user.id);

      if (err) throw err;

      setAssignments((prev) => prev.filter((a) => a.id !== id));
      if (cachedData.assignments) {
        cachedData.assignments = cachedData.assignments.filter((a) => a.id !== id);
      }
    },
    [user]
  );

  const addNote = useCallback(
    async (note: Omit<Note, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase.from('notes').insert([{ ...note, user_id: user.id }]).select();

      if (err) throw err;

      const newNote = data?.[0];
      if (newNote) {
        setNotes((prev) => [...prev, newNote]);
        if (cachedData.notes) {
          cachedData.notes = [...cachedData.notes, newNote];
        }
      }
      return newNote;
    },
    [user]
  );

  const updateNote = useCallback(
    async (id: number, note: Partial<Note>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('notes')
        .update(note)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (err) throw err;

      const updated = data?.[0];
      if (updated) {
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        if (cachedData.notes) {
          cachedData.notes = cachedData.notes.map((n) => (n.id === id ? updated : n));
        }
      }
      return updated;
    },
    [user]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id);

      if (err) throw err;

      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (cachedData.notes) {
        cachedData.notes = cachedData.notes.filter((n) => n.id !== id);
      }
    },
    [user]
  );

  const value = {
    subjects,
    assignments,
    notes,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addNote,
    updateNote,
    deleteNote,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData должен использоваться внутри DataProvider');
  }
  return context;
}
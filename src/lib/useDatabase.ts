'use client';

import { useAuth } from './AuthContext';
import { supabase } from './supabase';
import { Assignment, Note, Subject } from '@/src/types';
import { useCallback, useMemo } from 'react';

export function useDatabase() {
  const { user } = useAuth();

  // Все функции обернуты в useCallback с зависимостью только от user
  // Это предотвращает создание новых функций при каждом рендере

  const getSubjects = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase.from('subjects').select('*').eq('user_id', user.id);

    if (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
    return data || [];
  }, [user]);

  const addSubject = useCallback(
    async (subject: Omit<Subject, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subjects')
        .insert([{ ...subject, user_id: user.id }])
        .select();

      if (error) throw error;
      return data?.[0];
    },
    [user]
  );

  const updateSubject = useCallback(
    async (id: number, subject: Partial<Subject>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subjects')
        .update(subject)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    [user]
  );

  const deleteSubject = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('subjects').delete().eq('id', id).eq('user_id', user.id);

      if (error) throw error;
    },
    [user]
  );

  const getAssignments = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase.from('assignments').select('*').eq('user_id', user.id);

    if (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
    return data || [];
  }, [user]);

  const addAssignment = useCallback(
    async (assignment: Omit<Assignment, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('assignments')
        .insert([{ ...assignment, user_id: user.id }])
        .select();

      if (error) throw error;
      return data?.[0];
    },
    [user]
  );

  const updateAssignment = useCallback(
    async (id: number, assignment: Partial<Assignment>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('assignments')
        .update(assignment)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    [user]
  );

  const deleteAssignment = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    [user]
  );

  const getNotes = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id);

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
    return data || [];
  }, [user]);

  const addNote = useCallback(
    async (note: Omit<Note, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...note, user_id: user.id }])
        .select();

      if (error) throw error;
      return data?.[0];
    },
    [user]
  );

  const updateNote = useCallback(
    async (id: number, note: Partial<Note>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .update(note)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    [user]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id);

      if (error) throw error;
    },
    [user]
  );

  // Мемоизируем объект с функциями
  return useMemo(
    () => ({
      getSubjects,
      addSubject,
      updateSubject,
      deleteSubject,
      getAssignments,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      getNotes,
      addNote,
      updateNote,
      deleteNote,
    }),
    [
      getSubjects,
      addSubject,
      updateSubject,
      deleteSubject,
      getAssignments,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      getNotes,
      addNote,
      updateNote,
      deleteNote,
    ]
  );
}
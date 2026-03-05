'use client';

import { useAuth } from './AuthContext';
import { supabase } from './supabase';
import { Assignment, Note, Subject } from '@/src/types';

export function useDatabase() {
  const { user } = useAuth();

  // Получить все предметы пользователя
  const getSubjects = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
    return data || [];
  };

  // Добавить новый предмет
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subjects')
      .insert([{ ...subject, user_id: user.id }])
      .select();

    if (error) throw error;
    return data?.[0];
  };

  // Обновить предмет
  const updateSubject = async (id: number, subject: Partial<Subject>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subjects')
      .update(subject)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    return data?.[0];
  };

  // Удалить предмет
  const deleteSubject = async (id: number) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  // Получить все задания пользователя
  const getAssignments = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
    return data || [];
  };

  // Добавить новое задание
  const addAssignment = async (assignment: Omit<Assignment, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('assignments')
      .insert([{ ...assignment, user_id: user.id }])
      .select();

    if (error) throw error;
    return data?.[0];
  };

  // Обновить задание
  const updateAssignment = async (id: number, assignment: Partial<Assignment>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('assignments')
      .update(assignment)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    return data?.[0];
  };

  // Удалить задание
  const deleteAssignment = async (id: number) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  // Получить все заметки пользователя
  const getNotes = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
    return data || [];
  };

  // Добавить новую заметку
  const addNote = async (note: Omit<Note, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .insert([{ ...note, user_id: user.id }])
      .select();

    if (error) throw error;
    return data?.[0];
  };

  // Обновить заметку
  const updateNote = async (id: number, note: Partial<Note>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .update(note)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    return data?.[0];
  };

  // Удалить заметку
  const deleteNote = async (id: number) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  return {
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
  };
}
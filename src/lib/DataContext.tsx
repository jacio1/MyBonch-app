'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { Assignment, Note, Schedule, Preset, StudyPeriod, PresetSchedule } from '@/src/types';

interface DataContextType {
  // Study Periods
  studyPeriods: StudyPeriod[];
  activeStudyPeriod: StudyPeriod | null;
  createStudyPeriod: (period: Omit<StudyPeriod, 'id'>) => Promise<StudyPeriod>;
  updateStudyPeriod: (id: number, period: Partial<StudyPeriod>) => Promise<StudyPeriod>;
  deleteStudyPeriod: (id: number) => Promise<void>;
  setActiveStudyPeriod: (id: number) => Promise<void>;

  // Schedules
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<Schedule>;
  updateSchedule: (id: number, schedule: Partial<Schedule>) => Promise<Schedule>;
  deleteSchedule: (id: number) => Promise<void>;
  getSchedulesByDateRange: (startDate: string, endDate: string) => Schedule[];

  // Presets
  presets: Preset[];
  addPreset: (preset: Omit<Preset, 'id'>) => Promise<Preset>;
  updatePreset: (id: number, preset: Partial<Preset>) => Promise<Preset>;
  deletePreset: (id: number) => Promise<void>;
  addPresetSchedule: (presetId: number, schedule: Omit<PresetSchedule, 'id'>) => Promise<PresetSchedule>;
  deletePresetSchedule: (scheduleId: number) => Promise<void>;
  applyPreset: (presetId: number, startDate: string) => Promise<void>;

  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Promise<Assignment>;
  updateAssignment: (id: number, assignment: Partial<Assignment>) => Promise<Assignment>;
  deleteAssignment: (id: number) => Promise<void>;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => Promise<Note>;
  updateNote: (id: number, note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;

  // Loading
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

let cachedData = {
  userId: null as string | null,
  studyPeriods: null as StudyPeriod[] | null,
  schedules: null as Schedule[] | null,
  presets: null as Preset[] | null,
  assignments: null as Assignment[] | null,
  notes: null as Note[] | null,
  loading: false,
  loadPromise: null as Promise<void> | null,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [studyPeriods, setStudyPeriods] = useState<StudyPeriod[]>([]);
  const [activeStudyPeriod, setActiveStudyPeriod] = useState<StudyPeriod | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных
  useEffect(() => {
    if (!user) {
      cachedData = {
        userId: null,
        studyPeriods: null,
        schedules: null,
        presets: null,
        assignments: null,
        notes: null,
        loading: false,
        loadPromise: null,
      };
      setStudyPeriods([]);
      setActiveStudyPeriod(null);
      setSchedules([]);
      setPresets([]);
      setAssignments([]);
      setNotes([]);
      setLoading(false);
      return;
    }

    if (cachedData.userId === user.id && cachedData.studyPeriods !== null) {
      console.log('💾 Используем кешированные данные');
      setStudyPeriods(cachedData.studyPeriods);
      setSchedules(cachedData.schedules || []);
      setPresets(cachedData.presets || []);
      setAssignments(cachedData.assignments || []);
      setNotes(cachedData.notes || []);
      const active = cachedData.studyPeriods.find((p) => p.is_active) || null;
      setActiveStudyPeriod(active);
      setLoading(false);
      return;
    }

    if (cachedData.loading && cachedData.loadPromise) {
      console.log('⏳ Загрузка уже в процессе');
      cachedData.loadPromise.then(() => {
        setStudyPeriods(cachedData.studyPeriods || []);
        setSchedules(cachedData.schedules || []);
        setPresets(cachedData.presets || []);
        setAssignments(cachedData.assignments || []);
        setNotes(cachedData.notes || []);
        const active = cachedData.studyPeriods?.find((p) => p.is_active) || null;
        setActiveStudyPeriod(active);
        setLoading(false);
      });
      return;
    }

    cachedData.userId = user.id;
    cachedData.loading = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Загружаем данные для user:', user.id);

        const [
          studyPeriodsRes,
          schedulesRes,
          presetsRes,
          assignmentsRes,
          notesRes,
        ] = await Promise.all([
          supabase.from('study_periods').select('*').eq('user_id', user.id),
          supabase.from('schedules').select('*').eq('user_id', user.id),
          supabase.from('presets').select('*').eq('user_id', user.id),
          supabase.from('assignments').select('*').eq('user_id', user.id),
          supabase.from('notes').select('*').eq('user_id', user.id),
        ]);

        const studyPeriodsData = studyPeriodsRes.data || [];
        const schedulesData = schedulesRes.data || [];
        const presetsData = presetsRes.data || [];
        const assignmentsData = assignmentsRes.data || [];
        const notesData = notesRes.data || [];

        // Загружаем расписание пресетов
        if (presetsData.length > 0) {
          const { data: presetSchedulesData } = await supabase
            .from('preset_schedules')
            .select('*')
            .in(
              'preset_id',
              presetsData.map((p) => p.id)
            );

          presetsData.forEach((preset) => {
            preset.schedules = presetSchedulesData?.filter((ps) => ps.preset_id === preset.id) || [];
          });
        }

        cachedData.studyPeriods = studyPeriodsData;
        cachedData.schedules = schedulesData;
        cachedData.presets = presetsData;
        cachedData.assignments = assignmentsData;
        cachedData.notes = notesData;
        cachedData.loading = false;

        setStudyPeriods(studyPeriodsData);
        setSchedules(schedulesData);
        setPresets(presetsData);
        setAssignments(assignmentsData);
        setNotes(notesData);

        const active = studyPeriodsData.find((p) => p.is_active) || null;
        setActiveStudyPeriod(active);

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
  }, [user]);

  // Study Periods Functions
  const createStudyPeriod = useCallback(
    async (period: Omit<StudyPeriod, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('study_periods')
        .insert([{ ...period, user_id: user.id }])
        .select();

      if (err) throw err;

      const newPeriod = data?.[0];
      if (newPeriod) {
        setStudyPeriods((prev) => [...prev, newPeriod]);
        if (cachedData.studyPeriods) {
          cachedData.studyPeriods = [...cachedData.studyPeriods, newPeriod];
        }
        if (period.is_active) {
          setActiveStudyPeriod(newPeriod);
        }
      }
      return newPeriod;
    },
    [user]
  );

  const updateStudyPeriod = useCallback(
    async (id: number, period: Partial<StudyPeriod>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('study_periods')
        .update(period)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (err) throw err;

      const updated = data?.[0];
      if (updated) {
        setStudyPeriods((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (cachedData.studyPeriods) {
          cachedData.studyPeriods = cachedData.studyPeriods.map((p) => (p.id === id ? updated : p));
        }
        if (updated.is_active) {
          setActiveStudyPeriod(updated);
        }
      }
      return updated;
    },
    [user]
  );

  

  const deleteStudyPeriod = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase
        .from('study_periods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (err) throw err;

      setStudyPeriods((prev) => prev.filter((p) => p.id !== id));
      if (cachedData.studyPeriods) {
        cachedData.studyPeriods = cachedData.studyPeriods.filter((p) => p.id !== id);
      }
      if (activeStudyPeriod?.id === id) {
        setActiveStudyPeriod(null);
      }
    },
    [user, activeStudyPeriod]
  );

  const setActiveStudyPeriodFn = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      // Отключаем все остальные периоды
      for (const period of studyPeriods) {
        await supabase
          .from('study_periods')
          .update({ is_active: period.id === id })
          .eq('id', period.id)
          .eq('user_id', user.id);
      }

      const active = studyPeriods.find((p) => p.id === id) || null;
      setActiveStudyPeriod(active);

      // Обновляем локальное состояние
      setStudyPeriods((prev) =>
        prev.map((p) => ({ ...p, is_active: p.id === id }))
      );
    },
    [user, studyPeriods]
  );

  // Schedule Functions
  const addSchedule = useCallback(
    async (schedule: Omit<Schedule, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('schedules')
        .insert([{ ...schedule, user_id: user.id }])
        .select();

      if (err) throw err;

      const newSchedule = data?.[0];
      if (newSchedule) {
        setSchedules((prev) => [...prev, newSchedule]);
        if (cachedData.schedules) {
          cachedData.schedules = [...cachedData.schedules, newSchedule];
        }
      }
      return newSchedule;
    },
    [user]
  );

  const updateSchedule = useCallback(
    async (id: number, schedule: Partial<Schedule>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('schedules')
        .update(schedule)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (err) throw err;

      const updated = data?.[0];
      if (updated) {
        setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
        if (cachedData.schedules) {
          cachedData.schedules = cachedData.schedules.map((s) => (s.id === id ? updated : s));
        }
      }
      return updated;
    },
    [user]
  );

  const deleteSchedule = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (err) throw err;

      setSchedules((prev) => prev.filter((s) => s.id !== id));
      if (cachedData.schedules) {
        cachedData.schedules = cachedData.schedules.filter((s) => s.id !== id);
      }
    },
    [user]
  );

  const getSchedulesByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return schedules.filter((s) => s.date >= startDate && s.date <= endDate);
    },
    [schedules]
  );

  // Preset Functions
  const addPreset = useCallback(
    async (preset: Omit<Preset, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('presets')
        .insert([{ ...preset, user_id: user.id }])
        .select();

      if (err) throw err;

      const newPreset = data?.[0];
      if (newPreset) {
        newPreset.schedules = [];
        setPresets((prev) => [...prev, newPreset]);
        if (cachedData.presets) {
          cachedData.presets = [...cachedData.presets, newPreset];
        }
      }
      return newPreset;
    },
    [user]
  );

  const updatePreset = useCallback(
    async (id: number, preset: Partial<Preset>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('presets')
        .update(preset)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (err) throw err;

      const updated = data?.[0];
      if (updated) {
        setPresets((prev) =>
          prev.map((p) => (p.id === id ? { ...updated, schedules: p.schedules } : p))
        );
        if (cachedData.presets) {
          cachedData.presets = cachedData.presets.map((p) =>
            p.id === id ? { ...updated, schedules: p.schedules } : p
          );
        }
      }
      return updated;
    },
    [user]
  );

  const deletePreset = useCallback(
    async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase.from('presets').delete().eq('id', id).eq('user_id', user.id);

      if (err) throw err;

      setPresets((prev) => prev.filter((p) => p.id !== id));
      if (cachedData.presets) {
        cachedData.presets = cachedData.presets.filter((p) => p.id !== id);
      }
    },
    [user]
  );

  const addPresetSchedule = useCallback(
  async (presetId: number, schedule: Omit<PresetSchedule, 'id'>) => {
    const { data, error: err } = await supabase
      .from('preset_schedules')
      .insert([{ 
        ...schedule, 
        preset_id: presetId,
        is_important: schedule.is_important || false // Добавьте эту строку
      }])
      .select();

    if (err) throw err;

    const newSchedule = data?.[0];
    if (newSchedule) {
      setPresets((prev) =>
        prev.map((p) =>
          p.id === presetId
            ? { ...p, schedules: [...(p.schedules || []), newSchedule] }
            : p
        )
      );
    }
    return newSchedule;
  },
  []
);

  const deletePresetSchedule = useCallback(async (scheduleId: number) => {
    const { error: err } = await supabase.from('preset_schedules').delete().eq('id', scheduleId);

    if (err) throw err;

    setPresets((prev) =>
      prev.map((p) => ({
        ...p,
        schedules: (p.schedules || []).filter((s) => s.id !== scheduleId),
      }))
    );
  }, []);

  const applyPreset = useCallback(
  async (presetId: number, startDate: string) => {
    if (!user) throw new Error('User not authenticated');

    const preset = presets.find((p) => p.id === presetId);
    if (!preset || !preset.schedules) throw new Error('Preset not found');

    const startDateObj = new Date(startDate);
    const dayOfWeekStart = startDateObj.getDay() === 0 ? 6 : startDateObj.getDay() - 1;

    for (const presetSchedule of preset.schedules) {
      const dayDiff = (presetSchedule.day_of_week - dayOfWeekStart + 7) % 7;
      const scheduleDate = new Date(startDate);
      scheduleDate.setDate(scheduleDate.getDate() + dayDiff);

      await addSchedule({
        user_id: user.id,
        subject_name: presetSchedule.subject_name,
        date: scheduleDate.toISOString().split('T')[0],
        start_time: presetSchedule.start_time,
        end_time: presetSchedule.end_time,
        room: presetSchedule.room,
        color: presetSchedule.color,
        is_important: presetSchedule.is_important || false, // Добавьте эту строку
      });
    }
  },
  [user, presets, addSchedule]
);

  // Assignment Functions
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

      const { error: err } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (err) throw err;

      setAssignments((prev) => prev.filter((a) => a.id !== id));
      if (cachedData.assignments) {
        cachedData.assignments = cachedData.assignments.filter((a) => a.id !== id);
      }
    },
    [user]
  );

  // Note Functions
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

  const value: DataContextType = {
    studyPeriods,
    activeStudyPeriod,
    createStudyPeriod,
    updateStudyPeriod,
    deleteStudyPeriod,
    setActiveStudyPeriod: setActiveStudyPeriodFn,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByDateRange,
    presets,
    addPreset,
    updatePreset,
    deletePreset,
    addPresetSchedule,
    deletePresetSchedule,
    applyPreset,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    notes,
    addNote,
    updateNote,
    deleteNote,
    loading,
    error,
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
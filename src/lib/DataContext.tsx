"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";
import {
  Assignment,
  Note,
  Schedule,
  Preset,
  StudyPeriod,
  PresetSchedule,
  Attachment,
  Timing,
} from "@/src/types";

const DEFAULT_TIMINGS: Omit<
  Timing,
  "id" | "user_id" | "created_at" | "updated_at"
>[] = [
  { label: "1 пара", start_time: "09:00", end_time: "10:35", sort_order: 0 },
  { label: "2 пара", start_time: "10:45", end_time: "12:20", sort_order: 1 },
  { label: "3 пара", start_time: "13:00", end_time: "14:35", sort_order: 2 },
  { label: "4 пара", start_time: "14:45", end_time: "16:20", sort_order: 3 },
  { label: "5 пара", start_time: "16:30", end_time: "18:05", sort_order: 4 },
  { label: "6 пара", start_time: "18:15", end_time: "19:50", sort_order: 5 },
  { label: "7 пара", start_time: "20:00", end_time: "21:35", sort_order: 6 },
  { label: "8 пара", start_time: "21:45", end_time: "23:20", sort_order: 7 },
];

interface DataContextType {
  studyPeriods: StudyPeriod[];
  activeStudyPeriod: StudyPeriod | null;
  createStudyPeriod: (period: Omit<StudyPeriod, "id">) => Promise<StudyPeriod>;
  updateStudyPeriod: (
    id: number,
    period: Partial<StudyPeriod>,
  ) => Promise<StudyPeriod>;
  deleteStudyPeriod: (id: number) => Promise<void>;
  setActiveStudyPeriod: (id: number) => Promise<void>;

  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, "id">) => Promise<Schedule>;
  updateSchedule: (
    id: number,
    schedule: Partial<Schedule>,
  ) => Promise<Schedule>;
  deleteSchedule: (id: number) => Promise<void>;
  getSchedulesByDateRange: (startDate: string, endDate: string) => Schedule[];

  presets: Preset[];
  addPreset: (preset: Omit<Preset, "id">) => Promise<Preset>;
  updatePreset: (id: number, preset: Partial<Preset>) => Promise<Preset>;
  deletePreset: (id: number) => Promise<void>;
  addPresetSchedule: (
    presetId: number,
    schedule: Omit<PresetSchedule, "id">,
  ) => Promise<PresetSchedule>;
  deletePresetSchedule: (scheduleId: number) => Promise<void>;
  applyPreset: (presetId: number, startDate: string) => Promise<void>;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, "id">) => Promise<Assignment>;
  updateAssignment: (
    id: number,
    assignment: Partial<Assignment>,
  ) => Promise<Assignment>;
  deleteAssignment: (id: number) => Promise<void>;

  notes: Note[];
  addNote: (note: Omit<Note, "id">) => Promise<Note>;
  updateNote: (id: number, note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;

  attachments: Attachment[];
  addAttachment: (noteId: number, file: File) => Promise<Attachment>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
  getNoteAttachments: (noteId: number) => Attachment[];
  uploadingFiles: boolean;

  // Timings
  timings: Timing[];
  addTiming: (timing: Omit<Timing, "id" | "user_id">) => Promise<Timing>;
  updateTiming: (id: number, timing: Partial<Timing>) => Promise<Timing>;
  deleteTiming: (id: number) => Promise<void>;
  resetTimingsToDefault: () => Promise<void>;

  loading: boolean;
  error: string | null;

  // Новая функция для принудительного обновления данных
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

let cachedData = {
  userId: null as string | null,
  studyPeriods: null as StudyPeriod[] | null,
  schedules: null as Schedule[] | null,
  presets: null as Preset[] | null,
  assignments: null as Assignment[] | null,
  notes: null as Note[] | null,
  attachments: null as Attachment[] | null,
  timings: null as Timing[] | null,
  loading: false,
  loadPromise: null as Promise<void> | null,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [studyPeriods, setStudyPeriods] = useState<StudyPeriod[]>([]);
  const [activeStudyPeriod, setActiveStudyPeriodState] =
    useState<StudyPeriod | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [timings, setTimings] = useState<Timing[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки данных
  const loadData = useCallback(
    async (skipCache: boolean = false) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        console.log(
          "🔄 Загружаем данные для user:",
          user.id,
          skipCache ? "(принудительно)" : "",
        );

        const [
          studyPeriodsRes,
          schedulesRes,
          presetsRes,
          assignmentsRes,
          notesRes,
          timingsRes,
        ] = await Promise.all([
          supabase.from("study_periods").select("*").eq("user_id", user.id),
          supabase.from("schedules").select("*").eq("user_id", user.id),
          supabase.from("presets").select("*").eq("user_id", user.id),
          supabase.from("assignments").select("*").eq("user_id", user.id),
          supabase.from("notes").select("*").eq("user_id", user.id),
          supabase
            .from("timings")
            .select("*")
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true }),
        ]);

        const studyPeriodsData = studyPeriodsRes.data || [];
        const schedulesData = schedulesRes.data || [];
        const presetsData = presetsRes.data || [];
        const assignmentsData = assignmentsRes.data || [];
        const notesData = notesRes.data || [];
        let timingsData: Timing[] = timingsRes.data || [];

        // Seed default timings if user has none
        if (timingsData.length === 0) {
          const toInsert = DEFAULT_TIMINGS.map((t) => ({
            ...t,
            user_id: user.id,
          }));
          const { data: seeded } = await supabase
            .from("timings")
            .insert(toInsert)
            .select();
          timingsData = seeded || [];
        }

        if (presetsData.length > 0) {
          const { data: presetSchedulesData } = await supabase
            .from("preset_schedules")
            .select("*")
            .in(
              "preset_id",
              presetsData.map((p) => p.id),
            );

          presetsData.forEach((preset) => {
            preset.schedules =
              presetSchedulesData?.filter((ps) => ps.preset_id === preset.id) ||
              [];
          });
        }

        let attachmentsData: Attachment[] = [];
        if (notesData.length > 0) {
          const { data: attachmentsRes } = await supabase
            .from("attachments")
            .select("*")
            .in(
              "note_id",
              notesData.map((n) => n.id),
            );
          attachmentsData = attachmentsRes || [];
        }

        // Обновляем кеш только если не принудительная перезагрузка
        if (!skipCache) {
          cachedData.studyPeriods = studyPeriodsData;
          cachedData.schedules = schedulesData;
          cachedData.presets = presetsData;
          cachedData.assignments = assignmentsData;
          cachedData.notes = notesData;
          cachedData.attachments = attachmentsData;
          cachedData.timings = timingsData;
          cachedData.loading = false;
        }

        setStudyPeriods(studyPeriodsData);
        setSchedules(schedulesData);
        setPresets(presetsData);
        setAssignments(assignmentsData);
        setNotes(notesData);
        setAttachments(attachmentsData);
        setTimings(timingsData);

        const active = studyPeriodsData.find((p) => p.is_active) || null;
        setActiveStudyPeriodState(active);

        console.log("✅ Данные загружены успешно");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Ошибка загрузки";
        setError(message);
        console.error("❌ Ошибка:", err);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  // Функция для принудительного обновления данных (очищает кеш)
  const refreshData = useCallback(async () => {
    if (!user) return;

    // Очищаем кеш
    cachedData = {
      userId: null,
      studyPeriods: null,
      schedules: null,
      presets: null,
      assignments: null,
      notes: null,
      attachments: null,
      timings: null,
      loading: false,
      loadPromise: null,
    };

    // Загружаем данные заново
    await loadData(true);
  }, [user, loadData]);

  useEffect(() => {
    if (!user) {
      cachedData = {
        userId: null,
        studyPeriods: null,
        schedules: null,
        presets: null,
        assignments: null,
        notes: null,
        attachments: null,
        timings: null,
        loading: false,
        loadPromise: null,
      };
      setStudyPeriods([]);
      setActiveStudyPeriodState(null);
      setSchedules([]);
      setPresets([]);
      setAssignments([]);
      setNotes([]);
      setAttachments([]);
      setTimings([]);
      setLoading(false);
      return;
    }

    if (cachedData.userId === user.id && cachedData.studyPeriods !== null) {
      console.log("💾 Используем кешированные данные");
      setStudyPeriods(cachedData.studyPeriods);
      setSchedules(cachedData.schedules || []);
      setPresets(cachedData.presets || []);
      setAssignments(cachedData.assignments || []);
      setNotes(cachedData.notes || []);
      setAttachments(cachedData.attachments || []);
      setTimings(cachedData.timings || []);
      const active = cachedData.studyPeriods.find((p) => p.is_active) || null;
      setActiveStudyPeriodState(active);
      setLoading(false);
      return;
    }

    if (cachedData.loading && cachedData.loadPromise) {
      console.log("⏳ Загрузка уже в процессе");
      cachedData.loadPromise.then(() => {
        setStudyPeriods(cachedData.studyPeriods || []);
        setSchedules(cachedData.schedules || []);
        setPresets(cachedData.presets || []);
        setAssignments(cachedData.assignments || []);
        setNotes(cachedData.notes || []);
        setAttachments(cachedData.attachments || []);
        setTimings(cachedData.timings || []);
        const active =
          cachedData.studyPeriods?.find((p) => p.is_active) || null;
        setActiveStudyPeriodState(active);
        setLoading(false);
      });
      return;
    }

    cachedData.userId = user.id;
    cachedData.loading = true;

    const promise = loadData(false);
    cachedData.loadPromise = promise;
  }, [user, loadData]);

  // ─── Study Periods ──────────────────────────────────────────────────────────

  const createStudyPeriod = useCallback(
    async (period: Omit<StudyPeriod, "id">) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("study_periods")
        .insert([{ ...period, user_id: user.id }])
        .select();
      if (err) throw err;
      const newPeriod = data?.[0];
      if (newPeriod) {
        setStudyPeriods((prev) => [...prev, newPeriod]);
        if (cachedData.studyPeriods)
          cachedData.studyPeriods = [...cachedData.studyPeriods, newPeriod];
        if (period.is_active) setActiveStudyPeriodState(newPeriod);
      }
      return newPeriod;
    },
    [user],
  );

  const updateStudyPeriod = useCallback(
    async (id: number, period: Partial<StudyPeriod>) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("study_periods")
        .update(period)
        .eq("id", id)
        .eq("user_id", user.id)
        .select();
      if (err) throw err;
      const updated = data?.[0];
      if (updated) {
        setStudyPeriods((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (cachedData.studyPeriods)
          cachedData.studyPeriods = cachedData.studyPeriods.map((p) =>
            p.id === id ? updated : p,
          );
        if (updated.is_active) setActiveStudyPeriodState(updated);
      }
      return updated;
    },
    [user],
  );

  const deleteStudyPeriod = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");

      // Сначала удаляем все расписания, связанные с этим периодом
      const { error: schedulesError } = await supabase
        .from("schedules")
        .delete()
        .eq("study_period_id", id)
        .eq("user_id", user.id);

      if (schedulesError) throw schedulesError;

      // Затем удаляем сам период
      const { error: err } = await supabase
        .from("study_periods")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (err) throw err;

      setStudyPeriods((prev) => prev.filter((p) => p.id !== id));
      if (cachedData.studyPeriods)
        cachedData.studyPeriods = cachedData.studyPeriods.filter(
          (p) => p.id !== id,
        );

      // Очищаем расписание из состояния
      setSchedules((prev) => prev.filter((s) => s.study_period_id !== id));
      if (cachedData.schedules)
        cachedData.schedules = cachedData.schedules.filter(
          (s) => s.study_period_id !== id,
        );

      setActiveStudyPeriodState((prev) => (prev?.id === id ? null : prev));
    },
    [user],
  );

  const setActiveStudyPeriod = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      for (const period of studyPeriods) {
        await supabase
          .from("study_periods")
          .update({ is_active: period.id === id })
          .eq("id", period.id)
          .eq("user_id", user.id);
      }
      const active = studyPeriods.find((p) => p.id === id) || null;
      setActiveStudyPeriodState(active);
      setStudyPeriods((prev) =>
        prev.map((p) => ({ ...p, is_active: p.id === id })),
      );
    },
    [user, studyPeriods],
  );

  // ─── Schedules ──────────────────────────────────────────────────────────────

  const addSchedule = useCallback(
    async (schedule: Omit<Schedule, "id">) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("schedules")
        .insert([{ ...schedule, user_id: user.id }])
        .select();
      if (err) throw err;
      const newSchedule = data?.[0];
      if (newSchedule) {
        setSchedules((prev) => [...prev, newSchedule]);
        if (cachedData.schedules)
          cachedData.schedules = [...cachedData.schedules, newSchedule];
      }
      return newSchedule;
    },
    [user],
  );

  const updateSchedule = useCallback(
    async (id: number, schedule: Partial<Schedule>) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("schedules")
        .update(schedule)
        .eq("id", id)
        .eq("user_id", user.id)
        .select();
      if (err) throw err;
      const updated = data?.[0];
      if (updated) {
        setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
        if (cachedData.schedules)
          cachedData.schedules = cachedData.schedules.map((s) =>
            s.id === id ? updated : s,
          );
      }
      return updated;
    },
    [user],
  );

  const deleteSchedule = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error: err } = await supabase
        .from("schedules")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (err) throw err;
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      if (cachedData.schedules)
        cachedData.schedules = cachedData.schedules.filter((s) => s.id !== id);
    },
    [user],
  );

  const getSchedulesByDateRange = useCallback(
    (startDate: string, endDate: string) =>
      schedules.filter((s) => s.date >= startDate && s.date <= endDate),
    [schedules],
  );

  // ─── Presets ────────────────────────────────────────────────────────────────

  const addPreset = useCallback(
    async (preset: Omit<Preset, "id">) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("presets")
        .insert([{ ...preset, user_id: user.id }])
        .select();
      if (err) throw err;
      const newPreset = data?.[0];
      if (newPreset) {
        newPreset.schedules = [];
        setPresets((prev) => [...prev, newPreset]);
        if (cachedData.presets)
          cachedData.presets = [...cachedData.presets, newPreset];
      }
      return newPreset;
    },
    [user],
  );

  const updatePreset = useCallback(
    async (id: number, preset: Partial<Preset>) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("presets")
        .update(preset)
        .eq("id", id)
        .eq("user_id", user.id)
        .select();
      if (err) throw err;
      const updated = data?.[0];
      if (updated) {
        setPresets((prev) =>
          prev.map((p) =>
            p.id === id ? { ...updated, schedules: p.schedules } : p,
          ),
        );
        if (cachedData.presets)
          cachedData.presets = cachedData.presets.map((p) =>
            p.id === id ? { ...updated, schedules: p.schedules } : p,
          );
      }
      return updated;
    },
    [user],
  );

  const deletePreset = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error: err } = await supabase
        .from("presets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (err) throw err;
      setPresets((prev) => prev.filter((p) => p.id !== id));
      if (cachedData.presets)
        cachedData.presets = cachedData.presets.filter((p) => p.id !== id);
    },
    [user],
  );

  const addPresetSchedule = useCallback(
    async (presetId: number, schedule: Omit<PresetSchedule, "id">) => {
      const { data, error: err } = await supabase
        .from("preset_schedules")
        .insert([{ ...schedule, preset_id: presetId }])
        .select();
      if (err) throw err;
      const newSchedule = data?.[0];
      if (newSchedule) {
        setPresets((prev) =>
          prev.map((p) =>
            p.id === presetId
              ? { ...p, schedules: [...(p.schedules || []), newSchedule] }
              : p,
          ),
        );
      }
      return newSchedule;
    },
    [],
  );

  const deletePresetSchedule = useCallback(async (scheduleId: number) => {
    const { error: err } = await supabase
      .from("preset_schedules")
      .delete()
      .eq("id", scheduleId);
    if (err) throw err;
    setPresets((prev) =>
      prev.map((p) => ({
        ...p,
        schedules: (p.schedules || []).filter((s) => s.id !== scheduleId),
      })),
    );
  }, []);

  const applyPreset = useCallback(
    async (presetId: number, startDate: string) => {
      if (!user) throw new Error("User not authenticated");
      const activePeriod = studyPeriods.find((p) => p.is_active);
      if (!activePeriod) throw new Error("No active study period found");
      const preset = presets.find((p) => p.id === presetId);
      if (!preset?.schedules) throw new Error("Preset not found");
      const startDateObj = new Date(startDate);
      const dayOfWeekStart =
        startDateObj.getDay() === 0 ? 6 : startDateObj.getDay() - 1;
      for (const presetSchedule of preset.schedules) {
        const dayDiff = (presetSchedule.day_of_week - dayOfWeekStart + 7) % 7;
        const scheduleDate = new Date(startDate);
        scheduleDate.setDate(scheduleDate.getDate() + dayDiff);
        await addSchedule({
          user_id: user.id,
          study_period_id: activePeriod.id,
          subject_name: presetSchedule.subject_name,
          date: scheduleDate.toISOString().split("T")[0],
          start_time: presetSchedule.start_time,
          end_time: presetSchedule.end_time,
          room: presetSchedule.room,
          color: presetSchedule.color,
          is_important: presetSchedule.is_important || false,
        });
      }
    },
    [user, presets, addSchedule, studyPeriods],
  );

  // ─── Assignments ────────────────────────────────────────────────────────────

  const addAssignment = useCallback(
    async (assignment: Omit<Assignment, "id">) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("assignments")
        .insert([{ ...assignment, user_id: user.id }])
        .select();
      if (err) throw err;
      const newAssignment = data?.[0];
      if (newAssignment) {
        setAssignments((prev) => [...prev, newAssignment]);
        if (cachedData.assignments)
          cachedData.assignments = [...cachedData.assignments, newAssignment];
      }
      return newAssignment;
    },
    [user],
  );

  const updateAssignment = useCallback(
    async (id: number, assignment: Partial<Assignment>) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("assignments")
        .update(assignment)
        .eq("id", id)
        .eq("user_id", user.id)
        .select();
      if (err) throw err;
      const updated = data?.[0];
      if (updated) {
        setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
        if (cachedData.assignments)
          cachedData.assignments = cachedData.assignments.map((a) =>
            a.id === id ? updated : a,
          );
      }
      return updated;
    },
    [user],
  );

  const deleteAssignment = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error: err } = await supabase
        .from("assignments")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (err) throw err;
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      if (cachedData.assignments)
        cachedData.assignments = cachedData.assignments.filter(
          (a) => a.id !== id,
        );
    },
    [user],
  );

  // ─── Notes ──────────────────────────────────────────────────────────────────

  const addNote = useCallback(
    async (note: Omit<Note, "id">) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("notes")
        .insert([{ ...note, user_id: user.id }])
        .select();
      if (err) throw err;
      const newNote = data?.[0];
      if (newNote) {
        setNotes((prev) => [...prev, newNote]);
        if (cachedData.notes) cachedData.notes = [...cachedData.notes, newNote];
      }
      return newNote;
    },
    [user],
  );

  const updateNote = useCallback(
    async (id: number, note: Partial<Note>) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("notes")
        .update(note)
        .eq("id", id)
        .eq("user_id", user.id)
        .select();
      if (err) throw err;
      const updated = data?.[0];
      if (updated) {
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        if (cachedData.notes)
          cachedData.notes = cachedData.notes.map((n) =>
            n.id === id ? updated : n,
          );
      }
      return updated;
    },
    [user],
  );

  const deleteNote = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error: err } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (err) throw err;
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (cachedData.notes)
        cachedData.notes = cachedData.notes.filter((n) => n.id !== id);
    },
    [user],
  );

  // ─── Attachments ────────────────────────────────────────────────────────────

  const addAttachment = useCallback(
    async (noteId: number, file: File): Promise<Attachment> => {
      if (!user) throw new Error("User not authenticated");
      setUploadingFiles(true);
      try {
        if (file.size > 10 * 1024 * 1024)
          throw new Error("Файл слишком большой. Максимальный размер 10MB");
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${noteId}/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("note-attachments")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("note-attachments").getPublicUrl(filePath);
        const { data: attachmentData, error: dbError } = await supabase
          .from("attachments")
          .insert([
            {
              note_id: noteId,
              file_name: file.name,
              file_url: publicUrl,
              file_type: file.type.startsWith("image/") ? "image" : "document",
              file_size: file.size,
              mime_type: file.type,
            },
          ])
          .select()
          .single();
        if (dbError) throw dbError;
        setAttachments((prev) => [...prev, attachmentData]);
        if (cachedData.attachments)
          cachedData.attachments = [...cachedData.attachments, attachmentData];
        return attachmentData;
      } finally {
        setUploadingFiles(false);
      }
    },
    [user],
  );

  const deleteAttachment = useCallback(
    async (attachmentId: string) => {
      if (!user) throw new Error("User not authenticated");
      const attachment = attachments.find((a) => a.id === attachmentId);
      if (!attachment) throw new Error("Attachment not found");
      const filePath = attachment.file_url.split("/").slice(-3).join("/");
      await supabase.storage.from("note-attachments").remove([filePath]);
      const { error: dbError } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachmentId);
      if (dbError) throw dbError;
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      if (cachedData.attachments)
        cachedData.attachments = cachedData.attachments.filter(
          (a) => a.id !== attachmentId,
        );
    },
    [user, attachments],
  );

  const getNoteAttachments = useCallback(
    (noteId: number) => attachments.filter((a) => a.note_id === noteId),
    [attachments],
  );

  // ─── Timings ────────────────────────────────────────────────────────────────

  const addTiming = useCallback(
    async (timing: Omit<Timing, "id" | "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      if (timings.length >= 8) throw new Error("Максимум 8 пар");
      const { data, error: err } = await supabase
        .from("timings")
        .insert([{ ...timing, user_id: user.id }])
        .select()
        .single();
      if (err) throw err;
      setTimings((prev) =>
        [...prev, data].sort((a, b) => a.sort_order - b.sort_order),
      );
      if (cachedData.timings)
        cachedData.timings = [...cachedData.timings, data].sort(
          (a, b) => a.sort_order - b.sort_order,
        );
      return data;
    },
    [user, timings],
  );

  const updateTiming = useCallback(
    async (id: number, timing: Partial<Timing>) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error: err } = await supabase
        .from("timings")
        .update(timing)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (err) throw err;
      setTimings((prev) =>
        prev
          .map((t) => (t.id === id ? data : t))
          .sort((a, b) => a.sort_order - b.sort_order),
      );
      if (cachedData.timings)
        cachedData.timings = cachedData.timings
          .map((t) => (t.id === id ? data : t))
          .sort((a, b) => a.sort_order - b.sort_order);
      return data;
    },
    [user],
  );

  const deleteTiming = useCallback(
    async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error: err } = await supabase
        .from("timings")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (err) throw err;
      setTimings((prev) => prev.filter((t) => t.id !== id));
      if (cachedData.timings)
        cachedData.timings = cachedData.timings.filter((t) => t.id !== id);
    },
    [user],
  );

  const resetTimingsToDefault = useCallback(async () => {
    if (!user) throw new Error("User not authenticated");
    // Delete all existing timings
    await supabase.from("timings").delete().eq("user_id", user.id);
    // Insert defaults
    const toInsert = DEFAULT_TIMINGS.map((t) => ({ ...t, user_id: user.id }));
    const { data, error: err } = await supabase
      .from("timings")
      .insert(toInsert)
      .select();
    if (err) throw err;
    const sorted = (data || []).sort((a, b) => a.sort_order - b.sort_order);
    setTimings(sorted);
    if (cachedData.timings) cachedData.timings = sorted;
  }, [user]);

  // ─── Context value ──────────────────────────────────────────────────────────

  const value: DataContextType = {
    studyPeriods,
    activeStudyPeriod,
    createStudyPeriod,
    updateStudyPeriod,
    deleteStudyPeriod,
    setActiveStudyPeriod,
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
    attachments,
    addAttachment,
    deleteAttachment,
    getNoteAttachments,
    uploadingFiles,
    timings,
    addTiming,
    updateTiming,
    deleteTiming,
    resetTimingsToDefault,
    loading,
    error,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context)
    throw new Error("useData должен использоваться внутри DataProvider");
  return context;
}

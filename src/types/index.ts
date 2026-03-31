// src/types/index.ts

export type StudyPeriod = {
  id: number;
  user_id: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Schedule = {
  id: number;
  user_id: string;
  study_period_id?: number;
  subject_name: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  room?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
};

export type PresetSchedule = {
  id: number;
  preset_id: number;
  subject_name: string;
  day_of_week: number; // 0-6, где 0=Пн, 1=Вт и т.д.
  start_time: string;
  end_time: string;
  room?: string;
  color?: string;
};

export type Preset = {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  schedules?: PresetSchedule[];
  created_at?: string;
  updated_at?: string;
};

export type Subject = {
  id: number;
  name: string;
  teacher: string;
  room: string;
  time: string;
  day: string;
  color: string;
};

export type Assignment = {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
};

export type Note = {
  id: number;
  title: string;
  subject: string;
  content: string;
  date: string;
};
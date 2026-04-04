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

export interface Schedule {
  id: number;
  user_id: string;
  subject_name: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string | null;
  color: string;
  is_important?: boolean; // Добавьте эту строку
  study_period_id: number;
  created_at?: string;
}

// Также добавьте в PresetSchedule если нужно
export interface PresetSchedule {
  id: number;
  preset_id: number;
  day_of_week: number;
  subject_name: string;
  start_time: string;
  end_time: string;
  room: string | null;
  color: string;
  is_important?: boolean; // Добавьте эту строку (опционально)
}

export type Preset = {
  id: number;
  user_id?: string;
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
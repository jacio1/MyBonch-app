export type StudyPeriod = {
  id: number;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
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
  is_important?: boolean;
  study_period_id: number;
  created_at?: string;
}

export interface PresetSchedule {
  id: number;
  preset_id: number;
  day_of_week: number;
  subject_name: string;
  start_time: string;
  end_time: string;
  room: string | null;
  color: string;
  is_important?: boolean;
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
  priority: 'high' | 'medium' | 'low';
};

export type Attachment = {
  id: string;
  note_id: number;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'document';
  file_size: number;
  mime_type: string;
  created_at: string;
};

export type Note = {
  id: number;
  title: string;
  subject: string;
  content: string;
  date: string;
  user_id?: string;
  attachments?: Attachment[];
};

export type Timing = {
  id: number;
  user_id: string;
  label: string;      // "1 пара"
  start_time: string; // "09:00"
  end_time: string;   // "10:35"
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
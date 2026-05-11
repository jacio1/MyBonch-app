import { Schedule} from '@/src/types';

export interface ScheduleFormData {
  date: string;
  subject_name: string;
  start_time: string;
  end_time: string;
  room: string;
  color: string;
  is_important: boolean;
}

export interface PeriodFormData {
  name: string;
  start_date: string;
  end_date: string;
}

export interface ApplyPresetFormData {
  preset_id: string;
  start_date: string;
}

export interface ErrorModalData {
  title: string;
  message: string;
  conflictSchedule: Schedule | null;
}

export interface WeekDay {
  date: Date;
  dateStr: string;
  dayName: string;
}


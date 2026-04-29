import { Schedule } from '@/src/types';

export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

export const isTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  return (
    (start1 >= start2 && start1 < end2) ||
    (end1 > start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
};

export const checkTimeOverlap = (
  schedules: Schedule[],
  date: string,
  startTime: string,
  endTime: string,
  excludeScheduleId?: number,
): { overlaps: boolean; overlappingSchedule?: Schedule } => {
  const schedulesOnDate = schedules.filter(
    (s) => s.date === date && s.id !== excludeScheduleId,
  );

  for (const schedule of schedulesOnDate) {
    if (isTimeOverlap(startTime, endTime, schedule.start_time, schedule.end_time)) {
      return { overlaps: true, overlappingSchedule: schedule };
    }
  }

  return { overlaps: false };
};

export const getWeekDays = (weekStart: Date) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

export const getCurrentWeekStart = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(today.setDate(diff));
};
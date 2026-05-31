import { ScheduleCard } from './ScheduleCard';
import { Plus } from 'lucide-react';
import { Schedule } from '@/src/types';
import { DAYS_RU } from '@/src/constants/schedule';

interface WeekScheduleProps {
  weekDays: Date[];
  schedulesByDate: { [key: string]: Schedule[] };
  onAddSchedule: (date: string) => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: number) => void;
}

export const WeekSchedule = ({
  weekDays,
  schedulesByDate,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
}: WeekScheduleProps) => {
  return (
    <div className="space-y-6">
      {weekDays.map((day) => {
        const dateStr = day.toISOString().split("T")[0];
        const daySchedules = schedulesByDate[dateStr] || [];
        const dayName = DAYS_RU[day.getDay() === 0 ? 6 : day.getDay() - 1];

        return (
          <div key={dateStr}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
              {dayName}, {day.toLocaleDateString("ru-RU")}
            </h3>

            {daySchedules.length > 0 && (
              <div className="space-y-3 mb-3">
                {daySchedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => onEditSchedule(schedule)}
                    onDelete={() => onDeleteSchedule(schedule.id)}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => onAddSchedule(dateStr)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400 text-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition flex justify-center items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Добавить пару</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
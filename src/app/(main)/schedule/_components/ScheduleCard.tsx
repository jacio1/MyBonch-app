import { Clock, MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { Schedule } from '@/src/types';
import { formatTime } from '@/src/utils/schedule';

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: () => void;
  onDelete: () => void;
}

export const ScheduleCard = ({ schedule, onEdit, onDelete }: ScheduleCardProps) => {
  return (
    <div
      className={`${schedule.color} rounded-lg border p-4 hover:shadow-md transition ${
        schedule.is_important ? "ring-2 ring-yellow-500" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {schedule.is_important && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              {schedule.subject_name}
            </h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </span>
            {schedule.room && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {schedule.room}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition ml-2 shrink-0"
            title="Редактировать"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition ml-2 shrink-0"
            title="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
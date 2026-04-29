import { AlertTriangle } from 'lucide-react';
import { Schedule } from '@/src/types';
import { formatTime } from '@/src/utils/schedule';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  conflictSchedule?: Schedule | null;
}

export const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
  conflictSchedule,
}: ErrorModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {message}
          </p>
          {conflictSchedule && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Конфликтующая пара:
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                📚 {conflictSchedule.subject_name}
                <br />⏰ {formatTime(conflictSchedule.start_time)} -{" "}
                {formatTime(conflictSchedule.end_time)}
                <br />
                📅 {conflictSchedule.date}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
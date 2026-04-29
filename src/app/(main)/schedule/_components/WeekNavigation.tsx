import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigationProps {
  currentWeekStart: Date;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onCurrent: () => void;
  weekDays: Date[];
}

export const WeekNavigation = ({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onCurrent,
  weekDays,
}: WeekNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Пред. неделя
        </button>

        <button
          onClick={onCurrent}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition text-indigo-700 dark:text-indigo-400"
        >
          Текущая неделя
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white text-center">
        {weekDays[0].toLocaleDateString("ru-RU", { day: "numeric", month: "short" })} -{" "}
        {weekDays[6].toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
      </h3>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 dark:text-gray-300"
      >
        След. неделя
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
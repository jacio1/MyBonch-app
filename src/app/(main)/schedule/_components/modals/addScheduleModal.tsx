import { X, Clock, Star } from 'lucide-react';
import { Timing } from '@/src/types';
import { ScheduleFormData } from '@/src/types/schedule';
import { formatTime } from '@/src/utils/schedule';
import { COLORS } from '@/src/constants/schedule';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  activeStudyPeriod: { start_date: string; end_date: string } | null;
  formData: ScheduleFormData;
  onFormChange: (data: ScheduleFormData) => void;
  editingId?: number;
  timings: Timing[];
}

export const AddScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  activeStudyPeriod,
  formData,
  onFormChange,
  editingId,
  timings,
}: AddScheduleModalProps) => {
  if (!isOpen) return null;

  const hasTimings = timings && timings.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm m-0"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingId ? "Редактировать пару" : "Добавить пару"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Дата
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => onFormChange({ ...formData, date: e.target.value })}
              min={activeStudyPeriod?.start_date}
              max={activeStudyPeriod?.end_date}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Предмет
            </label>
            <input
              type="text"
              placeholder="Название"
              value={formData.subject_name}
              onChange={(e) => onFormChange({ ...formData, subject_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Время пары
            </label>
            {hasTimings ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {timings.map((t) => {
                    const isSelected = formData.start_time === t.start_time && formData.end_time === t.end_time;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          onFormChange({
                            ...formData,
                            start_time: t.start_time,
                            end_time: t.end_time,
                          })
                        }
                        className={`px-3 py-2.5 rounded-lg border text-left transition ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500"
                        }`}
                      >
                        <p className="text-xs font-semibold">{t.label}</p>
                        <p className="text-xs opacity-75 mt-0.5">
                          {formatTime(t.start_time)} — {formatTime(t.end_time)}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {formData.start_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Выбрано: {formatTime(formData.start_time)} — {formatTime(formData.end_time)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Начало
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => onFormChange({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Конец
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => onFormChange({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Аудитория
            </label>
            <input
              type="text"
              placeholder="Например: 101"
              value={formData.room}
              onChange={(e) => onFormChange({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Избранная пара
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onFormChange({ ...formData, is_important: !formData.is_important })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  formData.is_important
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Star className={`h-4 w-4 ${formData.is_important ? "fill-current" : ""}`} />
                {formData.is_important ? "Избранная" : "Обычная"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Цвет
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onFormChange({ ...formData, color })}
                  className={`h-10 rounded-lg border-2 transition ${
                    formData.color === color
                      ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800"
                      : "border-transparent hover:scale-105"
                  }`}
                >
                  <div className={`w-full h-full rounded ${color.split(" ")[0]} opacity-70`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50 transition"
            >
              {editingId ? "Сохранить изменения" : "Добавить пару"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
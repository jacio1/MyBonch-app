import { X } from 'lucide-react';
import { Preset } from '@/src/types';
import { ApplyPresetFormData } from '@/src/types/schedule';

interface ApplyPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  formData: ApplyPresetFormData & { presets: Preset[] };
  onFormChange: (data: ApplyPresetFormData) => void;
  activeStudyPeriod: { start_date: string; end_date: string } | null;
}

export const ApplyPresetModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  activeStudyPeriod,
}: ApplyPresetModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="m-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Применить шаблон
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
              Выберите шаблон
            </label>
            <select
              value={formData.preset_id}
              onChange={(e) => onFormChange({ ...formData, preset_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            >
              <option value="">Выберите шаблон</option>
              {formData.presets?.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.schedules?.length || 0} пар)
                </option>
              ))}
            </select>
          </div>

          {activeStudyPeriod && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                 Шаблон будет применен на весь период обучения:
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {new Date(activeStudyPeriod.start_date).toLocaleDateString("ru-RU")} -{" "}
                {new Date(activeStudyPeriod.end_date).toLocaleDateString("ru-RU")}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50 transition"
            >
              {isSubmitting ? "Применение..." : "Применить"}
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
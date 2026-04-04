'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Loader,
  BookOpen,
  Clock,
  MapPin,
  Trash2,
  X,
  Save,
  Edit2,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { useData } from '@/src/lib/DataContext';
import { useAuth } from '@/src/lib/AuthContext';

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const COLORS = [
  'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100',
  'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100',
  'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-100',
  'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100',
];

// Функция для форматирования времени без секунд
const formatTime = (time: string) => {
  return time.substring(0, 5);
};

// Функция для проверки пересечения времени
const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
  return (
    (start1 >= start2 && start1 < end2) || // Начало внутри
    (end1 > start2 && end1 <= end2) || // Конец внутри
    (start1 <= start2 && end1 >= end2) // Полное перекрытие
  );
};

// Модальное окно ошибки времени
const ErrorModal = ({ isOpen, onClose, title, message, conflictSchedule }: any) => {
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
                📚 {conflictSchedule.subject_name}<br />
                ⏰ {formatTime(conflictSchedule.start_time)} - {formatTime(conflictSchedule.end_time)}<br />
                📅 День: {DAYS_RU[conflictSchedule.day_of_week]}
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

// Модальное окно для создания/редактирования пресета
const PresetModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  formData, 
  onFormChange,
  editingId 
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingId ? 'Редактировать пресет' : 'Новый пресет'}
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
              Название пресета <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Например: Моё расписание"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание
            </label>
            <textarea
              placeholder="Описание пресета (опционально)"
              value={formData.description || ''}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none min-h-20"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Сохраняем..." : editingId ? "Обновить" : "Создать"}
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

// Модальное окно для добавления пары в пресет
const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  formData, 
  onFormChange,
  presetId,
  existingSchedules = []
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Добавить пару в пресет
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => onSubmit(e, presetId)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              День недели
            </label>
            <select
              value={formData.day_of_week}
              onChange={(e) => onFormChange({ ...formData, day_of_week: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {DAYS_RU.map((day, idx) => (
                <option key={idx} value={idx}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Предмет <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Название предмета"
              value={formData.subject_name}
              onChange={(e) => onFormChange({ ...formData, subject_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              Важная пара
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
                {formData.is_important ? "Важная" : "Обычная"}
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
                      ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' 
                      : 'border-transparent hover:scale-105'
                  }`}
                >
                  <div className={`w-full h-full rounded ${color.split(' ')[0]} opacity-70`}></div>
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
              Добавить пару
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

export default function PresetsPage() {
  const { user, loading: authLoading } = useAuth();
  const { presets, loading, error, addPreset, updatePreset, deletePreset, addPresetSchedule, deletePresetSchedule } = useData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState<number | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({
    title: '',
    message: '',
    conflictSchedule: null
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: 0,
    subject_name: '',
    start_time: '09:00',
    end_time: '10:35',
    room: '',
    color: COLORS[0],
    is_important: false,
  });

  // Функция проверки пересечения времени в пресете
  const checkTimeOverlapInPreset = useCallback((presetId: number, dayOfWeek: number, startTime: string, endTime: string, excludeScheduleId?: number) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset || !preset.schedules) return { overlaps: false };
    
    const schedulesOnDay = preset.schedules.filter(s => 
      s.day_of_week === dayOfWeek && s.id !== excludeScheduleId
    );
    
    for (const schedule of schedulesOnDay) {
      if (isTimeOverlap(startTime, endTime, schedule.start_time, schedule.end_time)) {
        return {
          overlaps: true,
          overlappingSchedule: schedule
        };
      }
    }
    
    return { overlaps: false };
  }, [presets]);

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingPresetId(null);
    setShowAddForm(false);
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      day_of_week: 0,
      subject_name: '',
      start_time: '09:00',
      end_time: '10:35',
      room: '',
      color: COLORS[0],
      is_important: false,
    });
    setShowScheduleForm(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name) {
        alert('Введите название пресета');
        return;
      }

      setIsSubmitting(true);

      if (editingPresetId) {
        await updatePreset(editingPresetId, formData);
      } else {
        await addPreset(formData);
      }
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      alert('Ошибка при сохранении');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent, presetId: number) => {
    e.preventDefault();

    try {
      if (!scheduleForm.subject_name) {
        alert('Введите название предмета');
        return;
      }

      // Проверка на пересечение времени в пресете
      const { overlaps, overlappingSchedule } = checkTimeOverlapInPreset(
        presetId,
        scheduleForm.day_of_week,
        scheduleForm.start_time,
        scheduleForm.end_time
      );

      if (overlaps) {
        setErrorModalData({
          title: "Конфликт времени в пресете!",
          message: `Нельзя добавить пару в это время, так как она пересекается с существующей парой в пресете.\n\nПожалуйста, измените время или удалите конфликтующую пару.`,
          conflictSchedule: overlappingSchedule
        });
        setShowErrorModal(true);
        return;
      }

      setIsSubmitting(true);

      await addPresetSchedule(presetId, scheduleForm);
      resetScheduleForm();
    } catch (err) {
      console.error('Error:', err);
      alert('Ошибка при добавлении пары');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить этот пресет?')) {
      try {
        await deletePreset(id);
      } catch (err) {
        console.error('Error:', err);
        alert('Ошибка удаления');
      }
    }
  };

  const filteredPresets = presets.filter((preset) =>
    preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка пресетов...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Пожалуйста, войдите в аккаунт</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Пресеты расписания</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {presets.length} пресетов создано
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Новый пресет</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск пресетов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
        />
      </div>

      {/* Модальные окна */}
      <PresetModal
        isOpen={showAddForm}
        onClose={resetForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        onFormChange={setFormData}
        editingId={editingPresetId}
      />

      <ScheduleModal
        isOpen={showScheduleForm !== null}
        onClose={resetScheduleForm}
        onSubmit={handleAddSchedule}
        isSubmitting={isSubmitting}
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        presetId={showScheduleForm}
        existingSchedules={showScheduleForm ? presets.find(p => p.id === showScheduleForm)?.schedules || [] : []}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
        conflictSchedule={errorModalData.conflictSchedule}
      />

      {/* Presets Grid */}
      <div className="space-y-6">
        {filteredPresets.map((preset) => (
          <div key={preset.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                  {preset.name}
                </h3>
                {preset.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setFormData({
                      name: preset.name,
                      description: preset.description || '',
                    });
                    setEditingPresetId(preset.id);
                    setShowAddForm(true);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition"
                  title="Редактировать"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(preset.id)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Schedules */}
            {preset.schedules && preset.schedules.length > 0 ? (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Пары в пресете:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {preset.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`${schedule.color} rounded-lg border p-3 flex justify-between items-start m-4 ${
                        schedule.is_important ? "ring-2 ring-yellow-500" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {schedule.is_important && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {DAYS_RU[schedule.day_of_week]} - {schedule.subject_name}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-1 text-xs text-gray-700 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </span>
                          {schedule.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {schedule.room}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deletePresetSchedule(schedule.id)}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 rounded transition ml-2 flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4 text-sm text-gray-500 dark:text-gray-400 italic text-center border border-gray-200 dark:border-gray-700">
                Пары не добавлены
              </div>
            )}

            {/* Add Schedule Button */}
            <button
              onClick={() => setShowScheduleForm(preset.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/50 transition font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              Добавить пару
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPresets.length === 0 && !showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">Нет пресетов</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {searchQuery ? 'По вашему поиску ничего не найдено' : 'Создайте первый пресет расписания'}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">Ошибка: {error}</p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { useData } from '@/src/lib/DataContext';
import { useAuth } from '@/src/lib/AuthContext';

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const COLORS = [
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
  'bg-yellow-100',
  'bg-red-100',
  'bg-pink-100',
  'bg-orange-100',
];

export default function PresetsPage() {
  const { user, loading: authLoading } = useAuth();
  const { presets, loading, error, addPreset, updatePreset, deletePreset, addPresetSchedule, deletePresetSchedule } = useData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState<number | null>(null);

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
  });

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Загрузка пресетов...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Пожалуйста, войдите в аккаунт</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Пресеты расписания</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {presets.length} пресетов созданы
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
          className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingPresetId ? 'Редактировать пресет' : 'Новый пресет'}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Название пресета (например: Мой расписание)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />

            <textarea
              placeholder="Описание (опционально)"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none min-h-20"
            />

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingPresetId ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Presets Grid */}
      <div className="space-y-6">
        {filteredPresets.map((preset) => (
          <div key={preset.id} className="bg-white rounded-xl border p-4 sm:p-6 hover:shadow-md transition">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-800">
                  {preset.name}
                </h3>
                {preset.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                  title="Редактировать"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(preset.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Schedules */}
            {preset.schedules && preset.schedules.length > 0 ? (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Пары в пресете:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {preset.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`${schedule.color} rounded-lg p-3 flex justify-between items-start`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {DAYS_RU[schedule.day_of_week]} - {schedule.subject_name}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-1 text-xs text-gray-700">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {schedule.start_time} - {schedule.end_time}
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
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-200 rounded transition ml-2 flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-500 italic text-center">
                Пары не добавлены
              </div>
            )}

            {/* Add Schedule Button */}
            {showScheduleForm === preset.id ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Добавить пару в пресет</h4>
                <form
                  onSubmit={(e) => handleAddSchedule(e, preset.id)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">День</label>
                      <select
                        value={scheduleForm.day_of_week}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, day_of_week: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        {DAYS_RU.map((day, idx) => (
                          <option key={idx} value={idx}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Предмет</label>
                      <input
                        type="text"
                        placeholder="Название"
                        value={scheduleForm.subject_name}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, subject_name: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Начало</label>
                      <input
                        type="time"
                        value={scheduleForm.start_time}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, start_time: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Конец</label>
                      <input
                        type="time"
                        value={scheduleForm.end_time}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, end_time: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Аудитория</label>
                      <input
                        type="text"
                        placeholder="Например: 101"
                        value={scheduleForm.room}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Добавить
                    </button>
                    <button
                      type="button"
                      onClick={resetScheduleForm}
                      className="flex-1 bg-gray-300 text-gray-800 py-2 rounded text-sm hover:bg-gray-400"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setShowScheduleForm(preset.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                Добавить пару
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPresets.length === 0 && !showAddForm && (
        <div className="bg-white rounded-xl border p-8 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">Нет пресетов</h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {searchQuery ? 'По вашему поиску ничего не найдено' : 'Создайте первый пресет расписания'}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Ошибка: {error}</p>
        </div>
      )}
    </div>
  );
}
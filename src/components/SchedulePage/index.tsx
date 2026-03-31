'use client';

import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
  Trash2,
  Loader,
  Copy,
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

export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const {
    schedules,
    presets,
    studyPeriods,
    activeStudyPeriod,
    loading,
    error,
    addSchedule,
    deleteSchedule,
    createStudyPeriod,
    setActiveStudyPeriod,
    applyPreset,
  } = useData();

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - (day === 0 ? 6 : day - 1);
    const date = new Date(today.setDate(diff));
    return date;
  });

  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showApplyPreset, setShowApplyPreset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [periodForm, setPeriodForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });

  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    subject_name: '',
    start_time: '09:00',
    end_time: '10:35',
    room: '',
    color: COLORS[0],
  });

  const [applyPresetForm, setApplyPresetForm] = useState({
    preset_id: '',
    start_date: '',
  });

  // Получаем дни текущей недели
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  // Расписание на текущую неделю
  const weekSchedules = useMemo(() => {
    const start = weekDays[0].toISOString().split('T')[0];
    const end = weekDays[6].toISOString().split('T')[0];
    return schedules.filter((s) => s.date >= start && s.date <= end).sort((a, b) => {
      const dateA = new Date(`2000-01-01 ${a.start_time}`);
      const dateB = new Date(`2000-01-01 ${b.start_time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [weekDays, schedules]);

  const schedulesByDate = useMemo(() => {
    const grouped: { [key: string]: typeof schedules } = {};
    weekSchedules.forEach((schedule) => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = [];
      }
      grouped[schedule.date].push(schedule);
    });
    return grouped;
  }, [weekSchedules]);

  const canGoNext = () => {
    if (!activeStudyPeriod) return false;
    const nextWeekEnd = new Date(currentWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 13);
    return nextWeekEnd <= new Date(activeStudyPeriod.end_date);
  };

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodForm.name || !periodForm.start_date || !periodForm.end_date) {
      alert('Заполните все поля');
      return;
    }

    try {
      setIsSubmitting(true);
      await createStudyPeriod({
        name: periodForm.name,
        start_date: periodForm.start_date,
        end_date: periodForm.end_date,
        is_active: true,
      });
      setPeriodForm({ name: '', start_date: '', end_date: '' });
      setShowAddPeriod(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Ошибка при создании периода');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudyPeriod) {
      alert('Выберите период обучения');
      return;
    }

    try {
      setIsSubmitting(true);
      await addSchedule({
        user_id: user!.id,
        subject_name: scheduleForm.subject_name,
        date: scheduleForm.date,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        room: scheduleForm.room,
        color: scheduleForm.color,
        study_period_id: activeStudyPeriod.id,
      });
      setScheduleForm({
        date: '',
        subject_name: '',
        start_time: '09:00',
        end_time: '10:35',
        room: '',
        color: COLORS[0],
      });
      setShowAddSchedule(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Ошибка при добавлении пары');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyPresetForm.preset_id || !applyPresetForm.start_date) {
      alert('Выберите пресет и дату');
      return;
    }

    try {
      setIsSubmitting(true);
      await applyPreset(Number(applyPresetForm.preset_id), applyPresetForm.start_date);
      setApplyPresetForm({ preset_id: '', start_date: '' });
      setShowApplyPreset(false);
      alert('Пресет успешно применен!');
    } catch (err) {
      console.error('Error:', err);
      alert('Ошибка при применении пресета');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Загрузка расписания...</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Расписание</h2>
          {activeStudyPeriod ? (
            <p className="text-gray-500 text-sm sm:text-base">
              {activeStudyPeriod.name} ({new Date(activeStudyPeriod.start_date).toLocaleDateString('ru-RU')} - {new Date(activeStudyPeriod.end_date).toLocaleDateString('ru-RU')})
            </p>
          ) : (
            <p className="text-amber-600 text-sm sm:text-base font-medium">Создайте период обучения</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddPeriod(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition"
          >
            <Plus className="h-4 w-4" />
            Новый период
          </button>
          {activeStudyPeriod && (
            <>
              <button
                onClick={() => setShowAddSchedule(true)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base transition"
              >
                <Plus className="h-4 w-4" />
                Добавить пару
              </button>
              {presets.length > 0 && (
                <button
                  onClick={() => setShowApplyPreset(true)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base transition"
                >
                  <Copy className="h-4 w-4" />
                  Пресет
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Period Form */}
      {showAddPeriod && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Новый период обучения</h3>
            <button onClick={() => setShowAddPeriod(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreatePeriod} className="space-y-4">
            <input
              type="text"
              placeholder="Название периода"
              value={periodForm.name}
              onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
                <input
                  type="date"
                  value={periodForm.start_date}
                  onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Конец</label>
                <input
                  type="date"
                  value={periodForm.end_date}
                  onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                Создать
              </button>
              <button type="button" onClick={() => setShowAddPeriod(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Schedule Form */}
      {showAddSchedule && activeStudyPeriod && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Добавить пару</h3>
            <button onClick={() => setShowAddSchedule(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  min={activeStudyPeriod.start_date}
                  max={activeStudyPeriod.end_date}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Предмет</label>
                <input
                  type="text"
                  placeholder="Название"
                  value={scheduleForm.subject_name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, subject_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
                <input
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Конец</label>
                <input
                  type="time"
                  value={scheduleForm.end_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Аудитория</label>
                <input
                  type="text"
                  placeholder="Например: 101"
                  value={scheduleForm.room}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setScheduleForm({ ...scheduleForm, color })}
                      className={`w-8 h-8 rounded-lg border-2 ${color} ${
                        scheduleForm.color === color ? 'border-gray-800' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                Добавить пару
              </button>
              <button type="button" onClick={() => setShowAddSchedule(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Apply Preset Form */}
      {showApplyPreset && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Применить пресет</h3>
            <button onClick={() => setShowApplyPreset(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleApplyPreset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пресет</label>
              <select
                value={applyPresetForm.preset_id}
                onChange={(e) => setApplyPresetForm({ ...applyPresetForm, preset_id: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              >
                <option value="">Выберите пресет</option>
                {presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начиная с</label>
              <input
                type="date"
                value={applyPresetForm.start_date}
                onChange={(e) => setApplyPresetForm({ ...applyPresetForm, start_date: e.target.value })}
                min={activeStudyPeriod?.start_date}
                max={activeStudyPeriod?.end_date}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Применить пресет
              </button>
              <button type="button" onClick={() => setShowApplyPreset(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* No Period Warning */}
      {!activeStudyPeriod && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-amber-800 font-medium">Создайте период обучения для начала работы с расписанием</p>
        </div>
      )}

      {/* Week Navigation */}
      {activeStudyPeriod && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <button
              onClick={() => {
                const newDate = new Date(currentWeekStart);
                newDate.setDate(newDate.getDate() - 7);
                setCurrentWeekStart(newDate);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Пред. неделя
            </button>

            <h3 className="font-semibold text-gray-800 text-center">
              {weekDays[0].toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} -{' '}
              {weekDays[6].toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>

            <button
              onClick={() => {
                const newDate = new Date(currentWeekStart);
                newDate.setDate(newDate.getDate() + 7);
                setCurrentWeekStart(newDate);
              }}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              След. неделя
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Week Schedule */}
          <div className="space-y-6">
            {weekDays.map((day) => {
              const dateStr = day.toISOString().split('T')[0];
              const daySchedules = schedulesByDate[dateStr] || [];
              const dayName = DAYS_RU[day.getDay() === 0 ? 6 : day.getDay() - 1];

              return (
                <div key={dateStr}>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">
                    {dayName}, {day.toLocaleDateString('ru-RU')}
                  </h3>

                  {daySchedules.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`${schedule.color} rounded-lg border p-4 hover:shadow-md transition`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 text-lg">
                                {schedule.subject_name}
                              </h4>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm text-gray-700">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {schedule.start_time} - {schedule.end_time}
                                </span>
                                {schedule.room && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {schedule.room}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteSchedule(schedule.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition ml-2 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 text-sm">
                      Нет пар
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Ошибка: {error}</p>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Loader,
  Copy,
  AlertTriangle,
  Edit2,
  Star,
  PlusCircle,
} from "lucide-react";
import { useData } from "@/src/lib/DataContext";
import { useAuth } from "@/src/lib/AuthContext";
import { useTheme } from "@/src/lib/ThemeContext";
import { Schedule, Timing } from "@/src/types";

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const COLORS = [
  "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100",
  "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100",
  "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-100",
  "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100",
];

const formatTime = (time: string) => {
  return time.substring(0, 5);
};

const isTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
) => {
  return (
    (start1 >= start2 && start1 < end2) ||
    (end1 > start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
};

const AddScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  activeStudyPeriod,
  formData,
  onFormChange,
  editingId,
  timings,
}: any) => {
  if (!isOpen) return null;

  const hasTimings = timings && timings.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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
              onChange={(e) =>
                onFormChange({ ...formData, date: e.target.value })
              }
              min={activeStudyPeriod?.start_date}
              max={activeStudyPeriod?.end_date}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
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
              onChange={(e) =>
                onFormChange({ ...formData, subject_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Время пары
            </label>
            {hasTimings ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {timings.map((t: Timing) => {
                    const isSelected =
                      formData.start_time === t.start_time &&
                      formData.end_time === t.end_time;
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
                          {t.start_time.substring(0, 5)} —{" "}
                          {t.end_time.substring(0, 5)}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {formData.start_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Выбрано: {formData.start_time.substring(0, 5)} —{" "}
                      {formData.end_time.substring(0, 5)}
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
                    onChange={(e) =>
                      onFormChange({ ...formData, start_time: e.target.value })
                    }
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
                    onChange={(e) =>
                      onFormChange({ ...formData, end_time: e.target.value })
                    }
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
              onChange={(e) =>
                onFormChange({ ...formData, room: e.target.value })
              }
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
                onClick={() =>
                  onFormChange({
                    ...formData,
                    is_important: !formData.is_important,
                  })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  formData.is_important
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Star
                  className={`h-4 w-4 ${formData.is_important ? "fill-current" : ""}`}
                />
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
                      ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800"
                      : "border-transparent hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-full h-full rounded ${color.split(" ")[0]} opacity-70`}
                  />
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

const AddPeriodModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
}: any) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;
  const nextYear = currentYear + 1;

  const minDate = `${prevYear}-01-01`;
  const maxDate = `${nextYear}-12-31`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Новый период обучения
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Название периода"
            value={formData.name}
            onChange={(e) =>
              onFormChange({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Начало
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                onFormChange({ ...formData, start_date: e.target.value })
              }
              min={minDate}
              max={maxDate}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Конец
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                onFormChange({ ...formData, end_date: e.target.value })
              }
              min={formData.start_date || minDate}
              max={maxDate}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50 transition"
            >
              Создать
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

const ApplyPresetModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  activeStudyPeriod,
}: any) => {
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
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Применить пресет
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
              Пресет
            </label>
            <select
              value={formData.preset_id}
              onChange={(e) =>
                onFormChange({ ...formData, preset_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            >
              <option value="">Выберите пресет</option>
              {formData.presets?.map((preset: any) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Начиная с
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                onFormChange({ ...formData, start_date: e.target.value })
              }
              min={activeStudyPeriod?.start_date}
              max={activeStudyPeriod?.end_date}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50 transition"
            >
              Применить пресет
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

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
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
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            Да, удалить и создать
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg transition"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
  conflictSchedule,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  conflictSchedule?: Schedule | null;
}) => {
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

export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const {
    schedules,
    presets,
    studyPeriods,
    activeStudyPeriod,
    timings,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    createStudyPeriod,
    setActiveStudyPeriod,
    applyPreset,
    deleteStudyPeriod,
    refreshData,
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [pendingPeriodData, setPendingPeriodData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [errorModalData, setErrorModalData] = useState<{
    title: string;
    message: string;
    conflictSchedule: Schedule | null | undefined;
  }>({
    title: "",
    message: "",
    conflictSchedule: null,
  });

  const [periodForm, setPeriodForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    subject_name: "",
    start_time: "09:00",
    end_time: "10:35",
    room: "",
    color: COLORS[0],
    is_important: false,
  });

  const [applyPresetForm, setApplyPresetForm] = useState({
    preset_id: "",
    start_date: "",
  });

  // Синхронизация текущей недели с активным периодом
  useEffect(() => {
    if (activeStudyPeriod) {
      goToCurrentWeek();
    }
  }, [activeStudyPeriod]);

  const checkTimeOverlap = useCallback(
    (
      date: string,
      startTime: string,
      endTime: string,
      excludeScheduleId?: number,
    ) => {
      const schedulesOnDate = schedules.filter(
        (s) => s.date === date && s.id !== excludeScheduleId,
      );

      for (const schedule of schedulesOnDate) {
        if (
          isTimeOverlap(
            startTime,
            endTime,
            schedule.start_time,
            schedule.end_time,
          )
        ) {
          return {
            overlaps: true,
            overlappingSchedule: schedule,
          };
        }
      }

      return { overlaps: false };
    },
    [schedules],
  );

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  const weekSchedules = useMemo(() => {
    const start = weekDays[0].toISOString().split("T")[0];
    const end = weekDays[6].toISOString().split("T")[0];
    return schedules
      .filter((s) => s.date >= start && s.date <= end)
      .sort((a, b) => {
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

  // Проверка возможности перехода на следующую неделю
  const canGoNext = useCallback(() => {
    if (!activeStudyPeriod) return false;
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekStartDate = nextWeekStart.toISOString().split("T")[0];
    const periodEndDate = activeStudyPeriod.end_date;
    return nextWeekStartDate <= periodEndDate;
  }, [activeStudyPeriod, currentWeekStart]);

  // Проверка возможности перехода на предыдущую неделю
  const canGoPrev = useCallback(() => {
    if (!activeStudyPeriod) return false;
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() + 6);
    const prevWeekEndDate = prevWeekEnd.toISOString().split("T")[0];
    const periodStartDate = activeStudyPeriod.start_date;
    return prevWeekEndDate >= periodStartDate;
  }, [activeStudyPeriod, currentWeekStart]);

  // Функция для перехода к текущей неделе с проверкой границ
  const goToCurrentWeek = useCallback(() => {
    if (!activeStudyPeriod) return;

    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - (day === 0 ? 6 : day - 1);
    let currentWeekDate = new Date(today.setDate(diff));

    const weekEnd = new Date(currentWeekDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekEndDate = weekEnd.toISOString().split("T")[0];
    const weekStartDate = currentWeekDate.toISOString().split("T")[0];

    if (weekEndDate < activeStudyPeriod.start_date) {
      currentWeekDate = new Date(activeStudyPeriod.start_date);
      const startDay = currentWeekDate.getDay();
      const startDiff =
        currentWeekDate.getDate() - (startDay === 0 ? 6 : startDay - 1);
      currentWeekDate = new Date(currentWeekDate.setDate(startDiff));
    } else if (weekStartDate > activeStudyPeriod.end_date) {
      currentWeekDate = new Date(activeStudyPeriod.end_date);
      const endDay = currentWeekDate.getDay();
      const endDiff =
        currentWeekDate.getDate() - (endDay === 0 ? 6 : endDay - 1);
      currentWeekDate = new Date(currentWeekDate.setDate(endDiff));
    }

    setCurrentWeekStart(currentWeekDate);
  }, [activeStudyPeriod]);

  // Функция для перехода на следующую неделю
  const goToNextWeek = useCallback(() => {
    if (!canGoNext()) return;
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  }, [canGoNext, currentWeekStart]);

  // Функция для перехода на предыдущую неделю
  const goToPrevWeek = useCallback(() => {
    if (!canGoPrev()) return;
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  }, [canGoPrev, currentWeekStart]);

  const handleCreatePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodForm.name || !periodForm.start_date || !periodForm.end_date) {
      alert("Заполните все поля");
      return;
    }

    const startYear = new Date(periodForm.start_date).getFullYear();
    const endYear = new Date(periodForm.end_date).getFullYear();
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;
    const nextYear = currentYear + 1;

    if (startYear < prevYear || startYear > nextYear) {
      alert(
        `Год начала должен быть ${prevYear}, ${currentYear} или ${nextYear}`,
      );
      return;
    }

    if (endYear < prevYear || endYear > nextYear) {
      alert(
        `Год окончания должен быть ${prevYear}, ${currentYear} или ${nextYear}`,
      );
      return;
    }

    if (activeStudyPeriod) {
      setPendingPeriodData({
        name: periodForm.name,
        start_date: periodForm.start_date,
        end_date: periodForm.end_date,
      });
      setShowConfirm(true);
      return;
    }

    await createPeriod();
  };

  const createPeriod = async () => {
    try {
      setIsSubmitting(true);

      if (activeStudyPeriod) {
        await deleteStudyPeriod(activeStudyPeriod.id);

        // Вручную очищаем локальное состояние расписания
        // так как deleteStudyPeriod уже должен был это сделать
      }

      const newPeriod = await createStudyPeriod({
        name: pendingPeriodData?.name || periodForm.name,
        start_date: pendingPeriodData?.start_date || periodForm.start_date,
        end_date: pendingPeriodData?.end_date || periodForm.end_date,
        is_active: true,
        user_id: user!.id,
      });

      // Вместо refreshData() просто обновляем необходимые состояния
      // и сбрасываем текущую неделю

      setPeriodForm({ name: "", start_date: "", end_date: "" });
      setShowAddPeriod(false);

      // Обновляем текущую неделю, чтобы показать новый период
      if (newPeriod) {
        // Принудительно устанавливаем активный период в состояние
        // (он уже должен обновиться через setActiveStudyPeriodState в createStudyPeriod)

        // Сбрасываем неделю на текущую
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - (day === 0 ? 6 : day - 1);
        const currentWeekDate = new Date(today.setDate(diff));
        setCurrentWeekStart(currentWeekDate);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ошибка при создании периода");
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
      setPendingPeriodData(null);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudyPeriod) {
      alert("Выберите период обучения");
      return;
    }

    const { overlaps, overlappingSchedule } = checkTimeOverlap(
      scheduleForm.date,
      scheduleForm.start_time,
      scheduleForm.end_time,
      editingSchedule?.id,
    );

    if (overlaps) {
      setErrorModalData({
        title: "Конфликт времени!",
        message: `Нельзя ${editingSchedule ? "сохранить" : "добавить"} пару в это время, так как она пересекается с существующей парой.\n\nПожалуйста, измените время или удалите конфликтующую пару.`,
        conflictSchedule: overlappingSchedule,
      });
      setShowErrorModal(true);
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, {
          subject_name: scheduleForm.subject_name,
          date: scheduleForm.date,
          start_time: scheduleForm.start_time,
          end_time: scheduleForm.end_time,
          room: scheduleForm.room,
          color: scheduleForm.color,
          is_important: scheduleForm.is_important,
        });
      } else {
        await addSchedule({
          user_id: user!.id,
          subject_name: scheduleForm.subject_name,
          date: scheduleForm.date,
          start_time: scheduleForm.start_time,
          end_time: scheduleForm.end_time,
          room: scheduleForm.room,
          color: scheduleForm.color,
          is_important: scheduleForm.is_important,
          study_period_id: activeStudyPeriod.id,
        });
      }

      setScheduleForm({
        date: "",
        subject_name: "",
        start_time: "09:00",
        end_time: "10:35",
        room: "",
        color: COLORS[0],
        is_important: false,
      });
      setEditingSchedule(null);
      setShowAddSchedule(false);
    } catch (err) {
      console.error("Error:", err);
      alert(
        editingSchedule
          ? "Ошибка при редактировании пары"
          : "Ошибка при добавлении пары",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      date: schedule.date,
      subject_name: schedule.subject_name,
      start_time: formatTime(schedule.start_time),
      end_time: formatTime(schedule.end_time),
      room: schedule.room || "",
      color: schedule.color || COLORS[0],
      is_important: schedule.is_important || false,
    });
    setShowAddSchedule(true);
  };

  const handleApplyPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyPresetForm.preset_id || !applyPresetForm.start_date) {
      alert("Выберите пресет и дату");
      return;
    }

    const preset = presets.find(
      (p) => p.id === Number(applyPresetForm.preset_id),
    );
    if (!preset || !preset.schedules) {
      alert("Пресет не найден");
      return;
    }

    const startDateObj = new Date(applyPresetForm.start_date);
    const dayOfWeekStart =
      startDateObj.getDay() === 0 ? 6 : startDateObj.getDay() - 1;

    const conflicts: string[] = [];

    for (const presetSchedule of preset.schedules) {
      const dayDiff = (presetSchedule.day_of_week - dayOfWeekStart + 7) % 7;
      const scheduleDate = new Date(applyPresetForm.start_date);
      scheduleDate.setDate(scheduleDate.getDate() + dayDiff);
      const dateStr = scheduleDate.toISOString().split("T")[0];

      const { overlaps, overlappingSchedule } = checkTimeOverlap(
        dateStr,
        presetSchedule.start_time,
        presetSchedule.end_time,
      );

      if (overlaps && overlappingSchedule) {
        conflicts.push(
          `${dateStr}: ${presetSchedule.subject_name} (${formatTime(presetSchedule.start_time)}-${formatTime(presetSchedule.end_time)}) конфликтует с ${overlappingSchedule.subject_name}`,
        );
      }
    }

    if (conflicts.length > 0) {
      setErrorModalData({
        title: "Невозможно применить пресет!",
        message: `Обнаружены конфликты:\n\n${conflicts.join("\n")}\n\nПожалуйста, удалите конфликтующие пары или выберите другую дату.`,
        conflictSchedule: null,
      });
      setShowErrorModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await applyPreset(
        Number(applyPresetForm.preset_id),
        applyPresetForm.start_date,
      );
      setApplyPresetForm({ preset_id: "", start_date: "" });
      setShowApplyPreset(false);
      alert("✅ Пресет успешно применен!");
    } catch (err) {
      console.error("Error:", err);
      alert("Ошибка при применении пресета");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Загрузка расписания...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">
          Пожалуйста, войдите в аккаунт
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 transition-colors mx-auto space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Расписание
          </h2>
          {activeStudyPeriod ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {activeStudyPeriod.name} (
              {new Date(activeStudyPeriod.start_date).toLocaleDateString(
                "ru-RU",
              )}{" "}
              -{" "}
              {new Date(activeStudyPeriod.end_date).toLocaleDateString("ru-RU")}
              )
            </p>
          ) : (
            <p className="text-amber-600 dark:text-amber-400 text-sm sm:text-base font-medium">
              Создайте период обучения
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddPeriod(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm sm:text-base transition"
          >
            <Plus className="h-4 w-4" />
            Новый период
          </button>
          {activeStudyPeriod && (
            <>
              <button
                onClick={() => {
                  setEditingSchedule(null);
                  setScheduleForm({
                    date: "",
                    subject_name: "",
                    start_time: "09:00",
                    end_time: "10:35",
                    room: "",
                    color: COLORS[0],
                    is_important: false,
                  });
                  setShowAddSchedule(true);
                }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm sm:text-base transition"
              >
                <Plus className="h-4 w-4" />
                Добавить пару
              </button>
              {presets.length > 0 && (
                <button
                  onClick={() => setShowApplyPreset(true)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition"
                >
                  <Copy className="h-4 w-4" />
                  Пресет
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      <AddPeriodModal
        isOpen={showAddPeriod}
        onClose={() => setShowAddPeriod(false)}
        onSubmit={handleCreatePeriodSubmit}
        isSubmitting={isSubmitting}
        formData={periodForm}
        onFormChange={setPeriodForm}
      />

      <AddScheduleModal
        isOpen={showAddSchedule}
        onClose={() => {
          setShowAddSchedule(false);
          setEditingSchedule(null);
        }}
        onSubmit={handleAddSchedule}
        isSubmitting={isSubmitting}
        activeStudyPeriod={activeStudyPeriod}
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        editingId={editingSchedule?.id}
        timings={timings}
      />

      <ApplyPresetModal
        isOpen={showApplyPreset}
        onClose={() => setShowApplyPreset(false)}
        onSubmit={handleApplyPreset}
        isSubmitting={isSubmitting}
        formData={{ ...applyPresetForm, presets }}
        onFormChange={setApplyPresetForm}
        activeStudyPeriod={activeStudyPeriod}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingPeriodData(null);
        }}
        onConfirm={createPeriod}
        title="Внимание!"
        message={`У вас уже есть активный период обучения "${activeStudyPeriod?.name}". При создании нового периода старый период и все его пары будут УДАЛЕНЫ. Вы уверены, что хотите продолжить?`}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
        conflictSchedule={errorModalData.conflictSchedule}
      />

      {/* No Period Warning */}
      {!activeStudyPeriod && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6 text-center">
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            Создайте период обучения для начала работы с расписанием
          </p>
        </div>
      )}

      {/* Week Navigation */}
      {activeStudyPeriod && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={goToPrevWeek}
                disabled={!canGoPrev()}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
                Пред. неделя
              </button>

              <button
                onClick={goToCurrentWeek}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition text-indigo-700 dark:text-indigo-400"
              >
                Текущая неделя
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white text-center">
              {weekDays[0].toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
              })}{" "}
              -{" "}
              {weekDays[6].toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>

            <button
              onClick={goToNextWeek}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 dark:text-gray-300"
            >
              След. неделя
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Week Schedule */}
          <div className="space-y-6">
            {weekDays.map((day) => {
              const dateStr = day.toISOString().split("T")[0];
              const daySchedules = schedulesByDate[dateStr] || [];
              const dayName =
                DAYS_RU[day.getDay() === 0 ? 6 : day.getDay() - 1];

              return (
                <div key={dateStr}>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                    {dayName}, {day.toLocaleDateString("ru-RU")}
                  </h3>

                  {daySchedules.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`${schedule.color} rounded-lg border p-4 hover:shadow-md transition ${
                            schedule.is_important
                              ? "ring-2 ring-yellow-500"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {schedule.is_important && (
                                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                )}
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                  {schedule.subject_name}
                                </h4>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatTime(schedule.start_time)} -{" "}
                                  {formatTime(schedule.end_time)}
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
                                onClick={() => handleEditSchedule(schedule)}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition ml-2 flex-shrink-0"
                                title="Редактировать"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteSchedule(schedule.id)}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition ml-2 flex-shrink-0"
                                title="Удалить"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingSchedule(null);
                        setScheduleForm({
                          date: dateStr,
                          subject_name: "",
                          start_time: "09:00",
                          end_time: "10:35",
                          room: "",
                          color: COLORS[0],
                          is_important: false,
                        });
                        setShowAddSchedule(true);
                      }}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400 text-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition flex justify-center items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Добавить пару</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Ошибка: {error}
          </p>
        </div>
      )}
    </div>
  );
}

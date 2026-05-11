"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Loader,
  BookOpen,
  MapPin,
  Trash2,
  X,
  Save,
  Edit2,
  Star,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { useData } from "@/src/lib/DataContext";
import { useAuth } from "@/src/lib/AuthContext";
import { Timing } from "@/src/types";

const DAYS_RU = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const COLORS = [
  "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100",
  "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100",
  "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-100",
  "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100",
];

const formatTime = (time: string) => time.substring(0, 5);

const isTimeOverlap = (s1: string, e1: string, s2: string, e2: string) =>
  (s1 >= s2 && s1 < e2) || (e1 > s2 && e1 <= e2) || (s1 <= s2 && e1 >= e2);

// ─── TimingSettings ────────────────────────────────────────────────────────────

function TimingSettings() {
  const {
    timings,
    addTiming,
    updateTiming,
    deleteTiming,
    resetTimingsToDefault,
  } = useData();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<number, Partial<Timing>>>(
    {},
  );

  const handleChange = (id: number, field: keyof Timing, value: string) => {
    setLocalEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleBlur = async (timing: Timing) => {
    const edits = localEdits[timing.id];
    if (!edits || Object.keys(edits).length === 0) return;
    try {
      setSaving(timing.id);
      await updateTiming(timing.id, edits);
      setLocalEdits((prev) => {
        const next = { ...prev };
        delete next[timing.id];
        return next;
      });
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setSaving(null);
    }
  };

  const handleAdd = async () => {
    if (timings.length >= 8) return;
    try {
      await addTiming({
        label: `${timings.length + 1} пара`,
        start_time: "09:00",
        end_time: "10:35",
        sort_order: timings.length,
      });
    } catch (e: any) {
      alert(e.message || "Ошибка добавления");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTiming(id);
    } catch {
      alert("Ошибка удаления");
    }
  };

  const handleReset = async () => {
    if (!confirm("Сбросить все тайминги к значениям по умолчанию?")) return;
    try {
      await resetTimingsToDefault();
    } catch {
      alert("Ошибка сброса");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Время пар
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {timings.length} из 8 пар настроено · изменения сохраняются
              автоматически
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-5 space-y-3">
          {timings.map((t) => {
            const edits = localEdits[t.id] || {};
            const isSaving = saving === t.id;
            return (
              <div key={t.id} className="flex items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  value={edits.label ?? t.label}
                  onChange={(e) => handleChange(t.id, "label", e.target.value)}
                  onBlur={() => handleBlur(t)}
                  className="w-24 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  value={edits.start_time ?? t.start_time}
                  onChange={(e) =>
                    handleChange(t.id, "start_time", e.target.value)
                  }
                  onBlur={() => handleBlur(t)}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-400 text-sm flex-shrink-0">—</span>
                <input
                  type="time"
                  value={edits.end_time ?? t.end_time}
                  onChange={(e) =>
                    handleChange(t.id, "end_time", e.target.value)
                  }
                  onBlur={() => handleBlur(t)}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex-shrink-0 w-6 flex items-center justify-center">
                  {isSaving ? (
                    <Loader className="h-3.5 w-3.5 text-indigo-500 animate-spin" />
                  ) : (
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex gap-4 pt-1">
            <button
              onClick={handleAdd}
              disabled={timings.length >= 8}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Добавить пару
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
            >
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ErrorModal ────────────────────────────────────────────────────────────────

const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
  conflictSchedule,
}: any) => {
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

// ─── PresetModal ───────────────────────────────────────────────────────────────

const PresetModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  editingId,
}: any) => {
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
            {editingId ? "Редактировать пресет" : "Новый пресет"}
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
              onChange={(e) =>
                onFormChange({ ...formData, name: e.target.value })
              }
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
              value={formData.description || ""}
              onChange={(e) =>
                onFormChange({ ...formData, description: e.target.value })
              }
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
              {isSubmitting
                ? "Сохраняем..."
                : editingId
                  ? "Обновить"
                  : "Создать"}
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

// ─── ScheduleModal ─────────────────────────────────────────────────────────────

const ScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  presetId,
  fixedDay,
  timings,
}: any) => {
  if (!isOpen) return null;

  return (
    <div
      className="m-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Добавить пару
            </h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              {DAYS_RU[fixedDay]}
            </p>
          </div>
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
              Предмет <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Название предмета"
              value={formData.subject_name}
              onChange={(e) =>
                onFormChange({ ...formData, subject_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Время пары
            </label>
            {timings.length > 0 ? (
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
                        {formatTime(t.start_time)} — {formatTime(t.end_time)}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                Настройте время пар в разделе «Время пар» выше.
              </p>
            )}
          </div>

          {formData.start_time && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <Clock className="h-4 w-4" />
              <span>
                Выбрано: {formData.start_time} — {formData.end_time}
              </span>
            </div>
          )}

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
              {formData.is_important ? "Избранная" : "Обычная"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Цвет
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color, i) => (
                <button
                  key={i}
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
              disabled={
                isSubmitting || timings.length === 0 || !formData.start_time
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50 transition"
            >
              {isSubmitting ? "Добавляем..." : "Добавить пару"}
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

// ─── WeekGrid ──────────────────────────────────────────────────────────────────

function WeekGrid({
  preset,
  onAddSchedule,
  onDeleteSchedule,
}: {
  preset: any;
  onAddSchedule: (presetId: number, day: number) => void;
  onDeleteSchedule: (id: number) => void;
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5].map((day) => {
          const daySchedules = (preset.schedules || [])
            .filter((s: any) => s.day_of_week === day)
            .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
          return (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 p-3"
            >
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-1 uppercase tracking-wide mb-2">
                {DAYS_RU[day]}
              </div>
              <div className="flex flex-col gap-2">
                {daySchedules.map((s: any) => (
                  <div
                    key={s.id}
                    className={`${s.color} rounded-lg border p-2 relative group ${s.is_important ? "ring-2 ring-yellow-500" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          {s.is_important && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                          <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 break-words">
                            {s.subject_name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {formatTime(s.start_time)}–{formatTime(s.end_time)}
                        </p>
                        {s.room && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-0.5 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                            <span className="break-words">{s.room}</span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteSchedule(s.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-600 rounded transition flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => onAddSchedule(preset.id, day)}
                  className="flex items-center justify-center gap-1 w-full py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Добавить пару</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    presets,
    timings,
    loading,
    error,
    addPreset,
    updatePreset,
    deletePreset,
    addPresetSchedule,
    deletePresetSchedule,
  } = useData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTargetPresetId, setScheduleTargetPresetId] = useState<
    number | null
  >(null);
  const [scheduleTargetDay, setScheduleTargetDay] = useState(0);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({
    title: "",
    message: "",
    conflictSchedule: null as any,
  });

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: 0,
    subject_name: "",
    start_time: "",
    end_time: "",
    room: "",
    color: COLORS[0],
    is_important: false,
  });

  const checkOverlap = useCallback(
    (
      presetId: number,
      day: number,
      start: string,
      end: string,
      excludeId?: number,
    ) => {
      const preset = presets.find((p) => p.id === presetId);
      if (!preset?.schedules) return { overlaps: false };
      for (const s of preset.schedules.filter(
        (s) => s.day_of_week === day && s.id !== excludeId,
      )) {
        if (isTimeOverlap(start, end, s.start_time, s.end_time))
          return { overlaps: true, overlappingSchedule: s };
      }
      return { overlaps: false };
    },
    [presets],
  );

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingPresetId(null);
    setShowAddForm(false);
  };

  const openScheduleModal = (presetId: number, day: number) => {
    setScheduleTargetPresetId(presetId);
    setScheduleTargetDay(day);
    const first = timings[0];
    setScheduleForm({
      day_of_week: day,
      subject_name: "",
      start_time: first?.start_time || "",
      end_time: first?.end_time || "",
      room: "",
      color: COLORS[0],
      is_important: false,
    });
    setScheduleModalOpen(true);
  };

  const handleSubmitPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Введите название пресета");
      return;
    }
    setIsSubmitting(true);
    try {
      editingPresetId
        ? await updatePreset(editingPresetId, formData)
        : await addPreset(formData);
      resetForm();
    } catch {
      alert("Ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent, presetId: number) => {
    e.preventDefault();
    if (!scheduleForm.subject_name) {
      alert("Введите название предмета");
      return;
    }
    if (!scheduleForm.start_time) {
      alert("Выберите время пары");
      return;
    }

    const { overlaps, overlappingSchedule } = checkOverlap(
      presetId,
      scheduleTargetDay,
      scheduleForm.start_time,
      scheduleForm.end_time,
    );
    if (overlaps) {
      setErrorModalData({
        title: "Конфликт времени!",
        message:
          "Нельзя добавить пару в это время — она пересекается с существующей парой.\n\nВыберите другое время или удалите конфликт.",
        conflictSchedule: overlappingSchedule || null,
      });
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await addPresetSchedule(presetId, {
        ...scheduleForm,
        day_of_week: scheduleTargetDay,
        preset_id: presetId,
      });
      setScheduleModalOpen(false);
    } catch {
      alert("Ошибка при добавлении пары");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPresets = presets.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
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
    <div className="sm:p-8 transition-colors mx-auto space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Настройки расписания
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {presets.length} пресетов создано
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Новый пресет
        </button>
      </div>

      <TimingSettings />

      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск пресетов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
        />
      </div>

      <PresetModal
        isOpen={showAddForm}
        onClose={resetForm}
        onSubmit={handleSubmitPreset}
        isSubmitting={isSubmitting}
        formData={formData}
        onFormChange={setFormData}
        editingId={editingPresetId}
      />

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSubmit={handleAddSchedule}
        isSubmitting={isSubmitting}
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        presetId={scheduleTargetPresetId}
        fixedDay={scheduleTargetDay}
        timings={timings}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
        conflictSchedule={errorModalData.conflictSchedule}
      />

      <div className="space-y-6">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-5">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                  {preset.name}
                </h3>
                {preset.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {(preset.schedules || []).length} пар добавлено
                </p>
              </div>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setFormData({
                      name: preset.name,
                      description: preset.description || "",
                    });
                    setEditingPresetId(preset.id);
                    setShowAddForm(true);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    confirm("Удалить этот пресет?") && deletePreset(preset.id)
                  }
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <WeekGrid
              preset={preset}
              onAddSchedule={openScheduleModal}
              onDeleteSchedule={deletePresetSchedule}
            />
          </div>
        ))}
      </div>

      {filteredPresets.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
            Нет пресетов
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {searchQuery
              ? "По вашему поиску ничего не найдено"
              : "Создайте первый пресет расписания"}
          </p>
        </div>
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

"use client";

import { useState } from "react";
import { X, Save, BookOpen } from "lucide-react";
import { useData } from "@/src/lib/DataContext";
import { useModalStore } from "@/src/stores/useModalStore";
import { useTaskFormStore } from "@/src/stores/taskFormStore";

export function TaskModal() {
  const { activeModal, closeModal } = useModalStore();
  const {
    formData,
    editingId,
    isSubmitting,
    setFormData,
    resetForm,
    setIsSubmitting,
  } = useTaskFormStore();
  const { addAssignment, updateAssignment, schedules } = useData();

  const isOpen = activeModal === "task";

  const subjectsFromSchedules = (() => {
    const subjects = new Set<string>();
    schedules.forEach((schedule) => {
      if (schedule.subject_name) {
        subjects.add(schedule.subject_name);
      }
    });
    return Array.from(subjects).sort();
  })();

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const [isCustomSubject, setIsCustomSubject] = useState(
    !formData.subject || !subjectsFromSchedules.includes(formData.subject),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.deadline) {
        alert("Заполните название и дедлайн");
        setIsSubmitting(false);
        return;
      }

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const maxDateObj = new Date();
      maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
      maxDateObj.setHours(0, 0, 0, 0);

      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setHours(0, 0, 0, 0);

      if (deadlineDate < todayDate) {
        alert(
          "Нельзя создать задание с датой дедлайна раньше сегодняшнего дня",
        );
        setIsSubmitting(false);
        return;
      }

      if (deadlineDate > maxDateObj) {
        alert(
          `Дедлайн не может быть позже ${maxDateObj.toLocaleDateString("ru-RU")}`,
        );
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateAssignment(editingId, formData);
      } else {
        await addAssignment(formData);
      }

      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Ошибка сохранения. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm m-0"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingId ? "Редактировать задание" : "Новое задание"}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название задания <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Например: Подготовиться к экзамену"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Предмет
            </label>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setIsCustomSubject(false)}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition ${
                  !isCustomSubject
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Выбрать из списка
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomSubject(true);
                  setFormData({ subject: "" });
                }}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition ${
                  isCustomSubject
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Ввести вручную
              </button>
            </div>

            {!isCustomSubject ? (
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ subject: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Выберите предмет</option>
                  {subjectsFromSchedules.map(
                    (subject: string, index: number) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ),
                  )}
                </select>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Например: Вышмат"
                value={formData.subject}
                onChange={(e) => setFormData({ subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Дедлайн <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ deadline: e.target.value })}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Можно выбрать дату от сегодня до{" "}
              {new Date(maxDateStr).toLocaleDateString("ru-RU")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Приоритет
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
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
                  : "Добавить"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

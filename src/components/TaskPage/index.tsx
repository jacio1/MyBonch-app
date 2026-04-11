"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Clock,
  MoreVertical,
  Loader,
  X,
  Save,
  Trash2,
  CheckCircle2,
  Circle,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { Assignment } from "@/src/types";
import { useData } from "@/src/lib/DataContext";

type FilterType = "all" | "active" | "completed" | "high" | "medium" | "low";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  editingId,
  subjects,
}: any) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const [isCustomSubject, setIsCustomSubject] = useState(
    !formData.subject || !subjects.includes(formData.subject),
  );

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
            {editingId ? "Редактировать задание" : "Новое задание"}
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
              Название задания <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Например: Подготовиться к экзамену"
              value={formData.title}
              onChange={(e) =>
                onFormChange({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Предмет
            </label>

            {/* Переключатель между выбором из списка и ручным вводом */}
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
                  onFormChange({ ...formData, subject: "" });
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
              // Выбор из существующих предметов
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    onFormChange({ ...formData, subject: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Выберите предмет</option>
                  {subjects.map((subject: string, index: number) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              // Ручной ввод
              <input
                type="text"
                placeholder="Например: Вышмат"
                value={formData.subject}
                onChange={(e) =>
                  onFormChange({ ...formData, subject: e.target.value })
                }
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
              onChange={(e) =>
                onFormChange({ ...formData, deadline: e.target.value })
              }
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
                onFormChange({
                  ...formData,
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

export default function TaskPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    assignments,
    schedules,
    loading,
    error,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>("active");
  const [formData, setFormData] = useState<Omit<Assignment, "id">>({
    title: "",
    subject: "",
    deadline: "",
    completed: false,
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем уникальные предметы из расписания
  const subjectsFromSchedules = useMemo(() => {
    const subjects = new Set<string>();
    schedules.forEach((schedule) => {
      if (schedule.subject_name) {
        subjects.add(schedule.subject_name);
      }
    });
    return Array.from(subjects).sort();
  }, [schedules]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return "";
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      deadline: "",
      completed: false,
      priority: "medium",
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.deadline) {
        alert("Заполните название и дедлайн");
        setIsSubmitting(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      maxDate.setHours(0, 0, 0, 0);

      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        alert(
          "Нельзя создать задание с датой дедлайна раньше сегодняшнего дня",
        );
        setIsSubmitting(false);
        return;
      }

      if (deadlineDate > maxDate) {
        alert(
          `Дедлайн не может быть позже ${maxDate.toLocaleDateString("ru-RU")}`,
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
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Ошибка сохранения. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await updateAssignment(id, { completed: !completed });
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Ошибка обновления. Попробуйте снова.");
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      deadline: assignment.deadline,
      completed: assignment.completed,
      priority: assignment.priority,
    });
    setEditingId(assignment.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить это задание?")) {
      try {
        await deleteAssignment(id);
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Ошибка удаления. Попробуйте снова.");
      }
    }
  };

  const getFilteredAssignments = () => {
    let filtered = assignments;

    if (filter === "active") {
      filtered = filtered.filter((a) => !a.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((a) => a.completed);
    } else if (["high", "medium", "low"].includes(filter)) {
      filtered = filtered.filter((a) => a.priority === filter);
    }

    return filtered.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );
  };

  const filteredAssignments = getFilteredAssignments();
  const activeCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Загрузка заданий...
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
    <div className=" sm:p-8 transition-colors mx-auto space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Задания
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {activeCount} активных, {completedCount} выполнено
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition"
          >
            <Plus className="h-4 w-4" />
            <span>Новое задание</span>
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      <TaskModal
        isOpen={showAddForm}
        onClose={resetForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        onFormChange={setFormData}
        editingId={editingId}
        subjects={subjectsFromSchedules}
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["all", "active", "completed"] as const).map((f) => {
          const labels = {
            all: "Все",
            active: "Активные",
            completed: "Выполненные",
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Priority Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["high", "medium", "low"] as const).map((p) => {
          const labels = { high: "Высокий", medium: "Средний", low: "Низкий" };
          const priorityColors = {
            high:
              filter === p
                ? "bg-red-600 text-white"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
            medium:
              filter === p
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
            low:
              filter === p
                ? "bg-green-600 text-white"
                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
          };
          return (
            <button
              key={p}
              onClick={() => setFilter(filter === p ? "all" : p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition ${priorityColors[p]}`}
            >
              {labels[p]}
            </button>
          );
        })}
      </div>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border p-4 sm:p-6 hover:shadow-md transition ${
                assignment.completed ? "bg-gray-50 dark:bg-gray-800/50" : ""
              } border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Checkbox */}
                  <button
                    onClick={() =>
                      handleToggleComplete(assignment.id, assignment.completed)
                    }
                    className="flex-shrink-0 mt-1 text-indigo-600 hover:text-indigo-700 transition"
                  >
                    {assignment.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-base sm:text-lg transition ${
                        assignment.completed
                          ? "text-gray-500 dark:text-gray-500 line-through"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {assignment.title}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      {assignment.subject && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {assignment.subject}
                        </span>
                      )}
                      {assignment.subject && assignment.deadline && (
                        <span>•</span>
                      )}
                      {assignment.deadline && (
                        <span className="flex items-center whitespace-nowrap">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {new Date(assignment.deadline).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Priority & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(
                      assignment.priority,
                    )}`}
                  >
                    {getPriorityLabel(assignment.priority)}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-1 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition"
                      title="Редактировать"
                    >
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-1 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center shadow-sm">
          <CheckCircle2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
            {filter === "completed"
              ? "Нет выполненных заданий"
              : "Нет активных заданий"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {filter === "completed"
              ? "Вы еще не выполнили задания"
              : "Все задания выполнены, отличная работа!"}
          </p>
          {filter !== "completed" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition"
            >
              Добавить задание
            </button>
          )}
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

'use client';

import { useState, useEffect } from 'react';
import { Filter, Plus, Clock, MoreVertical, Loader, X, Save, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { Assignment } from '@/src/types';
import { useData } from '@/src/lib/DataContext';

type FilterType = 'all' | 'active' | 'completed' | 'high' | 'medium' | 'low';

export default function TaskPage() {
  const { user, loading: authLoading } = useAuth();
  const { assignments, loading, error, addAssignment, updateAssignment, deleteAssignment } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('active');
  const [formData, setFormData] = useState<Omit<Assignment, 'id'>>({
    title: '',
    subject: '',
    deadline: '',
    completed: false,
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      deadline: '',
      completed: false,
      priority: 'medium',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.deadline) {
        alert('Заполните название и дедлайн');
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
      console.error('Error saving assignment:', error);
      alert('Ошибка сохранения. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await updateAssignment(id, { completed: !completed });
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Ошибка обновления. Попробуйте снова.');
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
    if (confirm('Вы уверены, что хотите удалить это задание?')) {
      try {
        await deleteAssignment(id);
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Ошибка удаления. Попробуйте снова.');
      }
    }
  };

  const getFilteredAssignments = () => {
    let filtered = assignments;

    if (filter === 'active') {
      filtered = filtered.filter((a) => !a.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((a) => a.completed);
    } else if (['high', 'medium', 'low'].includes(filter)) {
      filtered = filtered.filter((a) => a.priority === filter);
    }

    return filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  };

  const filteredAssignments = getFilteredAssignments();
  const activeCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Загрузка заданий...</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Задания</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {activeCount} активных, {completedCount} выполнено
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm sm:text-base transition">
            <Filter className="h-4 w-4" />
            <span>Фильтр</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition"
          >
            <Plus className="h-4 w-4" />
            <span>Новое задание</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? 'Редактировать задание' : 'Добавить новое задание'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <input
                type="text"
                placeholder="Название задания"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:col-span-2"
                required
              />

              {/* Subject */}
              <input
                type="text"
                placeholder="Предмет"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {/* Deadline */}
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />

              {/* Priority */}
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:col-span-2"
              >
                <option value="low">Низкий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="high">Высокий приоритет</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Сохраняем...' : editingId ? 'Обновить' : 'Добавить'}
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

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'active', 'completed'] as const).map((f) => {
          const labels = { all: 'Все', active: 'Активные', completed: 'Выполненные' };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Priority Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['high', 'medium', 'low'] as const).map((p) => {
          const labels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
          return (
            <button
              key={p}
              onClick={() => setFilter(filter === p ? 'all' : p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                filter === p
                  ? getPriorityColor(p) + ' ring-2 ring-offset-2'
                  : 'bg-white border hover:bg-gray-50'
              }`}
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
              className={`bg-white rounded-xl border p-4 sm:p-6 hover:shadow-md transition ${
                assignment.completed ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(assignment.id, assignment.completed)}
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
                          ? 'text-gray-500 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {assignment.title}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 flex-wrap">
                      {assignment.subject && <span>{assignment.subject}</span>}
                      {assignment.subject && assignment.deadline && <span>•</span>}
                      {assignment.deadline && (
                        <span className="flex items-center whitespace-nowrap">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {new Date(assignment.deadline).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Priority & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(
                      assignment.priority
                    )}`}
                  >
                    {getPriorityLabel(assignment.priority)}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-1 sm:p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                      title="Редактировать"
                    >
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-1 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
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
        <div className="bg-white rounded-xl border p-8 sm:p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">
            {filter === 'completed' ? 'Нет выполненных заданий' : 'Нет активных заданий'}
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {filter === 'completed'
              ? 'Вы еще не выполнили задания'
              : 'Все задания выполнены, отличная работа!'}
          </p>
          {filter !== 'completed' && (
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
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Ошибка: {error}</p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Home, ChevronRight, MoreVertical, Plus, Loader, X, Save, Trash2 } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { Subject } from '@/src/types';
import { useData } from '@/src/lib/DataContext';

export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const { subjects, loading, error, addSubject, updateSubject, deleteSubject } = useData();
  const [selectedDay, setSelectedDay] = useState<string>('Пн');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
    name: '',
    teacher: '',
    room: '',
    time: '',
    day: 'Пн',
    color: 'bg-blue-100',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-red-100', 'bg-pink-100'];

  const resetForm = () => {
    setFormData({
      name: '',
      teacher: '',
      room: '',
      time: '',
      day: 'Пн',
      color: 'bg-blue-100',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateSubject(editingId, formData);
      } else {
        await addSubject(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
      alert('Ошибка сохранения. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name,
      teacher: subject.teacher,
      room: subject.room,
      time: subject.time,
      day: subject.day,
      color: subject.color,
    });
    setEditingId(subject.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту пару?')) {
      try {
        await deleteSubject(id);
      } catch (error) {
        console.error('Error deleting subject:', error);
        alert('Ошибка удаления. Попробуйте снова.');
      }
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

  const filteredSubjects = subjects.filter((s) => s.day === selectedDay);

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Расписание занятий</h2>
          <p className="text-gray-200 text-sm sm:text-base">3 семестр</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
          <button className="px-3 sm:px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-800 text-sm sm:text-base transition ">
            Неделя
          </button>
          <button className="px-3 sm:px-4 py-2 bg-indigo-600  rounded-lg hover:bg-indigo-800 text-sm sm:text-base transition">
            Месяц
          </button>
          <button className="px-3 sm:px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-800 text-sm sm:text-base transition">
            Семестр
          </button>
        </div>
      </div>

      {/* Day Selection */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium whitespace-nowrap transition text-sm sm:text-base ${
              selectedDay === day ? 'bg-indigo-600 text-white' : 'bg-[#0A0A0A] border hover:bg-[#1c1c1c]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? 'Редактировать пару' : 'Добавить новую пару'}
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
              {/* Subject Name */}
              <input
                type="text"
                placeholder="Название предмета"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />

              {/* Teacher */}
              <input
                type="text"
                placeholder="Преподаватель"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {/* Room */}
              <input
                type="text"
                placeholder="Аудитория"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {/* Time */}
              <input
                type="text"
                placeholder="Время (9:00-10:35)"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {/* Day */}
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              {/* Color */}
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
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

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="bg-[#1c1c1c] rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
            <div className={`p-3 sm:p-4 ${subject.color}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-gray-800">{subject.name}</h3>
                  <p className="text-sm text-gray-700">{subject.teacher}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition"
                    title="Редактировать"
                  >
                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="flex items-center whitespace-nowrap">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {subject.time}
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                    <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {subject.room}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleEdit(subject)}
                  className="flex-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1 rounded hover:bg-indigo-50 transition"
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="flex-1 text-sm text-red-600 hover:text-red-800 font-medium py-1 rounded hover:bg-red-50 transition"
                >
                  <Trash2 className="h-4 w-4 inline mr-1" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!showAddForm && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Добавить пару
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredSubjects.length === 0 && !showAddForm && (
        <div className="bg-white rounded-xl border p-8 sm:p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">Пар нет</h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">В этот день у вас нет занятий</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition"
          >
            Добавить пару
          </button>
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
'use client';

import { useState } from 'react';
import { Plus, X, Save, Trash2, Loader, Search } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { Note } from '@/src/types';
import { useData } from '@/src/lib/DataContext';

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const { notes, loading, error, addNote, updateNote, deleteNote } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Omit<Note, 'id'>>({
    title: '',
    subject: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setShowAddForm(false);
    setShowPreview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.content) {
        alert('Заполните название и содержание заметки');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateNote(editingId, formData);
      } else {
        await addNote(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Ошибка сохранения. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      subject: note.subject,
      content: note.content,
      date: note.date,
    });
    setEditingId(note.id);
    setShowAddForm(true);
    setShowPreview(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await deleteNote(id);
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Ошибка удаления. Попробуйте снова.');
      }
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Загрузка заметок...</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Конспекты и заметки</h2>
          <p className="text-gray-500 text-sm sm:text-base">Ваши учебные материалы</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Новая заметка</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск заметок по названию, предмету или содержанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? 'Редактировать заметку' : 'Добавить новую заметку'}
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
                placeholder="Название заметки"
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

              {/* Date */}
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Content */}
            <textarea
              placeholder="Содержание заметки..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none min-h-40"
              required
            />

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                {showPreview ? 'Редактировать' : 'Предпросмотр'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Сохраняем...' : editingId ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Отмена
              </button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-bold text-lg mb-2">{formData.title || 'Название заметки'}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {formData.subject && <span className="font-medium">{formData.subject}</span>}
                  {formData.subject && formData.date && <span> • </span>}
                  {formData.date && <span>{new Date(formData.date).toLocaleDateString('ru-RU')}</span>}
                </p>
                <div className="text-gray-700 whitespace-pre-wrap">{formData.content}</div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedNote(note);
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">
                    {note.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {note.subject || 'Без предмета'}
                  </p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0">
                  {new Date(note.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {note.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t gap-2 flex-wrap">
                <div className="flex gap-1">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    Заметка
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm hover:bg-indigo-50 px-2 py-1 rounded transition"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm hover:bg-red-50 px-2 py-1 rounded transition"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 inline" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Button Card */}
        {!showAddForm && (
          <div
            onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 sm:p-12 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-700 text-center">Добавить заметку</h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 text-center">
              Запишите конспект лекции или важные мысли
            </p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && !showAddForm && (
        <div className="bg-white rounded-xl border p-8 sm:p-12 text-center">
          <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">
            {searchQuery ? 'Заметки не найдены' : 'Нет заметок'}
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {searchQuery
              ? 'Попробуйте изменить поисковый запрос'
              : 'Создайте первую заметку, чтобы начать'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition"
            >
              Создать заметку
            </button>
          )}
        </div>
      )}

      {/* Detail View Modal */}
      {selectedNote && !showAddForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{selectedNote.title}</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {selectedNote.subject && <span className="font-medium">{selectedNote.subject}</span>}
                  {selectedNote.subject && selectedNote.date && <span> • </span>}
                  {selectedNote.date && <span>{new Date(selectedNote.date).toLocaleDateString('ru-RU')}</span>}
                </p>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="prose prose-sm sm:prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                  {selectedNote.content}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 sm:p-6 flex gap-2">
              <button
                onClick={() => {
                  handleEdit(selectedNote);
                  setSelectedNote(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedNote.id);
                  setSelectedNote(null);
                }}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition text-sm sm:text-base"
              >
                Удалить
              </button>
            </div>
          </div>
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
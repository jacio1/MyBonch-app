"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  Save,
  Trash2,
  Loader,
  Search,
  FileText,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { Note, Attachment } from "@/src/types";
import { useData } from "@/src/lib/DataContext";
import { FileUploader } from "@/src/components/FileUploader";

const NoteModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  editingId,
  showPreview,
  onTogglePreview,
  noteId,
  onFileUpload,
  onDeleteAttachment,
  noteAttachments = [],
  isUploadingFiles = false,
  subjects = [],
}: any) => {
  if (!isOpen) return null;

  const [isCustomSubject, setIsCustomSubject] = useState(
    !formData.subject || !subjects.includes(formData.subject),
  );

  return (
    <div
      className="m-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingId ? "Редактировать заметку" : "Новая заметка"}
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
              Название заметки <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Например: Конспект лекции по математике"
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
                placeholder="Например: Математика"
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
              Содержание <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Введите текст заметки..."
              value={formData.content}
              onChange={(e) =>
                onFormChange({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-40"
              required
            />
          </div>

          {/* Вложения */}
          {noteId && onFileUpload && onDeleteAttachment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Вложения (фотографии и документы)
              </label>
              <FileUploader
                noteId={noteId}
                onUpload={onFileUpload}
                onDelete={onDeleteAttachment}
                attachments={noteAttachments}
                isUploading={isUploadingFiles}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onTogglePreview}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {showPreview ? "Редактировать" : "Предпросмотр"}
            </button>
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

          {/* Preview */}
          {showPreview && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                {formData.title || "Название заметки"}
              </h4>
              {formData.subject && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">{formData.subject}</span>
                </p>
              )}
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {formData.content || "Содержание заметки..."}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const NotePreviewModal = ({ note, onClose, onEdit, onDelete }: any) => {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
              {note.title}
            </h2>
            {note.subject && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium">{note.subject}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {note.subject && " Дата создания:"}{" "}
                  {new Date(note.date).toLocaleDateString("ru-RU")}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition shrink-0 ml-2 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm sm:text-base wrap-break-word">
              {note.content}
            </p>
          </div>

          {/* Отображение вложений */}
          {note.attachments && note.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Вложения ({note.attachments.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {note.attachments.map((attachment: Attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
                  >
                    {attachment.file_type === "image" ? (
                      <div className="relative">
                        <img
                          src={attachment.file_url}
                          alt={attachment.file_name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-2" />
                      </div>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate text-center">
                      {attachment.file_name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex gap-2">
          <button
            onClick={() => {
              onEdit(note);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Редактировать
          </button>
          <button
            onClick={() => {
              onDelete(note.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    notes,
    schedules,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    addAttachment,
    deleteAttachment,
    getNoteAttachments,
    uploadingFiles,
  } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Omit<Note, "id">>({
    title: "",
    subject: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentNoteAttachments, setCurrentNoteAttachments] = useState<
    Attachment[]
  >([]);

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

  useEffect(() => {
    if (editingId) {
      const attachments = getNoteAttachments(editingId);
      setCurrentNoteAttachments(attachments);
    } else {
      setCurrentNoteAttachments([]);
    }
  }, [editingId, getNoteAttachments]);

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setShowAddForm(false);
    setShowPreview(false);
    setCurrentNoteAttachments([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.content) {
        alert("Заполните название и содержание заметки");
        setIsSubmitting(false);
        return;
      }

      const dataToSave = editingId
        ? formData
        : { ...formData, date: new Date().toISOString().split("T")[0] };

      if (editingId) {
        await updateNote(editingId, dataToSave);
      } else {
        const newNote = await addNote(dataToSave);
        if (newNote) {
          setEditingId(newNote.id);
        }
      }

      if (!editingId) {
        setFormData({
          title: "",
          subject: "",
          content: "",
          date: new Date().toISOString().split("T")[0],
        });
      } else {
        resetForm();
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Ошибка сохранения. Попробуйте снова.");
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
    if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
      try {
        await deleteNote(id);
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Ошибка удаления. Попробуйте снова.");
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!editingId) {
      alert("Сначала сохраните заметку, затем добавляйте файлы");
      return;
    }

    try {
      await addAttachment(editingId, file);
      const updatedAttachments = getNoteAttachments(editingId);
      setCurrentNoteAttachments(updatedAttachments);

      if (selectedNote && selectedNote.id === editingId) {
        const updatedNote = {
          ...selectedNote,
          attachments: updatedAttachments,
        };
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Ошибка загрузки файла");
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (confirm("Удалить этот файл?")) {
      try {
        await deleteAttachment(attachmentId);
        const updatedAttachments = editingId
          ? getNoteAttachments(editingId)
          : [];
        setCurrentNoteAttachments(updatedAttachments);

        if (selectedNote && selectedNote.id === editingId) {
          const updatedNote = {
            ...selectedNote,
            attachments: updatedAttachments,
          };
          setSelectedNote(updatedNote);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Ошибка удаления файла");
      }
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Загрузка заметок...
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
    <div className="sm:p-8 transition-colors mx-auto space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Конспекты и заметки
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Ваши учебные материалы
          </p>
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Поиск заметок по названию, предмету или содержанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Модальное окно для добавления/редактирования */}
      <NoteModal
        isOpen={showAddForm}
        onClose={resetForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        onFormChange={setFormData}
        editingId={editingId}
        showPreview={showPreview}
        onTogglePreview={togglePreview}
        noteId={editingId}
        onFileUpload={handleFileUpload}
        onDeleteAttachment={handleDeleteAttachment}
        noteAttachments={currentNoteAttachments}
        isUploadingFiles={uploadingFiles}
        subjects={subjectsFromSchedules}
      />

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              const attachments = getNoteAttachments(note.id);
              setSelectedNote({ ...note, attachments });
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <BookOpen className="h-3 w-3 text-gray-400" />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {note.subject || "Без предмета"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 shrink-0">
                  {new Date(note.date).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 wrap-break-word">
                {note.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-2 flex-wrap">
                <div className="flex gap-1">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                    Заметка
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                    className="bg-indigo-600 text-white font-medium text-xs sm:text-sm hover:bg-indigo-700 px-2 py-1 rounded transition"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-xs sm:text-sm hover:bg-red-50 dark:hover:bg-red-950/50 px-2 py-1 rounded transition"
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
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center p-8 sm:p-12 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white text-center">
              Добавить заметку
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 text-center">
              Запишите конспект лекции или важные мысли
            </p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && !showAddForm && searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Ничего не найдено по запросу {searchQuery}
          </p>
        </div>
      )}

      {filteredNotes.length === 0 && !showAddForm && !searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            У вас пока нет заметок. Создайте первую заметку!
          </p>
        </div>
      )}

      {/* Модальное окно для просмотра заметки */}
      <NotePreviewModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

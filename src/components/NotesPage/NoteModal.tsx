"use client";

import { useState, useEffect } from "react";
import { X, Save, BookOpen } from "lucide-react";
import { useData } from "@/src/lib/DataContext";
import { FileUploader } from "@/src/components/FileUploader";
import { useNoteFormStore } from "@/src/stores/noteFormStore";
import { useModalStore } from "@/src/stores/useModalStore";
import { Attachment } from "@/src/types";

export function NoteModal() {
  const { activeModal, closeModal } = useModalStore();
  const {
    formData,
    editingId,
    isSubmitting,
    showPreview,
    attachments,
    setFormData,
    resetForm,
    setIsSubmitting,
    togglePreview,
    setAttachments,
  } = useNoteFormStore();
  const {
    addNote,
    updateNote,
    addAttachment: addNoteAttachment,
    deleteAttachment,
    getNoteAttachments,
    uploadingFiles,
    schedules,
  } = useData();

  const isOpen = activeModal === "note";
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const subjectsFromSchedules = (() => {
    const subjects = new Set<string>();
    schedules.forEach((schedule) => {
      if (schedule.subject_name) {
        subjects.add(schedule.subject_name);
      }
    });
    return Array.from(subjects).sort();
  })();

  const [isCustomSubject, setIsCustomSubject] = useState(
    !formData.subject || !subjectsFromSchedules.includes(formData.subject),
  );

  useEffect(() => {
    if (editingId) {
      const noteAttachments = getNoteAttachments(editingId);
      setAttachments(noteAttachments);
      setPendingFiles([]);
    } else {
      setAttachments([]);
      setPendingFiles([]);
    }
  }, [editingId, getNoteAttachments, setAttachments]);

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
        resetForm();
        setPendingFiles([]);
        closeModal();
      } else {
        const newNote = await addNote(dataToSave);
        if (newNote && pendingFiles.length > 0) {
          for (const file of pendingFiles) {
            try {
              await addNoteAttachment(newNote.id, file);
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
          attachments.forEach(attachment => {
            if (attachment.file_url && attachment.id.toString().startsWith("temp_")) {
              URL.revokeObjectURL(attachment.file_url);
            }
          });
        }
        resetForm();
        setAttachments([]);
        setPendingFiles([]);
        closeModal();
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Ошибка сохранения. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    attachments.forEach(attachment => {
      if (attachment.file_url && attachment.id.toString().startsWith("temp_")) {
        URL.revokeObjectURL(attachment.file_url);
      }
    });
    resetForm();
    setAttachments([]);
    setPendingFiles([]);
    closeModal();
  };

  const handleFileUpload = async (file: File) => {
    if (editingId) {
      try {
        await addNoteAttachment(editingId, file);
        const updatedAttachments = getNoteAttachments(editingId);
        setAttachments(updatedAttachments);
      } catch (error) {
        console.error("Upload error:", error);
        alert(error instanceof Error ? error.message : "Ошибка загрузки файла");
      }
    } else {
      const tempId = `temp_${Date.now()}_${file.name}`;
      const tempAttachment: Attachment = {
        id: tempId,
        note_id: 0,
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        file_type: file.type.startsWith("image/") ? "image" : "document",
        file_size: file.size,
        mime_type: file.type,
        created_at: new Date().toISOString(),
      };
      setAttachments([...attachments, tempAttachment]);
      setPendingFiles(prev => [...prev, file]);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (confirm("Удалить этот файл?")) {
      if (attachmentId.startsWith("temp_")) {
        const attachmentToDelete = attachments.find(a => a.id === attachmentId);
        if (attachmentToDelete && attachmentToDelete.file_url) {
          URL.revokeObjectURL(attachmentToDelete.file_url);
        }
        const newAttachments = attachments.filter(a => a.id !== attachmentId);
        setAttachments(newAttachments);
        
        const indexToRemove = attachments.findIndex(a => a.id === attachmentId);
        if (indexToRemove !== -1) {
          setPendingFiles(prev => prev.filter((_, i) => i !== indexToRemove));
        }
      } 
      else if (editingId) {
        try {
          await deleteAttachment(attachmentId);
          const updatedAttachments = getNoteAttachments(editingId);
          setAttachments(updatedAttachments);
        } catch (error) {
          console.error("Delete error:", error);
          alert("Ошибка удаления файла");
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm m-0"
      onClick={handleClose}
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
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название заметки <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Например: Конспект лекции по математике"
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
                placeholder="Например: Математика"
                value={formData.subject}
                onChange={(e) => setFormData({ subject: e.target.value })}
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
              onChange={(e) => setFormData({ content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Вложения (фотографии и документы)
              {!editingId && pendingFiles.length > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  (будут загружены после создания заметки)
                </span>
              )}
            </label>
            <FileUploader
              noteId={editingId || 0}
              onUpload={handleFileUpload}
              onDelete={handleDeleteAttachment}
              attachments={attachments}
              isUploading={uploadingFiles}
              isNewNote={!editingId}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={togglePreview}
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
              onClick={handleClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg transition"
            >
              Отмена
            </button>
          </div>

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
              <div className="wrap-break-word text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {formData.content || "Содержание заметки..."}
              </div>
              {attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Вложений: {attachments.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
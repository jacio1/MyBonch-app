"use client";

import { FileText, X } from "lucide-react";
import { useData } from "@/src/lib/DataContext";
import { Attachment } from "@/src/types";
import { useModalStore } from "@/src/stores/useModalStore";
import { useNoteFormStore } from "@/src/stores/noteFormStore";
import Image from "next/image";

export function NotePreviewModal() {
  const { activeModal, modalProps, closeModal } = useModalStore();
  const { setEditing } = useNoteFormStore();
  const { deleteNote } = useData();

  const note = modalProps.note;
  const isOpen = activeModal === "previewNote";

  const handleEdit = () => {
    if (note) {
      setEditing(note.id, {
        title: note.title,
        subject: note.subject,
        content: note.content,
        date: note.date,
      });
      closeModal();
      const { openModal } = useModalStore.getState();
      openModal("note");
    }
  };

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
      try {
        await deleteNote(note.id);
        closeModal();
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Ошибка удаления. Попробуйте снова.");
      }
    }
  };

  if (!isOpen || !note) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 m-0"
      onClick={closeModal}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white wrap-break-word">
              {note.title}
            </h2>
            {note.subject && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium">{note.subject}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {" Дата создания:"}{" "}
                  {new Date(note.date).toLocaleDateString("ru-RU")}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={closeModal}
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
                        <Image
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
            onClick={handleEdit}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Редактировать
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Loader, Search, BookOpen } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { useData } from "@/src/lib/DataContext";
import { useModalStore } from "@/src/stores/useModalStore";
import { useNoteFormStore } from "@/src/stores/noteFormStore";
import { NoteModal } from "./NoteModal";
import { NotePreviewModal } from "./NotePreviewModal";

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const { notes, loading, error, getNoteAttachments } = useData();
  const { openModal } = useModalStore();
  const { resetForm } = useNoteFormStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddClick = () => {
    resetForm();
    openModal("note");
  };

  const handleNoteClick = (note: any) => {
    const attachments = getNoteAttachments(note.id);
    openModal("previewNote", { note: { ...note, attachments } });
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
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm sm:text-base transition w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
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

      {/* Модальные окна */}
      <NoteModal />
      <NotePreviewModal />

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNoteClick(note)}
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
              </div>
            </div>
          </div>
        ))}


      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Ничего не найдено по запросу {searchQuery}
          </p>
        </div>
      )}

      {filteredNotes.length === 0 && !searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            У вас пока нет заметок. Создайте первую заметку!
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

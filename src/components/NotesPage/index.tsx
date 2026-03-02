"use client";
import { Note } from "@/src/types";
import { Plus } from "lucide-react";

interface NotesPageProps {
  notes: Note[];
}

export default function NotesPage({ notes }: NotesPageProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Конспекты и заметки
          </h2>
          <p className="text-gray-500">Ваши учебные материалы</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          <span>Новая заметка</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-[#1c1c1c] rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {note.title}
                  </h3>
                  <p className="text-white">{note.subject}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {note.date}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{note.content}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    PDF
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    Конспект
                  </span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800">
                  Открыть →
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-12 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-medium text-gray-700">
            Добавить заметку
          </h3>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Запишите конспект лекции или важные мысли
          </p>
        </div>
      </div>
    </div>
  );
}
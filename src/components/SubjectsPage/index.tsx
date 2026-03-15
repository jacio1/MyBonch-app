"use client";

import { useState } from "react";
import { Plus, Loader, BookOpen, Users, MapPin } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { useData } from "@/src/lib/DataContext";

export default function SubjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const { subjects, loading, error } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = subjects.filter((subject) => {
    const query = searchQuery.toLowerCase();
    return (
      subject.name.toLowerCase().includes(query) ||
      subject.teacher.toLowerCase().includes(query) ||
      subject.room.toLowerCase().includes(query)
    );
  });

  const uniqueSubjects = Array.from(
    new Map(subjects.map((s) => [s.name.toLowerCase(), s])).values(),
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Загрузка дисциплин...</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Дисциплины
          </h2>
          <p className="text-gray-200 text-sm sm:text-base">
            {uniqueSubjects.length} дисциплин в расписании
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition w-full sm:w-auto justify-center sm:justify-start">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Добавить дисциплину</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию предмета, преподавателю или аудитории..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {uniqueSubjects
          .filter((subject) => {
            const query = searchQuery.toLowerCase();
            return (
              subject.name.toLowerCase().includes(query) ||
              subject.teacher.toLowerCase().includes(query) ||
              subject.room.toLowerCase().includes(query)
            );
          })
          .map((subject) => {
            const subjectSchedules = subjects.filter(
              (s) => s.name.toLowerCase() === subject.name.toLowerCase(),
            );

            return (
              <div
                key={subject.id}
                className={`${subject.color} rounded-xl border p-4 sm:p-6 hover:shadow-md transition`}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-10 h-10 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-700" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {subject.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{subject.teacher || "Не указан"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{subject.room || "Не указана"}</span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-50">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Расписание:
                  </p>
                  <div className="space-y-1">
                    {subjectSchedules.map((schedule, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-700 bg-white bg-opacity-50 rounded px-2 py-1"
                      >
                        {schedule.day} • {schedule.time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-white bg-opacity-60 text-gray-800 font-medium rounded-lg hover:bg-opacity-100 transition text-sm">
                    Редактировать
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition text-sm">
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="bg-white rounded-xl border p-8 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-700">
            {searchQuery ? "Дисциплины не найдены" : "Нет дисциплин"}
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {searchQuery
              ? "Попробуйте изменить поисковый запрос"
              : "Добавьте дисциплины в расписание"}
          </p>
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

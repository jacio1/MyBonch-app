"use client";
import { useState } from "react";
import { Calendar, Clock, Home, ChevronRight, MoreVertical } from "lucide-react";
import ScheduleTaskInfo from "../SchedulePage/ScheduleTaskInfo";
import { Subject } from "@/src/types";

interface SchedulePageProps {
  subjects: Subject[];
}

export default function SchedulePage({ subjects }: SchedulePageProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Пн");
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Расписание занятий
          </h2>
          <p className="text-gray-500">3 семестр</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            Неделя
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            Месяц
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Семестр
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-lg font-medium ${
              selectedDay === day
                ? "bg-indigo-600 text-white"
                : "bg-[#0A0A0A] border hover:bg-[#1c1c1c]"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects
          .filter((subject) => subject.day === selectedDay)
          .map((subject) => (
            <div
              key={subject.id}
              className="bg-[#1c1c1c] rounded-xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`p-4 ${subject.color}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {subject.name}
                    </h3>
                    <p className="text-gray-700">{subject.teacher}</p>
                  </div>
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {subject.time}
                    </span>
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {subject.room}
                    </span>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                    Задания <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <ScheduleTaskInfo />
              </div>
            </div>
          ))}
      </div>

      {subjects.filter((s) => s.day === selectedDay).length === 0 && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700">Пар нет</h3>
          <p className="text-gray-500 mt-2">
            В этот день у вас нет занятий
          </p>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Добавить пару
          </button>
        </div>
      )}
    </div>
  );
}
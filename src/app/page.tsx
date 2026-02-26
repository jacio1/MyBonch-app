"use client";
import {
  Calendar,
  CheckSquare,
  FileText,
  Home,
  User,
  Clock,
  BookOpen,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  BellRing,
} from "lucide-react";
import { useState } from "react";
import ScheduleTaskInfo from "../components/SchedulePage/ScheduleTaskInfo";
import TaskInfoCard from "../components/TaskPage/TaskInfoCard";
type Subject = {
  id: number;
  name: string;
  teacher: string;
  room: string;
  time: string;
  day: string;
  color: string;
};

type Assignment = {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
};

type Note = {
  id: number;
  title: string;
  subject: string;
  content: string;
  date: string;
};

const initialSubjects: Subject[] = [
  {
    id: 1,
    name: "вышмат",
    teacher: "Климов",
    room: "522/2",
    time: "9:00-10:35",
    day: "Пн",
    color: "bg-blue-100",
  },
  {
    id: 2,
    name: "вышмат",
    teacher: "Климов",
    room: "522/2",
    time: "9:00-10:35",
    day: "Пн",
    color: "bg-green-100",
  },
  {
    id: 3,
    name: "вышмат",
    teacher: "Климов",
    room: "522/2",
    time: "9:00-10:35",
    day: "Пн",
    color: "bg-purple-100",
  },
  {
    id: 4,
    name: "вышмат",
    teacher: "Климов",
    room: "522/2",
    time: "9:00-10:35",
    day: "Пн",
    color: "bg-yellow-100",
  },
  {
    id: 5,
    name: "вышмат",
    teacher: "Климов",
    room: "522/2",
    time: "9:00-10:35",
    day: "Пн",
    color: "bg-red-100",
  },
];

const initialAssignments: Assignment[] = [
  {
    id: 1,
    title: "шрифтовая композиция",
    subject: "гунина",
    deadline: "2025-09-12",
    completed: false,
    priority: "high",
  },
  {
    id: 2,
    title: "дз",
    subject: "вышмат",
    deadline: "2025-09-12",
    completed: false,
    priority: "high",
  },
  {
    id: 3,
    title: "дз",
    subject: "вышмат",
    deadline: "2025-09-12",
    completed: false,
    priority: "high",
  },
  {
    id: 4,
    title: "дз",
    subject: "вышмат",
    deadline: "2025-09-12",
    completed: false,
    priority: "high",
  },
];

const initialNotes: Note[] = [
  {
    id: 1,
    title: "вышмат",
    subject: "вышмат",
    content: "интегралы",
    date: "2025-09-12",
  },
  {
    id: 2,
    title: "вышмат",
    subject: "вышмат",
    content: "интегралы",
    date: "2025-09-12",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    "schedule" | "assignments" | "notes"
  >("schedule");
  const [selectedDay, setSelectedDay] = useState<string>("Пн");
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [assignments] = useState<Assignment[]>(initialAssignments);
  const [notes] = useState<Note[]>(initialNotes);

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const getPriorityColor = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">МойБонч</h1>
              <p className="text-sm text-gray-500">
                Ваш персональный помощник в учебе
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
            <BellRing className="h-5 w-5 text-gray-500 cursor-pointer" />
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Гоглев Слава</p>
                <p className="text-sm text-gray-500">4 курс, ИТПИ</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-64 bg-white border-r flex flex-col p-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
              Навигация
            </h2>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === "schedule"
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Расписание</span>
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === "assignments"
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">Задания</span>
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {assignments.filter((a) => !a.completed).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === "notes"
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Конспекты</span>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === "notes"
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Дисциплины</span>
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
              Быстрый доступ
            </h2>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
              <Plus className="h-5 w-5 text-gray-500" />
              <span>Добавить пары</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
              <Plus className="h-5 w-5 text-gray-500" />
              <span>Добавить экзамены</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
              <Plus className="h-5 w-5 text-gray-500" />
              <span>Добавить зачеты</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>Ближайшие дедлайны</span>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t">
            <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-800">До экзаменов</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">24 дня</p>
              <p className="text-xs text-gray-500 mt-2">
                У вас 3 незавершенных задания
              </p>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-auto p-8">
          {activeTab === "schedule" && (
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
                        <ScheduleTaskInfo/>
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
          )}

          {activeTab === "assignments" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Задания</h2>
                  <p className="text-gray-500">
                    Управляйте своими учебными задачами
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Фильтр</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Plus className="h-4 w-4" />
                    <span>Новое задание</span>
                  </button>
                </div>
              </div>

              <TaskInfoCard/>

              <div className="bg-[#1c1c1c] rounded-xl border overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="font-bold text-lg">Текущие задания</h3>
                </div>
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-6 border-b hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            assignment.completed
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {assignment.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{assignment.subject}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Дедлайн: {assignment.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            assignment.priority
                          )}`}
                        >
                          {assignment.priority === "high"
                            ? "Высокий"
                            : assignment.priority === "medium"
                            ? "Средний"
                            : "Низкий"}
                        </span>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
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
          )}
        </main>
      </div>
    </div>
  );
}

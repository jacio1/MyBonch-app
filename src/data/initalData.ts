import { Assignment, Note, Subject } from "../types";

export const initialSubjects: Subject[] = [
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

export const initialAssignments: Assignment[] = [
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

export const initialNotes: Note[] = [
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
export type Subject = {
  id: number;
  name: string;
  teacher: string;
  room: string;
  time: string;
  day: string;
  color: string;
};

export type Assignment = {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
};

export type Note = {
  id: number;
  title: string;
  subject: string;
  content: string;
  date: string;
};
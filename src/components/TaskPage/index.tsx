"use client";
import { Filter, Plus, Clock, MoreVertical } from "lucide-react";
import TaskInfoCard from "../TaskPage/TaskInfoCard";
import { Assignment } from "@/src/types";

interface AssignmentsPageProps {
  assignments: Assignment[];
}

export default function AssignmentsPage({ assignments }: AssignmentsPageProps) {
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

      <TaskInfoCard />

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
                    assignment.completed ? "bg-green-500" : "bg-gray-300"
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
  );
}
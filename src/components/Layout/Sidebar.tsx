'use client'

import { Calendar, CheckSquare, FileText, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  assignmentsCount: number;
}

export default function Sidebar({ assignmentsCount }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/schedule", icon: Calendar, label: "Расписание" },
    {
      href: "/task",
      icon: CheckSquare,
      label: "Задания",
      badge: assignmentsCount,
    },
    { href: "/notes", icon: FileText, label: "Конспекты" },
    { href: "/subjects", icon: FileText, label: "Дисциплины" },
  ];

  return (
    <nav className="w-64 bg-white border-r flex flex-col p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
          Навигация
        </h2>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
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
  );
}

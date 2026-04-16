"use client";

import {
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  Plus,
  User,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  assignmentsCount: number;
}

export default function Sidebar({ assignmentsCount }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: "/schedule", icon: Calendar, label: "Расписание" },
    {
      href: "/tasks",
      icon: CheckSquare,
      label: "Задания",
    },
    { href: "/notes", icon: FileText, label: "Конспекты" },
    { href: "/templates", icon: Settings, label: "Шаблоны" },
    { href: "/profile", icon: User, label: "Профиль" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden sm:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col p-6 space-y-8 transition-colors">
        <div className="space-y-2">
          <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
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
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 "
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className=" pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              До экзаменов
            </p>
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mt-1">
              24 дня
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              У вас {assignmentsCount} незавершенных заданий
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition text-red-600 dark:text-red-400 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Выход</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="px-2 sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors z-10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-3 px-2 transition-all ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 bg-white dark:bg-gray-800 w-64 shadow-lg flex flex-col p-6 space-y-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-500 dark:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-2">
              <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                Быстрый доступ
              </h2>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left text-gray-700 dark:text-gray-300">
                <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">Добавить пары</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left text-gray-700 dark:text-gray-300">
                <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">Добавить экзамены</span>
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition text-red-600 dark:text-red-400 font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Выход</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { Calendar, CheckSquare, FileText, Plus, Clock, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/src/lib/AuthContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  assignmentsCount: number;
}

export default function Sidebar({ assignmentsCount }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: '/schedule', icon: Calendar, label: 'Расписание' },
    {
      href: '/task',
      icon: CheckSquare,
      label: 'Задания',
      badge: assignmentsCount,
    },
    { href: '/notes', icon: FileText, label: 'Конспекты' },
    { href: '/subjects', icon: FileText, label: 'Дисциплины' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className=" hidden sm:flex w-64 bg-white border-[#282829] border-r flex-col p-6 space-y-8">
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
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>



        <div className="m pt-6 border-t">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-gray-800">До экзаменов</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">24 дня</p>
            <p className="text-xs text-gray-500 mt-2">
              У вас {assignmentsCount} незавершенных задания
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition text-red-600 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Выход</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 bg-white w-64 shadow-lg flex flex-col p-6 space-y-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-2">
              <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
                Быстрый доступ
              </h2>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition text-left">
                <Plus className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Добавить пары</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition text-left">
                <Plus className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Добавить экзамены</span>
              </button>
            </div>

            <div className="mt-auto pt-6 border-t">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition text-red-600 font-medium"
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
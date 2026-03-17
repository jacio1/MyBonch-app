'use client';

import { BookOpen, Search, BellRing, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/src/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'Пользователь';

  return (
    <header className="bg-white shadow-sm border-[#282829] border-b px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-bold text-white">МойБонч</h1>
            <p className="text-xs sm:text-sm text-gray-200">Ваш помощник в учебе</p>
          </div>
          <h1 className="text-lg font-bold text-gray-800 sm:hidden">МойБонч</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <Search className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          <BellRing className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          <div className="flex items-center space-x-3 cursor-pointer border-l pl-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-white">{userName}</p>
              <p className="text-xs text-gray-200">4 курс, ИТПИ</p>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 pt-4 border-t space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition text-left">
            <Search className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Поиск</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition text-left">
            <BellRing className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Уведомления</span>
          </button>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">4 курс, ИТПИ</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Выход</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
"use client";

import {
  BookOpen,
  BellRing,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const userName =
    user?.user_metadata?.full_name || user?.email || "Пользователь";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 transition-colors hidden sm:block">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              МойБонч
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Ваш помощник в учебе
            </p>
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:hidden">
            МойБонч
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <BellRing className="h-5 w-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition" />
          <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">{userName}</p>
            </div>
          </div>
        </div>


      </div>


    </header>
  );
}
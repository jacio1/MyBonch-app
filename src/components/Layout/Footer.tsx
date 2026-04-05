"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 transition-colors">
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
        <div className="space-x-3">
          <Link
            href="/tos"
            target="_blank"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline-offset-2 hover:underline"
          >
            Публичная оферта
          </Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link
            href="/privacy"
            target="_blank"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline-offset-2 hover:underline"
          >
            Политика конфиденциальности
          </Link>
        </div>
        <div>
          © {new Date().getFullYear()} МойБонч. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
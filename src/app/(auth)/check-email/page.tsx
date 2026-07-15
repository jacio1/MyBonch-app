"use client";

import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-indigo-900/50 rounded-full p-3 sm:p-4">
              <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Шпора
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Подтверждение регистрации
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-full p-4">
              <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Проверьте почту
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm sm:text-base">
            Мы отправили письмо на ваш адрес электронной почты. Пожалуйста,
             перейдите по ссылке для подтверждения
            регистрации.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">
              💡 Не получили письмо? Проверьте папку `Спам` или попробуйте
              зарегистрироваться снова.
            </p>
          </div>

          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base"
          >
            <span>Вернуться к входу</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-center text-gray-500 dark:text-gray-500 text-xs sm:text-sm mt-6">
            Это займет всего несколько секунд
          </p>
        </div>
      </div>
    </div>
  );
}
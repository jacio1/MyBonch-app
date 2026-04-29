"use client";

import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#131313] rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 rounded-full p-4">
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            Проверьте почту
          </h1>
          <p className="text-gray-200 text-center mb-6 text-sm sm:text-base">
            Мы отправили письмо на ваш адрес электронной почты. Пожалуйста,
            проверьте папку входящих и перейдите по ссылке для подтверждения
            регистрации.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm font-medium">
              💡 Не получили письмо? Проверьте папку спама или попробуйте
              зарегистрироваться снова.
            </p>
          </div>

          <Link
            href="/sign-in"
            className="flex items-center justify-center space-x-2 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            <span>Вернуться к входу</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-center text-gray-500 text-xs sm:text-sm mt-6">
            Это займет всего несколько секунд
          </p>
        </div>
      </div>
    </div>
  );
}

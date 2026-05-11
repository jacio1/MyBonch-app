"use client";

import { useState } from "react";
import { BookOpen, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Введите email");
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password-confirm`,
        },
      );

      if (resetError) throw resetError;
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка отправки письма";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8 transition-colors bg-[#111827]">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-4">
                <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Письмо отправлено
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm sm:text-base">
              Мы отправили письмо на адрес <strong className="text-gray-900 dark:text-white">{email}</strong>. Перейдите
              по ссылке в письме для создания нового пароля.
            </p>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                💡 Если письмо не пришло, проверьте папку спама.
              </p>
            </div>

            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Вернуться к входу</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-indigo-900/50 rounded-full p-3 sm:p-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            МойБонч
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Восстановление доступа
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Забыли пароль?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Введите email, связанный с вашим аккаунтом, и мы отправим письмо для
            восстановления пароля.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition text-sm sm:text-base"
            >
              {loading ? "Отправляем письмо..." : "Отправить письмо"}
            </button>
          </form>

          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 mt-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться к входу</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Заполните все поля");
      return;
    }

    try {
      await signIn(email, password);
      router.push("/templates");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка входа";
      setLocalError(message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8 transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
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
            Ваш персональный помощник в учебе
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Вход в аккаунт
          </h2>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {displayError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition text-sm sm:text-base"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <Link
              href="/reset-password"
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition"
            >
              Забыли пароль?
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className=" pt-4 text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Нет аккаунта?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
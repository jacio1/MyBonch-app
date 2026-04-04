"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password || !confirmPassword || !fullName) {
      setLocalError("Заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setLocalError("Пароль должен быть не менее 6 символов");
      return;
    }

    if (!email.includes("@")) {
      setLocalError("Введите корректный email");
      return;
    }

    try {
      await signUp(email, password, fullName);
      router.push("/check-email");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка регистрации";
      setLocalError(message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="h-full bg-[#0a0a0a]  flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-[#131313] rounded-2xl">
        {/* Header */}
        <div className="text-center mt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-indigo-900 rounded-full p-3 sm:p-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            МойБонч
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base">
            Создайте аккаунт для управления учебой
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl p-6 sm:p-8 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">
            Регистрация
          </h2>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {displayError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-primary mb-2"
              >
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-secondary" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Username"
                  className="h-12 rounded-xl border input-base w-full pl-10 pr-4"
                  disabled={loading}
                  maxLength={15}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-secondary" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border input-base w-full pl-10 pr-4"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-secondary" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border input-base w-full pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-secondary hover:text-primary transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-secondary mt-1">Минимум 6 символов</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-primary mb-2"
              >
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-secondary" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border input-base w-full pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-secondary hover:text-primary transition"
                >
                  {showConfirmPassword ? (
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
              className="bg-indigo-600 hover:bg-indigo-800 rounded-2xl h-12 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-secondary text-sm sm:text-base">
            Уже есть аккаунт?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Войдите
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

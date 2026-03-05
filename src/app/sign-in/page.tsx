'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Заполните все поля');
      return;
    }

    try {
      await signIn(email, password);
      router.push('/schedule');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа';
      setLocalError(message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-indigo-900 rounded-full p-3 sm:p-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">МойБонч</h1>
          <p className="text-indigo-100 text-sm sm:text-base">Ваш персональный помощник в учебе</p>
        </div>

        {/* Form Card */}
        <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl p-6 sm:p-8 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">Вход в аккаунт</h2>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
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
                  className="input-base w-full pl-10 pr-4"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-secondary" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base w-full pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-secondary hover:text-primary transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-card)] text-secondary">или</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-secondary text-sm sm:text-base">
            Нет аккаунта?{' '}
            <Link href="/sign-up" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Зарегистрируйтесь
            </Link>
          </p>

          {/* Forgot Password */}
          <p className="text-center mt-4">
            <Link href="/reset-password" className="text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">
              Забыли пароль?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { BookOpen, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Введите email');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password-confirm`,
      });

      if (resetError) throw resetError;
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка отправки письма';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 rounded-full p-4">
                <Mail className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
              Письмо отправлено
            </h1>
            <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
              Мы отправили письмо на адрес <strong>{email}</strong>. 
              Перейдите по ссылке в письме для создания нового пароля.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm font-medium">
                💡 Если письмо не пришло, проверьте папку спама.
              </p>
            </div>

            <Link
              href="/sign-in"
              className="flex items-center justify-center space-x-2 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 sm:p-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">МойБонч</h1>
          <p className="text-indigo-100 text-sm sm:text-base">Восстановите доступ к аккаунту</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Забыли пароль?
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Введите email, связанный с вашим аккаунтом, и мы отправим письмо для восстановления пароля.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition text-sm sm:text-base"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
            >
              {loading ? 'Отправляем письмо...' : 'Отправить письмо'}
            </button>
          </form>

          <Link
            href="/sign-in"
            className="flex items-center justify-center space-x-2 mt-6 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться к входу</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
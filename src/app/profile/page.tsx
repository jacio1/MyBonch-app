'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  LogOut,
  Save,
  Loader,
  Moon,
  Sun,
  Monitor,
  Lock,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { useTheme } from '@/src/lib/ThemeContext';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';


export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { theme, isDark, setTheme } = useTheme();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);

  // Загружаем данные профиля
  useEffect(() => {
    if (user) {
      loadProfile();
      checkPushSupport();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const checkPushSupport = () => {
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsPushSupported(isSupported);

    if (isSupported) {
      // Проверяем если уведомления уже включены
      if ('Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Профиль успешно сохранен!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Ошибка при сохранении профиля');
    } finally {
      setIsSaving(false);
    }
  };

  const enableNotifications = async () => {
    if (!isPushSupported) {
      alert('Ваш браузер не поддерживает уведомления');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        alert('Уведомления включены!');

        // Регистрируем service worker для уведомлений
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          // Подписываем на push уведомления
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          // Отправляем subscription на сервер
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription: subscription.toJSON(),
              userId: user?.id,
            }),
          });
        }
      } else {
        alert('Вы отклонили уведомления');
        setNotificationsEnabled(false);
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      alert('Ошибка при включении уведомлений');
    }
  };

  const disableNotifications = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          
          // Отправляем запрос на удаление подписки с сервера
          await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user?.id,
            }),
          });
        }
      }

      setNotificationsEnabled(false);
      alert('Уведомления отключены');
    } catch (err) {
      console.error('Error disabling notifications:', err);
      alert('Ошибка при отключении уведомлений');
    }
  };

  const handleLogout = async () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      try {
        await signOut();
        router.push('/sign-in');
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Пожалуйста, войдите в аккаунт</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Профиль</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Управление вашей учетной записью</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profileData.full_name || 'Пользователь'}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5" />
                <span>{user.email}</span>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                <User className="h-4 w-4" />
                Редактировать
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Полное имя
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadProfile();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Theme Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Внешний вид
          </h3>

          <div className="space-y-3">
            {[
              { value: 'light' as const, label: 'Светлая тема', icon: Sun },
              { value: 'dark' as const, label: 'Темная тема', icon: Moon },
              { value: 'system' as const, label: 'Как в системе', icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                  theme === value
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${
                  theme === value ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'
                }`} />
                <span className={`font-medium ${
                  theme === value
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {label}
                </span>
                {theme === value && (
                  <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        {isPushSupported && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {notificationsEnabled
                ? 'Вы получаете уведомления о новых заданиях и событиях'
                : 'Включите уведомления, чтобы получать напоминания о заданиях'}
            </p>

            <button
              onClick={notificationsEnabled ? disableNotifications : enableNotifications}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                notificationsEnabled
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
              }`}
            >
              <Bell className="h-5 w-5" />
              {notificationsEnabled ? 'Отключить уведомления' : 'Включить уведомления'}
            </button>
          </div>
        )}

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Безопасность
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Статус входа</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Активен</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg font-semibold transition"
            >
              <LogOut className="h-5 w-5" />
              Выйти из аккаунта
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Version: 0.91</p>
          <p>Developed by jacio</p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
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
  BellOff,
  Calendar,
  CheckSquare,
  Star,
  Clock,
  Zap,
} from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { useThemeStore } from "@/src/stores/useThemeStore";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

// ── helpers ──────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

interface NotifSettings {
  push_enabled: boolean;
  schedule_enabled: boolean;
  schedule_offset_minutes: number;
  schedule_important_only: boolean;
  schedule_daily_only: boolean;
  assignments_enabled: boolean;
  assignment_offset_days: number;
}

const DEFAULT_NOTIF: NotifSettings = {
  push_enabled: false,
  schedule_enabled: false,
  schedule_offset_minutes: 30,
  schedule_important_only: false,
  schedule_daily_only: true,
  assignments_enabled: false,
  assignment_offset_days: 1,
};

const SCHEDULE_OFFSETS = [
  { value: 10, label: "За 10 минут" },
  { value: 30, label: "За 30 минут" },
  { value: 60, label: "За 1 час" },
  { value: 120, label: "За 2 часа" },
  { value: 240, label: "За 4 часа" },
  { value: 1440, label: "За сутки" },
];

const ASSIGNMENT_OFFSETS = [
  { value: 1, label: "За 1 день" },
  { value: 2, label: "За 2 дня" },
  { value: 3, label: "За 3 дня" },
  { value: 7, label: "За неделю" },
];

// ── Toggle component ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40 ${
        checked ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── SelectChips component ────────────────────────────────────────────────────

function SelectChips<T extends number>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            value === opt.value
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          } disabled:opacity-40`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Theme Option Component ────────────────────────────────────────────────────

function ThemeOption({
  value,
  label,
  icon: Icon,
  currentTheme,
  onSelect,
}: {
  value: "light" | "dark" | "system";
  label: string;
  icon: any;
  currentTheme: "light" | "dark" | "system";
  onSelect: (theme: "light" | "dark" | "system") => void;
}) {
  const isActive = currentTheme === value;

  return (
    <button
      onClick={() => onSelect(value)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${
        isActive
          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <Icon
        className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-500 dark:text-gray-400"}`}
      />
      <span
        className={`font-medium text-sm ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}
      >
        {label}
      </span>
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full" />
      )}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    avatar_url: "",
  });

  const [isPushSupported, setIsPushSupported] = useState(false);
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>("default");
  const [notifSettings, setNotifSettings] =
    useState<NotifSettings>(DEFAULT_NOTIF);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;
    loadProfile();
    checkPush();
    loadNotifSettings();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (data)
      setProfileData({
        full_name: data.full_name || "",
        avatar_url: data.avatar_url || "",
      });
  };

  const checkPush = () => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setIsPushSupported(supported);
    if (supported) setPermissionState(Notification.permission);
  };

  const loadNotifSettings = async () => {
    if (!user) return;
    setNotifLoading(true);
    try {
      const { data } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setNotifSettings(data);
    } catch {
      // no settings yet — use defaults
    } finally {
      setNotifLoading(false);
    }
  };

  // ── Profile save ────────────────────────────────────────────────────────────

  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Сохраняем в таблицу profiles
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      // 2. Обновляем user_metadata (чтобы имя было везде одинаковым)
      const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: profileData.full_name },
      });
      if (userError) throw userError;

      setIsEditing(false);
      alert("Профиль успешно сохранён!");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка при сохранении профиля");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Push subscription ───────────────────────────────────────────────────────

  const subscribeToPush = async (): Promise<PushSubscription | null> => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      alert(
        "VAPID ключ не настроен. Добавьте NEXT_PUBLIC_VAPID_PUBLIC_KEY в .env.local",
      );
      return null;
    }
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    const applicationServerKey = urlBase64ToUint8Array(vapidKey);

    return reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });
  };

  const enablePush = async () => {
    if (!isPushSupported) {
      alert("Ваш браузер не поддерживает push-уведомления");
      return;
    }
    setNotifSaving(true);
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission !== "granted") {
        alert(
          "Вы отклонили разрешение на уведомления. Разрешите их в настройках браузера.",
        );
        return;
      }
      const subscription = await subscribeToPush();
      if (!subscription) return;

      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: user?.id,
        }),
      });

      const newSettings = { ...notifSettings, push_enabled: true };
      await saveNotifSettings(newSettings);
    } catch (err: any) {
      console.error("Error enabling notifications:", err);
      alert(`Ошибка при включении уведомлений: ${err?.message ?? err}`);
    } finally {
      setNotifSaving(false);
    }
  };

  const disablePush = async () => {
    setNotifSaving(true);
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch("/api/notifications/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user?.id }),
          });
        }
      }
      const newSettings = { ...notifSettings, push_enabled: false };
      await saveNotifSettings(newSettings);
    } catch (err) {
      console.error("Error disabling notifications:", err);
      alert("Ошибка при отключении уведомлений");
    } finally {
      setNotifSaving(false);
    }
  };

  // ── Notif settings save ─────────────────────────────────────────────────────

  const saveNotifSettings = async (settings: NotifSettings) => {
    if (!user) return;
    setNotifSettings(settings);
    await supabase.from("notification_settings").upsert(
      {
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  };

  const updateNotif = (patch: Partial<NotifSettings>) => {
    const next = { ...notifSettings, ...patch };
    setNotifSettings(next);
    // debounced save
    saveNotifSettings(next);
  };

  // ── Logout ──────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    if (!confirm("Выйти из аккаунта?")) return;
    try {
      await signOut();
      router.push("/sign-in");
    } catch {}
  };

  // ── Render ──────────────────────────────────────────────────────────────────

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
        <p className="text-gray-600 dark:text-gray-400">
          Пожалуйста, войдите в аккаунт
        </p>
      </div>
    );
  }

  const pushEnabled = notifSettings.push_enabled;
  const userName =
    user?.user_metadata?.full_name || user?.email || "Пользователь";

  return (
    <div className="sm:p-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6 ">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Профиль
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Управление учётной записью и уведомлениями
          </p>
        </div>

        {/* ── Profile ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center shrink-0">
              <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {userName || "Пользователь"}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
              >
                Редактировать
              </button>
            )}
          </div>

          {isEditing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Полное имя
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Сохранение..." : "Сохранить"}
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

        {/* ── Theme ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
            Внешний вид
          </h3>
          <div className="space-y-2">
            <ThemeOption
              value="light"
              label="Светлая тема"
              icon={Sun}
              currentTheme={theme}
              onSelect={setTheme}
            />
            <ThemeOption
              value="dark"
              label="Тёмная тема"
              icon={Moon}
              currentTheme={theme}
              onSelect={setTheme}
            />
            <ThemeOption
              value="system"
              label="Как в системе"
              icon={Monitor}
              currentTheme={theme}
              onSelect={setTheme}
            />
          </div>
        </div>

        {/* ── Notifications ── */}
        {isPushSupported && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${pushEnabled ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
                >
                  {pushEnabled ? (
                    <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <BellOff className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Push-уведомления
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {permissionState === "denied"
                      ? "Заблокированы в браузере — разрешите в настройках"
                      : pushEnabled
                        ? "Включены · настройте ниже"
                        : "Получайте напоминания на устройство"}
                  </p>
                </div>
              </div>
              {notifSaving ? (
                <Loader className="h-5 w-5 text-indigo-600 animate-spin flex-shrink-0" />
              ) : permissionState === "denied" ? (
                <span className="text-xs text-red-500 font-medium flex-shrink-0">
                  Заблокированы
                </span>
              ) : (
                <Toggle
                  checked={pushEnabled}
                  onChange={pushEnabled ? disablePush : enablePush}
                />
              )}
            </div>

            {/* Settings — only shown when push is enabled */}
            {pushEnabled && (
              <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/60">
                {/* ── Schedule notifications ── */}
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        Уведомления о парах
                      </span>
                    </div>
                    <Toggle
                      checked={notifSettings.schedule_enabled}
                      onChange={() =>
                        updateNotif({
                          schedule_enabled: !notifSettings.schedule_enabled,
                        })
                      }
                    />
                  </div>

                  {notifSettings.schedule_enabled && (
                    <div className="space-y-4 pl-6 border-l-2 border-indigo-100 dark:border-indigo-900/40">
                      {/* Offset */}
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Когда отправлять
                        </p>
                        <SelectChips
                          options={SCHEDULE_OFFSETS}
                          value={notifSettings.schedule_offset_minutes as any}
                          onChange={(v) =>
                            updateNotif({ schedule_offset_minutes: v })
                          }
                        />
                      </div>

                      {/* Daily only */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Одно уведомление в день
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Уведомление придёт один раз — перед первой парой дня
                          </p>
                        </div>
                        <Toggle
                          checked={notifSettings.schedule_daily_only}
                          onChange={() =>
                            updateNotif({
                              schedule_daily_only:
                                !notifSettings.schedule_daily_only,
                            })
                          }
                        />
                      </div>

                      {/* Important only */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            Только избранные пары
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Уведомления придут только для пар, отмеченных как
                            важные
                          </p>
                        </div>
                        <Toggle
                          checked={notifSettings.schedule_important_only}
                          onChange={() =>
                            updateNotif({
                              schedule_important_only:
                                !notifSettings.schedule_important_only,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Assignment notifications ── */}
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        Уведомления о заданиях
                      </span>
                    </div>
                    <Toggle
                      checked={notifSettings.assignments_enabled}
                      onChange={() =>
                        updateNotif({
                          assignments_enabled:
                            !notifSettings.assignments_enabled,
                        })
                      }
                    />
                  </div>

                  {notifSettings.assignments_enabled && (
                    <div className="space-y-4 pl-6 border-l-2 border-green-100 dark:border-green-900/40">
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Напомнить до
                          дедлайна
                        </p>
                        <SelectChips
                          options={ASSIGNMENT_OFFSETS}
                          value={notifSettings.assignment_offset_days as any}
                          onChange={(v) =>
                            updateNotif({ assignment_offset_days: v })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-6 py-4 bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                    <Zap className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    Уведомления отправляются сервером автоматически. Приложение
                    может быть закрыто — уведомления всё равно придут, если
                    устройство онлайн.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Security ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Безопасность
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Статус
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Активен
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg font-semibold text-sm transition"
            >
              <LogOut className="h-4 w-4" />
              Выйти из аккаунта
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
          <p>Version 0.91 · Developed by jacio</p>
        </div>
      </div>
    </div>
  );
}

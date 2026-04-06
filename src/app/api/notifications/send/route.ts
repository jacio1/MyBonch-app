// app/api/notifications/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { fromZonedTime } from "date-fns-tz";
const TIMEZONE = "Europe/Moscow";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// Вспомогательная функция для форматирования времени в московском часовом поясе
function formatMoscowTime(
  date: Date,
  options: Intl.DateTimeFormatOptions = {},
) {
  return date.toLocaleTimeString("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

function formatMoscowDate(date: Date) {
  return date.toLocaleDateString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function notifyTime(
  date: string,
  timeStr: string,
  offsetMinutes: number,
): Date {
  const [h, m] = timeStr.substring(0, 5).split(":").map(Number);

  // Формируем строку с московским временем
  const hour = String(h).padStart(2, "0");
  const minute = String(m).padStart(2, "0");
  const moscowDateTimeStr = `${date}T${hour}:${minute}:00`;

  // Конвертируем из МСК в UTC (fromZonedTime = из часового пояса в UTC)
  const utcDate = fromZonedTime(moscowDateTimeStr, TIMEZONE);

  // Вычитаем оффсет
  utcDate.setMinutes(utcDate.getMinutes() - offsetMinutes);

  return utcDate;
}
function inWindow(target: Date, now: Date): boolean {
  return Math.abs(target.getTime() - now.getTime()) <= 5 * 60 * 1000;
}

async function alreadySent(
  userId: string,
  entityType: string,
  entityId: number,
  sentDate: string,
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("notification_sent_log")
    .select("id")
    .eq("user_id", userId)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("sent_date", sentDate)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

async function markSent(
  userId: string,
  entityType: string,
  entityId: number,
  sentDate: string,
) {
  await supabaseAdmin.from("notification_sent_log").upsert({
    user_id: userId,
    entity_type: entityType,
    entity_id: entityId,
    sent_date: sentDate,
  });
}

async function sendPush(subscription: any, payload: object): Promise<boolean> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      await supabaseAdmin
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", subscription.endpoint);
    }
    return false;
  }
}

function pluralPairs(n: number) {
  if (n === 1) return "пара";
  if (n >= 2 && n <= 4) return "пары";
  return "пар";
}

async function handler(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ========== ТЕСТОВЫЙ РЕЖИМ ==========
  const isTestMode = request.headers.get("X-Test-Mode") === "true";

  if (isTestMode) {
    console.log("🧪 ТЕСТОВЫЙ РЕЖИМ: отправка тестового уведомления");

    const { data: allSubs } = await supabaseAdmin
      .from("push_subscriptions")
      .select("user_id, subscription");

    if (allSubs?.length) {
      let testSent = 0;

      const moscowTime = formatMoscowTime(new Date(), {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      for (const sub of allSubs) {
        const parsedSub =
          typeof sub.subscription === "string"
            ? JSON.parse(sub.subscription)
            : sub.subscription;

        const testPayload = {
          title: "🧪 Тестовое уведомление",
          body: `Привет! Московское время: ${moscowTime}`,
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          tag: "test-notification",
          requireInteraction: true,
          url: "/profile",
        };

        const sent = await sendPush(parsedSub, testPayload);
        if (sent) testSent++;
      }

      return NextResponse.json({
        test_mode: true,
        sent: testSent,
        total_subscriptions: allSubs.length,
      });
    }

    return NextResponse.json({
      test_mode: true,
      error: "Нет активных подписок",
    });
  }
  // ========== КОНЕЦ ТЕСТОВОГО РЕЖИМА ==========

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  let totalSent = 0;

  try {
    const { data: settings } = await supabaseAdmin
      .from("notification_settings")
      .select("*")
      .eq("push_enabled", true);

    if (!settings?.length) return NextResponse.json({ sent: 0 });

    for (const s of settings) {
      const userId: string = s.user_id;
      const { data: subs } = await supabaseAdmin
        .from("push_subscriptions")
        .select("subscription")
        .eq("user_id", userId);
      if (!subs?.length) continue;

      const parsedSubs = subs.map((row: any) =>
        typeof row.subscription === "string"
          ? JSON.parse(row.subscription)
          : row.subscription,
      );

      // Schedule notifications
      // Schedule notifications - с подробными логами
      if (s.schedule_enabled) {
        console.log(`\n🔔 === ПРОВЕРКА РАСПИСАНИЯ для user ${userId} ===`);
        console.log(`📅 Сегодня: ${todayStr}`);
        console.log(`🕐 Текущее время (UTC): ${now.toISOString()}`);
        console.log(
          `🕐 Текущее время (MSK): ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
        );

        let query = supabaseAdmin
          .from("schedules")
          .select("*")
          .eq("user_id", userId)
          .eq("date", todayStr)
          .order("start_time", { ascending: true });

        if (s.schedule_important_only) query = query.eq("is_important", true);
        const { data: classes } = await query;

        console.log(`📚 Найдено пар на сегодня: ${classes?.length || 0}`);

        if (classes?.length) {
          for (const cls of classes) {
            console.log(
              `\n📖 Пара: ${cls.subject_name}, время: ${cls.start_time}, важная: ${cls.is_important}`,
            );

            const offset: number = s.schedule_offset_minutes ?? 30;
            console.log(`⏰ Оффсет: ${offset} минут`);

            const fireAt = notifyTime(todayStr, cls.start_time, offset);
            console.log(`⏰ Время отправки (UTC): ${fireAt.toISOString()}`);
            console.log(
              `⏰ Время отправки (MSK): ${fireAt.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
            );

            const inWindowResult = inWindow(fireAt, now);
            console.log(`🎯 В окне отправки: ${inWindowResult}`);

            const alreadySentToday = await alreadySent(
              userId,
              "schedule",
              cls.id,
              todayStr,
            );
            console.log(`📝 Уже отправлено сегодня: ${alreadySentToday}`);

            if (inWindowResult && !alreadySentToday) {
              console.log(`✅ ДОЛЖНО ОТПРАВИТЬСЯ!`);
              const offsetLabel =
                offset >= 1440
                  ? "за сутки"
                  : offset >= 60
                    ? `за ${offset / 60} ч`
                    : `за ${offset} мин`;
              const payload = {
                title: `${cls.is_important ? "⭐ " : ""}${cls.subject_name}`,
                body: `${offsetLabel} · ${cls.start_time.substring(0, 5)}–${cls.end_time.substring(0, 5)}${cls.room ? ` · ауд. ${cls.room}` : ""}`,
                icon: "/icon-192.png",
                badge: "/icon-192.png",
                tag: `schedule-${cls.id}-${todayStr}`,
                requireInteraction: Boolean(cls.is_important),
                url: "/schedule",
              };

              // Получаем подписки пользователя
              const { data: userSubs } = await supabaseAdmin
                .from("push_subscriptions")
                .select("subscription")
                .eq("user_id", userId);

              if (userSubs?.length) {
                for (const sub of userSubs) {
                  const parsedSub =
                    typeof sub.subscription === "string"
                      ? JSON.parse(sub.subscription)
                      : sub.subscription;
                  const sent = await sendPush(parsedSub, payload);
                  console.log(`📤 Отправлено: ${sent}`);
                  if (sent) totalSent++;
                }
              }
              await markSent(userId, "schedule", cls.id, todayStr);
            } else {
              console.log(
                `❌ НЕ отправляется: inWindow=${inWindowResult}, alreadySent=${alreadySentToday}`,
              );
            }
          }
        }
      }
      // Assignment notifications
      if (s.assignments_enabled) {
        const offsetDays: number = s.assignment_offset_days ?? 1;
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + offsetDays);
        const targetDateStr = targetDate.toISOString().split("T")[0];
        const { data: tasks } = await supabaseAdmin
          .from("assignments")
          .select("*")
          .eq("user_id", userId)
          .eq("deadline", targetDateStr)
          .eq("completed", false);

        for (const task of tasks ?? []) {
          if (await alreadySent(userId, "assignment", task.id, todayStr))
            continue;

          const daysLabel =
            offsetDays === 7
              ? "через неделю"
              : offsetDays === 1
                ? "завтра"
                : `через ${offsetDays} дня`;

          const priorityIcon =
            task.priority === "high"
              ? "🔴 "
              : task.priority === "medium"
                ? "🟡 "
                : "🟢 ";

          // Исправляем дату дедлайна с московским часовым поясом
          const deadlineDate = new Date(task.deadline);
          const formattedDeadline = formatMoscowDate(deadlineDate);

          const payload = {
            title: `${priorityIcon}Дедлайн ${daysLabel}`,
            body: `${task.title}${task.subject ? ` · ${task.subject}` : ""}\nДо ${formattedDeadline}`,
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png",
            tag: `assignment-${task.id}-${todayStr}`,
            requireInteraction: task.priority === "high",
            url: "/task",
          };
          for (const sub of parsedSubs)
            if (await sendPush(sub, payload)) totalSent++;
          await markSent(userId, "assignment", task.id, todayStr);
        }
      }
    }
    return NextResponse.json({ sent: totalSent, users: settings.length });
  } catch (err) {
    console.error("[notifications/send]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export { handler as GET, handler as POST };

// app/api/notifications/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

function notifyTime(date: string, timeStr: string, offsetMinutes: number): Date {
  const [h, m] = timeStr.substring(0, 5).split(':').map(Number);
  const dt = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
  dt.setMinutes(dt.getMinutes() - offsetMinutes);
  return dt;
}

function inWindow(target: Date, now: Date): boolean {
  return Math.abs(target.getTime() - now.getTime()) <= 5 * 60 * 1000;
}

async function alreadySent(userId: string, entityType: string, entityId: number, sentDate: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('notification_sent_log')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('sent_date', sentDate)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

async function markSent(userId: string, entityType: string, entityId: number, sentDate: string) {
  await supabaseAdmin
    .from('notification_sent_log')
    .upsert({ user_id: userId, entity_type: entityType, entity_id: entityId, sent_date: sentDate });
}

async function sendPush(subscription: any, payload: object): Promise<boolean> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
    }
    return false;
  }
}

function pluralPairs(n: number) {
  if (n === 1) return 'пара';
  if (n >= 2 && n <= 4) return 'пары';
  return 'пар';
}

async function handler(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  let totalSent = 0;

  try {
    const { data: settings } = await supabaseAdmin
      .from('notification_settings')
      .select('*')
      .eq('push_enabled', true);

    if (!settings?.length) return NextResponse.json({ sent: 0 });

    for (const s of settings) {
      const userId: string = s.user_id;
      const { data: subs } = await supabaseAdmin
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', userId);
      if (!subs?.length) continue;

      const parsedSubs = subs.map((row: any) =>
        typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription
      );

      // Schedule notifications
      if (s.schedule_enabled) {
        let query = supabaseAdmin
          .from('schedules')
          .select('*')
          .eq('user_id', userId)
          .eq('date', todayStr)
          .order('start_time', { ascending: true });
        if (s.schedule_important_only) query = query.eq('is_important', true);
        const { data: classes } = await query;
        if (classes?.length) {
          const offset: number = s.schedule_offset_minutes ?? 30;
          if (s.schedule_daily_only) {
            const first = classes[0];
            const fireAt = notifyTime(todayStr, first.start_time, offset);
            if (inWindow(fireAt, now) && !(await alreadySent(userId, 'schedule_daily', 0, todayStr))) {
              const lines = classes
                .map((c: any) => `${c.start_time.substring(0,5)} — ${c.subject_name}${c.is_important ? ' ⭐' : ''}${c.room ? ` (${c.room})` : ''}`)
                .join('\n');
              const payload = {
                title: `Расписание на сегодня · ${classes.length} ${pluralPairs(classes.length)}`,
                body: lines,
                icon: '/icon-192.png', badge: '/icon-192.png',
                tag: `schedule-daily-${todayStr}`,
                requireInteraction: false, url: '/schedule',
              };
              for (const sub of parsedSubs) if (await sendPush(sub, payload)) totalSent++;
              await markSent(userId, 'schedule_daily', 0, todayStr);
            }
          } else {
            for (const cls of classes) {
              const fireAt = notifyTime(todayStr, cls.start_time, offset);
              if (!inWindow(fireAt, now)) continue;
              if (await alreadySent(userId, 'schedule', cls.id, todayStr)) continue;
              const offsetLabel = offset >= 1440 ? 'за сутки' : offset >= 60 ? `за ${offset/60} ч` : `за ${offset} мин`;
              const payload = {
                title: `${cls.is_important ? '⭐ ' : ''}${cls.subject_name}`,
                body: `${offsetLabel} · ${cls.start_time.substring(0,5)}–${cls.end_time.substring(0,5)}${cls.room ? ` · ауд. ${cls.room}` : ''}`,
                icon: '/icon-192.png', badge: '/icon-192.png',
                tag: `schedule-${cls.id}-${todayStr}`,
                requireInteraction: Boolean(cls.is_important), url: '/schedule',
              };
              for (const sub of parsedSubs) if (await sendPush(sub, payload)) totalSent++;
              await markSent(userId, 'schedule', cls.id, todayStr);
            }
          }
        }
      }

      // Assignment notifications
      if (s.assignments_enabled) {
        const offsetDays: number = s.assignment_offset_days ?? 1;
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + offsetDays);
        const targetDateStr = targetDate.toISOString().split('T')[0];
        const { data: tasks } = await supabaseAdmin
          .from('assignments').select('*')
          .eq('user_id', userId).eq('deadline', targetDateStr).eq('completed', false);
        for (const task of tasks ?? []) {
          if (await alreadySent(userId, 'assignment', task.id, todayStr)) continue;
          const daysLabel = offsetDays === 7 ? 'через неделю' : offsetDays === 1 ? 'завтра' : `через ${offsetDays} дня`;
          const priorityIcon = task.priority === 'high' ? '🔴 ' : task.priority === 'medium' ? '🟡 ' : '🟢 ';
          const payload = {
            title: `${priorityIcon}Дедлайн ${daysLabel}`,
            body: `${task.title}${task.subject ? ` · ${task.subject}` : ''}\nДо ${new Date(task.deadline).toLocaleDateString('ru-RU')}`,
            icon: '/icon-192.png', badge: '/icon-192.png',
            tag: `assignment-${task.id}-${todayStr}`,
            requireInteraction: task.priority === 'high', url: '/task',
          };
          for (const sub of parsedSubs) if (await sendPush(sub, payload)) totalSent++;
          await markSent(userId, 'assignment', task.id, todayStr);
        }
      }
    }
    return NextResponse.json({ sent: totalSent, users: settings.length });
  } catch (err) {
    console.error('[notifications/send]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { handler as GET, handler as POST };
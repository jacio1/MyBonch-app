import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

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

export async function POST(request: NextRequest) {
  // Проверка авторизации (как у вас)
  const auth = request.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, customTitle, customBody } = await request.json();
  
  // Получаем подписку пользователя
  const { data: subs } = await supabaseAdmin
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', userId || 'ВАШ_USER_ID_СЮДА');
  
  if (!subs?.length) {
    return NextResponse.json({ error: 'Нет подписки у пользователя' });
  }

  const subscription = typeof subs[0].subscription === 'string' 
    ? JSON.parse(subs[0].subscription) 
    : subs[0].subscription;

  const payload = {
    title: customTitle || '🔔 Тест с сервера',
    body: customBody || `Время: ${new Date().toLocaleTimeString('ru-RU')}`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'manual-test',
    requireInteraction: true,
    url: '/profile',
  };

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return NextResponse.json({ success: true, message: 'Уведомление отправлено' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
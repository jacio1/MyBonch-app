import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Используйте admin клиент с сервисной ролью для обхода RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userId } = body;
    
    console.log('📝 Received subscription request:', { userId, hasSubscription: !!subscription });
    console.log('Subscription endpoint:', subscription?.endpoint);

    if (!subscription || !userId) {
      console.log('❌ Missing data:', { subscription: !!subscription, userId });
      return NextResponse.json(
        { error: 'Missing subscription or userId' },
        { status: 400 }
      );
    }

    // Проверяем структуру подписки
    const subscriptionData = {
      user_id: userId,
      subscription: subscription, // Не нужно JSON.stringify, Supabase сам обработает
      endpoint: subscription.endpoint,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('📤 Attempting to upsert:', { 
      userId, 
      endpoint: subscription.endpoint.substring(0, 50) + '...' 
    });

    // Сначала проверяем, существует ли уже запись
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscription.endpoint)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('⚠️ Error checking existing:', selectError);
    }

    let result;
    if (existing) {
      // Обновляем существующую
      result = await supabaseAdmin
        .from('push_subscriptions')
        .update({
          subscription: subscription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Создаём новую
      result = await supabaseAdmin
        .from('push_subscriptions')
        .insert(subscriptionData);
    }

    if (result.error) {
      console.error('❌ Database error:', {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to save subscription',
          details: result.error.message,
          code: result.error.code
        },
        { status: 500 }
      );
    }

    console.log('✅ Subscription saved successfully');
    return NextResponse.json({
      success: true,
      message: 'Subscription saved successfully',
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
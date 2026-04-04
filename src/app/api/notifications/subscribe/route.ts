import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { subscription, userId } = await request.json();

    if (!subscription || !userId) {
      return NextResponse.json(
        { error: 'Missing subscription or userId' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      subscription: JSON.stringify(subscription),
      endpoint: subscription.endpoint,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'endpoint',
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription saved successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
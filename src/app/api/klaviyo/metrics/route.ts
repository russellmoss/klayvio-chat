import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { klaviyoClient } from '@/lib/klaviyo/client';

export async function GET() {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch Klaviyo metrics
    const metrics = await klaviyoClient.getWineryMetrics();
    
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error: any) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch metrics',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { claudeClient } from '@/lib/anthropic/client';

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, metrics } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Generate AI insights
    const insights = await claudeClient.analyzeEmailPerformance(query, {
      metrics,
      userQuery: query,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        insights,
        query,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate insights',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

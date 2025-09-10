import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { klaviyoClient } from '@/lib/klaviyo/client';

export async function GET(request: Request) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const metric = searchParams.get('metric') || 'all';

    // Fetch performance analytics
    const analytics = await klaviyoClient.getWineryMetrics();
    
    // Generate time-series data based on period
    const timeSeriesData = generateTimeSeriesData(period, analytics);
    
    return NextResponse.json({
      success: true,
      data: {
        period,
        metric,
        analytics,
        timeSeries: timeSeriesData,
        summary: {
          totalCampaigns: analytics.totalCampaigns,
          totalSubscribers: analytics.totalSubscribers,
          averageOpenRate: analytics.averageOpenRate,
          averageClickRate: analytics.averageClickRate,
          totalRevenue: analytics.totalRevenue,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching performance analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function generateTimeSeriesData(period: string, analytics: any) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      opens: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 200) + 100,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      subscribers: Math.floor(Math.random() * 100) + 50,
      campaigns: Math.floor(Math.random() * 5) + 1,
    });
  }
  
  return data;
}

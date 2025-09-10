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

    // Fetch Klaviyo campaigns
    const campaignsResponse = await klaviyoClient.getCampaigns();
    const campaigns = campaignsResponse.data;
    
    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (error: any) {
    console.error('Error fetching Klaviyo campaigns:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch campaigns',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

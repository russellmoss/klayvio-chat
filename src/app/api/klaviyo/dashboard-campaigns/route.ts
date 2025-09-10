import { NextResponse } from 'next/server';
import { klaviyoClient } from '@/lib/klaviyo/client';

export async function GET() {
  try {
    console.log('Fetching dashboard campaigns...');
    
    // Fetch Klaviyo campaigns
    const campaignsResponse = await klaviyoClient.getCampaigns();
    const campaigns = campaignsResponse.data;
    
    console.log(`Fetched ${campaigns?.length || 0} campaigns for dashboard`);
    
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

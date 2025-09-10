import { NextResponse } from 'next/server';
import { claudeClient } from '@/lib/anthropic/client';
import { klaviyoClient } from '@/lib/klaviyo/client';

export async function POST(request: Request) {
  try {
    const { query, context } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get real Klaviyo data for context
    let klaviyoData = null;
    try {
      console.log('Fetching Klaviyo data for AI analysis...');
      const campaigns = await klaviyoClient.getCampaigns();
      const metrics = await klaviyoClient.getWineryMetrics();
      
      klaviyoData = {
        campaigns: campaigns.data || [],
        metrics,
        totalCampaigns: campaigns.data?.length || 0,
      };
      
      console.log(`Fetched ${campaigns.data?.length || 0} campaigns for analysis`);
    } catch (error) {
      console.log('Could not fetch Klaviyo data:', error);
      // Continue without Klaviyo data
    }

    // Clear conversation history to avoid timestamp issues
    claudeClient.clearHistory();
    
    // Generate AI response with real data
    const insights = await claudeClient.analyzeEmailPerformance(query, {
      metrics: klaviyoData?.metrics,
      campaigns: klaviyoData?.campaigns,
      totalCampaigns: klaviyoData?.totalCampaigns,
      userQuery: query,
      conversationHistory: [],
    });
    
    return NextResponse.json({
      success: true,
      insights,
      query,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate response',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

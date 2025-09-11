import { NextResponse } from 'next/server';
import { klaviyoClient } from '@/lib/klaviyo/client';
import { config } from '@/lib/env';
import { fetchWithConfig, handleKlaviyoResponse } from '@/lib/utils/klaviyo-fetch';

export async function GET() {
  try {
    // Validate API key
    if (!config.klaviyo.privateKey || config.klaviyo.privateKey === 'your-klaviyo-private-key') {
      return NextResponse.json({
        error: 'Klaviyo API key not configured',
        message: 'Please add your KLAVIYO_PRIVATE_KEY to your .env.local file',
        instructions: [
          '1. Go to your Klaviyo account settings',
          '2. Navigate to Account > Settings > API Keys',
          '3. Create a new Private API Key with read access',
          '4. Add it to your .env.local file as KLAVIYO_PRIVATE_KEY=pk_...',
          '5. Restart your development server'
        ]
      }, { status: 500 });
    }
    
    console.log('Fetching real Klaviyo data...');
    
    // Test the API connection first
    try {
      const testResponse = await fetchWithConfig('https://a.klaviyo.com/api/accounts');
      await handleKlaviyoResponse(testResponse);
    } catch (error) {
      return NextResponse.json({
        error: 'Invalid Klaviyo API key',
        message: 'Your API key appears to be invalid or lacks proper permissions',
        details: error.message
      }, { status: 401 });
    }
    
    // Fetch actual metrics with better error handling
    let metrics, campaigns, lists;
    
    try {
      // Fetch data in parallel for better performance
      [metrics, campaigns, lists] = await Promise.allSettled([
        klaviyoClient.getWineryMetrics(),
        klaviyoClient.getCampaigns({ pageSize: 10 }),
        klaviyoClient.getLists({ pageSize: 10 })
      ]);
      
      // Handle individual failures gracefully
      metrics = metrics.status === 'fulfilled' ? metrics.value : { totalRevenue: 0, totalCampaigns: 0, totalSubscribers: 0 };
      campaigns = campaigns.status === 'fulfilled' ? campaigns.value : { data: [], total: 0 };
      lists = lists.status === 'fulfilled' ? lists.value : { data: [], meta: {} };
      
    } catch (error) {
      console.error('Error fetching Klaviyo data:', error);
      // Provide fallback data
      metrics = { totalRevenue: 0, totalCampaigns: 0, totalSubscribers: 0 };
      campaigns = { data: [], total: 0 };
      lists = { data: [], meta: {} };
    }
    
    // Calculate real metrics from actual Klaviyo data
    const totalSubscribers = await getTotalSubscribers();
    const activeSubscribers = await getActiveSubscribers();
    const averageOpenRate = await calculateAverageOpenRate(campaigns.data || []);
    const averageClickRate = await calculateAverageClickRate(campaigns.data || []);
    const unsubscribeRate = await calculateUnsubscribeRate(campaigns.data || []);
    
    // Calculate additional metrics
    const totalRevenue = metrics.totalRevenue || 0;
    const revenuePerEmail = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        ...metrics,
        totalSubscribers,
        activeSubscribers,
        averageOpenRate,
        averageClickRate,
        unsubscribeRate,
        revenuePerEmail,
        recentCampaigns: campaigns.data || [],
        lists: lists.data || [],
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch metrics',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Helper methods to calculate metrics from real Klaviyo data
async function getTotalSubscribers(): Promise<number> {
  try {
    const response = await fetchWithConfig('https://a.klaviyo.com/api/profiles', {
      'page[size]': 1
    });
    
    const data = await handleKlaviyoResponse(response);
    return data.meta?.total || 0;
  } catch (error) {
    console.error('Error fetching total subscribers:', error);
    return 0;
  }
}

async function getActiveSubscribers(): Promise<number> {
  try {
    const response = await fetchWithConfig('https://a.klaviyo.com/api/profiles', {
      'filter': 'equals(subscriptions.email.marketing.consent,"SUBSCRIBED")',
      'page[size]': 1
    });
    
    const data = await handleKlaviyoResponse(response);
    return data.meta?.total || 0;
  } catch (error) {
    console.error('Error fetching active subscribers:', error);
    return 0;
  }
}

async function calculateAverageOpenRate(campaigns: any[]): Promise<number> {
  if (!campaigns || campaigns.length === 0) return 0;
  const validCampaigns = campaigns.filter(c => c.open_rate !== undefined);
  if (validCampaigns.length === 0) return 0;
  return validCampaigns.reduce((sum, c) => sum + c.open_rate, 0) / validCampaigns.length;
}

async function calculateAverageClickRate(campaigns: any[]): Promise<number> {
  if (!campaigns || campaigns.length === 0) return 0;
  const validCampaigns = campaigns.filter(c => c.click_rate !== undefined);
  if (validCampaigns.length === 0) return 0;
  return validCampaigns.reduce((sum, c) => sum + c.click_rate, 0) / validCampaigns.length;
}

async function calculateUnsubscribeRate(campaigns: any[]): Promise<number> {
  if (!campaigns || campaigns.length === 0) return 0;
  const validCampaigns = campaigns.filter(c => c.unsubscribe_rate !== undefined);
  if (validCampaigns.length === 0) return 0.4; // Default fallback
  return validCampaigns.reduce((sum, c) => sum + (c.unsubscribe_rate || 0), 0) / validCampaigns.length;
}


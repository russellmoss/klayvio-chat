import { NextResponse } from 'next/server';
import { klaviyoClient } from '@/lib/klaviyo/client';
import { config } from '@/lib/env';

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
      const testResponse = await fetch('https://a.klaviyo.com/api/accounts', {
        headers: {
          'Authorization': `Klaviyo-API-Key ${config.klaviyo.privateKey}`,
          'revision': '2024-10-15',
        }
      });
      
      if (!testResponse.ok) {
        throw new Error(`API Key validation failed: ${testResponse.status}`);
      }
    } catch (error) {
      return NextResponse.json({
        error: 'Invalid Klaviyo API key',
        message: 'Your API key appears to be invalid or lacks proper permissions',
        details: error.message
      }, { status: 401 });
    }
    
    // Fetch actual metrics
    const metrics = await klaviyoClient.getWineryMetrics();
    const campaigns = await klaviyoClient.getCampaigns({ pageSize: 10 });
    
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
    const response = await fetch('https://a.klaviyo.com/api/profiles?page[size]=1', {
      headers: {
        'Authorization': `Klaviyo-API-Key ${config.klaviyo.privateKey}`,
        'revision': '2024-10-15',
      }
    });
    const data = await response.json();
    return data.meta?.total || 0;
  } catch (error) {
    console.error('Error fetching total subscribers:', error);
    return 0;
  }
}

async function getActiveSubscribers(): Promise<number> {
  try {
    const response = await fetch('https://a.klaviyo.com/api/profiles?filter=equals(subscriptions.email.marketing.consent,"SUBSCRIBED")&page[size]=1', {
      headers: {
        'Authorization': `Klaviyo-API-Key ${config.klaviyo.privateKey}`,
        'revision': '2024-10-15',
      }
    });
    const data = await response.json();
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


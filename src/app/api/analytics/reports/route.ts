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
    const reportType = searchParams.get('type') || 'summary';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let reportData;

    switch (reportType) {
      case 'campaign':
        reportData = await generateCampaignReport(startDate, endDate);
        break;
      case 'subscriber':
        reportData = await generateSubscriberReport(startDate, endDate);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(startDate, endDate);
        break;
      default:
        reportData = await generateSummaryReport(startDate, endDate);
    }

    return NextResponse.json({
      success: true,
      data: {
        reportType,
        startDate,
        endDate,
        generatedAt: new Date().toISOString(),
        ...reportData,
      },
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate report',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function generateSummaryReport(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  
  return {
    summary: {
      totalCampaigns: metrics.totalCampaigns,
      totalSubscribers: metrics.totalSubscribers,
      averageOpenRate: metrics.averageOpenRate,
      averageClickRate: metrics.averageClickRate,
      totalRevenue: metrics.totalRevenue,
      wineClubMembers: metrics.wineClubMembers,
      seasonalPerformance: metrics.seasonalPerformance,
    },
    trends: {
      subscriberGrowth: '+12.5%',
      revenueGrowth: '+8.7%',
      engagementGrowth: '+3.2%',
    },
    topPerforming: {
      campaigns: await getTopPerformingCampaigns(),
      segments: await getTopPerformingSegments(),
      timeSlots: await getBestTimeSlots(),
    },
  };
}

async function generateCampaignReport(startDate?: string, endDate?: string) {
  const campaigns = await klaviyoClient.getCampaigns();
  
  return {
    campaigns: campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      sent: campaign.sent,
      recipients: campaign.recipients,
      opens: campaign.opens,
      clicks: campaign.clicks,
      openRate: campaign.open_rate,
      clickRate: campaign.click_rate,
      revenue: campaign.revenue || 0,
    })),
    summary: {
      totalCampaigns: campaigns.length,
      averageOpenRate: campaigns.reduce((sum, c) => sum + c.open_rate, 0) / campaigns.length,
      averageClickRate: campaigns.reduce((sum, c) => sum + c.click_rate, 0) / campaigns.length,
      totalRevenue: campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0),
    },
  };
}

async function generateSubscriberReport(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  
  return {
    subscribers: {
      total: metrics.totalSubscribers,
      wineClub: metrics.wineClubMembers,
      regular: metrics.totalSubscribers - metrics.wineClubMembers,
      growth: '+5.2%',
    },
    segments: await getSubscriberSegments(),
    engagement: {
      averageOpenRate: metrics.averageOpenRate,
      averageClickRate: metrics.averageClickRate,
      unsubscribeRate: '0.8%',
    },
  };
}

async function generateRevenueReport(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  
  return {
    revenue: {
      total: metrics.totalRevenue,
      emailDriven: metrics.totalRevenue * 0.35, // Assume 35% is email-driven
      wineClub: metrics.totalRevenue * 0.25,
      direct: metrics.totalRevenue * 0.40,
    },
    trends: {
      monthlyGrowth: '+8.7%',
      quarterlyGrowth: '+24.3%',
      yearlyGrowth: '+67.8%',
    },
    topRevenueDrivers: await getTopRevenueDrivers(),
  };
}

// Helper functions
async function getTopPerformingCampaigns() {
  const campaigns = await klaviyoClient.getCampaigns();
  return campaigns
    .sort((a, b) => b.open_rate - a.open_rate)
    .slice(0, 5)
    .map(c => ({ name: c.name, openRate: c.open_rate }));
}

async function getTopPerformingSegments() {
  return [
    { name: 'Wine Club Members', openRate: 34.2, clickRate: 8.7 },
    { name: 'Premium Customers', openRate: 28.9, clickRate: 6.4 },
    { name: 'New Subscribers', openRate: 22.1, clickRate: 4.2 },
  ];
}

async function getBestTimeSlots() {
  return [
    { time: 'Tuesday 10:00 AM', openRate: 32.4 },
    { time: 'Thursday 2:00 PM', openRate: 29.8 },
    { time: 'Friday 11:00 AM', openRate: 28.1 },
  ];
}

async function getSubscriberSegments() {
  return [
    { name: 'Wine Club Members', count: 1250, percentage: 44 },
    { name: 'Premium Customers', count: 890, percentage: 31 },
    { name: 'Regular Subscribers', count: 707, percentage: 25 },
  ];
}

async function getTopRevenueDrivers() {
  return [
    { campaign: 'Holiday Wine Collection', revenue: 15420 },
    { campaign: 'Wine Club Exclusive', revenue: 12890 },
    { campaign: 'Summer Tasting Events', revenue: 9870 },
  ];
}

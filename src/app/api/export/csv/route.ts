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
    const dataType = searchParams.get('type') || 'campaigns';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let csvData;

    switch (dataType) {
      case 'campaigns':
        csvData = await generateCampaignsCSV(startDate, endDate);
        break;
      case 'subscribers':
        csvData = await generateSubscribersCSV(startDate, endDate);
        break;
      case 'analytics':
        csvData = await generateAnalyticsCSV(startDate, endDate);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid data type' },
          { status: 400 }
        );
    }

    // Set headers for CSV download
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename="${dataType}_export_${new Date().toISOString().split('T')[0]}.csv"`);

    return new NextResponse(csvData, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error generating CSV export:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Export failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function generateCampaignsCSV(startDate?: string, endDate?: string) {
  const campaigns = await klaviyoClient.getCampaigns();
  
  const headers = [
    'Campaign ID',
    'Campaign Name',
    'Status',
    'Created Date',
    'Sent Date',
    'Recipients',
    'Opens',
    'Clicks',
    'Open Rate (%)',
    'Click Rate (%)',
    'Revenue',
  ];

  const rows = campaigns.map(campaign => [
    campaign.id,
    campaign.name,
    campaign.status,
    campaign.created,
    campaign.sent || '',
    campaign.recipients,
    campaign.opens,
    campaign.clicks,
    campaign.open_rate.toFixed(2),
    campaign.click_rate.toFixed(2),
    campaign.revenue || 0,
  ]);

  return convertToCSV([headers, ...rows]);
}

async function generateSubscribersCSV(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  const customerInsights = await klaviyoClient.getCustomerInsights();
  
  const headers = [
    'Date',
    'Total Subscribers',
    'Wine Club Members',
    'Regular Subscribers',
    'New Subscribers',
    'Unsubscribes',
    'Growth Rate (%)',
  ];

  // Generate sample data for the last 30 days
  const rows = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    rows.push([
      date.toISOString().split('T')[0],
      metrics.totalSubscribers + Math.floor(Math.random() * 100),
      metrics.wineClubMembers + Math.floor(Math.random() * 20),
      (metrics.totalSubscribers - metrics.wineClubMembers) + Math.floor(Math.random() * 80),
      Math.floor(Math.random() * 50) + 10,
      Math.floor(Math.random() * 5),
      (Math.random() * 10 + 2).toFixed(2),
    ]);
  }

  return convertToCSV([headers, ...rows]);
}

async function generateAnalyticsCSV(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  
  const headers = [
    'Metric',
    'Value',
    'Change (%)',
    'Period',
    'Category',
  ];

  const rows = [
    ['Total Campaigns', metrics.totalCampaigns, '+12.0', '30 days', 'Campaigns'],
    ['Total Subscribers', metrics.totalSubscribers, '+5.2', '30 days', 'Subscribers'],
    ['Average Open Rate', metrics.averageOpenRate.toFixed(2) + '%', '+2.1', '30 days', 'Engagement'],
    ['Average Click Rate', metrics.averageClickRate.toFixed(2) + '%', '+1.8', '30 days', 'Engagement'],
    ['Total Revenue', '$' + metrics.totalRevenue.toLocaleString(), '+8.7', '30 days', 'Revenue'],
    ['Wine Club Members', metrics.wineClubMembers, '+3.4', '30 days', 'Subscribers'],
    ['Email-Driven Revenue', '$' + (metrics.totalRevenue * 0.35).toLocaleString(), '+6.2', '30 days', 'Revenue'],
  ];

  return convertToCSV([headers, ...rows]);
}

function convertToCSV(data: any[][]) {
  return data.map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const cellStr = String(cell || '');
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  ).join('\n');
}

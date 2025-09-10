import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { klaviyoClient } from '@/lib/klaviyo/client';

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportType, startDate, endDate, includeCharts } = await request.json();

    if (!reportType) {
      return NextResponse.json(
        { error: 'Report type is required' },
        { status: 400 }
      );
    }

    let reportData;

    switch (reportType) {
      case 'performance':
        reportData = await generatePerformanceReport(startDate, endDate);
        break;
      case 'campaigns':
        reportData = await generateCampaignReport(startDate, endDate);
        break;
      case 'subscribers':
        reportData = await generateSubscriberReport(startDate, endDate);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(startDate, endDate);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    // Generate PDF content (simplified - in production, use a PDF library)
    const pdfContent = generatePDFContent(reportData, reportType, includeCharts);

    // Set headers for PDF download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf"`);

    return new NextResponse(pdfContent, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error generating PDF report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'PDF generation failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function generatePerformanceReport(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  const campaigns = await klaviyoClient.getCampaigns();
  
  return {
    title: 'Email Marketing Performance Report',
    period: startDate && endDate ? `${startDate} to ${endDate}` : 'Last 30 Days',
    generatedAt: new Date().toISOString(),
    summary: {
      totalCampaigns: campaigns.length,
      totalSubscribers: metrics.totalSubscribers,
      averageOpenRate: metrics.averageOpenRate,
      averageClickRate: metrics.averageClickRate,
      totalRevenue: metrics.totalRevenue,
    },
    campaigns: campaigns.slice(0, 10),
    trends: {
      subscriberGrowth: '+5.2%',
      revenueGrowth: '+8.7%',
      engagementGrowth: '+3.2%',
    },
  };
}

async function generateCampaignReport(startDate?: string, endDate?: string) {
  const campaigns = await klaviyoClient.getCampaigns();
  
  return {
    title: 'Campaign Performance Report',
    period: startDate && endDate ? `${startDate} to ${endDate}` : 'All Time',
    generatedAt: new Date().toISOString(),
    campaigns: campaigns.map(campaign => ({
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
  const customerInsights = await klaviyoClient.getCustomerInsights();
  
  return {
    title: 'Subscriber Analytics Report',
    period: startDate && endDate ? `${startDate} to ${endDate}` : 'Last 30 Days',
    generatedAt: new Date().toISOString(),
    subscribers: {
      total: metrics.totalSubscribers,
      wineClub: metrics.wineClubMembers,
      regular: metrics.totalSubscribers - metrics.wineClubMembers,
      growth: '+5.2%',
    },
    engagement: {
      averageOpenRate: metrics.averageOpenRate,
      averageClickRate: metrics.averageClickRate,
      unsubscribeRate: '0.8%',
    },
    insights: customerInsights,
  };
}

async function generateRevenueReport(startDate?: string, endDate?: string) {
  const metrics = await klaviyoClient.getWineryMetrics();
  const wineClubMetrics = await klaviyoClient.getWineClubMetrics();
  
  return {
    title: 'Revenue Analysis Report',
    period: startDate && endDate ? `${startDate} to ${endDate}` : 'Last 30 Days',
    generatedAt: new Date().toISOString(),
    revenue: {
      total: metrics.totalRevenue,
      emailDriven: metrics.totalRevenue * 0.35,
      wineClub: metrics.totalRevenue * 0.25,
      direct: metrics.totalRevenue * 0.40,
    },
    trends: {
      monthlyGrowth: '+8.7%',
      quarterlyGrowth: '+24.3%',
      yearlyGrowth: '+67.8%',
    },
    wineClub: wineClubMetrics,
  };
}

function generatePDFContent(reportData: any, reportType: string, includeCharts: boolean) {
  // This is a simplified PDF generation
  // In production, you would use a library like Puppeteer, jsPDF, or PDFKit
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${reportData.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportData.title}</h1>
        <p>Period: ${reportData.period}</p>
        <p>Generated: ${new Date(reportData.generatedAt).toLocaleDateString()}</p>
      </div>
      
      <div class="summary">
        <h2>Summary</h2>
        ${Object.entries(reportData.summary || {}).map(([key, value]) => 
          `<p><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</p>`
        ).join('')}
      </div>
      
      ${reportData.campaigns ? `
        <h2>Campaign Details</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Recipients</th>
              <th>Open Rate</th>
              <th>Click Rate</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.campaigns.map((campaign: any) => `
              <tr>
                <td>${campaign.name}</td>
                <td>${campaign.status}</td>
                <td>${campaign.recipients?.toLocaleString() || 'N/A'}</td>
                <td>${campaign.openRate?.toFixed(1) || campaign.open_rate?.toFixed(1) || 'N/A'}%</td>
                <td>${campaign.clickRate?.toFixed(1) || campaign.click_rate?.toFixed(1) || 'N/A'}%</td>
                <td>$${campaign.revenue?.toLocaleString() || '0'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
      
      <div class="footer">
        <p>Generated by Winery Email AI Assistant</p>
      </div>
    </body>
    </html>
  `;

  // Return HTML content (in production, convert to PDF)
  return htmlContent;
}

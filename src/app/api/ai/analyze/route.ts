import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { claudeClient } from '@/lib/anthropic/client';
import { klaviyoClient } from '@/lib/klaviyo/client';

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisType, data, options } = await request.json();

    if (!analysisType) {
      return NextResponse.json(
        { error: 'Analysis type is required' },
        { status: 400 }
      );
    }

    let analysis;

    switch (analysisType) {
      case 'campaign_performance':
        analysis = await analyzeCampaignPerformance(data, options);
        break;
      case 'subscriber_behavior':
        analysis = await analyzeSubscriberBehavior(data, options);
        break;
      case 'seasonal_trends':
        analysis = await analyzeSeasonalTrends(data, options);
        break;
      case 'revenue_optimization':
        analysis = await analyzeRevenueOptimization(data, options);
        break;
      case 'content_optimization':
        analysis = await analyzeContentOptimization(data, options);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    // Log the analysis for future reference
    await supabase
      .from('query_logs')
      .insert({
        user_id: user.id,
        query_type: analysisType,
        query_data: data,
        response: analysis,
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      data: {
        analysisType,
        analysis,
        timestamp: new Date().toISOString(),
        options,
      },
    });
  } catch (error: any) {
    console.error('Error performing AI analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Analysis failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function analyzeCampaignPerformance(data: any, options: any) {
  const metrics = await klaviyoClient.getWineryMetrics();
  const campaigns = await klaviyoClient.getCampaigns();
  
  const prompt = `
    Analyze the campaign performance data for this winery:
    
    Campaigns: ${JSON.stringify(campaigns.slice(0, 5))}
    Overall Metrics: ${JSON.stringify(metrics)}
    
    Provide insights on:
    1. Top performing campaigns and why they succeeded
    2. Areas for improvement
    3. Recommendations for future campaigns
    4. Wine industry specific insights
  `;

  return await claudeClient.analyzeEmailPerformance(prompt, {
    metrics,
    userQuery: 'Campaign performance analysis',
  });
}

async function analyzeSubscriberBehavior(data: any, options: any) {
  const metrics = await klaviyoClient.getWineryMetrics();
  const customerInsights = await klaviyoClient.getCustomerInsights();
  
  const prompt = `
    Analyze subscriber behavior patterns for this winery:
    
    Customer Insights: ${JSON.stringify(customerInsights)}
    Metrics: ${JSON.stringify(metrics)}
    
    Provide insights on:
    1. Subscriber engagement patterns
    2. Wine club member behavior vs regular subscribers
    3. Seasonal preferences and trends
    4. Recommendations for segmentation and personalization
  `;

  return await claudeClient.analyzeEmailPerformance(prompt, {
    metrics,
    customerInsights,
    userQuery: 'Subscriber behavior analysis',
  });
}

async function analyzeSeasonalTrends(data: any, options: any) {
  const metrics = await klaviyoClient.getWineryMetrics();
  
  const prompt = `
    Analyze seasonal trends for this winery's email marketing:
    
    Metrics: ${JSON.stringify(metrics)}
    Seasonal Data: ${JSON.stringify(data)}
    
    Provide insights on:
    1. Best performing seasons and months
    2. Wine industry seasonal patterns
    3. Holiday and event opportunities
    4. Recommendations for seasonal campaigns
  `;

  return await claudeClient.analyzeEmailPerformance(prompt, {
    metrics,
    userQuery: 'Seasonal trends analysis',
  });
}

async function analyzeRevenueOptimization(data: any, options: any) {
  const metrics = await klaviyoClient.getWineryMetrics();
  const wineClubMetrics = await klaviyoClient.getWineClubMetrics();
  
  const prompt = `
    Analyze revenue optimization opportunities for this winery:
    
    Revenue Metrics: ${JSON.stringify(metrics)}
    Wine Club Metrics: ${JSON.stringify(wineClubMetrics)}
    
    Provide insights on:
    1. Revenue drivers and opportunities
    2. Wine club member value vs regular customers
    3. Email marketing ROI optimization
    4. Upselling and cross-selling opportunities
  `;

  return await claudeClient.analyzeEmailPerformance(prompt, {
    metrics,
    wineClubMetrics,
    userQuery: 'Revenue optimization analysis',
  });
}

async function analyzeContentOptimization(data: any, options: any) {
  const campaigns = await klaviyoClient.getCampaigns();
  
  const prompt = `
    Analyze content optimization for this winery's email campaigns:
    
    Campaigns: ${JSON.stringify(campaigns.slice(0, 10))}
    
    Provide insights on:
    1. Subject line performance patterns
    2. Content themes that resonate
    3. Wine industry content best practices
    4. Recommendations for content strategy
  `;

  return await claudeClient.analyzeEmailPerformance(prompt, {
    userQuery: 'Content optimization analysis',
  });
}

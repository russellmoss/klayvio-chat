// Test API route for database operations
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dbServer } from '@/lib/database/queries';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Test 1: Basic connection - try a simple query first
    const { data: connectionTest, error: connectionError } = await supabase
      .from('wineries')
      .select('id')
      .limit(1);

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message,
        code: connectionError.code,
        hint: connectionError.hint
      }, { status: 500 });
    }

    // Test 2: Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names');

    // Test 3: Try to fetch wineries (should work even if empty)
    const { data: wineries, error: wineriesError } = await supabase
      .from('wineries')
      .select('*')
      .limit(5);

    // Test 4: Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    // Test 5: Check analytics tables
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaign_analytics')
      .select('*')
      .limit(5);

    return NextResponse.json({
      success: true,
      tests: {
        connection: {
          status: 'passed',
          message: 'Database connection successful'
        },
        tables: {
          status: tablesError ? 'warning' : 'passed',
          message: tablesError ? 'Could not fetch table names' : 'Tables accessible',
          error: tablesError?.message
        },
        wineries: {
          status: wineriesError ? 'failed' : 'passed',
          message: wineriesError ? 'Wineries table error' : `Found ${wineries?.length || 0} wineries`,
          error: wineriesError?.message,
          data: wineries
        },
        profiles: {
          status: profilesError ? 'failed' : 'passed',
          message: profilesError ? 'Profiles table error' : `Found ${profiles?.length || 0} profiles`,
          error: profilesError?.message,
          data: profiles
        },
        campaigns: {
          status: campaignsError ? 'failed' : 'passed',
          message: campaignsError ? 'Campaign analytics table error' : `Found ${campaigns?.length || 0} campaigns`,
          error: campaignsError?.message,
          data: campaigns
        }
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during database test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test database utility functions
    const supabase = await createServerSupabaseClient();
    
    // Test 1: Create a test winery
    const testWinery = {
      name: 'Test Winery',
      domain: 'testwinery.com',
      klaviyo_account_id: 'test_account_123',
      timezone: 'UTC',
      currency: 'USD'
    };

    const { data: newWinery, error: wineryError } = await supabase
      .from('wineries')
      .insert(testWinery)
      .select()
      .single();

    if (wineryError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test winery',
        details: wineryError.message
      }, { status: 500 });
    }

    // Test 2: Create a test profile
    const testProfile = {
      id: 'test-user-123',
      email: 'test@testwinery.com',
      full_name: 'Test User',
      role: 'admin' as const,
      winery_id: newWinery.id,
      preferences: { theme: 'light' }
    };

    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select()
      .single();

    if (profileError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test profile',
        details: profileError.message
      }, { status: 500 });
    }

    // Test 3: Create test analytics data
    const testCampaign = {
      winery_id: newWinery.id,
      klaviyo_campaign_id: 'test_campaign_123',
      campaign_name: 'Test Campaign',
      campaign_type: 'promotional',
      status: 'sent' as const,
      sent_count: 1000,
      delivered_count: 950,
      opened_count: 285,
      clicked_count: 57,
      revenue: 1500.00,
      open_rate: 30.00,
      click_rate: 6.00
    };

    const { data: newCampaign, error: campaignError } = await supabase
      .from('campaign_analytics')
      .insert(testCampaign)
      .select()
      .single();

    if (campaignError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test campaign',
        details: campaignError.message
      }, { status: 500 });
    }

    // Test 4: Test database utility functions
    const wineryFromUtils = await dbServer.getWinery(newWinery.id);
    const profileFromUtils = await dbServer.getProfile(newProfile.id);
    const campaignsFromUtils = await dbServer.getCampaignAnalytics(newWinery.id);

    return NextResponse.json({
      success: true,
      message: 'All database tests passed',
      created: {
        winery: newWinery,
        profile: newProfile,
        campaign: newCampaign
      },
      utilityTests: {
        getWinery: wineryFromUtils ? 'passed' : 'failed',
        getProfile: profileFromUtils ? 'passed' : 'failed',
        getCampaignAnalytics: campaignsFromUtils.length > 0 ? 'passed' : 'failed'
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during database test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

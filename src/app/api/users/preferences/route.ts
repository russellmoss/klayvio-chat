import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 400 }
      );
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      dashboard: {
        defaultView: 'overview',
        refreshInterval: 300, // 5 minutes
        showAdvancedMetrics: false,
      },
      winery: {
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
      },
    };

    return NextResponse.json({
      success: true,
      data: preferences || defaultPreferences,
    });
  } catch (error: any) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch preferences',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await request.json();

    // Upsert user preferences
    const { data: updatedPreferences, error: updateError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPreferences,
      message: 'Preferences updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update preferences',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

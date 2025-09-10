// Database query utilities for the Winery Email Marketing AI Assistant
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Winery = Tables['wineries']['Row'];
type QueryLog = Tables['query_logs']['Row'];
type SavedReport = Tables['saved_reports']['Row'];
type CampaignAnalytics = Tables['campaign_analytics']['Row'];
type FlowAnalytics = Tables['flow_analytics']['Row'];
type SegmentAnalytics = Tables['segment_analytics']['Row'];

// Client-side database operations
export class DatabaseClient {
  private supabase = createClient();

  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }

  // Winery operations
  async getWinery(wineryId: string): Promise<Winery | null> {
    const { data, error } = await this.supabase
      .from('wineries')
      .select('*')
      .eq('id', wineryId)
      .single();

    if (error) {
      console.error('Error fetching winery:', error);
      return null;
    }

    return data;
  }

  // Query logs operations
  async logQuery(queryData: {
    userId: string;
    wineryId: string;
    query: string;
    response?: string;
    queryType?: string;
    metricsUsed?: Record<string, unknown>;
    responseTimeMs?: number;
    tokensUsed?: number;
    modelUsed?: string;
  }): Promise<QueryLog | null> {
    const { data, error } = await this.supabase
      .from('query_logs')
      .insert(queryData)
      .select()
      .single();

    if (error) {
      console.error('Error logging query:', error);
      return null;
    }

    return data;
  }

  async getQueryHistory(userId: string, limit: number = 50): Promise<QueryLog[]> {
    const { data, error } = await this.supabase
      .from('query_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching query history:', error);
      return [];
    }

    return data || [];
  }

  // Saved reports operations
  async saveReport(reportData: {
    userId: string;
    wineryId: string;
    title: string;
    description?: string;
    reportType?: string;
    data: Record<string, unknown>;
    filters?: Record<string, unknown>;
    isPublic?: boolean;
  }): Promise<SavedReport | null> {
    const { data, error } = await this.supabase
      .from('saved_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) {
      console.error('Error saving report:', error);
      return null;
    }

    return data;
  }

  async getSavedReports(userId: string, wineryId?: string): Promise<SavedReport[]> {
    let query = this.supabase
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (wineryId) {
      query = query.eq('winery_id', wineryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching saved reports:', error);
      return [];
    }

    return data || [];
  }

  async getPublicReports(wineryId: string): Promise<SavedReport[]> {
    const { data, error } = await this.supabase
      .from('saved_reports')
      .select('*')
      .eq('winery_id', wineryId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public reports:', error);
      return [];
    }

    return data || [];
  }

  // Analytics operations
  async getCampaignAnalytics(wineryId: string, limit: number = 100): Promise<CampaignAnalytics[]> {
    const { data, error } = await this.supabase
      .from('campaign_analytics')
      .select('*')
      .eq('winery_id', wineryId)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching campaign analytics:', error);
      return [];
    }

    return data || [];
  }

  async getFlowAnalytics(wineryId: string, limit: number = 100): Promise<FlowAnalytics[]> {
    const { data, error } = await this.supabase
      .from('flow_analytics')
      .select('*')
      .eq('winery_id', wineryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching flow analytics:', error);
      return [];
    }

    return data || [];
  }

  async getSegmentAnalytics(wineryId: string, limit: number = 100): Promise<SegmentAnalytics[]> {
    const { data, error } = await this.supabase
      .from('segment_analytics')
      .select('*')
      .eq('winery_id', wineryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching segment analytics:', error);
      return [];
    }

    return data || [];
  }

  // Bulk operations for analytics data
  async upsertCampaignAnalytics(analytics: Partial<CampaignAnalytics>[]): Promise<CampaignAnalytics[]> {
    const { data, error } = await this.supabase
      .from('campaign_analytics')
      .upsert(analytics, { onConflict: 'winery_id,klaviyo_campaign_id' })
      .select();

    if (error) {
      console.error('Error upserting campaign analytics:', error);
      return [];
    }

    return data || [];
  }

  async upsertFlowAnalytics(analytics: Partial<FlowAnalytics>[]): Promise<FlowAnalytics[]> {
    const { data, error } = await this.supabase
      .from('flow_analytics')
      .upsert(analytics, { onConflict: 'winery_id,klaviyo_flow_id' })
      .select();

    if (error) {
      console.error('Error upserting flow analytics:', error);
      return [];
    }

    return data || [];
  }

  async upsertSegmentAnalytics(analytics: Partial<SegmentAnalytics>[]): Promise<SegmentAnalytics[]> {
    const { data, error } = await this.supabase
      .from('segment_analytics')
      .upsert(analytics, { onConflict: 'winery_id,klaviyo_segment_id' })
      .select();

    if (error) {
      console.error('Error upserting segment analytics:', error);
      return [];
    }

    return data || [];
  }
}

// Server-side database operations
export class DatabaseServer {
  private async getSupabase() {
    return await createServerSupabaseClient();
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }

  // Winery operations
  async getWinery(wineryId: string): Promise<Winery | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('wineries')
      .select('*')
      .eq('id', wineryId)
      .single();

    if (error) {
      console.error('Error fetching winery:', error);
      return null;
    }

    return data;
  }

  // Query logs operations
  async logQuery(queryData: {
    userId: string;
    wineryId: string;
    query: string;
    response?: string;
    queryType?: string;
    metricsUsed?: Record<string, unknown>;
    responseTimeMs?: number;
    tokensUsed?: number;
    modelUsed?: string;
  }): Promise<QueryLog | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('query_logs')
      .insert(queryData)
      .select()
      .single();

    if (error) {
      console.error('Error logging query:', error);
      return null;
    }

    return data;
  }

  // Analytics operations
  async getCampaignAnalytics(wineryId: string, limit: number = 100): Promise<CampaignAnalytics[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('winery_id', wineryId)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching campaign analytics:', error);
      return [];
    }

    return data || [];
  }

  async getFlowAnalytics(wineryId: string, limit: number = 100): Promise<FlowAnalytics[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('flow_analytics')
      .select('*')
      .eq('winery_id', wineryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching flow analytics:', error);
      return [];
    }

    return data || [];
  }

  async getSegmentAnalytics(wineryId: string, limit: number = 100): Promise<SegmentAnalytics[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('segment_analytics')
      .select('*')
      .eq('winery_id', wineryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching segment analytics:', error);
      return [];
    }

    return data || [];
  }

  // Bulk operations for analytics data
  async upsertCampaignAnalytics(analytics: Partial<CampaignAnalytics>[]): Promise<CampaignAnalytics[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('campaign_analytics')
      .upsert(analytics, { onConflict: 'winery_id,klaviyo_campaign_id' })
      .select();

    if (error) {
      console.error('Error upserting campaign analytics:', error);
      return [];
    }

    return data || [];
  }

  async upsertFlowAnalytics(analytics: Partial<FlowAnalytics>[]): Promise<FlowAnalytics[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('flow_analytics')
      .upsert(analytics, { onConflict: 'winery_id,klaviyo_flow_id' })
      .select();

    if (error) {
      console.error('Error upserting flow analytics:', error);
      return [];
    }

    return data || [];
  }

  async upsertSegmentAnalytics(analytics: Partial<SegmentAnalytics>[]): Promise<SegmentAnalytics[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('segment_analytics')
      .upsert(analytics, { onConflict: 'winery_id,klaviyo_segment_id' })
      .select();

    if (error) {
      console.error('Error upserting segment analytics:', error);
      return [];
    }

    return data || [];
  }
}

// Export singleton instances
export const dbClient = new DatabaseClient();
export const dbServer = new DatabaseServer();

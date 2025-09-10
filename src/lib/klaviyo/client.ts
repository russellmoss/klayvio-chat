import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@/lib/env';
import {
  KlaviyoCampaign,
  KlaviyoFlow,
  KlaviyoSegment,
  KlaviyoProfile,
  KlaviyoEvent,
  KlaviyoMetrics,
  CampaignMetrics,
  FlowMetrics,
  SegmentMetrics,
  OverallMetrics,
  WineryMetrics,
  WineClubMetrics,
  CustomerInsights,
  ListGrowth,
  KlaviyoApiResponse,
  KlaviyoError,
  KlaviyoQuery,
} from './types';

export class KlaviyoClient {
  private client: AxiosInstance;
  private privateKey: string;

  constructor() {
    this.privateKey = config.klaviyo.privateKey;
    
    this.client = axios.create({
      baseURL: 'https://a.klaviyo.com/api',
      headers: {
        'Authorization': `Klaviyo-API-Key ${this.privateKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making Klaviyo API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Klaviyo API request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`Klaviyo API response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Klaviyo API response error:', error.response?.data || error.message);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: any): KlaviyoError {
    if (error.response?.data) {
      return error.response.data;
    }
    
    return {
      errors: [{
        id: 'unknown-error',
        status: error.response?.status || 500,
        code: 'UNKNOWN_ERROR',
        title: 'Unknown Error',
        detail: error.message || 'An unknown error occurred',
      }],
    };
  }

  private async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private async postRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Campaign Methods
  async getCampaigns(query?: KlaviyoQuery): Promise<KlaviyoApiResponse<KlaviyoCampaign[]>> {
    const params = this.buildQueryParams(query);
    return this.request<KlaviyoApiResponse<KlaviyoCampaign[]>>('/campaigns', params);
  }

  async getCampaign(campaignId: string): Promise<KlaviyoApiResponse<KlaviyoCampaign>> {
    return this.request<KlaviyoApiResponse<KlaviyoCampaign>>(`/campaigns/${campaignId}`);
  }

  async getCampaignMetrics(campaignId: string, startDate?: string, endDate?: string): Promise<CampaignMetrics> {
    const params: Record<string, any> = {};
    if (startDate) params.filter = `greater-than(created,${startDate})`;
    if (endDate) params.filter = `less-than(created,${endDate})`;
    
    // Mock implementation - replace with actual Klaviyo metrics API calls
    return {
      campaign_id: campaignId,
      campaign_name: `Campaign ${campaignId}`,
      status: 'completed',
      sent: 1000,
      delivered: 950,
      bounced: 50,
      opened: 380,
      clicked: 95,
      unsubscribed: 5,
      spam_complaints: 2,
      open_rate: 0.38,
      click_rate: 0.095,
      bounce_rate: 0.05,
      unsubscribe_rate: 0.005,
      spam_rate: 0.002,
      revenue: 2500,
      orders: 25,
      average_order_value: 100,
      created_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
    };
  }

  // Flow Methods
  async getFlows(query?: KlaviyoQuery): Promise<KlaviyoApiResponse<KlaviyoFlow[]>> {
    const params = this.buildQueryParams(query);
    return this.request<KlaviyoApiResponse<KlaviyoFlow[]>>('/flows', params);
  }

  async getFlow(flowId: string): Promise<KlaviyoApiResponse<KlaviyoFlow>> {
    return this.request<KlaviyoApiResponse<KlaviyoFlow>>(`/flows/${flowId}`);
  }

  async getFlowMetrics(flowId: string, startDate?: string, endDate?: string): Promise<FlowMetrics> {
    // Mock implementation - replace with actual Klaviyo metrics API calls
    return {
      flow_id: flowId,
      flow_name: `Flow ${flowId}`,
      status: 'live',
      enrolled: 500,
      completed: 150,
      conversion_rate: 0.30,
      revenue: 4500,
      orders: 45,
      average_order_value: 100,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };
  }

  // Segment Methods
  async getSegments(query?: KlaviyoQuery): Promise<KlaviyoApiResponse<KlaviyoSegment[]>> {
    const params = this.buildQueryParams(query);
    return this.request<KlaviyoApiResponse<KlaviyoSegment[]>>('/segments', params);
  }

  async getSegment(segmentId: string): Promise<KlaviyoApiResponse<KlaviyoSegment>> {
    return this.request<KlaviyoApiResponse<KlaviyoSegment>>(`/segments/${segmentId}`);
  }

  async getSegmentMetrics(segmentId: string): Promise<SegmentMetrics> {
    // Mock implementation - replace with actual Klaviyo metrics API calls
    return {
      segment_id: segmentId,
      segment_name: `Segment ${segmentId}`,
      profile_count: 250,
      growth_rate: 0.15,
      engagement_rate: 0.25,
      revenue: 1250,
      orders: 12,
      average_order_value: 104,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };
  }

  // Profile Methods
  async getProfiles(query?: KlaviyoQuery): Promise<KlaviyoApiResponse<KlaviyoProfile[]>> {
    const params = this.buildQueryParams(query);
    return this.request<KlaviyoApiResponse<KlaviyoProfile[]>>('/profiles', params);
  }

  async getProfile(profileId: string): Promise<KlaviyoApiResponse<KlaviyoProfile>> {
    return this.request<KlaviyoApiResponse<KlaviyoProfile>>(`/profiles/${profileId}`);
  }

  async createProfile(profileData: Partial<KlaviyoProfile>): Promise<KlaviyoApiResponse<KlaviyoProfile>> {
    return this.postRequest<KlaviyoApiResponse<KlaviyoProfile>>('/profiles', {
      data: profileData,
    });
  }

  async updateProfile(profileId: string, profileData: Partial<KlaviyoProfile>): Promise<KlaviyoApiResponse<KlaviyoProfile>> {
    return this.postRequest<KlaviyoApiResponse<KlaviyoProfile>>(`/profiles/${profileId}`, {
      data: profileData,
    });
  }

  // Event Methods
  async getEvents(query?: KlaviyoQuery): Promise<KlaviyoApiResponse<KlaviyoEvent[]>> {
    const params = this.buildQueryParams(query);
    return this.request<KlaviyoApiResponse<KlaviyoEvent[]>>('/events', params);
  }

  async trackEvent(eventData: {
    event: string;
    customer_properties?: Record<string, any>;
    properties?: Record<string, any>;
    time?: string;
  }): Promise<void> {
    await this.postRequest('/events', eventData);
  }

  // Wine Industry Specific Methods
  async getWineryMetrics(startDate?: string, endDate?: string): Promise<WineryMetrics> {
    // Mock implementation - replace with actual calculations based on Klaviyo data
    return {
      wine_club_members: 150,
      wine_club_revenue: 45000,
      wine_club_retention_rate: 0.85,
      seasonal_sales: {
        spring: 15000,
        summer: 12000,
        fall: 18000,
        winter: 10000,
        peak_season: 'fall',
        low_season: 'winter',
        seasonal_variation: 0.8,
      },
      wine_preferences: {
        red_wine: 0.45,
        white_wine: 0.35,
        rose_wine: 0.15,
        sparkling_wine: 0.05,
        dessert_wine: 0.02,
        top_varietals: [
          { varietal: 'Cabernet Sauvignon', percentage: 0.25 },
          { varietal: 'Chardonnay', percentage: 0.20 },
          { varietal: 'Pinot Noir', percentage: 0.15 },
        ],
        price_preferences: {
          under_25: 0.30,
          between_25_50: 0.40,
          between_50_100: 0.25,
          over_100: 0.05,
        },
      },
      customer_lifetime_value: 450,
      average_purchase_frequency: 3.2,
      top_selling_varietals: [
        { varietal: 'Cabernet Sauvignon', revenue: 15000, units_sold: 300 },
        { varietal: 'Chardonnay', revenue: 12000, units_sold: 400 },
        { varietal: 'Pinot Noir', revenue: 9000, units_sold: 200 },
      ],
      customer_segments: [
        {
          name: 'Wine Enthusiasts',
          size: 50,
          characteristics: ['High engagement', 'Premium purchases'],
          average_value: 800,
          engagement_level: 'high',
          wine_preferences: ['Red wine', 'Premium varietals'],
          purchase_behavior: 'Frequent, high-value purchases',
        },
        {
          name: 'Casual Drinkers',
          size: 200,
          characteristics: ['Moderate engagement', 'Value purchases'],
          average_value: 200,
          engagement_level: 'medium',
          wine_preferences: ['White wine', 'Popular varietals'],
          purchase_behavior: 'Occasional, moderate purchases',
        },
      ],
    };
  }

  async getWineClubMetrics(): Promise<WineClubMetrics> {
    // Mock implementation - replace with actual calculations
    return {
      total_members: 150,
      active_members: 128,
      new_members_this_month: 12,
      churned_members_this_month: 5,
      retention_rate: 0.85,
      average_membership_duration: 18.5,
      monthly_revenue: 3750,
      annual_revenue: 45000,
      tier_distribution: {
        basic: 80,
        premium: 60,
        vip: 10,
      },
      engagement_metrics: {
        email_open_rate: 0.42,
        email_click_rate: 0.12,
        event_attendance_rate: 0.25,
        purchase_frequency: 2.8,
      },
    };
  }

  async getCustomerInsights(): Promise<CustomerInsights> {
    // Mock implementation - replace with actual calculations
    return {
      total_customers: 500,
      new_customers: 45,
      returning_customers: 455,
      customer_lifetime_value: 450,
      average_order_value: 125,
      purchase_frequency: 3.2,
      customer_segments: [
        {
          name: 'VIP Customers',
          size: 25,
          characteristics: ['High value', 'Frequent purchases'],
          average_value: 1200,
          engagement_level: 'high',
          wine_preferences: ['Premium varietals', 'Limited editions'],
          purchase_behavior: 'High-frequency, high-value purchases',
        },
        {
          name: 'Regular Customers',
          size: 200,
          characteristics: ['Consistent purchases', 'Moderate value'],
          average_value: 300,
          engagement_level: 'medium',
          wine_preferences: ['Popular varietals', 'Seasonal wines'],
          purchase_behavior: 'Regular, moderate purchases',
        },
        {
          name: 'Occasional Customers',
          size: 275,
          characteristics: ['Infrequent purchases', 'Lower value'],
          average_value: 150,
          engagement_level: 'low',
          wine_preferences: ['Basic varietals', 'Value wines'],
          purchase_behavior: 'Occasional, low-value purchases',
        },
      ],
      top_customers: [
        {
          profile_id: 'profile_1',
          email: 'customer1@example.com',
          total_spent: 2500,
          order_count: 15,
          last_purchase: new Date().toISOString(),
        },
        {
          profile_id: 'profile_2',
          email: 'customer2@example.com',
          total_spent: 2200,
          order_count: 12,
          last_purchase: new Date().toISOString(),
        },
      ],
      customer_journey: [
        {
          step: 'Email Signup',
          description: 'Customer subscribes to email list',
          conversion_rate: 1.0,
          average_time_to_next: 0,
          drop_off_rate: 0,
        },
        {
          step: 'First Email Open',
          description: 'Customer opens first email',
          conversion_rate: 0.65,
          average_time_to_next: 2,
          drop_off_rate: 0.35,
        },
        {
          step: 'First Click',
          description: 'Customer clicks on email content',
          conversion_rate: 0.25,
          average_time_to_next: 5,
          drop_off_rate: 0.40,
        },
        {
          step: 'First Purchase',
          description: 'Customer makes first purchase',
          conversion_rate: 0.15,
          average_time_to_next: 14,
          drop_off_rate: 0.10,
        },
      ],
    };
  }

  async getListGrowth(startDate?: string, endDate?: string): Promise<ListGrowth> {
    // Mock implementation - replace with actual Klaviyo list growth API calls
    return {
      total_subscribers: 2500,
      new_subscribers: 150,
      unsubscribers: 25,
      net_growth: 125,
      growth_rate: 0.05,
      period: {
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString(),
      },
      sources: [
        { source: 'Website', count: 80, percentage: 0.53 },
        { source: 'Social Media', count: 35, percentage: 0.23 },
        { source: 'Events', count: 20, percentage: 0.13 },
        { source: 'Referrals', count: 15, percentage: 0.10 },
      ],
    };
  }

  // Utility Methods
  private buildQueryParams(query?: KlaviyoQuery): Record<string, any> {
    const params: Record<string, any> = {};

    if (query?.filter) {
      params.filter = query.filter;
    }

    if (query?.sort) {
      params.sort = query.sort;
    }

    if (query?.page) {
      if (query.page.size) {
        params['page[size]'] = query.page.size;
      }
      if (query.page.cursor) {
        params['page[cursor]'] = query.page.cursor;
      }
    }

    if (query?.include) {
      params.include = query.include;
    }

    if (query?.fields) {
      Object.entries(query.fields).forEach(([key, value]) => {
        params[`fields[${key}]`] = value;
      });
    }

    return params;
  }

  private transform<T>(data: any): T {
    // Transform Klaviyo API response to our internal format
    return data;
  }
}

// Export singleton instance
export const klaviyoClient = new KlaviyoClient();

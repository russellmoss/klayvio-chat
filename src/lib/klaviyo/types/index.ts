// Core Klaviyo API Types
export interface KlaviyoCampaign {
  type: 'campaign';
  id: string;
  attributes: {
    name: string;
    status: 'draft' | 'scheduled' | 'running' | 'paused' | 'canceled' | 'completed';
    created: string;
    updated: string;
    send_time: string | null;
    scheduled_time: string | null;
    archived: boolean;
    subject: string | null;
    preview_text: string | null;
    from_email: string | null;
    from_name: string | null;
    reply_to_email: string | null;
    template_id: string | null;
    message_type: 'email' | 'sms';
    channel: 'email' | 'sms';
  };
  relationships: {
    template?: {
      data: {
        type: 'template';
        id: string;
      };
    };
    tags?: {
      data: Array<{
        type: 'tag';
        id: string;
      }>;
    };
  };
}

export interface KlaviyoFlow {
  type: 'flow';
  id: string;
  attributes: {
    name: string;
    status: 'draft' | 'live' | 'paused' | 'stopped';
    created: string;
    updated: string;
    trigger_type: string;
    archived: boolean;
  };
  relationships: {
    tags?: {
      data: Array<{
        type: 'tag';
        id: string;
      }>;
    };
  };
}

export interface KlaviyoSegment {
  type: 'segment';
  id: string;
  attributes: {
    name: string;
    created: string;
    updated: string;
    profile_count: number;
  };
  relationships: {
    tags?: {
      data: Array<{
        type: 'tag';
        id: string;
      }>;
    };
  };
}

export interface KlaviyoProfile {
  type: 'profile';
  id: string;
  attributes: {
    email: string | null;
    phone_number: string | null;
    first_name: string | null;
    last_name: string | null;
    organization: string | null;
    title: string | null;
    image: string | null;
    created: string;
    updated: string;
    last_event_date: string | null;
    location: {
      address1: string | null;
      address2: string | null;
      city: string | null;
      country: string | null;
      latitude: number | null;
      longitude: number | null;
      region: string | null;
      zip: string | null;
      timezone: string | null;
    };
    properties: Record<string, any>;
    subscriptions: {
      email: {
        marketing: {
          consent: string;
          consent_timestamp: string | null;
          method: string | null;
          method_detail: string | null;
          custom_method: string | null;
          custom_method_detail: string | null;
        };
        transactional: {
          consent: string;
          consent_timestamp: string | null;
          method: string | null;
          method_detail: string | null;
          custom_method: string | null;
          custom_method_detail: string | null;
        };
      };
      sms: {
        marketing: {
          consent: string;
          consent_timestamp: string | null;
          method: string | null;
          method_detail: string | null;
          custom_method: string | null;
          custom_method_detail: string | null;
        };
        transactional: {
          consent: string;
          consent_timestamp: string | null;
          method: string | null;
          method_detail: string | null;
          custom_method: string | null;
          custom_method_detail: string | null;
        };
      };
    };
  };
}

export interface KlaviyoEvent {
  type: 'event';
  id: string;
  attributes: {
    timestamp: string;
    event_type: string;
    properties: Record<string, any>;
    metric: {
      data: {
        type: 'metric';
        id: string;
      };
    };
    profile: {
      data: {
        type: 'profile';
        id: string;
      };
    };
  };
}

// Metrics and Analytics Types
export interface KlaviyoMetrics {
  campaigns: CampaignMetrics[];
  flows: FlowMetrics[];
  segments: SegmentMetrics[];
  overall: OverallMetrics;
}

export interface CampaignMetrics {
  campaign_id: string;
  campaign_name: string;
  status: string;
  sent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  spam_complaints: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  spam_rate: number;
  revenue: number;
  orders: number;
  average_order_value: number;
  created_at: string;
  sent_at: string | null;
}

export interface FlowMetrics {
  flow_id: string;
  flow_name: string;
  status: string;
  enrolled: number;
  completed: number;
  conversion_rate: number;
  revenue: number;
  orders: number;
  average_order_value: number;
  created_at: string;
  last_updated: string;
}

export interface SegmentMetrics {
  segment_id: string;
  segment_name: string;
  profile_count: number;
  growth_rate: number;
  engagement_rate: number;
  revenue: number;
  orders: number;
  average_order_value: number;
  created_at: string;
  last_updated: string;
}

export interface OverallMetrics {
  total_profiles: number;
  total_campaigns: number;
  total_flows: number;
  total_segments: number;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  overall_open_rate: number;
  overall_click_rate: number;
  overall_conversion_rate: number;
  period_start: string;
  period_end: string;
}

// Wine Industry Specific Metrics
export interface WineryMetrics {
  wine_club_members: number;
  wine_club_revenue: number;
  wine_club_retention_rate: number;
  seasonal_sales: SeasonalSales;
  wine_preferences: WinePreferences;
  customer_lifetime_value: number;
  average_purchase_frequency: number;
  top_selling_varietals: Array<{
    varietal: string;
    revenue: number;
    units_sold: number;
  }>;
  customer_segments: CustomerSegment[];
}

export interface WineClubMetrics {
  total_members: number;
  active_members: number;
  new_members_this_month: number;
  churned_members_this_month: number;
  retention_rate: number;
  average_membership_duration: number;
  monthly_revenue: number;
  annual_revenue: number;
  tier_distribution: {
    basic: number;
    premium: number;
    vip: number;
  };
  engagement_metrics: {
    email_open_rate: number;
    email_click_rate: number;
    event_attendance_rate: number;
    purchase_frequency: number;
  };
}

export interface CustomerInsights {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  customer_lifetime_value: number;
  average_order_value: number;
  purchase_frequency: number;
  customer_segments: CustomerSegment[];
  top_customers: Array<{
    profile_id: string;
    email: string;
    total_spent: number;
    order_count: number;
    last_purchase: string;
  }>;
  customer_journey: CustomerJourneyStep[];
}

export interface CustomerSegment {
  name: string;
  size: number;
  characteristics: string[];
  average_value: number;
  engagement_level: 'high' | 'medium' | 'low';
  wine_preferences: string[];
  purchase_behavior: string;
}

export interface CustomerJourneyStep {
  step: string;
  description: string;
  conversion_rate: number;
  average_time_to_next: number;
  drop_off_rate: number;
}

export interface SeasonalSales {
  spring: number;
  summer: number;
  fall: number;
  winter: number;
  peak_season: string;
  low_season: string;
  seasonal_variation: number;
}

export interface WinePreferences {
  red_wine: number;
  white_wine: number;
  rose_wine: number;
  sparkling_wine: number;
  dessert_wine: number;
  top_varietals: Array<{
    varietal: string;
    percentage: number;
  }>;
  price_preferences: {
    under_25: number;
    between_25_50: number;
    between_50_100: number;
    over_100: number;
  };
}

// API Response Types
export interface KlaviyoApiResponse<T> {
  data: T;
  links?: {
    self: string;
    next?: string;
    prev?: string;
  };
  meta?: {
    count: number;
    total_count?: number;
  };
}

export interface KlaviyoError {
  errors: Array<{
    id: string;
    status: number;
    code: string;
    title: string;
    detail: string;
    source?: {
      pointer?: string;
      parameter?: string;
    };
    meta?: Record<string, any>;
  }>;
}

// Query and Filter Types
export interface KlaviyoQuery {
  filter?: string;
  sort?: string;
  page?: {
    size?: number;
    cursor?: string;
  };
  include?: string;
  fields?: Record<string, string>;
}

export interface ListGrowth {
  total_subscribers: number;
  new_subscribers: number;
  unsubscribers: number;
  net_growth: number;
  growth_rate: number;
  period: {
    start: string;
    end: string;
  };
  sources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

// Export all types
export type {
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
  CustomerSegment,
  CustomerJourneyStep,
  SeasonalSales,
  WinePreferences,
  KlaviyoApiResponse,
  KlaviyoError,
  KlaviyoQuery,
  ListGrowth,
};

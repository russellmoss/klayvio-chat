import { KlaviyoCampaign, KlaviyoFlow, KlaviyoSegment, KlaviyoProfile } from '../types';

// Date and Time Utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(d);
  }
};

// Campaign Utilities
export const getCampaignStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'running':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCampaignStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return '📝';
    case 'scheduled':
      return '⏰';
    case 'running':
      return '▶️';
    case 'paused':
      return '⏸️';
    case 'canceled':
      return '❌';
    case 'completed':
      return '✅';
    default:
      return '📄';
  }
};

export const isCampaignActive = (campaign: KlaviyoCampaign): boolean => {
  return campaign.attributes.status === 'running' || campaign.attributes.status === 'scheduled';
};

export const getCampaignPerformance = (campaign: KlaviyoCampaign): 'excellent' | 'good' | 'average' | 'poor' => {
  // Mock performance calculation - replace with actual metrics
  const openRate = 0.25; // 25% open rate
  const clickRate = 0.05; // 5% click rate

  if (openRate > 0.3 && clickRate > 0.08) {
    return 'excellent';
  } else if (openRate > 0.2 && clickRate > 0.05) {
    return 'good';
  } else if (openRate > 0.15 && clickRate > 0.03) {
    return 'average';
  } else {
    return 'poor';
  }
};

// Flow Utilities
export const getFlowStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'live':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'stopped':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getFlowStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return '📝';
    case 'live':
      return '🔄';
    case 'paused':
      return '⏸️';
    case 'stopped':
      return '⏹️';
    default:
      return '📄';
  }
};

export const isFlowActive = (flow: KlaviyoFlow): boolean => {
  return flow.attributes.status === 'live';
};

// Segment Utilities
export const getSegmentSize = (segment: KlaviyoSegment): string => {
  const count = segment.attributes.profile_count;
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toString();
  }
};

export const getSegmentSizeColor = (count: number): string => {
  if (count >= 10000) {
    return 'text-green-600';
  } else if (count >= 1000) {
    return 'text-blue-600';
  } else if (count >= 100) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
};

// Profile Utilities
export const getProfileDisplayName = (profile: KlaviyoProfile): string => {
  const firstName = profile.attributes.first_name;
  const lastName = profile.attributes.last_name;
  const email = profile.attributes.email;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (email) {
    return email;
  } else {
    return 'Unknown User';
  }
};

export const getProfileInitials = (profile: KlaviyoProfile): string => {
  const firstName = profile.attributes.first_name;
  const lastName = profile.attributes.last_name;
  const email = profile.attributes.email;

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    return firstName.charAt(0).toUpperCase();
  } else if (email) {
    return email.charAt(0).toUpperCase();
  } else {
    return 'U';
  }
};

export const getProfileLocation = (profile: KlaviyoProfile): string => {
  const location = profile.attributes.location;
  
  if (location.city && location.region) {
    return `${location.city}, ${location.region}`;
  } else if (location.city) {
    return location.city;
  } else if (location.country) {
    return location.country;
  } else {
    return 'Unknown Location';
  }
};

export const isProfileSubscribed = (profile: KlaviyoProfile, channel: 'email' | 'sms' = 'email'): boolean => {
  const subscriptions = profile.attributes.subscriptions;
  
  if (channel === 'email') {
    return subscriptions.email.marketing.consent === 'SUBSCRIBED';
  } else {
    return subscriptions.sms.marketing.consent === 'SUBSCRIBED';
  }
};

// Metrics Utilities
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toString();
  }
};

// Performance Utilities
export const getPerformanceColor = (value: number, thresholds: { good: number; average: number }): string => {
  if (value >= thresholds.good) {
    return 'text-green-600';
  } else if (value >= thresholds.average) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
};

export const getPerformanceIcon = (value: number, thresholds: { good: number; average: number }): string => {
  if (value >= thresholds.good) {
    return '📈';
  } else if (value >= thresholds.average) {
    return '➡️';
  } else {
    return '📉';
  }
};

// Wine Industry Specific Utilities
export const getWineVarietalColor = (varietal: string): string => {
  const varietalLower = varietal.toLowerCase();
  
  if (varietalLower.includes('red') || varietalLower.includes('cabernet') || varietalLower.includes('merlot') || varietalLower.includes('pinot noir')) {
    return 'text-red-600';
  } else if (varietalLower.includes('white') || varietalLower.includes('chardonnay') || varietalLower.includes('sauvignon')) {
    return 'text-yellow-600';
  } else if (varietalLower.includes('rose') || varietalLower.includes('rosé')) {
    return 'text-pink-600';
  } else if (varietalLower.includes('sparkling') || varietalLower.includes('champagne')) {
    return 'text-blue-600';
  } else {
    return 'text-gray-600';
  }
};

export const getSeasonalTrend = (season: string): string => {
  switch (season.toLowerCase()) {
    case 'spring':
      return '🌸';
    case 'summer':
      return '☀️';
    case 'fall':
    case 'autumn':
      return '🍂';
    case 'winter':
      return '❄️';
    default:
      return '📅';
  }
};

export const getCustomerTierColor = (tier: string): string => {
  switch (tier.toLowerCase()) {
    case 'vip':
      return 'bg-purple-100 text-purple-800';
    case 'premium':
      return 'bg-blue-100 text-blue-800';
    case 'basic':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Export all utilities
export {
  formatDate,
  formatDateTime,
  getRelativeTime,
  getCampaignStatusColor,
  getCampaignStatusIcon,
  isCampaignActive,
  getCampaignPerformance,
  getFlowStatusColor,
  getFlowStatusIcon,
  isFlowActive,
  getSegmentSize,
  getSegmentSizeColor,
  getProfileDisplayName,
  getProfileInitials,
  getProfileLocation,
  isProfileSubscribed,
  formatPercentage,
  formatCurrency,
  formatNumber,
  formatLargeNumber,
  getPerformanceColor,
  getPerformanceIcon,
  getWineVarietalColor,
  getSeasonalTrend,
  getCustomerTierColor,
  isValidEmail,
  isValidPhoneNumber,
};

import { config } from '@/lib/env';

export async function fetchWithConfig(url: string, params: Record<string, any> = {}) {
  const queryString = new URLSearchParams();
  
  // Handle special Klaviyo parameter formatting
  Object.entries(params).forEach(([key, value]) => {
    if (key.includes('[') && key.includes(']')) {
      // Keep bracket notation as-is
      queryString.append(key, value);
    } else if (key === 'page_size') {
      // Convert page_size to page[size]
      queryString.append('page[size]', value);
    } else {
      queryString.append(key, value);
    }
  });
  
  const fullUrl = `${url}?${queryString.toString()}`;
  
  return fetch(fullUrl, {
    headers: {
      'Authorization': `Klaviyo-API-Key ${config.klaviyo.privateKey}`,
      'revision': '2024-10-15',
      'Accept': 'application/json',
    },
  });
}

// Helper function to handle Klaviyo API responses with error checking
export async function handleKlaviyoResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Klaviyo API Error ${response.status}: ${errorData.detail || response.statusText}`);
  }
  
  return response.json();
}

// Utility function for making Klaviyo API calls with proper error handling
export async function klaviyoApiCall<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  try {
    const response = await fetchWithConfig(`https://a.klaviyo.com/api${endpoint}`, params);
    return await handleKlaviyoResponse<T>(response);
  } catch (error) {
    console.error(`Klaviyo API call failed for ${endpoint}:`, error);
    throw error;
  }
}

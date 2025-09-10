'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, Users, TrendingUp, Eye, MousePointer } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  created: string;
  sent: string;
  recipients: number;
  opens: number;
  clicks: number;
  open_rate: number;
  click_rate: number;
}

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/klaviyo/campaigns');
        const data = await response.json();
        
        if (data.success) {
          setCampaigns(data.data || []);
        } else {
          setError(data.error || 'Failed to fetch campaigns');
        }
      } catch (err) {
        setError('Failed to fetch campaigns');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Found</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Your First Campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
      </div>
      <div className="divide-y">
        {campaigns.length === 0 ? (
          <div className="p-6 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3>
            <p className="text-gray-500 mb-4">Create your first email campaign to get started.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Campaign
            </button>
          </div>
        ) : (
          campaigns.slice(0, 5).map((campaign) => (
            <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(campaign.sent || campaign.created)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {campaign.recipients.toLocaleString()} recipients
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {campaign.open_rate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center text-gray-500">
                      <MousePointer className="h-4 w-4 mr-1" />
                      {campaign.click_rate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Click Rate</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

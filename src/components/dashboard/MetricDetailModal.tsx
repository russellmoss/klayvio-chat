'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, BarChart3, LineChart } from 'lucide-react';
import { TimeSeriesChart } from './TimeSeriesChart';

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    title: string;
    value: string | number;
    type: 'campaigns' | 'subscribers' | 'openRate' | 'clickRate' | 'unsubscribeRate' | 'conversions' | 'bounceRate' | 'revenue';
    icon: any;
    color: string;
  };
}

interface TimeSeriesData {
  date: string;
  value: number;
  previousYearValue?: number;
}

const timePeriods = [
  { label: '30 Days', value: '30d' },
  { label: '60 Days', value: '60d' },
  { label: '90 Days', value: '90d' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' }
];

export function MetricDetailModal({ isOpen, onClose, metric }: MetricDetailModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('90d');
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedProfileType, setSelectedProfileType] = useState<'subscribers' | 'totalProfiles' | 'activeProfiles' | 'suppressedProfiles'>('subscribers');

  useEffect(() => {
    if (isOpen) {
      fetchMetricData();
    }
  }, [isOpen, selectedPeriod, metric.type, showComparison, selectedProfileType]);

  const fetchMetricData = async () => {
    setLoading(true);
    try {
      // Use selectedProfileType for subscriber metrics, otherwise use metric.type
      const metricType = metric.type === 'subscribers' ? selectedProfileType : metric.type;
      const response = await fetch(
        `/api/klaviyo/metric-history?metric=${metricType}&period=${selectedPeriod}&comparison=${showComparison}`
      );
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        console.error('API error:', result.error);
        // Fallback to mock data
        const mockData = generateMockData(metric.type, selectedPeriod);
        setData(mockData);
      }
    } catch (error) {
      console.error('Error fetching metric data:', error);
      // Fallback to mock data
      const mockData = generateMockData(metric.type, selectedPeriod);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (type: string, period: string): TimeSeriesData[] => {
    const days = period === '30d' ? 30 : period === '60d' ? 60 : period === '90d' ? 90 : period === '6m' ? 180 : 365;
    const data: TimeSeriesData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let value = 0;
      let previousYearValue = 0;
      
      switch (type) {
        case 'campaigns':
          value = Math.floor(Math.random() * 5) + 1; // 1-5 campaigns per day
          previousYearValue = Math.floor(Math.random() * 3) + 1; // 1-3 campaigns per day
          break;
        case 'subscribers':
          value = 9821 + Math.floor(Math.random() * 100) - 50; // Around 9,821 with variation
          previousYearValue = 8500 + Math.floor(Math.random() * 100) - 50; // Previous year baseline
          break;
        case 'openRate':
          value = 52.25 + (Math.random() * 10) - 5; // Around 52.25% with variation
          previousYearValue = 45 + (Math.random() * 8) - 4; // Previous year baseline
          break;
        case 'clickRate':
          value = 1.19 + (Math.random() * 0.5) - 0.25; // Around 1.19% with variation
          previousYearValue = 1.0 + (Math.random() * 0.4) - 0.2; // Previous year baseline
          break;
        case 'unsubscribeRate':
          value = 0.40 + (Math.random() * 0.2) - 0.1; // Around 0.40% with variation
          previousYearValue = 0.5 + (Math.random() * 0.3) - 0.15; // Previous year baseline
          break;
        case 'conversions':
          value = Math.floor(Math.random() * 10) + 1; // 1-10 conversions per day
          previousYearValue = Math.floor(Math.random() * 6) + 1; // 1-6 conversions per day
          break;
        case 'bounceRate':
          value = 0.68 + (Math.random() * 0.3) - 0.15; // Around 0.68% with variation
          previousYearValue = 0.8 + (Math.random() * 0.4) - 0.2; // Previous year baseline
          break;
        case 'revenue':
          value = 45000 + (Math.random() * 10000) - 5000; // Around $45,000 with variation
          previousYearValue = 38000 + (Math.random() * 8000) - 4000; // Previous year baseline
          break;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value),
        previousYearValue: Math.max(0, previousYearValue)
      });
    }
    
    return data;
  };

  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const percentage = ((last - first) / first) * 100;
    
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  const calculateYoYComparison = () => {
    if (!showComparison || data.length === 0) return null;
    
    const currentPeriod = data.slice(-30); // Last 30 days
    const previousYear = data.filter(d => d.previousYearValue !== undefined);
    
    if (previousYear.length === 0) return null;
    
    const currentAvg = currentPeriod.reduce((sum, d) => sum + d.value, 0) / currentPeriod.length;
    const previousAvg = previousYear.reduce((sum, d) => sum + (d.previousYearValue || 0), 0) / previousYear.length;
    
    const percentage = ((currentAvg - previousAvg) / previousAvg) * 100;
    
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  const formatValue = (value: number) => {
    switch (metric.type) {
      case 'subscribers':
      case 'conversions':
        return value.toLocaleString();
      case 'openRate':
      case 'clickRate':
      case 'unsubscribeRate':
      case 'bounceRate':
        return `${value.toFixed(2)}%`;
      case 'revenue':
        return `$${value.toLocaleString()}`;
      default:
        return value.toString();
    }
  };

  const getChartColor = () => {
    return metric.color.includes('blue') ? '#3B82F6' :
           metric.color.includes('green') ? '#10B981' :
           metric.color.includes('purple') ? '#8B5CF6' :
           metric.color.includes('yellow') ? '#F59E0B' :
           metric.color.includes('red') ? '#EF4444' :
           metric.color.includes('indigo') ? '#6366F1' :
           metric.color.includes('pink') ? '#EC4899' :
           '#6B7280';
  };

  if (!isOpen) return null;

  const trend = calculateTrend();
  const yoyComparison = calculateYoYComparison();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${metric.color}`}>
              <metric.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{metric.title}</h2>
              <p className="text-gray-600">Historical performance and trends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Time Period:</span>
              </div>
              <div className="flex space-x-2">
                {timePeriods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {metric.type === 'subscribers' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Profile Type:</span>
                  <div className="flex space-x-1">
                    {[
                      { key: 'subscribers', label: 'Email Profiles' },
                      { key: 'totalProfiles', label: 'Total Profiles' },
                      { key: 'activeProfiles', label: 'Active Profiles' },
                      { key: 'suppressedProfiles', label: 'Suppressed Profiles' }
                    ].map((profile) => (
                      <button
                        key={profile.key}
                        onClick={() => setSelectedProfileType(profile.key as any)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          selectedProfileType === profile.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border'
                        }`}
                      >
                        {profile.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Show Year-over-Year Comparison</span>
              </label>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Value</span>
                    <span className="text-2xl font-bold text-gray-900">{formatValue(data[data.length - 1]?.value || 0)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Period Trend</span>
                    <div className="flex items-center space-x-1">
                      {trend.direction === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : trend.direction === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                      )}
                      <span className={`text-sm font-medium ${
                        trend.direction === 'up' ? 'text-green-600' :
                        trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {trend.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {yoyComparison && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">YoY Change</span>
                      <div className="flex items-center space-x-1">
                        {yoyComparison.direction === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : yoyComparison.direction === 'down' ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                        )}
                        <span className={`text-sm font-medium ${
                          yoyComparison.direction === 'up' ? 'text-green-600' :
                          yoyComparison.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {yoyComparison.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Chart */}
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setChartType('line')}
                        className={`p-2 rounded-md text-sm font-medium transition-colors ${
                          chartType === 'line'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <LineChart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`p-2 rounded-md text-sm font-medium transition-colors ${
                          chartType === 'bar'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Real Interactive Chart */}
                <div className="h-64 w-full">
                  <TimeSeriesChart
                    data={data}
                    metricType={metric.type === 'subscribers' ? selectedProfileType : metric.type}
                    showComparison={showComparison}
                    chartType={chartType}
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Data Points</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        {showComparison && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Year</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.slice(-10).reverse().map((item, index) => {
                        const change = index > 0 ? 
                          ((item.value - data[data.length - 1 - index + 1].value) / data[data.length - 1 - index + 1].value) * 100 : 0;
                        
                        return (
                          <tr key={item.date}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatValue(item.value)}
                            </td>
                            {showComparison && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.previousYearValue ? formatValue(item.previousYearValue) : 'N/A'}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`${
                                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

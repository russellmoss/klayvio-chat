'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';

interface ChartData {
  date: string;
  opens: number;
  clicks: number;
  revenue: number;
  subscribers: number;
}

export function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/klaviyo/metrics');
        const data = await response.json();
        
        if (data.success) {
          // Generate sample data for the last 30 days
          const sampleData = generateSampleData();
          setChartData(sampleData);
        } else {
          setError(data.error || 'Failed to fetch chart data');
        }
      } catch (err) {
        setError('Failed to fetch chart data');
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const generateSampleData = (): ChartData[] => {
    const data: ChartData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        opens: Math.floor(Math.random() * 1000) + 500,
        clicks: Math.floor(Math.random() * 200) + 100,
        revenue: Math.floor(Math.random() * 5000) + 2000,
        subscribers: Math.floor(Math.random() * 100) + 50,
      });
    }
    
    return data;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chart Unavailable</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded-md ${
                chartType === 'line'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-md ${
                chartType === 'bar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="opens" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Opens"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Clicks"
                />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="New Subscribers"
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="opens" fill="#3B82F6" name="Opens" />
                <Bar dataKey="clicks" fill="#10B981" name="Clicks" />
                <Bar dataKey="subscribers" fill="#8B5CF6" name="New Subscribers" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {chartData.reduce((sum, item) => sum + item.opens, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Opens</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {chartData.reduce((sum, item) => sum + item.clicks, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Clicks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {chartData.reduce((sum, item) => sum + item.subscribers, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">New Subscribers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

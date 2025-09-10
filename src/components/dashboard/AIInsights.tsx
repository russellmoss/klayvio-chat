'use client';

import { useState } from 'react';
import { Brain, Send, Loader2, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface AIInsightsProps {
  metrics?: any;
}

export function AIInsights({ metrics }: AIInsightsProps) {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          metrics,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInsights(data.data.insights);
      } else {
        setError(data.error || 'Failed to generate insights');
      }
    } catch (err) {
      setError('Failed to generate insights');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "How can I improve my email open rates?",
    "What's the best time to send emails to my wine club members?",
    "Which campaigns are performing best this month?",
    "How can I increase customer engagement?",
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Ask Claude AI for personalized recommendations about your email marketing.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your email performance, best practices, or campaign optimization..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>

        {/* Sample Queries */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sampleQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(sampleQuery)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {sampleQuery}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {insights && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-purple-900 mb-2">AI Recommendation</h4>
                <div className="text-sm text-purple-800 whitespace-pre-wrap">
                  {insights}
                </div>
              </div>
            </div>
          </div>
        )}

        {!insights && !error && !loading && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Get AI-Powered Insights</h4>
            <p className="text-gray-500">
              Ask Claude AI questions about your email marketing performance and get personalized recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

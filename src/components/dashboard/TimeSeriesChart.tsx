'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesData {
  date: string;
  value: number;
  previousYearValue?: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  metricType: string;
  showComparison: boolean;
  chartType?: 'line' | 'bar';
}

export function TimeSeriesChart({ data, metricType, showComparison, chartType = 'line' }: TimeSeriesChartProps) {
  const formatValue = (value: number) => {
    switch (metricType) {
      case 'subscribers':
      case 'totalProfiles':
      case 'activeProfiles':
      case 'suppressedProfiles':
      case 'conversions':
      case 'campaigns':
      case 'campaignRecipients':
      case 'wineClub':
        return value.toLocaleString();
      case 'openRate':
      case 'clickRate':
      case 'unsubscribeRate':
      case 'bounceRate':
        return `${value.toFixed(2)}%`;
      case 'revenue':
      case 'revenuePerRecipient':
        return `$${value.toLocaleString()}`;
      default:
        return value.toString();
    }
  };

  const getChartColor = (metricType: string) => {
    const colors = {
      campaigns: '#3B82F6',
      subscribers: '#10B981',
      totalProfiles: '#3B82F6',
      activeProfiles: '#10B981',
      suppressedProfiles: '#F59E0B',
      openRate: '#8B5CF6',
      clickRate: '#6366F1',
      unsubscribeRate: '#EF4444',
      conversions: '#10B981',
      bounceRate: '#F59E0B',
      revenue: '#F59E0B',
      campaignRecipients: '#F97316',
      revenuePerRecipient: '#8B5CF6',
      wineClub: '#EC4899'
    };
    return colors[metricType as keyof typeof colors] || '#6B7280';
  };

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Current Period',
        data: data.map(item => item.value),
        borderColor: getChartColor(metricType),
        backgroundColor: getChartColor(metricType) + '20',
        borderWidth: 3,
        fill: chartType === 'line',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: getChartColor(metricType),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
      ...(showComparison ? [{
        label: 'Previous Year',
        data: data.map(item => item.previousYearValue || 0),
        borderColor: '#9CA3AF',
        backgroundColor: '#9CA3AF20',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#9CA3AF',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500' as const,
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: getChartColor(metricType),
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            const dataIndex = context[0].dataIndex;
            const date = new Date(data[dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${formatValue(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          font: {
            size: 11,
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return formatValue(value);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
        hoverBorderColor: getChartColor(metricType),
        hoverBorderWidth: 3,
      }
    }
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="h-64 w-full">
      <ChartComponent data={chartData} options={options} />
    </div>
  );
}

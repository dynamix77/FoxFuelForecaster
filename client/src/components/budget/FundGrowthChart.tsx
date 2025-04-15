import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/context';
import Chart from 'chart.js/auto';

const FundGrowthChart: React.FC = () => {
  const { fundPoints } = useAppContext();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // Format currency for chart labels
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  useEffect(() => {
    if (chartRef.current && fundPoints.length > 0) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Get the data for charting (first 40 quarters = 10 years)
      const displayData = fundPoints.slice(0, 40);
      
      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: displayData.map(point => point.label),
            datasets: [{
              label: 'Fund Balance',
              data: displayData.map(point => point.fundBalance),
              borderColor: 'rgba(59, 130, 246, 1)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return formatCurrency(value as number);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return formatCurrency(context.parsed.y);
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [fundPoints]);

  return (
    <div className="bg-white rounded-lg shadow h-full">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Fund Growth</h2>
      </div>
      
      <div className="p-4">
        <canvas ref={chartRef} height="300"></canvas>
      </div>
    </div>
  );
};

export default FundGrowthChart;

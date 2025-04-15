import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/context';
import Chart from 'chart.js/auto';

const CapExChart: React.FC = () => {
  const { capExPoints } = useAppContext();
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
    if (chartRef.current && capExPoints.length > 0) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: capExPoints.map(point => point.label),
            datasets: [{
              label: 'Capital Expenditure',
              data: capExPoints.map(point => point.expenditure),
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderWidth: 1
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
  }, [capExPoints]);

  return (
    <div className="bg-white rounded-lg shadow mt-6">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Capital Expenditure Forecast</h2>
      </div>
      
      <div className="p-4">
        <canvas ref={chartRef} height="200"></canvas>
      </div>
    </div>
  );
};

export default CapExChart;

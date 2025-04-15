import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/context';
import Chart from 'chart.js/auto';

const FleetOverview: React.FC = () => {
  const { ageDistribution, fundPoints } = useAppContext();
  
  const ageChartRef = useRef<HTMLCanvasElement | null>(null);
  const fundChartRef = useRef<HTMLCanvasElement | null>(null);
  
  // Chart instances for cleanup
  const ageChartInstance = useRef<Chart | null>(null);
  const fundChartInstance = useRef<Chart | null>(null);
  
  // Format currency for chart labels
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  useEffect(() => {
    if (ageChartRef.current) {
      // Destroy existing chart if it exists
      if (ageChartInstance.current) {
        ageChartInstance.current.destroy();
      }
      
      // Create age distribution chart
      const ctx = ageChartRef.current.getContext('2d');
      if (ctx) {
        ageChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['0-3 years', '4-7 years', '8-10 years', '10+ years'],
            datasets: [{
              label: 'Number of Vehicles',
              data: ageDistribution,
              backgroundColor: [
                'rgba(16, 185, 129, 0.7)',  // Green
                'rgba(59, 130, 246, 0.7)',  // Blue
                'rgba(245, 158, 11, 0.7)',  // Yellow
                'rgba(239, 68, 68, 0.7)'    // Red
              ],
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
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }
    
    if (fundChartRef.current && fundPoints.length > 0) {
      // Destroy existing chart if it exists
      if (fundChartInstance.current) {
        fundChartInstance.current.destroy();
      }
      
      // Get the first 8 quarters (2 years) for display
      const displayFundPoints = fundPoints.slice(0, 8);
      
      // Create fund balance chart
      const ctx = fundChartRef.current.getContext('2d');
      if (ctx) {
        fundChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: displayFundPoints.map(point => point.label),
            datasets: [{
              label: 'Fund Balance',
              data: displayFundPoints.map(point => point.fundBalance),
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
              legend: {
                display: false
              },
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
      if (ageChartInstance.current) {
        ageChartInstance.current.destroy();
      }
      if (fundChartInstance.current) {
        fundChartInstance.current.destroy();
      }
    };
  }, [ageDistribution, fundPoints]);

  return (
    <div className="bg-white rounded-lg shadow h-full">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Fleet Overview</h2>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Vehicle Age Distribution</h3>
          <canvas ref={ageChartRef} height="200"></canvas>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Fund Balance Projection</h3>
          <canvas ref={fundChartRef} height="200"></canvas>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;

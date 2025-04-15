import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/context';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Chart from 'chart.js/auto';

const ScenarioDetails: React.FC = () => {
  const { scenarios, activeScenario } = useAppContext();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // Get active scenario data
  const scenario = scenarios.find(s => s.id === activeScenario);
  
  // Format currency for chart labels
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Create scenario comparison chart
  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Data for each scenario
      let labels: string[], cashFlowData: number[], fundBalanceData: number[];
      
      // These would typically come from calculations based on the selected scenario
      // Using mock data for demonstration
      if (activeScenario === 'current') {
        labels = ['2025', '2026', '2027', '2028', '2029'];
        cashFlowData = [143000, 195000, 0, 0, 0];
        fundBalanceData = [75000, 25000, 125000, 225000, 325000];
      } else if (activeScenario === 'delay') {
        labels = ['2025', '2026', '2027', '2028', '2029'];
        cashFlowData = [0, 143000, 195000, 0, 0];
        fundBalanceData = [125000, 125000, 75000, 175000, 275000];
      } else if (activeScenario === 'lease') {
        labels = ['2025', '2026', '2027', '2028', '2029'];
        cashFlowData = [0, 0, 0, 0, 0];
        fundBalanceData = [125000, 225000, 325000, 425000, 525000];
      } else {
        labels = ['2025', '2026', '2027', '2028', '2029'];
        cashFlowData = [0, 0, 0, 0, 0];
        fundBalanceData = [0, 0, 0, 0, 0];
      }
      
      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Capital Expenditure',
                type: 'bar',
                data: cashFlowData,
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderWidth: 1,
                yAxisID: 'y'
              },
              {
                label: 'Fund Balance',
                type: 'line',
                data: fundBalanceData,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
              }
            ]
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
  }, [activeScenario]);

  if (!scenario) {
    return <div>No scenario selected</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 id="scenario-title" className="font-semibold text-gray-800">{scenario.name} Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left side - summary */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Summary</h3>
          
          <div className="space-y-4">
            <p className="text-sm">
              {scenario.description}
            </p>
            
            <Alert variant={scenario.alertType}>
              <AlertTitle>Key Points</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {scenario.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
        
        {/* Right side - chart */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Financial Impact</h3>
          <canvas ref={chartRef} height="250"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetails;

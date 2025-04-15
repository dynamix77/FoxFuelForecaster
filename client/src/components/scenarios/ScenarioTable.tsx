import React from 'react';
import { useAppContext } from '@/lib/context';
import { Progress } from '@/components/ui/progress';

const ScenarioTable: React.FC = () => {
  const { scenarios, activeScenario, setActiveScenario } = useAppContext();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Determine risk level color
  const getRiskLevelVariant = (riskLevel: number) => {
    if (riskLevel < 40) return 'success';
    if (riskLevel < 60) return 'warning';
    return 'danger';
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Compare Scenarios</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => (
              <tr 
                key={scenario.id} 
                className={`scenario-row ${activeScenario === scenario.id ? 'active' : ''}`} 
                data-scenario={scenario.id}
              >
                <td className="py-2 px-4 text-sm text-gray-800">{scenario.name}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(scenario.totalCost)}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{scenario.roi}%</td>
                <td className="py-3 px-4">
                  <Progress 
                    value={scenario.riskLevel} 
                    variant={getRiskLevelVariant(scenario.riskLevel)} 
                    showValue
                  />
                </td>
                <td className="py-2 px-4 text-sm text-gray-800">
                  <button 
                    className={`select-scenario ${activeScenario === scenario.id ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-800'} px-3 py-1 rounded text-sm`}
                    onClick={() => setActiveScenario(scenario.id)}
                  >
                    {activeScenario === scenario.id ? 'Active' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScenarioTable;

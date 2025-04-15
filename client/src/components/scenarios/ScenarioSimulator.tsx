import React from 'react';
import { useAppContext } from '@/lib/context';

const ScenarioSimulator: React.FC = () => {
  const { simulationParams, simulationResults, updateSimulationParams } = useAppContext();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Handle slider changes
  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSimulationParams({
      monthlyContribution: Number(e.target.value)
    });
  };
  
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSimulationParams({
      interestRate: Number(e.target.value)
    });
  };
  
  const handleInflationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSimulationParams({
      inflationRate: Number(e.target.value)
    });
  };
  
  const handleLoanRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSimulationParams({
      loanRate: Number(e.target.value)
    });
  };
  
  // Handle apply simulation (this would typically update the main app state)
  const handleApplySimulation = () => {
    alert('Simulation parameters applied to the current scenario.');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Scenario Simulator</h2>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Adjust parameters below to simulate different financial scenarios and see how they impact your fleet budget.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  className="slider mr-3" 
                  min="1000" 
                  max="6000" 
                  step="500" 
                  value={simulationParams.monthlyContribution}
                  onChange={handleContributionChange}
                />
                <span className="text-sm font-medium">
                  {formatCurrency(simulationParams.monthlyContribution)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  className="slider mr-3" 
                  min="0.5" 
                  max="3.0" 
                  step="0.25" 
                  value={simulationParams.interestRate}
                  onChange={handleInterestChange}
                />
                <span className="text-sm font-medium">{simulationParams.interestRate}%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  className="slider mr-3" 
                  min="1.0" 
                  max="5.0" 
                  step="0.5" 
                  value={simulationParams.inflationRate}
                  onChange={handleInflationChange}
                />
                <span className="text-sm font-medium">{simulationParams.inflationRate}%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan/Lease Rate</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  className="slider mr-3" 
                  min="4.0" 
                  max="9.0" 
                  step="0.5" 
                  value={simulationParams.loanRate}
                  onChange={handleLoanRateChange}
                />
                <span className="text-sm font-medium">{simulationParams.loanRate}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Simulation Results</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fund balance after 10 years:</span>
              <span className="font-medium">{formatCurrency(simulationResults.fundBalance)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vehicles fully funded:</span>
              <span className="font-medium">
                {simulationResults.fundedVehicles} of {simulationResults.totalVehicles}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maximum shortfall:</span>
              <span className="font-medium text-red-600">
                {simulationResults.maxShortfall > 0 ? formatCurrency(simulationResults.maxShortfall) : 'None'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average monthly cost:</span>
              <span className="font-medium">{formatCurrency(simulationResults.monthlyAverage)}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              onClick={handleApplySimulation}
            >
              Apply Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;

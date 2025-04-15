import React from 'react';
import ScenarioTable from '@/components/scenarios/ScenarioTable';
import ScenarioDetails from '@/components/scenarios/ScenarioDetails';
import ScenarioSimulator from '@/components/scenarios/ScenarioSimulator';

const Scenarios: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Scenario Planning</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ScenarioTable />
          <ScenarioDetails />
        </div>
        
        <div>
          <ScenarioSimulator />
        </div>
      </div>
    </div>
  );
};

export default Scenarios;

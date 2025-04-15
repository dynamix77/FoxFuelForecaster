import React from 'react';
import BudgetSummary from '@/components/budget/BudgetSummary';
import ProjectionTable from '@/components/budget/ProjectionTable';
import FundGrowthChart from '@/components/budget/FundGrowthChart';
import CapExChart from '@/components/budget/CapExChart';
import TaxAnalysis from '@/components/budget/TaxAnalysis';

const Budget: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Forecasting</h2>
        <BudgetSummary />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProjectionTable />
        </div>
        
        <div>
          <FundGrowthChart />
        </div>
      </div>
      
      <CapExChart />
      
      <TaxAnalysis />
    </div>
  );
};

export default Budget;

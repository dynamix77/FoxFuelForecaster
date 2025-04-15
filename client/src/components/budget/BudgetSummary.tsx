import React from 'react';
import { useAppContext } from '@/lib/context';

const BudgetSummary: React.FC = () => {
  const { settings } = useAppContext();
  const { financial } = settings;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <i className="fas fa-dollar-sign text-blue-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Initial Fund</p>
            <p className="text-2xl font-semibold">{formatCurrency(financial.initialFund)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <i className="fas fa-plus text-green-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Monthly Contribution</p>
            <p className="text-2xl font-semibold">{formatCurrency(financial.monthlyContribution)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-3">
            <i className="fas fa-chart-line text-purple-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Annual Interest</p>
            <p className="text-2xl font-semibold">{financial.interestRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;

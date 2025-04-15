import React from 'react';
import { useAppContext } from '@/lib/context';

const DashboardSummary: React.FC = () => {
  const { fleetStats } = useAppContext();
  
  // Format to 1 decimal place for average age
  const formattedAge = fleetStats.averageAge.toFixed(1);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <i className="fas fa-truck text-blue-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Vehicles</p>
            <p className="text-2xl font-semibold">{fleetStats.totalVehicles}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <i className="fas fa-calendar-alt text-green-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Average Age</p>
            <p className="text-2xl font-semibold">{formattedAge} years</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-yellow-100 p-3">
            <i className="fas fa-money-bill-wave text-yellow-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Fund Balance</p>
            <p className="text-2xl font-semibold">{formatCurrency(fleetStats.fundBalance)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-red-100 p-3">
            <i className="fas fa-exclamation-triangle text-red-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Alerts</p>
            <p className="text-2xl font-semibold">{fleetStats.alertCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;

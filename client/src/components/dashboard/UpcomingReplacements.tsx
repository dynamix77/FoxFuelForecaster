import React from 'react';
import { useAppContext } from '@/lib/context';
import { Projection } from '@/lib/types';

const UpcomingReplacements: React.FC = () => {
  const { projections, vehicles } = useAppContext();
  
  // Get vehicle details by id
  const getVehicleType = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.type : 'Unknown';
  };
  
  // Sort by replacement date and take the first 5
  const upcomingReplacements = [...projections]
    .sort((a, b) => a.replacementMonth - b.replacementMonth)
    .slice(0, 5);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (upcomingReplacements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-3">
          <h2 className="font-semibold text-gray-800">Upcoming Replacements</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-500 italic">No upcoming replacements scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mt-6">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Upcoming Replacements</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {upcomingReplacements.map((replacement) => (
              <tr key={replacement.vehicleId}>
                <td className="py-2 px-4 text-sm text-gray-800">{replacement.name}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{getVehicleType(replacement.vehicleId)}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{replacement.replacementQuarter} {replacement.replacementYear}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(replacement.netCost)}</td>
                <td className="py-2 px-4 text-sm">
                  {replacement.shortfall > 0 ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Shortfall</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Funded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingReplacements;

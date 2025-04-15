import React from 'react';
import { useAppContext } from '@/lib/context';

const ProjectionTable: React.FC = () => {
  const { projections } = useAppContext();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (projections.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-6 py-3">
          <h2 className="font-semibold text-gray-800">Replacement Projections</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-500 italic text-center">No replacements scheduled. Add vehicles with replacement dates to see projections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Replacement Projections</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Replace Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Net Cost</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Reserve</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Payment</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Payment</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projections.map((projection, index) => (
              <tr key={index} className={projection.shortfall > 0 ? 'bg-red-50' : ''}>
                <td className="py-2 px-4 text-sm text-gray-800">{projection.name}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{projection.replacementQuarter} {projection.replacementYear}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(projection.netCost)}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(projection.monthlyReserve)}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(projection.loanPayment)}</td>
                <td className="py-2 px-4 text-sm text-gray-800">{formatCurrency(projection.leasePayment)}</td>
                <td className="py-2 px-4 text-sm">
                  {projection.shortfall > 0 ? (
                    <span className="text-red-600 font-medium">
                      Shortfall: {formatCurrency(projection.shortfall)}
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">Funded</span>
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

export default ProjectionTable;

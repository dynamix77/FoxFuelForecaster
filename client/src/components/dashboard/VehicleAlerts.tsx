import React from 'react';
import { useAppContext } from '@/lib/context';
import { Alert } from '@/lib/types';

const VehicleAlerts: React.FC = () => {
  const { alerts } = useAppContext();

  // Sort alerts by severity (critical first)
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;
    return 0;
  });

  if (sortedAlerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-6 py-3">
          <h2 className="font-semibold text-gray-800">Vehicle Alerts</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-500 italic">No alerts at this time. All vehicles are within configured thresholds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Vehicle Alerts</h2>
      </div>
      
      <div className="p-4">
        {sortedAlerts.map((alert, index) => (
          <div 
            key={`${alert.vehicleId}-${index}`}
            className={`border-l-4 ${alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'} p-4 mb-4 last:mb-0`}
          >
            <div className="flex items-center">
              <i className={`fas fa-exclamation-circle ${alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'} mr-2`}></i>
              <h3 className="font-medium">{alert.vehicleName}</h3>
            </div>
            <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleAlerts;

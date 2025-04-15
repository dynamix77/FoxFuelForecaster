import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Vehicle } from '@/lib/types';
import { VehicleDetail } from './VehicleDetail';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';

interface VehicleTableProps {
  onEditVehicle: (vehicle: Vehicle) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ onEditVehicle }) => {
  const { vehicles, alerts, removeVehicle } = useAppContext();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Get current year for age calculation
  const currentYear = new Date().getFullYear();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Get alert status for a vehicle
  const getVehicleStatus = (vehicleId: number) => {
    const vehicleAlerts = alerts.filter(a => a.vehicleId === vehicleId);
    
    if (vehicleAlerts.length === 0) {
      return { label: 'Good', className: 'bg-green-100 text-green-800' };
    }
    
    if (vehicleAlerts.some(a => a.severity === 'critical')) {
      const alert = vehicleAlerts.find(a => a.severity === 'critical');
      if (alert?.message.includes('age')) {
        return { label: 'Age Alert', className: 'bg-red-100 text-red-800' };
      }
      if (alert?.message.includes('Mileage')) {
        return { label: 'Mileage', className: 'bg-red-100 text-red-800' };
      }
      return { label: 'Critical', className: 'bg-red-100 text-red-800' };
    }
    
    if (vehicleAlerts.some(a => a.severity === 'warning')) {
      if (vehicleAlerts.find(a => a.message.includes('approaching'))?.message.includes('Mileage')) {
        return { label: 'Mileage', className: 'bg-yellow-100 text-yellow-800' };
      }
      return { label: 'Maintenance', className: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { label: 'Good', className: 'bg-green-100 text-green-800' };
  };
  
  // Handle view vehicle details
  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };
  
  // Handle remove vehicle click
  const handleRemoveClick = (vehicleId: number, vehicleName: string) => {
    if (window.confirm(`Are you sure you want to remove ${vehicleName} from the fleet?`)) {
      removeVehicle(vehicleId);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 mb-4">No vehicles in your fleet yet. Add a vehicle to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Year Purchased</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Age</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Mileage</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Replacement</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => {
                const vehicleAge = currentYear - vehicle.purchaseYear;
                const status = getVehicleStatus(vehicle.id);
                
                return (
                  <tr 
                    key={vehicle.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetails(vehicle)}
                  >
                    <td className="py-2 px-4 text-sm font-medium text-gray-800">{vehicle.name}</td>
                    <td className="py-2 px-4 text-sm text-gray-600 capitalize">{vehicle.type}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">{vehicle.purchaseYear}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">{vehicleAge} years</td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {vehicle.currentMileage !== null ? formatNumber(vehicle.currentMileage) : 'N/A'}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">{vehicle.replacementQuarter} {vehicle.replacementYear}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">{formatCurrency(vehicle.replacementCost)}</td>
                    <td className="py-2 px-4 text-sm">
                      <span className={`px-2 py-1 ${status.className} rounded-full text-xs`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(vehicle);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditVehicle(vehicle);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClick(vehicle.id, vehicle.name);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Vehicle Detail Dialog */}
      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          isOpen={selectedVehicle !== null}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </>
  );
};

export default VehicleTable;

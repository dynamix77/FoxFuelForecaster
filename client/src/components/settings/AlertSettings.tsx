import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { AlertSettings as AlertSettingsType } from '@/lib/types';

const AlertSettings: React.FC = () => {
  const { settings, updateAlertSettings } = useAppContext();
  const [formData, setFormData] = useState<AlertSettingsType>(settings.alerts);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: Number(value)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAlertSettings(formData);
    alert('Alert settings updated successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Alert Thresholds</h2>
      </div>
      
      <div className="p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Vehicle Age</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="truck-age-max" className="block text-sm text-gray-700 mb-1">Max Truck Age (Years)</label>
                <input 
                  type="number" 
                  id="truck-age-max"
                  name="truckMaxAge"
                  value={formData.truckMaxAge}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="trailer-age-max" className="block text-sm text-gray-700 mb-1">Max Trailer Age (Years)</label>
                <input 
                  type="number" 
                  id="trailer-age-max"
                  name="trailerMaxAge"
                  value={formData.trailerMaxAge}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Vehicle Mileage</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="truck-mileage-max" className="block text-sm text-gray-700 mb-1">Max Truck Mileage</label>
                <input 
                  type="number" 
                  id="truck-mileage-max"
                  name="truckMaxMileage"
                  value={formData.truckMaxMileage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Maintenance Costs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="truck-maint-max" className="block text-sm text-gray-700 mb-1">Max Truck (per Quarter)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input 
                    type="number" 
                    id="truck-maint-max"
                    name="truckMaintenanceMax"
                    value={formData.truckMaintenanceMax}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="trailer-maint-max" className="block text-sm text-gray-700 mb-1">Max Trailer (per Quarter)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input 
                    type="number" 
                    id="trailer-maint-max"
                    name="trailerMaintenanceMax"
                    value={formData.trailerMaintenanceMax}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              Save Alert Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertSettings;

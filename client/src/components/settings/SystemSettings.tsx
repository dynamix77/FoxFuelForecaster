import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { SystemSettings as SystemSettingsType } from '@/lib/types';

const SystemSettings: React.FC = () => {
  const { settings, updateSystemSettings } = useAppContext();
  const [formData, setFormData] = useState<SystemSettingsType>(settings.system);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(formData);
    alert('System settings updated successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">System Settings</h2>
      </div>
      
      <div className="p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select 
              id="date-format"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select 
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="auto-save"
              name="autoSave"
              checked={formData.autoSave}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="auto-save" className="ml-2 block text-sm text-gray-700">Auto-save changes</label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="email-alerts"
              name="emailAlerts"
              checked={formData.emailAlerts}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="email-alerts" className="ml-2 block text-sm text-gray-700">Email alerts for upcoming replacements</label>
          </div>
          
          <div className="pt-4 border-t">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              Save System Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;

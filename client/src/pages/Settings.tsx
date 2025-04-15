import React from 'react';
import FinancialSettings from '@/components/settings/FinancialSettings';
import AlertSettings from '@/components/settings/AlertSettings';
import SystemSettings from '@/components/settings/SystemSettings';

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FinancialSettings />
        </div>
        
        <div>
          <AlertSettings />
          
          <div className="mt-6">
            <SystemSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React from 'react';
import { useAppContext } from '@/lib/context';

interface HeaderProps {
  onExportData: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExportData }) => {
  const { activeTab } = useAppContext();
  
  const getTitleFromTab = (tab: string): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'vehicles': return 'Vehicles';
      case 'budgeting': return 'Budget Forecasting';
      case 'scenarios': return 'Scenario Planning';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800" id="page-title">
        {getTitleFromTab(activeTab)}
      </h1>
      <div className="flex items-center">
        <button 
          onClick={onExportData}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center"
        >
          <i className="fas fa-download mr-2"></i>
          Export Data
        </button>
      </div>
    </header>
  );
};

export default Header;

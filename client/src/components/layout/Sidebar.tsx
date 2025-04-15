import React from 'react';
import { useAppContext } from '@/lib/context';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab } = useAppContext();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <div className={`sidebar bg-white shadow-lg w-64 fixed h-full overflow-y-auto transition-all z-30 ${isMobileOpen ? 'open transform-none' : 'transform -translate-x-full md:transform-none'}`}>
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">Fox Fuel</h1>
        <p className="text-sm text-gray-500">Fleet Budget Forecaster</p>
      </div>
      
      <nav className="mt-4">
        <ul>
          <li>
            <a 
              href="#" 
              className={`tab-link flex items-center px-4 py-3 ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('dashboard');
              }}
            >
              <i className="fas fa-tachometer-alt w-6"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`tab-link flex items-center px-4 py-3 ${activeTab === 'vehicles' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('vehicles');
              }}
            >
              <i className="fas fa-truck w-6"></i>
              <span>Vehicles</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`tab-link flex items-center px-4 py-3 ${activeTab === 'budgeting' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('budgeting');
              }}
            >
              <i className="fas fa-chart-line w-6"></i>
              <span>Budget Forecasting</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`tab-link flex items-center px-4 py-3 ${activeTab === 'scenarios' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('scenarios');
              }}
            >
              <i className="fas fa-sitemap w-6"></i>
              <span>Scenario Planning</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`tab-link flex items-center px-4 py-3 ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('settings');
              }}
            >
              <i className="fas fa-cog w-6"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-800">Fleet Manager</p>
            <p className="text-xs text-gray-500">manager@foxfuel.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '@/lib/context';
import Dashboard from '@/pages/Dashboard';
import Vehicles from '@/pages/Vehicles';
import Budget from '@/pages/Budget';
import Scenarios from '@/pages/Scenarios';
import Settings from '@/pages/Settings';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeTab, vehicles, settings } = useAppContext();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleExportData = () => {
    // Create export data object
    const exportData = {
      vehicles,
      settings,
      exportDate: new Date().toISOString()
    };
    
    // Convert to JSON and create file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create download link and trigger click
    const exportFileDefaultName = 'fox-fuel-fleet-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onCloseMobile={closeMobileMenu} 
      />
      
      {/* Mobile menu button */}
      <div className="fixed bottom-4 right-4 md:hidden z-40">
        <button 
          onClick={toggleMobileMenu}
          className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      <div className="main-content flex-1 md:ml-64 overflow-x-hidden">
        <Header onExportData={handleExportData} />
        
        <div className="p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'vehicles' && <Vehicles />}
          {activeTab === 'budgeting' && <Budget />}
          {activeTab === 'scenarios' && <Scenarios />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Layout;

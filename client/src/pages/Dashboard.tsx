import React from 'react';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import VehicleAlerts from '@/components/dashboard/VehicleAlerts';
import UpcomingReplacements from '@/components/dashboard/UpcomingReplacements';
import FleetOverview from '@/components/dashboard/FleetOverview';

const Dashboard: React.FC = () => {
  return (
    <div>
      <DashboardSummary />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VehicleAlerts />
          <UpcomingReplacements />
        </div>
        
        <div>
          <FleetOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

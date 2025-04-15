import React, { useState } from 'react';
import VehicleTable from '@/components/vehicles/VehicleTable';
import AddVehicleForm from '@/components/vehicles/AddVehicleForm';
import { Vehicle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, FileBarChart, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Vehicles: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { vehicles, vehiclesLoading, alerts } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  
  const handleAddClick = () => {
    setEditingVehicle(null);
    setShowAddForm(true);
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddForm(true);
  };
  
  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingVehicle(null);
  };

  // Calculate stats for the summary cards
  const currentYear = new Date().getFullYear();
  const totalVehicles = vehicles.length;
  const truckCount = vehicles.filter(v => v.type === 'truck').length;
  const trailerCount = vehicles.filter(v => v.type === 'trailer').length;
  const totalAge = vehicles.reduce((sum, v) => sum + (currentYear - v.purchaseYear), 0);
  const averageAge = totalVehicles > 0 ? (totalAge / totalVehicles).toFixed(1) : '0';
  
  // Calculate vehicle counts with issues
  const vehiclesWithAgeAlerts = alerts.filter(a => a.message.includes('age')).length;
  const replacementsThisYear = vehicles.filter(v => v.replacementYear === currentYear).length;
  const replacementsNextYear = vehicles.filter(v => v.replacementYear === currentYear + 1).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Vehicle Fleet</h2>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Add New Vehicle
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehicles
            </CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              {truckCount} trucks, {trailerCount} trailers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fleet Age
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAge} years</div>
            <p className="text-xs text-muted-foreground">
              Average across all vehicles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approaching Replacement
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{replacementsThisYear}</div>
            <p className="text-xs text-muted-foreground">
              + {replacementsNextYear} due next year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Age Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesWithAgeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Vehicles exceeding age thresholds
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="trucks">Trucks</TabsTrigger>
          <TabsTrigger value="trailers">Trailers</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <VehicleTable onEditVehicle={handleEditVehicle} />
        </TabsContent>
        <TabsContent value="trucks" className="mt-4">
          {/* Later we can add filtered tables */}
          <VehicleTable onEditVehicle={handleEditVehicle} />
        </TabsContent>
        <TabsContent value="trailers" className="mt-4">
          {/* Later we can add filtered tables */}
          <VehicleTable onEditVehicle={handleEditVehicle} />
        </TabsContent>
      </Tabs>
      
      {showAddForm && (
        <div className="mt-6">
          <AddVehicleForm 
            onClose={handleCloseForm}
            editingVehicle={editingVehicle}
          />
        </div>
      )}
    </div>
  );
};

export default Vehicles;

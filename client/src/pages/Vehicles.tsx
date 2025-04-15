import React, { useState } from 'react';
import VehicleTable from '@/components/vehicles/VehicleTable';
import AddVehicleForm from '@/components/vehicles/AddVehicleForm';
import { Vehicle } from '@/lib/types';

const Vehicles: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
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

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Vehicle Inventory</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center"
          onClick={handleAddClick}
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Vehicle
        </button>
      </div>
      
      <VehicleTable onEditVehicle={handleEditVehicle} />
      
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

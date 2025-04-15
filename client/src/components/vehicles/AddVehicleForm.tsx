import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/context';
import { Vehicle } from '@/lib/types';

interface AddVehicleFormProps {
  onClose: () => void;
  editingVehicle: Vehicle | null;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onClose, editingVehicle }) => {
  const { addVehicle, updateVehicle } = useAppContext();
  const currentYear = new Date().getFullYear();
  
  // Default empty form
  const emptyForm = {
    name: '',
    type: '',
    purchaseYear: currentYear,
    currentMileage: '',
    replacementCost: '',
    salvageValue: '',
    inflationRate: '2.5',
    replacementYear: currentYear + 5,
    replacementQuarter: 'Q2'
  };
  
  // Initialize form state
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // If editing a vehicle, set form data to that vehicle
  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        name: editingVehicle.name,
        type: editingVehicle.type,
        purchaseYear: editingVehicle.purchaseYear,
        currentMileage: editingVehicle.currentMileage !== null ? String(editingVehicle.currentMileage) : '',
        replacementCost: String(editingVehicle.replacementCost),
        salvageValue: String(editingVehicle.salvageValue),
        inflationRate: String(editingVehicle.inflationRate),
        replacementYear: editingVehicle.replacementYear,
        replacementQuarter: editingVehicle.replacementQuarter
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingVehicle]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Vehicle type is required';
    }
    
    if (!formData.purchaseYear || formData.purchaseYear < 1990 || formData.purchaseYear > currentYear) {
      newErrors.purchaseYear = `Purchase year must be between 1990 and ${currentYear}`;
    }
    
    if (formData.currentMileage && (isNaN(Number(formData.currentMileage)) || Number(formData.currentMileage) < 0)) {
      newErrors.currentMileage = 'Mileage must be a positive number';
    }
    
    if (!formData.replacementCost || isNaN(Number(formData.replacementCost)) || Number(formData.replacementCost) <= 0) {
      newErrors.replacementCost = 'Replacement cost must be a positive number';
    }
    
    if (!formData.salvageValue || isNaN(Number(formData.salvageValue)) || Number(formData.salvageValue) < 0) {
      newErrors.salvageValue = 'Salvage value must be a non-negative number';
    }
    
    if (!formData.inflationRate || isNaN(Number(formData.inflationRate)) || Number(formData.inflationRate) < 0) {
      newErrors.inflationRate = 'Inflation rate must be a non-negative number';
    }
    
    if (!formData.replacementYear || formData.replacementYear < currentYear) {
      newErrors.replacementYear = `Replacement year must be ${currentYear} or later`;
    }
    
    if (!formData.replacementQuarter) {
      newErrors.replacementQuarter = 'Replacement quarter is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const vehicleData: Omit<Vehicle, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      purchaseYear: Number(formData.purchaseYear),
      currentMileage: formData.currentMileage ? Number(formData.currentMileage) : null,
      replacementCost: Number(formData.replacementCost),
      salvageValue: Number(formData.salvageValue),
      inflationRate: Number(formData.inflationRate),
      replacementYear: Number(formData.replacementYear),
      replacementQuarter: formData.replacementQuarter
    };
    
    if (editingVehicle) {
      // Update existing vehicle
      updateVehicle({
        ...vehicleData,
        id: editingVehicle.id
      });
    } else {
      // Add new vehicle
      addVehicle(vehicleData);
    }
    
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h3>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicle-name" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
            <input 
              type="text" 
              id="vehicle-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g. Truck #123"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="vehicle-type" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select 
              id="vehicle-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full border ${errors.type ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Type</option>
              <option value="Straight Truck">Straight Truck</option>
              <option value="Semi Truck">Semi Truck</option>
              <option value="Dry Van">Dry Van Trailer</option>
              <option value="Refrigerated">Refrigerated Trailer</option>
              <option value="Flatbed">Flatbed Trailer</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>
          
          <div>
            <label htmlFor="purchase-year" className="block text-sm font-medium text-gray-700 mb-1">Purchase Year</label>
            <input 
              type="number" 
              id="purchase-year"
              name="purchaseYear"
              value={formData.purchaseYear}
              onChange={handleChange}
              className={`w-full border ${errors.purchaseYear ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g. 2020"
            />
            {errors.purchaseYear && <p className="text-red-500 text-xs mt-1">{errors.purchaseYear}</p>}
          </div>
          
          <div>
            <label htmlFor="current-mileage" className="block text-sm font-medium text-gray-700 mb-1">Current Mileage</label>
            <input 
              type="number" 
              id="current-mileage"
              name="currentMileage"
              value={formData.currentMileage}
              onChange={handleChange}
              className={`w-full border ${errors.currentMileage ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g. 250000 (leave empty for trailers)"
            />
            {errors.currentMileage && <p className="text-red-500 text-xs mt-1">{errors.currentMileage}</p>}
          </div>
          
          <div>
            <label htmlFor="replacement-cost" className="block text-sm font-medium text-gray-700 mb-1">Replacement Cost</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input 
                type="number" 
                id="replacement-cost"
                name="replacementCost"
                value={formData.replacementCost}
                onChange={handleChange}
                className={`w-full border ${errors.replacementCost ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g. 85000"
              />
            </div>
            {errors.replacementCost && <p className="text-red-500 text-xs mt-1">{errors.replacementCost}</p>}
          </div>
          
          <div>
            <label htmlFor="salvage-value" className="block text-sm font-medium text-gray-700 mb-1">Salvage Value</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input 
                type="number" 
                id="salvage-value"
                name="salvageValue"
                value={formData.salvageValue}
                onChange={handleChange}
                className={`w-full border ${errors.salvageValue ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g. 5000"
              />
            </div>
            {errors.salvageValue && <p className="text-red-500 text-xs mt-1">{errors.salvageValue}</p>}
          </div>
          
          <div>
            <label htmlFor="inflation-rate" className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              id="inflation-rate"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={handleChange}
              className={`w-full border ${errors.inflationRate ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g. 2.5"
            />
            {errors.inflationRate && <p className="text-red-500 text-xs mt-1">{errors.inflationRate}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="replacement-year" className="block text-sm font-medium text-gray-700 mb-1">Replacement Year</label>
              <input 
                type="number" 
                id="replacement-year"
                name="replacementYear"
                value={formData.replacementYear}
                onChange={handleChange}
                className={`w-full border ${errors.replacementYear ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g. 2026"
              />
              {errors.replacementYear && <p className="text-red-500 text-xs mt-1">{errors.replacementYear}</p>}
            </div>
            
            <div>
              <label htmlFor="replacement-quarter" className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
              <select 
                id="replacement-quarter"
                name="replacementQuarter"
                value={formData.replacementQuarter}
                onChange={handleChange}
                className={`w-full border ${errors.replacementQuarter ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
              {errors.replacementQuarter && <p className="text-red-500 text-xs mt-1">{errors.replacementQuarter}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700"
          >
            {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleForm;

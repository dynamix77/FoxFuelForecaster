import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { FinancialSettings as FinancialSettingsType } from '@/lib/types';

const FinancialSettings: React.FC = () => {
  const { settings, updateFinancialSettings } = useAppContext();
  const [formData, setFormData] = useState<FinancialSettingsType>(settings.financial);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const numValue = type === 'number' ? Number(value) : value;
    
    setFormData({
      ...formData,
      [name]: numValue
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialSettings(formData);
    alert('Financial settings updated successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-6 py-3">
        <h2 className="font-semibold text-gray-800">Financial Settings</h2>
      </div>
      
      <div className="p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="initial-fund" className="block text-sm font-medium text-gray-700 mb-1">Initial Fund Balance</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input 
                type="number" 
                id="initial-fund"
                name="initialFund"
                value={formData.initialFund}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="monthly-contribution" className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input 
                type="number" 
                id="monthly-contribution"
                name="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              id="interest-rate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="loan-interest-rate" className="block text-sm font-medium text-gray-700 mb-1">Loan Interest Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              id="loan-interest-rate"
              name="loanInterestRate"
              value={formData.loanInterestRate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="lease-interest-rate" className="block text-sm font-medium text-gray-700 mb-1">Lease Interest Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              id="lease-interest-rate"
              name="leaseInterestRate"
              value={formData.leaseInterestRate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="loan-term-years" className="block text-sm font-medium text-gray-700 mb-1">Loan/Lease Term (Years)</label>
            <input 
              type="number" 
              id="loan-term-years"
              name="loanTermYears"
              value={formData.loanTermYears}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              id="tax-rate"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="depreciation-method" className="block text-sm font-medium text-gray-700 mb-1">Default Depreciation Method</label>
            <select 
              id="depreciation-method"
              name="depreciationMethod"
              value={formData.depreciationMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="straight-line">Straight Line</option>
              <option value="macrs">MACRS (Modified Accelerated Cost Recovery)</option>
              <option value="double-declining">Double Declining Balance</option>
            </select>
          </div>
          
          <div className="pt-4 border-t">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              Save Financial Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialSettings;

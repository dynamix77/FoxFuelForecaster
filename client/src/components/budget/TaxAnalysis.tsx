import React from 'react';
import { useAppContext } from '@/lib/context';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const TaxAnalysis: React.FC = () => {
  const { taxAnalysis, taxMethod, setTaxMethod, settings } = useAppContext();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaxMethod(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow mt-6">
      <div className="border-b px-6 py-3 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Tax Benefits Analysis</h2>
        <select 
          id="tax-analysis-method" 
          className="border border-gray-300 rounded px-3 py-1 text-sm"
          value={taxMethod}
          onChange={handleMethodChange}
        >
          <option value="immediate">Immediate Deduction</option>
          <option value="depreciation">Depreciation (MACRS)</option>
          <option value="bonus">Bonus Depreciation</option>
        </select>
      </div>
      
      <div className="p-4">
        <Alert variant="info" className="mb-4">
          <AlertDescription>
            Tax analysis based on current rate: <strong>{settings.financial.taxRate}%</strong>
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Total Tax Savings</h3>
            <p className="text-2xl font-semibold">{formatCurrency(taxAnalysis.totalSavings)}</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">First Year Savings</h3>
            <p className="text-2xl font-semibold">{formatCurrency(taxAnalysis.firstYearSavings)}</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Net Equipment Cost</h3>
            <p className="text-2xl font-semibold">{formatCurrency(taxAnalysis.netEquipmentCost)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxAnalysis;

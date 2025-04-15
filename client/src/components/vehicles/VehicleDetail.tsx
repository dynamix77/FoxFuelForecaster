import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  X, Edit, Trash2, TrendingUp, Calendar, Truck, 
  DollarSign, AlertTriangle, RefreshCw, BarChart3 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/lib/types';
import { useAppContext } from '@/lib/context';
import { VehiclePricingPanel } from './VehiclePricingPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VehicleDetailProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetail({ vehicle, isOpen, onClose }: VehicleDetailProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { removeVehicle, settings, updateVehiclePricing } = useAppContext();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicle.purchaseYear;
  const isTrailer = vehicle.type.toLowerCase().includes('trailer');
  const maxAge = isTrailer ? settings.alerts.trailerMaxAge : settings.alerts.truckMaxAge;
  
  const ageStatus = age > maxAge 
    ? 'critical' 
    : age > maxAge * 0.8 
      ? 'warning' 
      : 'normal';

  // Calculate approximate remaining vehicle life based on age ratio
  const remainingLifePercent = Math.max(0, Math.min(100, 100 - (age / maxAge) * 100));
  
  // Calculate replacement cost adjusted for inflation
  const inflationFactor = Math.pow((1 + vehicle.inflationRate / 100), vehicle.replacementYear - currentYear);
  const adjustedReplacementCost = vehicle.replacementCost * inflationFactor;
  
  // Format quarter date for display
  const getQuarterStartMonth = (quarter: string) => {
    switch (quarter) {
      case 'Q1': return 'Jan';
      case 'Q2': return 'Apr';
      case 'Q3': return 'Jul';
      case 'Q4': return 'Oct';
      default: return '';
    }
  };
  
  const replacementDate = `${getQuarterStartMonth(vehicle.replacementQuarter)} ${vehicle.replacementYear}`;
  const yearsUntilReplacement = vehicle.replacementYear - currentYear;
  
  const handleEdit = () => {
    onClose();
    navigate(`/vehicles/edit/${vehicle.id}`);
  };
  
  const handleDelete = () => {
    if (confirmDelete) {
      removeVehicle(vehicle.id);
      toast({
        title: 'Vehicle Deleted',
        description: `${vehicle.name} has been removed from your fleet.`,
      });
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };
  
  // Handler for updating vehicle pricing from the pricing panel
  const handleUpdatePricing = async (
    vehicleId: number, 
    currentValue: number, 
    replacementCost: number,
    salvageValue: number
  ) => {
    try {
      const success = await updateVehiclePricing(vehicleId, currentValue, replacementCost, salvageValue);
      
      if (success) {
        toast({
          title: "Pricing Updated",
          description: `Updated replacement cost to $${replacementCost.toLocaleString()} and salvage value to $${salvageValue.toLocaleString()}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "There was an error updating the vehicle pricing. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating vehicle pricing:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the vehicle pricing. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {vehicle.type === 'truck' ? (
                <Truck className="inline-block mr-2 h-6 w-6" />
              ) : (
                <Truck className="inline-block mr-2 h-6 w-6" />
              )}
              {vehicle.name}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {`${vehicle.purchaseYear} ${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}`}
            <Badge className="ml-2" variant={vehicle.type === 'truck' ? 'default' : 'secondary'}>
              {vehicle.type.toUpperCase()}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              <Truck className="h-4 w-4 mr-2" />
              Vehicle Details
            </TabsTrigger>
            <TabsTrigger value="market">
              <BarChart3 className="h-4 w-4 mr-2" />
              Market Data
            </TabsTrigger>
            <TabsTrigger value="financials">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Vehicle Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicle Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className={`font-medium ${ageStatus === 'critical' ? 'text-destructive' : 
                        ageStatus === 'warning' ? 'text-yellow-500' : ''}`}>
                        {age} years
                        {ageStatus === 'critical' && <AlertTriangle className="h-4 w-4 inline-block ml-1" />}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Year:</span>
                      <span className="font-medium">{vehicle.purchaseYear}</span>
                    </div>
                    
                    {vehicle.currentMileage !== null && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Mileage:</span>
                        <span className="font-medium">{vehicle.currentMileage.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Remaining Life:</span>
                      <span className="font-medium">
                        {remainingLifePercent.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          remainingLifePercent < 20 ? 'bg-red-500' : 
                          remainingLifePercent < 50 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`} 
                        style={{ width: `${remainingLifePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Replacement Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Replacement Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled Replacement:</span>
                      <span className="font-medium">{replacementDate}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Until Replacement:</span>
                      <span className={`font-medium ${yearsUntilReplacement <= 1 ? 'text-yellow-500' : ''}`}>
                        {yearsUntilReplacement <= 0 
                          ? 'Due now' 
                          : `${yearsUntilReplacement} ${yearsUntilReplacement === 1 ? 'year' : 'years'}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Replacement Cost (Base):</span>
                      <span className="font-medium">${vehicle.replacementCost.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inflation Adjusted Cost:</span>
                      <span className="font-medium">${Math.round(adjustedReplacementCost).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salvage Value:</span>
                      <span className="font-medium">${vehicle.salvageValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Additional vehicle details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance & Financial Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inflation Rate:</span>
                    <span className="font-medium">{vehicle.inflationRate}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Replacement Cost:</span>
                    <span className="font-medium">
                      ${Math.round(adjustedReplacementCost - vehicle.salvageValue).toLocaleString()}
                    </span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Savings Target:</span>
                    <span className="font-medium">
                      ${Math.round((adjustedReplacementCost - vehicle.salvageValue) / 
                        Math.max(1, (vehicle.replacementYear - currentYear) * 12)).toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Market Data Tab */}
          <TabsContent value="market" className="pt-4">
            <VehiclePricingPanel 
              vehicle={vehicle} 
              onUpdatePricing={handleUpdatePricing}
            />
          </TabsContent>
          
          {/* Financial Analysis Tab */}
          <TabsContent value="financials" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Projections</CardTitle>
                <CardDescription>
                  Long-term cost analysis and ROI calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 border rounded-lg p-4">
                      <h4 className="text-sm font-medium">Purchase Options</h4>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Outright Purchase:</span>
                        <span className="font-medium">${Math.round(adjustedReplacementCost).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">With Salvage Credit:</span>
                        <span className="font-medium">${Math.round(adjustedReplacementCost - vehicle.salvageValue).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border rounded-lg p-4">
                      <h4 className="text-sm font-medium">Loan Analysis (7 yr @ {settings.financial.loanInterestRate}%)</h4>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                        <span className="font-medium">
                          ${Math.round((adjustedReplacementCost - vehicle.salvageValue) * 
                            (settings.financial.loanInterestRate / 1200) / 
                            (1 - Math.pow(1 + settings.financial.loanInterestRate / 1200, -84))).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Interest:</span>
                        <span className="font-medium">
                          ${Math.round((adjustedReplacementCost - vehicle.salvageValue) * 
                            (settings.financial.loanInterestRate / 1200) / 
                            (1 - Math.pow(1 + settings.financial.loanInterestRate / 1200, -84)) * 84 - 
                            (adjustedReplacementCost - vehicle.salvageValue)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border rounded-lg p-4">
                      <h4 className="text-sm font-medium">Lease Analysis (5 yr @ {settings.financial.leaseInterestRate}%)</h4>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                        <span className="font-medium">
                          ${Math.round(adjustedReplacementCost * 0.018).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Lease Cost:</span>
                        <span className="font-medium">
                          ${Math.round(adjustedReplacementCost * 0.018 * 60).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tax Considerations</h4>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Tax Benefits (Year 1):</span>
                      <span className="font-medium text-green-600">
                        -${Math.round(adjustedReplacementCost * 0.2 * (settings.financial.taxRate / 100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lifetime Tax Depreciation Benefits:</span>
                      <span className="font-medium text-green-600">
                        -${Math.round(adjustedReplacementCost * (settings.financial.taxRate / 100)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between space-x-2 mt-4">
          <div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-2"
            >
              {confirmDelete ? 'Confirm Delete' : 'Delete'}
              <Trash2 className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Close
            </Button>
            <Button onClick={handleEdit}>
              Edit
              <Edit className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
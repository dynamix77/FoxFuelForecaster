import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { runVehiclePricing } from '@/lib/vehiclePricingService';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, AlertCircle, Check, Truck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface VehiclePricingPanelProps {
  vehicle: Vehicle;
  onUpdatePricing?: (
    vehicleId: number, 
    currentValue: number, 
    replacementCost: number,
    salvageValue: number
  ) => void;
}

export function VehiclePricingPanel({ vehicle, onUpdatePricing }: VehiclePricingPanelProps) {
  const [pricingData, setPricingData] = useState<VehiclePricingData | null>(null);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [applyingChanges, setApplyingChanges] = useState(false);
  const { toast } = useToast();
  
  const fetchPricingData = async () => {
  setLoading(true);
  try {
    const input = {
      vehicle,
      inflationRate: 0.03,
      investmentRate: 0.06,
      taxRate: 0.25,
      years: 5
    };

    const data = await runVehiclePricing(input);
    setPricingData(data);

    // Optionally skip trends for now
    // const trends = await getMarketTrends(vehicle.type);
    // setMarketTrends(trends);

  } catch (error) {
    console.error("Error fetching vehicle pricing:", error);
    toast({
      title: "Error retrieving pricing data",
      description: "Unable to fetch current market values. Please try again later.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

  
  useEffect(() => {
    // Load pricing data when component mounts
    fetchPricingData();
  }, [vehicle.id]);
  
  const handleApplyPricing = () => {
    if (pricingData && onUpdatePricing) {
      setApplyingChanges(true);
      
      // Simulate API delay
      setTimeout(() => {
        onUpdatePricing(
          vehicle.id, 
          pricingData.currentValue,
          pricingData.replacementCost,
          pricingData.salvageValue
        );
        
        toast({
          title: "Pricing updated",
          description: "Vehicle pricing information has been updated successfully.",
          variant: "default"
        });
        
        setApplyingChanges(false);
      }, 800);
    }
  };
  
  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return <Badge variant="default" className="bg-green-500">High Confidence</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500">Medium Confidence</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-red-500">Low Confidence</Badge>;
      default:
        return null;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getMarketConditionBadge = (condition: 'buyer' | 'seller' | 'neutral') => {
    switch (condition) {
      case 'buyer':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Buyer's Market</Badge>;
      case 'seller':
        return <Badge variant="outline" className="text-green-600 border-green-600">Seller's Market</Badge>;
      case 'neutral':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Neutral Market</Badge>;
      default:
        return null;
    }
  };
  
  const renderValueComparison = () => {
    if (!pricingData) return null;
    
    const currentDbValue = vehicle.replacementCost;
    const currentDbSalvage = vehicle.salvageValue;
    const priceDiff = pricingData.replacementCost - currentDbValue;
    const salvageDiff = pricingData.salvageValue - currentDbSalvage;
    
    const priceDiffPercent = Math.round((priceDiff / currentDbValue) * 100);
    const salvageDiffPercent = Math.round((salvageDiff / currentDbSalvage) * 100);
    
    return (
      <div className="space-y-3 mt-4">
        <h4 className="text-sm font-medium">Comparison to Current Values</h4>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Replacement Cost</span>
          <div className="flex items-center space-x-2">
            <span className={priceDiff > 0 ? 'text-red-500' : priceDiff < 0 ? 'text-green-500' : ''}>
              {priceDiff > 0 ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : priceDiff < 0 ? (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              ) : null}
              {priceDiff !== 0 ? `${priceDiff > 0 ? '+' : ''}${priceDiffPercent}%` : 'No change'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Salvage Value</span>
          <div className="flex items-center space-x-2">
            <span className={salvageDiff > 0 ? 'text-green-500' : salvageDiff < 0 ? 'text-red-500' : ''}>
              {salvageDiff > 0 ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : salvageDiff < 0 ? (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              ) : null}
              {salvageDiff !== 0 ? `${salvageDiff > 0 ? '+' : ''}${salvageDiffPercent}%` : 'No change'}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Pricing Data</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchPricingData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Current market values for {vehicle.name} ({vehicle.type})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : pricingData ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Data Source</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{pricingData.source}</span>
                {getConfidenceBadge(pricingData.confidence)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Current Market Value</span>
                  <span className="font-bold">{formatCurrency(pricingData.currentValue)}</span>
                </div>
                <Progress value={Math.min(100, (pricingData.currentValue / pricingData.replacementCost) * 100)} />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Replacement Cost</span>
                  <div>
                    <span className="font-bold">{formatCurrency(pricingData.replacementCost)}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formatCurrency(pricingData.priceRange.min)} - {formatCurrency(pricingData.priceRange.max)})
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Salvage Value</span>
                  <span className="font-bold">{formatCurrency(pricingData.salvageValue)}</span>
                </div>
                <Progress value={Math.min(100, (pricingData.salvageValue / pricingData.currentValue) * 100)} />
              </div>
            </div>
            
            {renderValueComparison()}
            
            <Separator className="my-4" />
            
            {marketTrends && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Market Trends</h4>
                  {getMarketConditionBadge(marketTrends.marketCondition)}
                </div>
                
                <div className="space-y-2">
                  {marketTrends.priceChanges.map((change: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{change.timeframe}</span>
                      <span className={change.percentage >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {change.percentage > 0 && '+'}
                        {change.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Forecasted Growth (12mo)</span>
                  <span className={marketTrends.forecastedGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {marketTrends.forecastedGrowth > 0 && '+'}
                    {marketTrends.forecastedGrowth}%
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No pricing data available</p>
            <Button variant="outline" size="sm" onClick={fetchPricingData} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
      
      {pricingData && onUpdatePricing && (
        <CardFooter className="flex justify-end space-x-2 pt-2">
          <Button
            onClick={handleApplyPricing}
            disabled={applyingChanges}
            className="min-w-[120px]"
          >
            {applyingChanges ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Apply Values
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
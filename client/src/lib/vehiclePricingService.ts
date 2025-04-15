import { Vehicle } from './types';

// Interfaces for the pricing data
export interface VehiclePricingData {
  currentValue: number;
  replacementCost: number;
  salvageValue: number;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  lastUpdated: string;
  priceRange: {
    min: number;
    max: number;
  };
}

// We'll extend Vehicle interface to include description for service requests
interface VehicleWithDescription extends Vehicle {
  description?: string; 
}

export interface VehiclePricingRequest {
  purchaseYear: number;
  year?: number;
  make?: string;
  model?: string;
  type: string;
  description?: string;
}

// This function could be expanded to use an actual external API
// For now, it simulates getting market data with realistic pricing logic
export async function getVehiclePricing(
  vehicle: Vehicle | VehiclePricingRequest
): Promise<VehiclePricingData> {
  // In a real implementation, this would make API calls to pricing services
  // such as Kelley Blue Book, Black Book, or industry-specific pricing databases
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentYear = new Date().getFullYear();
    
    // Type guard: Check which type of parameter we've received
    let purchaseYear = currentYear;
    let vehicleDescription: string | undefined = undefined;
    
    if ('description' in vehicle) {
      vehicleDescription = vehicle.description;
    }
    
    if ('purchaseYear' in vehicle) {
      purchaseYear = vehicle.purchaseYear;
    }
    
    const vehicleAge = currentYear - purchaseYear;
    
    // Base values - in a real implementation, these would come from API
    let baseCost = 0;
    let depreciation = 0;
    let confidenceRating: 'high' | 'medium' | 'low' = 'medium';
    
    // Determine base costs by vehicle type 
    if (vehicle.type.toLowerCase().includes('truck')) {
      if (vehicle.type.toLowerCase().includes('tank') || 
          (vehicleDescription && vehicleDescription.toLowerCase().includes('tank'))) {
        // Tank trucks (based on provided data)
        baseCost = 175000;
        depreciation = 0.06; // 6% annual depreciation
        confidenceRating = 'high';
      } else {
        // Standard trucks/tractors (based on provided data)
        baseCost = 195000;
        depreciation = 0.08; // 8% annual depreciation
        confidenceRating = 'high';
      }
    } else if (vehicle.type.toLowerCase().includes('trailer')) {
      // Trailers (based on provided data)
      if (vehicleDescription && vehicleDescription.toLowerCase().includes('mini')) {
        baseCost = 90000;
      } else {
        baseCost = 85000; // Full-size trailer
      }
      depreciation = 0.05; // 5% annual depreciation for trailers
      confidenceRating = 'medium';
    } else {
      // Other vehicle types
      baseCost = 120000;
      depreciation = 0.1; // 10% annual depreciation
      confidenceRating = 'low';
    }
    
    // Calculate current value with depreciation curve
    // Uses an exponential depreciation model which is more realistic
    // than linear depreciation for vehicles
    const depreciationFactor = Math.pow((1 - depreciation), vehicleAge);
    const currentValue = Math.round(baseCost * depreciationFactor);
    
    // Calculate market-based replacement cost
    // In reality, this would come from dealer pricing APIs or industry databases
    const inflationRate = 0.025; // 2.5% annual inflation
    const marketAdjustment = 1.02; // Current market is 2% above normal
    const replacementCost = Math.round(baseCost * Math.pow(1 + inflationRate, 2) * marketAdjustment);
    
    // Estimate salvage value (typically 10-20% of replacement cost for old vehicles)
    // For newer vehicles, salvage is higher percentage of replacement
    let salvagePercent = 0.15; // Default 15%
    if (vehicleAge < 5) {
      salvagePercent = 0.4; // 40% for newer vehicles
    } else if (vehicleAge < 10) {
      salvagePercent = 0.25; // 25% for middle-aged vehicles
    }
    
    const salvageValue = Math.round(replacementCost * salvagePercent);
    
    // Price ranges based on market variance
    const variance = confidenceRating === 'high' ? 0.05 : 
                     confidenceRating === 'medium' ? 0.1 : 0.15;
                     
    return {
      currentValue,
      replacementCost,
      salvageValue,
      confidence: confidenceRating,
      source: "Fox Fuel Fleet Budget Forecaster",
      lastUpdated: new Date().toISOString(),
      priceRange: {
        min: Math.round(replacementCost * (1 - variance)),
        max: Math.round(replacementCost * (1 + variance))
      }
    };
  } catch (error) {
    console.error("Error fetching vehicle pricing:", error);
    throw new Error("Unable to retrieve vehicle pricing information");
  }
}

// Function to get bulk pricing for multiple vehicles
export async function getBulkVehiclePricing(
  vehicles: Vehicle[]
): Promise<Map<number, VehiclePricingData>> {
  const pricingMap = new Map<number, VehiclePricingData>();
  
  // In a real implementation, this would batch API calls
  await Promise.all(
    vehicles.map(async (vehicle) => {
      try {
        const pricing = await getVehiclePricing(vehicle);
        pricingMap.set(vehicle.id, pricing);
      } catch (error) {
        console.error(`Failed to get pricing for vehicle ${vehicle.id}:`, error);
      }
    })
  );
  
  return pricingMap;
}

// Function to get current market trends for a specific vehicle type
export async function getMarketTrends(
  vehicleType: string
): Promise<{
  priceChanges: { timeframe: string; percentage: number }[];
  forecastedGrowth: number;
  marketCondition: 'buyer' | 'seller' | 'neutral';
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // This would normally be retrieved from market analysis APIs
  let priceChanges: { timeframe: string; percentage: number }[] = [];
  let forecastedGrowth = 0;
  let marketCondition: 'buyer' | 'seller' | 'neutral' = 'neutral';
  
  if (vehicleType.toLowerCase().includes('truck')) {
    priceChanges = [
      { timeframe: '1 month', percentage: 0.5 },
      { timeframe: '3 months', percentage: 1.2 },
      { timeframe: '1 year', percentage: 3.5 },
    ];
    forecastedGrowth = 2.8;
    marketCondition = 'seller';
  } else if (vehicleType.toLowerCase().includes('trailer')) {
    priceChanges = [
      { timeframe: '1 month', percentage: 0.2 },
      { timeframe: '3 months', percentage: 0.6 },
      { timeframe: '1 year', percentage: 2.0 },
    ];
    forecastedGrowth = 1.5;
    marketCondition = 'neutral';
  } else {
    priceChanges = [
      { timeframe: '1 month', percentage: -0.3 },
      { timeframe: '3 months', percentage: -0.8 },
      { timeframe: '1 year', percentage: 1.0 },
    ];
    forecastedGrowth = 0.5;
    marketCondition = 'buyer';
  }
  
  return {
    priceChanges,
    forecastedGrowth,
    marketCondition
  };
}
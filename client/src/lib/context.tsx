import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, AppSettings, Alert, Projection, FundPoint, CapExPoint, Scenario, SimulationParams, SimulationResults, TaxAnalysis } from './types';
import { defaultVehicles, defaultSettings, defaultScenarios, defaultSimulationParams } from './defaultData';
import { calculateProjections, calculateAgeDistribution, calculateTaxBenefits, calculateSimulation } from './calculations';

interface AppContextValue {
  // State
  vehicles: Vehicle[];
  settings: AppSettings;
  activeTab: string;
  scenarios: Scenario[];
  activeScenario: string;
  simulationParams: SimulationParams;
  taxMethod: string;

  // Computed values
  projections: Projection[];
  fundPoints: FundPoint[];
  capExPoints: CapExPoint[];
  alerts: Alert[];
  ageDistribution: number[];
  simulationResults: SimulationResults;
  taxAnalysis: TaxAnalysis;
  fleetStats: {
    totalVehicles: number;
    averageAge: number;
    fundBalance: number;
    alertCount: number;
  };

  // Actions
  setActiveTab: (tab: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: number) => void;
  updateFinancialSettings: (settings: Partial<AppSettings['financial']>) => void;
  updateAlertSettings: (settings: Partial<AppSettings['alerts']>) => void;
  updateSystemSettings: (settings: Partial<AppSettings['system']>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setActiveScenario: (scenarioId: string) => void;
  updateSimulationParams: (params: Partial<SimulationParams>) => void;
  setTaxMethod: (method: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Core state
  const [vehicles, setVehicles] = useState<Vehicle[]>(defaultVehicles);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scenarios] = useState<Scenario[]>(defaultScenarios);
  const [activeScenario, setActiveScenario] = useState('current');
  const [simulationParams, setSimulationParams] = useState(defaultSimulationParams);
  const [taxMethod, setTaxMethod] = useState('immediate');

  // Compute projections whenever vehicles or settings change
  const { projections, fundPoints, capExPoints } = calculateProjections(
    vehicles,
    settings.financial
  );

  // Compute tax analysis whenever relevant settings change
  const taxAnalysis = calculateTaxBenefits(
    vehicles,
    settings.financial.taxRate,
    taxMethod
  );

  // Compute simulation results whenever simulation parameters change
  const simulationResults = calculateSimulation(
    vehicles,
    settings.financial,
    simulationParams
  );

  // Generate alerts based on vehicle data and settings
  const currentYear = new Date().getFullYear();
  const alerts: Alert[] = vehicles.flatMap(vehicle => {
    const alerts: Alert[] = [];
    const age = currentYear - vehicle.purchaseYear;
    const isTrailer = vehicle.type.toLowerCase().includes('trailer');
    const maxAge = isTrailer ? settings.alerts.trailerMaxAge : settings.alerts.truckMaxAge;
    
    // Check age threshold
    if (age > maxAge) {
      alerts.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        severity: 'critical',
        message: `Vehicle age (${age} years) exceeds maximum threshold (${maxAge} years)`
      });
    }
    
    // Check mileage for trucks
    if (!isTrailer && vehicle.currentMileage !== null) {
      if (vehicle.currentMileage > settings.alerts.truckMaxMileage) {
        alerts.push({
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          severity: 'critical',
          message: `Mileage (${vehicle.currentMileage.toLocaleString()}) exceeds maximum threshold (${settings.alerts.truckMaxMileage.toLocaleString()})`
        });
      } else if (vehicle.currentMileage > settings.alerts.truckMaxMileage * 0.95) {
        alerts.push({
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          severity: 'warning',
          message: `Mileage (${vehicle.currentMileage.toLocaleString()}) approaching maximum threshold (${settings.alerts.truckMaxMileage.toLocaleString()})`
        });
      }
    }
    
    return alerts;
  });

  // Calculate fleet stats
  const totalVehicles = vehicles.length;
  const totalAge = vehicles.reduce((sum, v) => sum + (currentYear - v.purchaseYear), 0);
  const averageAge = totalVehicles > 0 ? totalAge / totalVehicles : 0;
  const fundBalance = fundPoints.length > 0 ? fundPoints[0].fundBalance : settings.financial.initialFund;
  const alertCount = alerts.length;

  const fleetStats = {
    totalVehicles,
    averageAge,
    fundBalance,
    alertCount
  };

  // Calculate age distribution
  const ageDistribution = calculateAgeDistribution(vehicles);

  // Add a vehicle with a new ID
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newId = Math.max(0, ...vehicles.map(v => v.id)) + 1;
    setVehicles([...vehicles, { ...vehicleData, id: newId }]);
  };

  // Update an existing vehicle
  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map(v => 
      v.id === updatedVehicle.id ? updatedVehicle : v
    ));
  };

  // Remove a vehicle by ID
  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Update financial settings
  const updateFinancialSettings = (updatedSettings: Partial<AppSettings['financial']>) => {
    setSettings({
      ...settings,
      financial: {
        ...settings.financial,
        ...updatedSettings
      }
    });
  };

  // Update alert settings
  const updateAlertSettings = (updatedSettings: Partial<AppSettings['alerts']>) => {
    setSettings({
      ...settings,
      alerts: {
        ...settings.alerts,
        ...updatedSettings
      }
    });
  };

  // Update system settings
  const updateSystemSettings = (updatedSettings: Partial<AppSettings['system']>) => {
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        ...updatedSettings
      }
    });
  };

  // Update all settings at once
  const updateSettings = (updatedSettings: Partial<AppSettings>) => {
    setSettings({
      ...settings,
      ...updatedSettings
    });
  };

  // Update simulation parameters
  const updateSimulationParams = (params: Partial<SimulationParams>) => {
    setSimulationParams({
      ...simulationParams,
      ...params
    });
  };

  const value: AppContextValue = {
    vehicles,
    settings,
    activeTab,
    scenarios,
    activeScenario,
    simulationParams,
    taxMethod,
    projections,
    fundPoints,
    capExPoints,
    alerts,
    ageDistribution,
    simulationResults,
    taxAnalysis,
    fleetStats,
    setActiveTab,
    addVehicle,
    updateVehicle,
    removeVehicle,
    updateFinancialSettings,
    updateAlertSettings,
    updateSystemSettings,
    updateSettings,
    setActiveScenario,
    updateSimulationParams,
    setTaxMethod
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

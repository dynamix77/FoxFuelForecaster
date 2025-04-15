import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, AppSettings, Alert, Projection, FundPoint, CapExPoint, Scenario, SimulationParams, SimulationResults, TaxAnalysis } from './types';
import { defaultVehicles, defaultSettings, defaultScenarios, defaultSimulationParams } from './defaultData';
import { calculateProjections, calculateAgeDistribution, calculateTaxBenefits, calculateSimulation } from './calculations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';

interface AppContextValue {
  // State
  vehicles: Vehicle[];
  vehiclesLoading: boolean;
  vehiclesError: Error | null;
  settings: AppSettings;
  settingsLoading: boolean;
  settingsError: Error | null;
  activeTab: string;
  scenarios: Scenario[];
  scenariosLoading: boolean;
  scenariosError: Error | null;
  activeScenario: string;
  simulationParams: SimulationParams;
  simulationParamsLoading: boolean;
  simulationParamsError: Error | null;
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
  const queryClient = useQueryClient();
  
  // Core state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScenario, setActiveScenario] = useState('current');
  const [taxMethod, setTaxMethod] = useState('immediate');

  // Fetch vehicles from the API
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    error: vehiclesError
  } = useQuery({
    queryKey: ['/api/vehicles'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        return response.json();
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        // Fall back to default vehicles if API fails
        return defaultVehicles;
      }
    }
  });

  // Initialize settings state with default values
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<Error | null>(null);

  // Fetch settings from the API
  useEffect(() => {
    async function fetchSettings() {
      setSettingsLoading(true);
      try {
        // Fetch financial settings
        const financialResponse = await fetch('/api/settings/financial');
        let financial = defaultSettings.financial;
        if (financialResponse.ok) {
          financial = await financialResponse.json();
        }

        // Fetch alert settings
        const alertsResponse = await fetch('/api/settings/alerts');
        let alerts = defaultSettings.alerts;
        if (alertsResponse.ok) {
          alerts = await alertsResponse.json();
        }

        // Fetch system settings
        const systemResponse = await fetch('/api/settings/system');
        let system = defaultSettings.system;
        if (systemResponse.ok) {
          system = await systemResponse.json();
        }

        setSettings({
          financial,
          alerts,
          system
        });
        setSettingsError(null);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettingsError(error instanceof Error ? error : new Error('Failed to fetch settings'));
        // Keep default settings if API fails
      } finally {
        setSettingsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Fetch scenarios from the API
  const {
    data: scenarios = defaultScenarios,
    isLoading: scenariosLoading,
    error: scenariosError
  } = useQuery({
    queryKey: ['/api/scenarios'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/scenarios');
        if (!response.ok) throw new Error('Failed to fetch scenarios');
        return response.json();
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        // Fall back to default scenarios if API fails
        return defaultScenarios;
      }
    }
  });

  // Fetch simulation parameters from the API
  const {
    data: apiSimulationParams,
    isLoading: simulationParamsLoading,
    error: simulationParamsError
  } = useQuery({
    queryKey: ['/api/simulation/params'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/simulation/params');
        if (!response.ok) throw new Error('Failed to fetch simulation parameters');
        return response.json();
      } catch (error) {
        console.error('Error fetching simulation parameters:', error);
        // Fall back to default parameters if API fails
        return null;
      }
    }
  });

  // Use API simulation params or fall back to defaults
  const simulationParams = apiSimulationParams || defaultSimulationParams;

  // Mutations for CRUD operations
  const addVehicleMutation = useMutation({
    mutationFn: (vehicle: Omit<Vehicle, 'id'>) => 
      apiRequest('POST', '/api/vehicles', vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
    }
  });

  const updateVehicleMutation = useMutation({
    mutationFn: (vehicle: Vehicle) => 
      apiRequest('PUT', `/api/vehicles/${vehicle.id}`, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
    }
  });

  const removeVehicleMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/vehicles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
    }
  });

  const updateFinancialSettingsMutation = useMutation({
    mutationFn: (updatedSettings: Partial<AppSettings['financial']>) => 
      apiRequest('POST', '/api/settings/financial', updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/financial'] });
    }
  });

  const updateAlertSettingsMutation = useMutation({
    mutationFn: (updatedSettings: Partial<AppSettings['alerts']>) => 
      apiRequest('POST', '/api/settings/alerts', updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/alerts'] });
    }
  });

  const updateSystemSettingsMutation = useMutation({
    mutationFn: (updatedSettings: Partial<AppSettings['system']>) => 
      apiRequest('POST', '/api/settings/system', updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/system'] });
    }
  });

  const updateSimulationParamsMutation = useMutation({
    mutationFn: (params: Partial<SimulationParams>) => 
      apiRequest('POST', '/api/simulation/params', params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/simulation/params'] });
    }
  });

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
    addVehicleMutation.mutate(vehicleData);
  };

  // Update an existing vehicle
  const updateVehicle = (updatedVehicle: Vehicle) => {
    updateVehicleMutation.mutate(updatedVehicle);
  };

  // Remove a vehicle by ID
  const removeVehicle = (id: number) => {
    removeVehicleMutation.mutate(id);
  };

  // Update financial settings
  const updateFinancialSettings = (updatedSettings: Partial<AppSettings['financial']>) => {
    // Update local state immediately for responsive UI
    setSettings({
      ...settings,
      financial: {
        ...settings.financial,
        ...updatedSettings
      }
    });
    
    // Then update in the database
    updateFinancialSettingsMutation.mutate({
      ...settings.financial,
      ...updatedSettings
    });
  };

  // Update alert settings
  const updateAlertSettings = (updatedSettings: Partial<AppSettings['alerts']>) => {
    // Update local state immediately for responsive UI
    setSettings({
      ...settings,
      alerts: {
        ...settings.alerts,
        ...updatedSettings
      }
    });
    
    // Then update in the database
    updateAlertSettingsMutation.mutate({
      ...settings.alerts,
      ...updatedSettings
    });
  };

  // Update system settings
  const updateSystemSettings = (updatedSettings: Partial<AppSettings['system']>) => {
    // Update local state immediately for responsive UI
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        ...updatedSettings
      }
    });
    
    // Then update in the database
    updateSystemSettingsMutation.mutate({
      ...settings.system,
      ...updatedSettings
    });
  };

  // Update all settings at once
  const updateSettings = (updatedSettings: Partial<AppSettings>) => {
    // Update local state immediately for responsive UI
    setSettings({
      ...settings,
      ...updatedSettings
    });
    
    // Then update individual settings in the database
    if (updatedSettings.financial) {
      updateFinancialSettingsMutation.mutate({
        ...settings.financial,
        ...updatedSettings.financial
      });
    }
    
    if (updatedSettings.alerts) {
      updateAlertSettingsMutation.mutate({
        ...settings.alerts,
        ...updatedSettings.alerts
      });
    }
    
    if (updatedSettings.system) {
      updateSystemSettingsMutation.mutate({
        ...settings.system,
        ...updatedSettings.system
      });
    }
  };

  // Update simulation parameters
  const updateSimulationParams = (params: Partial<SimulationParams>) => {
    // Update the simulation parameters in the database
    updateSimulationParamsMutation.mutate({
      ...simulationParams,
      ...params
    });
  };

  const value: AppContextValue = {
    vehicles,
    vehiclesLoading,
    vehiclesError,
    settings,
    settingsLoading,
    settingsError,
    activeTab,
    scenarios,
    scenariosLoading,
    scenariosError,
    activeScenario,
    simulationParams,
    simulationParamsLoading,
    simulationParamsError,
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

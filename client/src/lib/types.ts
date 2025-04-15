export interface Vehicle {
  id: number;
  name: string;
  type: string;
  purchaseYear: number;
  currentMileage: number | null;
  replacementCost: number;
  salvageValue: number;
  inflationRate: number;
  replacementYear: number;
  replacementQuarter: string;
}

export interface FinancialSettings {
  initialFund: number;
  monthlyContribution: number;
  interestRate: number;
  loanInterestRate: number;
  leaseInterestRate: number;
  loanTermYears: number;
  taxRate: number;
  depreciationMethod: string;
}

export interface AlertSettings {
  truckMaxAge: number;
  trailerMaxAge: number;
  truckMaxMileage: number;
  truckMaintenanceMax: number;
  trailerMaintenanceMax: number;
}

export interface SystemSettings {
  dateFormat: string;
  currency: string;
  autoSave: boolean;
  emailAlerts: boolean;
}

export interface AppSettings {
  financial: FinancialSettings;
  alerts: AlertSettings;
  system: SystemSettings;
}

export interface Alert {
  vehicleId: number;
  vehicleName: string;
  severity: 'critical' | 'warning';
  message: string;
}

export interface Projection {
  vehicleId: number;
  name: string;
  replacementYear: number;
  replacementQuarter: string;
  replacementMonth: number;
  adjustedCost: number;
  netCost: number;
  fundBeforePurchase: number;
  fundAfterPurchase: number;
  shortfall: number;
  monthlyReserve: number;
  loanPayment: number;
  leasePayment: number;
}

export interface FundPoint {
  quarter: number;
  year: number;
  label: string;
  fundBalance: number;
}

export interface CapExPoint {
  quarter: number;
  year: number;
  label: string;
  expenditure: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  roi: number;
  riskLevel: number;
  keyPoints: string[];
  alertType: 'info' | 'warning' | 'success';
}

export interface SimulationParams {
  monthlyContribution: number;
  interestRate: number;
  inflationRate: number;
  loanRate: number;
}

export interface SimulationResults {
  fundBalance: number;
  fundedVehicles: number;
  totalVehicles: number;
  maxShortfall: number;
  monthlyAverage: number;
}

export interface TaxAnalysis {
  method: string;
  totalSavings: number;
  firstYearSavings: number;
  netEquipmentCost: number;
}

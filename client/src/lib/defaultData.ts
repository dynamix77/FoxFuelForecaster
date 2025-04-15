import { Vehicle, AppSettings } from './types';

export const defaultVehicles: Vehicle[] = [
  {
    id: 1,
    name: "Truck #120",
    type: "Straight Truck",
    purchaseYear: 2015,
    currentMileage: 385000,
    replacementCost: 68000,
    salvageValue: 5000,
    inflationRate: 2.5,
    replacementYear: 2025,
    replacementQuarter: "Q3"
  },
  {
    id: 2,
    name: "Trailer #134",
    type: "Dry Van",
    purchaseYear: 2018,
    currentMileage: null,
    replacementCost: 85000,
    salvageValue: 5000,
    inflationRate: 2.0,
    replacementYear: 2025,
    replacementQuarter: "Q2"
  },
  {
    id: 3,
    name: "Truck #118",
    type: "Semi Truck",
    purchaseYear: 2017,
    currentMileage: 435000,
    replacementCost: 125000,
    salvageValue: 10000,
    inflationRate: 2.2,
    replacementYear: 2026,
    replacementQuarter: "Q4"
  },
  {
    id: 4,
    name: "Trailer #147",
    type: "Refrigerated",
    purchaseYear: 2016,
    currentMileage: null,
    replacementCost: 210000,
    salvageValue: 15000,
    inflationRate: 2.8,
    replacementYear: 2026,
    replacementQuarter: "Q1"
  }
];

export const defaultSettings: AppSettings = {
  financial: {
    initialFund: 25000,
    monthlyContribution: 3000,
    interestRate: 1.5,
    loanInterestRate: 6.5,
    leaseInterestRate: 5.5,
    loanTermYears: 5,
    taxRate: 28,
    depreciationMethod: "macrs"
  },
  alerts: {
    truckMaxAge: 7,
    trailerMaxAge: 10,
    truckMaxMileage: 450000,
    truckMaintenanceMax: 3500,
    trailerMaintenanceMax: 2500
  },
  system: {
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    autoSave: true,
    emailAlerts: false
  }
};

export const defaultScenarios = [
  {
    id: "current",
    name: "Current Plan",
    description: "This scenario follows your current replacement schedule with all vehicles being replaced according to their planned dates. It represents the baseline against which other scenarios are compared.",
    totalCost: 338000,
    roi: 15.4,
    riskLevel: 58,
    keyPoints: [
      "All replacements happen on schedule",
      "Requires $338,000 in total",
      "ROI of 15.4% based on operational savings",
      "Risk score: 58/100"
    ],
    alertType: "info" as const
  },
  {
    id: "delay",
    name: "Delay Replacements",
    description: "This scenario pushes all planned replacements back by one year. While this reduces immediate capital requirements, it may increase maintenance costs and operational risk.",
    totalCost: 350000,
    roi: 12.1,
    riskLevel: 70,
    keyPoints: [
      "All replacements delayed by 12 months",
      "Higher maintenance costs expected in interim",
      "Increased inflation impact on replacement costs",
      "Higher operational risk due to aging equipment",
      "Additional cash flow flexibility in short term"
    ],
    alertType: "warning" as const
  },
  {
    id: "lease",
    name: "Lease Options",
    description: "This scenario evaluates leasing equipment instead of purchasing. Leasing reduces upfront capital requirements but has different tax implications and ownership considerations.",
    totalCost: 243000,
    roi: 12.3,
    riskLevel: 41,
    keyPoints: [
      "TRAC leases with purchase options at end of term",
      "Lower monthly cash flow impact",
      "Lease payments fully tax deductible as operating expenses",
      "Reduced maintenance risk with newer equipment",
      "No large capital expenditures required"
    ],
    alertType: "success" as const
  }
];

export const defaultSimulationParams = {
  monthlyContribution: 3000,
  interestRate: 1.5,
  inflationRate: 2.5,
  loanRate: 6.5
};

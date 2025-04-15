import { Vehicle, Projection, FundPoint, CapExPoint, FinancialSettings, TaxAnalysis, SimulationParams, SimulationResults } from './types';

// Calculate loan payment (standard amortization formula)
export function calculateLoanPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const termMonths = termYears * 12;
  
  if (monthlyRate === 0) return principal / termMonths;
  
  return principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
         (Math.pow(1 + monthlyRate, termMonths) - 1);
}

// Calculate lease payment (simplified)
export function calculateLeasePayment(assetValue: number, residualValue: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const termMonths = termYears * 12;
  const depreciation = (assetValue - residualValue) / termMonths;
  const interestPayment = (assetValue + residualValue) / 2 * monthlyRate;
  
  return depreciation + interestPayment;
}

// Convert year and quarter to month
export function quarterToMonth(year: number, quarter: string): number {
  const baseYear = 2025; // Reference starting year
  const quarterMap: Record<string, number> = { 'Q1': 1, 'Q2': 4, 'Q3': 7, 'Q4': 10 };
  return ((year - baseYear) * 12) + quarterMap[quarter];
}

// Convert month to year and quarter label
export function monthToQuarterLabel(month: number): string {
  const baseYear = 2025; // Reference starting year
  const year = Math.floor(month / 12) + baseYear;
  const quarterNum = Math.ceil((month % 12) / 3) || 4;
  return `Q${quarterNum} ${year}`;
}

// Calculate financial projections
export function calculateProjections(
  vehicles: Vehicle[], 
  financialSettings: FinancialSettings
): { projections: Projection[], fundPoints: FundPoint[], capExPoints: CapExPoint[] } {
  const projections: Projection[] = [];
  const fundPoints: FundPoint[] = [];
  const capExPoints: CapExPoint[] = [];
  const quarterlyExpenses: Record<string, number> = {};
  
  // Sort vehicles by replacement date
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a.replacementYear !== b.replacementYear) {
      return a.replacementYear - b.replacementYear;
    }
    
    const quarterMap: Record<string, number> = { 'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4 };
    return quarterMap[a.replacementQuarter] - quarterMap[b.replacementQuarter];
  });
  
  // Initialize fund
  let currentFund = financialSettings.initialFund;
  
  // Calculate for 10 years (120 months)
  for (let month = 1; month <= 120; month++) {
    // Add monthly contribution
    currentFund += financialSettings.monthlyContribution;
    
    // Add interest (monthly compounding)
    currentFund += currentFund * (financialSettings.interestRate / 100 / 12);
    
    // Check if any vehicles need replacement this month
    sortedVehicles.forEach(vehicle => {
      const replacementMonth = quarterToMonth(vehicle.replacementYear, vehicle.replacementQuarter);
      
      if (month === replacementMonth) {
        // Calculate inflation-adjusted cost
        const years = (vehicle.replacementYear - 2025) + 
                     (['Q1', 'Q2', 'Q3', 'Q4'].indexOf(vehicle.replacementQuarter) / 4);
        const inflatedCost = vehicle.replacementCost * 
                           Math.pow(1 + (vehicle.inflationRate / 100), years);
        
        // Calculate net cost after salvage value
        const netCost = inflatedCost - vehicle.salvageValue;
        
        // Calculate monthly reserve needed
        const monthsUntilReplacement = replacementMonth;
        const monthlyReserve = monthsUntilReplacement > 0 ? 
                             Math.round(netCost / monthsUntilReplacement) : 0;
        
        // Calculate potential loan payment
        const loanPayment = calculateLoanPayment(
          netCost, 
          financialSettings.loanInterestRate, 
          financialSettings.loanTermYears
        );
        
        // Calculate lease payment
        const leasePayment = calculateLeasePayment(
          inflatedCost,
          vehicle.salvageValue,
          financialSettings.leaseInterestRate,
          financialSettings.loanTermYears
        );
        
        // Add to projections
        projections.push({
          vehicleId: vehicle.id,
          name: vehicle.name,
          replacementYear: vehicle.replacementYear,
          replacementQuarter: vehicle.replacementQuarter,
          replacementMonth,
          adjustedCost: Math.round(inflatedCost),
          netCost: Math.round(netCost),
          fundBeforePurchase: Math.round(currentFund),
          fundAfterPurchase: Math.round(currentFund - netCost),
          shortfall: currentFund < netCost ? Math.round(netCost - currentFund) : 0,
          monthlyReserve: Math.round(monthlyReserve),
          loanPayment: Math.round(loanPayment),
          leasePayment: Math.round(leasePayment)
        });
        
        // Track capital expenditures by quarter
        const quarterLabel = monthToQuarterLabel(month);
        if (!quarterlyExpenses[quarterLabel]) {
          quarterlyExpenses[quarterLabel] = 0;
        }
        quarterlyExpenses[quarterLabel] += netCost;
        
        // Deduct from fund if possible
        if (currentFund >= netCost) {
          currentFund -= netCost;
        } else {
          // Not enough funds - indicates a shortfall
          currentFund = 0;
        }
      }
    });
    
    // Every 3 months (quarterly), add to chart data
    if (month % 3 === 0) {
      const quarterNumber = Math.ceil(month / 3);
      const year = Math.floor((month - 1) / 12) + 2025;
      const quarter = (Math.ceil((month % 12) / 3) || 4);
      const label = `Q${quarter} ${year}`;
      
      fundPoints.push({
        quarter: quarterNumber,
        year,
        label,
        fundBalance: Math.round(currentFund)
      });
    }
  }
  
  // Convert quarterly expenses to chart points
  Object.entries(quarterlyExpenses).forEach(([label, expenditure]) => {
    const [q, year] = label.split(' ');
    const quarter = parseInt(q.substring(1));
    const yearNum = parseInt(year);
    const quarterNumber = ((yearNum - 2025) * 4) + quarter;
    
    capExPoints.push({
      quarter: quarterNumber,
      year: yearNum,
      label,
      expenditure: Math.round(expenditure)
    });
  });
  
  // Sort capEx points by date
  capExPoints.sort((a, b) => a.quarter - b.quarter);
  
  // Ensure we have points for all quarters (filling in zeros)
  const allLabels: string[] = [];
  for (let year = 2025; year <= 2035; year++) {
    for (let q = 1; q <= 4; q++) {
      allLabels.push(`Q${q} ${year}`);
    }
  }
  
  const filledCapExPoints: CapExPoint[] = allLabels.map((label, i) => {
    const existing = capExPoints.find(pt => pt.label === label);
    if (existing) return existing;
    
    const [q, year] = label.split(' ');
    const quarter = parseInt(q.substring(1));
    const yearNum = parseInt(year);
    const quarterNumber = ((yearNum - 2025) * 4) + quarter;
    
    return {
      quarter: quarterNumber,
      year: yearNum,
      label,
      expenditure: 0
    };
  });
  
  // Filter to first 20 quarters (5 years) for display purposes
  const limitedCapExPoints = filledCapExPoints.slice(0, 20);
  
  return { projections, fundPoints, capExPoints: limitedCapExPoints };
}

// Calculate age distribution of vehicles
export function calculateAgeDistribution(vehicles: Vehicle[]): number[] {
  const currentYear = new Date().getFullYear();
  const ageGroups = [0, 0, 0, 0]; // [0-3 years, 4-7 years, 8-10 years, 10+ years]
  
  vehicles.forEach(vehicle => {
    const age = currentYear - vehicle.purchaseYear;
    
    if (age <= 3) {
      ageGroups[0]++;
    } else if (age <= 7) {
      ageGroups[1]++;
    } else if (age <= 10) {
      ageGroups[2]++;
    } else {
      ageGroups[3]++;
    }
  });
  
  return ageGroups;
}

// Calculate tax benefits
export function calculateTaxBenefits(
  vehicles: Vehicle[], 
  taxRate: number, 
  method: string
): TaxAnalysis {
  // Calculate total equipment cost for all future replacements
  const totalEquipmentCost = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.replacementCost, 0
  );
  
  let totalSavings = 0;
  let firstYearSavings = 0;
  
  switch (method) {
    case 'immediate':
      // Immediate deduction (Section 179) - all in first year
      totalSavings = totalEquipmentCost * (taxRate / 100);
      firstYearSavings = totalSavings;
      break;
      
    case 'depreciation':
      // MACRS 5-year depreciation percentages
      const macrsRates = [0.20, 0.32, 0.192, 0.1152, 0.1152, 0.0576];
      
      // Calculate savings for each year
      macrsRates.forEach((rate, index) => {
        const yearSavings = totalEquipmentCost * rate * (taxRate / 100);
        totalSavings += yearSavings;
        
        if (index === 0) {
          firstYearSavings = yearSavings;
        }
      });
      break;
      
    case 'bonus':
      // Bonus depreciation - 80% in first year, remaining 20% using MACRS
      const bonusAmount = totalEquipmentCost * 0.8;
      const remainingAmount = totalEquipmentCost * 0.2;
      
      // First year bonus
      firstYearSavings = bonusAmount * (taxRate / 100);
      totalSavings = firstYearSavings;
      
      // Remaining depreciation on the 20%
      const macrsRates2 = [0.20, 0.32, 0.192, 0.1152, 0.1152, 0.0576];
      macrsRates2.forEach((rate, index) => {
        const yearSavings = remainingAmount * rate * (taxRate / 100);
        totalSavings += yearSavings;
        
        if (index === 0) {
          firstYearSavings += yearSavings;
        }
      });
      break;
  }
  
  return {
    method,
    totalSavings: Math.round(totalSavings),
    firstYearSavings: Math.round(firstYearSavings),
    netEquipmentCost: Math.round(totalEquipmentCost - totalSavings)
  };
}

// Calculate simulation results based on changed parameters
export function calculateSimulation(
  vehicles: Vehicle[],
  currentSettings: FinancialSettings,
  params: SimulationParams
): SimulationResults {
  // Create modified settings for simulation
  const simulatedSettings: FinancialSettings = {
    ...currentSettings,
    monthlyContribution: params.monthlyContribution,
    interestRate: params.interestRate,
    loanInterestRate: params.loanRate
  };
  
  // Copy vehicles and adjust inflation rate
  const simulatedVehicles = vehicles.map(v => ({
    ...v,
    inflationRate: params.inflationRate
  }));
  
  // Calculate projections with new parameters
  const { projections } = calculateProjections(simulatedVehicles, simulatedSettings);
  
  // Calculate results
  const fundedVehicles = projections.filter(p => p.shortfall === 0).length;
  const maxShortfall = Math.max(0, ...projections.map(p => p.shortfall));
  
  // Calculate 10-year fund balance
  let fundBalance = currentSettings.initialFund;
  const monthlyRate = params.interestRate / 100 / 12;
  
  for (let i = 0; i < 120; i++) {
    fundBalance += params.monthlyContribution;
    fundBalance += fundBalance * monthlyRate;
    
    // Deduct vehicle costs when they occur
    const vehiclesThisMonth = projections.filter(p => p.replacementMonth === i + 1);
    vehiclesThisMonth.forEach(v => {
      if (fundBalance >= v.netCost) {
        fundBalance -= v.netCost;
      } else {
        fundBalance = 0;
      }
    });
  }
  
  // Calculate average monthly cost (contributions + loan payments for shortfalls)
  const totalContributions = params.monthlyContribution * 120;
  const totalShortfallPayments = projections
    .filter(p => p.shortfall > 0)
    .reduce((sum, p) => sum + (p.loanPayment * 60), 0); // 5 year loan terms
  
  const monthlyAverage = Math.round((totalContributions + totalShortfallPayments) / 120);
  
  return {
    fundBalance: Math.round(fundBalance),
    fundedVehicles,
    totalVehicles: vehicles.length,
    maxShortfall,
    monthlyAverage
  };
}

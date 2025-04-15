import { db } from '../server/db';
import { 
  financialSettings, 
  alertSettings, 
  systemSettings,
  simulationParams,
  depreciationMethodEnum
} from '../shared/schema';

async function setupInitialSettings() {
  try {
    console.log('Setting up initial application settings...');
    
    // Create initial financial settings
    const financialSettingsData = {
      initialFund: 250000,
      monthlyContribution: 15000,
      interestRate: 3.5,
      loanInterestRate: 6.5,
      leaseInterestRate: 5.0,
      loanTermYears: 7,
      taxRate: 25.0,
      depreciationMethod: "straight-line" as const
    };
    
    // Create initial alert settings
    const alertSettingsData = {
      truckMaxAge: 15,
      trailerMaxAge: 20,
      truckMaxMileage: 500000,
      truckMaintenanceMax: 15000,
      trailerMaintenanceMax: 10000
    };
    
    // Create initial system settings
    const systemSettingsData = {
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      autoSave: true,
      emailAlerts: false
    };
    
    // Create initial simulation parameters
    const simulationParamsData = {
      monthlyContribution: 15000,
      interestRate: 3.5,
      inflationRate: 2.5,
      loanRate: 6.5
    };
    
    // Clear existing settings
    await db.delete(financialSettings);
    await db.delete(alertSettings);
    await db.delete(systemSettings);
    await db.delete(simulationParams);
    console.log('Cleared existing settings');
    
    // Insert new settings
    const [financial] = await db.insert(financialSettings).values(financialSettingsData).returning();
    const [alerts] = await db.insert(alertSettings).values(alertSettingsData).returning();
    const [system] = await db.insert(systemSettings).values(systemSettingsData).returning();
    const [simulation] = await db.insert(simulationParams).values(simulationParamsData).returning();
    
    console.log('Successfully created initial settings:');
    console.log('Financial settings:', financial);
    console.log('Alert settings:', alerts);
    console.log('System settings:', system);
    console.log('Simulation parameters:', simulation);
    
    return { financial, alerts, system, simulation };
  } catch (error) {
    console.error('Error setting up initial settings:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the setup
setupInitialSettings();
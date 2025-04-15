import { db } from '../server/db';
import { vehicles } from '../shared/schema';

// Fox Fuel Fleet Data
const fleetData = [
  {
    name: "117",
    type: "truck" as const,
    purchaseYear: 2010,
    currentMileage: null, // Not provided in the data
    replacementCost: 68000,
    salvageValue: 10000, // Estimate
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2025,
    replacementQuarter: "Q3" as const
  },
  {
    name: "118",
    type: "truck" as const,
    purchaseYear: 2019,
    currentMileage: null, // Not provided in the data
    replacementCost: 175000, // Based on similar vehicle cost
    salvageValue: 40000, // Estimate based on newer vehicle
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2029, // Estimated - not scheduled for replacement yet
    replacementQuarter: "Q2" as const
  },
  {
    name: "119",
    type: "truck" as const,
    purchaseYear: 2024,
    currentMileage: null, // Not provided in the data
    replacementCost: 175000, // From data
    salvageValue: 50000, // Estimate based on newest vehicle
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2034, // Estimated based on condition assessment in 2026
    replacementQuarter: "Q4" as const
  },
  {
    name: "1108",
    type: "truck" as const,
    purchaseYear: 2007,
    currentMileage: null, // Not provided in the data
    replacementCost: 195000, // From data
    salvageValue: 15000, // Estimate based on older vehicle
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2026,
    replacementQuarter: "Q1" as const
  },
  {
    name: "1110",
    type: "truck" as const,
    purchaseYear: 2023,
    currentMileage: null, // Not provided in the data
    replacementCost: 195000, // Estimate based on similar vehicle
    salvageValue: 45000, // Estimate based on newer vehicle
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2033, // Estimated - not scheduled for replacement yet
    replacementQuarter: "Q2" as const
  },
  {
    name: "1112",
    type: "truck" as const,
    purchaseYear: 2015,
    currentMileage: null, // Not provided in the data
    replacementCost: 210000, // Combined with T102 from data
    salvageValue: 25000, // Estimate
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2025,
    replacementQuarter: "Q2" as const
  },
  {
    name: "T102",
    type: "trailer" as const,
    purchaseYear: 1991,
    currentMileage: null, // Not applicable for trailer
    replacementCost: 210000, // Combined with 1112 from data
    salvageValue: 5000, // Estimate based on old trailer
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2025,
    replacementQuarter: "Q2" as const
  },
  {
    name: "T105",
    type: "trailer" as const,
    purchaseYear: 2001,
    currentMileage: null, // Not applicable for trailer
    replacementCost: 85000, // From data
    salvageValue: 8000, // Estimate
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2025,
    replacementQuarter: "Q2" as const
  },
  {
    name: "T106",
    type: "trailer" as const,
    purchaseYear: 1999,
    currentMileage: null, // Not applicable for trailer
    replacementCost: 85000, // From data
    salvageValue: 7500, // Estimate
    inflationRate: 2.5, // Default inflation rate
    replacementYear: 2027, // Based on condition assessment in Q4 2027
    replacementQuarter: "Q4" as const
  }
];

async function importFleetData() {
  try {
    console.log('Importing fleet data into database...');
    
    // Clear existing vehicles
    await db.delete(vehicles);
    console.log('Cleared existing vehicles');
    
    // Insert new vehicles
    const result = await db.insert(vehicles).values(fleetData).returning();
    
    console.log(`Successfully imported ${result.length} vehicles`);
    result.forEach(v => console.log(`- ${v.name}`));
    
    return result;
  } catch (error) {
    console.error('Error importing fleet data:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the import
importFleetData();
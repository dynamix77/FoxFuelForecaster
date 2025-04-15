import { 
  users, vehicles, financialSettings, alertSettings, systemSettings, 
  scenarios, scenarioKeyPoints, scenarioVehicles, simulationParams,
  type User, type InsertUser, type Vehicle, type InsertVehicle,
  type FinancialSettings, type InsertFinancialSettings,
  type AlertSettings, type InsertAlertSettings,
  type SystemSettings, type InsertSystemSettings,
  type Scenario, type InsertScenario,
  type ScenarioKeyPoint, type InsertScenarioKeyPoint,
  type ScenarioVehicle, type InsertScenarioVehicle,
  type SimulationParams, type InsertSimulationParams
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface with CRUD methods for all entities
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vehicle methods
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Financial Settings methods
  getActiveFinancialSettings(): Promise<FinancialSettings | undefined>;
  createFinancialSettings(settings: InsertFinancialSettings): Promise<FinancialSettings>;
  updateFinancialSettings(id: number, settings: Partial<InsertFinancialSettings>): Promise<FinancialSettings | undefined>;
  
  // Alert Settings methods
  getActiveAlertSettings(): Promise<AlertSettings | undefined>;
  createAlertSettings(settings: InsertAlertSettings): Promise<AlertSettings>;
  updateAlertSettings(id: number, settings: Partial<InsertAlertSettings>): Promise<AlertSettings | undefined>;
  
  // System Settings methods
  getActiveSystemSettings(): Promise<SystemSettings | undefined>;
  createSystemSettings(settings: InsertSystemSettings): Promise<SystemSettings>;
  updateSystemSettings(id: number, settings: Partial<InsertSystemSettings>): Promise<SystemSettings | undefined>;
  
  // Scenario methods
  getScenarios(): Promise<Scenario[]>;
  getScenario(id: number): Promise<Scenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  updateScenario(id: number, scenario: Partial<InsertScenario>): Promise<Scenario | undefined>;
  deleteScenario(id: number): Promise<boolean>;
  
  // Scenario Key Points methods
  getScenarioKeyPoints(scenarioId: number): Promise<ScenarioKeyPoint[]>;
  createScenarioKeyPoint(keyPoint: InsertScenarioKeyPoint): Promise<ScenarioKeyPoint>;
  deleteScenarioKeyPoints(scenarioId: number): Promise<boolean>;
  
  // Scenario Vehicles methods
  getScenarioVehicles(scenarioId: number): Promise<ScenarioVehicle[]>;
  createScenarioVehicle(scenarioVehicle: InsertScenarioVehicle): Promise<ScenarioVehicle>;
  updateScenarioVehicle(id: number, scenarioVehicle: Partial<InsertScenarioVehicle>): Promise<ScenarioVehicle | undefined>;
  deleteScenarioVehicles(scenarioId: number): Promise<boolean>;
  
  // Simulation Parameters methods
  getActiveSimulationParams(): Promise<SimulationParams | undefined>;
  createSimulationParams(params: InsertSimulationParams): Promise<SimulationParams>;
  updateSimulationParams(id: number, params: Partial<InsertSimulationParams>): Promise<SimulationParams | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Vehicle methods
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }
  
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return result[0];
  }
  
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const result = await db.insert(vehicles).values(vehicle).returning();
    return result[0];
  }
  
  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const result = await db.update(vehicles)
      .set(vehicle)
      .where(eq(vehicles.id, id))
      .returning();
    return result[0];
  }
  
  async deleteVehicle(id: number): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id)).returning();
    return result.length > 0;
  }
  
  // Financial Settings methods
  async getActiveFinancialSettings(): Promise<FinancialSettings | undefined> {
    const result = await db.select()
      .from(financialSettings)
      .where(eq(financialSettings.isActive, true))
      .orderBy(desc(financialSettings.createdAt))
      .limit(1);
    return result[0];
  }
  
  async createFinancialSettings(settings: InsertFinancialSettings): Promise<FinancialSettings> {
    // First, deactivate all existing settings
    await db.update(financialSettings)
      .set({ isActive: false })
      .where(eq(financialSettings.isActive, true));
    
    // Then create new active settings
    const result = await db.insert(financialSettings)
      .values({ ...settings, isActive: true })
      .returning();
    return result[0];
  }
  
  async updateFinancialSettings(id: number, settings: Partial<InsertFinancialSettings>): Promise<FinancialSettings | undefined> {
    const result = await db.update(financialSettings)
      .set(settings)
      .where(eq(financialSettings.id, id))
      .returning();
    return result[0];
  }
  
  // Alert Settings methods
  async getActiveAlertSettings(): Promise<AlertSettings | undefined> {
    const result = await db.select()
      .from(alertSettings)
      .where(eq(alertSettings.isActive, true))
      .orderBy(desc(alertSettings.createdAt))
      .limit(1);
    return result[0];
  }
  
  async createAlertSettings(settings: InsertAlertSettings): Promise<AlertSettings> {
    // First, deactivate all existing settings
    await db.update(alertSettings)
      .set({ isActive: false })
      .where(eq(alertSettings.isActive, true));
    
    // Then create new active settings
    const result = await db.insert(alertSettings)
      .values({ ...settings, isActive: true })
      .returning();
    return result[0];
  }
  
  async updateAlertSettings(id: number, settings: Partial<InsertAlertSettings>): Promise<AlertSettings | undefined> {
    const result = await db.update(alertSettings)
      .set(settings)
      .where(eq(alertSettings.id, id))
      .returning();
    return result[0];
  }
  
  // System Settings methods
  async getActiveSystemSettings(): Promise<SystemSettings | undefined> {
    const result = await db.select()
      .from(systemSettings)
      .where(eq(systemSettings.isActive, true))
      .orderBy(desc(systemSettings.createdAt))
      .limit(1);
    return result[0];
  }
  
  async createSystemSettings(settings: InsertSystemSettings): Promise<SystemSettings> {
    // First, deactivate all existing settings
    await db.update(systemSettings)
      .set({ isActive: false })
      .where(eq(systemSettings.isActive, true));
    
    // Then create new active settings
    const result = await db.insert(systemSettings)
      .values({ ...settings, isActive: true })
      .returning();
    return result[0];
  }
  
  async updateSystemSettings(id: number, settings: Partial<InsertSystemSettings>): Promise<SystemSettings | undefined> {
    const result = await db.update(systemSettings)
      .set(settings)
      .where(eq(systemSettings.id, id))
      .returning();
    return result[0];
  }
  
  // Scenario methods
  async getScenarios(): Promise<Scenario[]> {
    return await db.select().from(scenarios).where(eq(scenarios.isActive, true));
  }
  
  async getScenario(id: number): Promise<Scenario | undefined> {
    const result = await db.select().from(scenarios).where(eq(scenarios.id, id));
    return result[0];
  }
  
  async createScenario(scenario: InsertScenario): Promise<Scenario> {
    const result = await db.insert(scenarios)
      .values({ ...scenario, isActive: true })
      .returning();
    return result[0];
  }
  
  async updateScenario(id: number, scenario: Partial<InsertScenario>): Promise<Scenario | undefined> {
    const result = await db.update(scenarios)
      .set(scenario)
      .where(eq(scenarios.id, id))
      .returning();
    return result[0];
  }
  
  async deleteScenario(id: number): Promise<boolean> {
    // Soft delete by setting isActive to false
    const result = await db.update(scenarios)
      .set({ isActive: false })
      .where(eq(scenarios.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Scenario Key Points methods
  async getScenarioKeyPoints(scenarioId: number): Promise<ScenarioKeyPoint[]> {
    return await db.select()
      .from(scenarioKeyPoints)
      .where(eq(scenarioKeyPoints.scenarioId, scenarioId));
  }
  
  async createScenarioKeyPoint(keyPoint: InsertScenarioKeyPoint): Promise<ScenarioKeyPoint> {
    const result = await db.insert(scenarioKeyPoints)
      .values(keyPoint)
      .returning();
    return result[0];
  }
  
  async deleteScenarioKeyPoints(scenarioId: number): Promise<boolean> {
    const result = await db.delete(scenarioKeyPoints)
      .where(eq(scenarioKeyPoints.scenarioId, scenarioId))
      .returning();
    return result.length > 0;
  }
  
  // Scenario Vehicles methods
  async getScenarioVehicles(scenarioId: number): Promise<ScenarioVehicle[]> {
    return await db.select()
      .from(scenarioVehicles)
      .where(eq(scenarioVehicles.scenarioId, scenarioId));
  }
  
  async createScenarioVehicle(scenarioVehicle: InsertScenarioVehicle): Promise<ScenarioVehicle> {
    const result = await db.insert(scenarioVehicles)
      .values(scenarioVehicle)
      .returning();
    return result[0];
  }
  
  async updateScenarioVehicle(id: number, scenarioVehicle: Partial<InsertScenarioVehicle>): Promise<ScenarioVehicle | undefined> {
    const result = await db.update(scenarioVehicles)
      .set(scenarioVehicle)
      .where(eq(scenarioVehicles.id, id))
      .returning();
    return result[0];
  }
  
  async deleteScenarioVehicles(scenarioId: number): Promise<boolean> {
    const result = await db.delete(scenarioVehicles)
      .where(eq(scenarioVehicles.scenarioId, scenarioId))
      .returning();
    return result.length > 0;
  }
  
  // Simulation Parameters methods
  async getActiveSimulationParams(): Promise<SimulationParams | undefined> {
    const result = await db.select()
      .from(simulationParams)
      .where(eq(simulationParams.isActive, true))
      .orderBy(desc(simulationParams.createdAt))
      .limit(1);
    return result[0];
  }
  
  async createSimulationParams(params: InsertSimulationParams): Promise<SimulationParams> {
    // First, deactivate all existing params
    await db.update(simulationParams)
      .set({ isActive: false })
      .where(eq(simulationParams.isActive, true));
    
    // Then create new active params
    const result = await db.insert(simulationParams)
      .values({ ...params, isActive: true })
      .returning();
    return result[0];
  }
  
  async updateSimulationParams(id: number, params: Partial<InsertSimulationParams>): Promise<SimulationParams | undefined> {
    const result = await db.update(simulationParams)
      .set(params)
      .where(eq(simulationParams.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();

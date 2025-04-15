import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, date, foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (keeping it for authentication purposes)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Vehicle Types
export const vehicleTypeEnum = pgEnum("vehicle_type", [
  "truck",
  "trailer",
  "van",
  "car",
  "other"
]);

// Quarter Enum for replacements
export const quarterEnum = pgEnum("quarter", ["Q1", "Q2", "Q3", "Q4"]);

// Depreciation Method Enum
export const depreciationMethodEnum = pgEnum("depreciation_method", [
  "straight-line", 
  "macrs", 
  "double-declining"
]);

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: vehicleTypeEnum("type").notNull(),
  purchaseYear: integer("purchase_year").notNull(),
  currentMileage: integer("current_mileage"),
  replacementCost: doublePrecision("replacement_cost").notNull(),
  salvageValue: doublePrecision("salvage_value").notNull(),
  inflationRate: doublePrecision("inflation_rate").notNull(),
  replacementYear: integer("replacement_year").notNull(),
  replacementQuarter: quarterEnum("replacement_quarter").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  scenarios: many(scenarioVehicles)
}));

// Financial Settings
export const financialSettings = pgTable("financial_settings", {
  id: serial("id").primaryKey(),
  initialFund: doublePrecision("initial_fund").notNull(),
  monthlyContribution: doublePrecision("monthly_contribution").notNull(),
  interestRate: doublePrecision("interest_rate").notNull(),
  loanInterestRate: doublePrecision("loan_interest_rate").notNull(),
  leaseInterestRate: doublePrecision("lease_interest_rate").notNull(),
  loanTermYears: integer("loan_term_years").notNull(),
  taxRate: doublePrecision("tax_rate").notNull(),
  depreciationMethod: depreciationMethodEnum("depreciation_method").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alert Settings
export const alertSettings = pgTable("alert_settings", {
  id: serial("id").primaryKey(),
  truckMaxAge: integer("truck_max_age").notNull(),
  trailerMaxAge: integer("trailer_max_age").notNull(),
  truckMaxMileage: integer("truck_max_mileage").notNull(),
  truckMaintenanceMax: doublePrecision("truck_maintenance_max").notNull(),
  trailerMaintenanceMax: doublePrecision("trailer_maintenance_max").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Settings
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  dateFormat: text("date_format").notNull(),
  currency: text("currency").notNull(),
  autoSave: boolean("auto_save").notNull(),
  emailAlerts: boolean("email_alerts").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scenarios
export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalCost: doublePrecision("total_cost").notNull(),
  roi: doublePrecision("roi").notNull(),
  riskLevel: integer("risk_level").notNull(),
  alertType: text("alert_type").notNull(), // 'info', 'warning', 'success'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scenariosRelations = relations(scenarios, ({ many }) => ({
  keyPoints: many(scenarioKeyPoints),
  vehicles: many(scenarioVehicles)
}));

// Scenario Key Points
export const scenarioKeyPoints = pgTable("scenario_key_points", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull().references(() => scenarios.id, { onDelete: 'cascade' }),
  point: text("point").notNull(),
});

export const scenarioKeyPointsRelations = relations(scenarioKeyPoints, ({ one }) => ({
  scenario: one(scenarios, {
    fields: [scenarioKeyPoints.scenarioId],
    references: [scenarios.id]
  })
}));

// Scenario Vehicles (for modified vehicles in scenarios)
export const scenarioVehicles = pgTable("scenario_vehicles", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull().references(() => scenarios.id, { onDelete: 'cascade' }),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  replacementYear: integer("replacement_year"),
  replacementQuarter: quarterEnum("replacement_quarter"),
  replacementCost: doublePrecision("replacement_cost"),
});

export const scenarioVehiclesRelations = relations(scenarioVehicles, ({ one }) => ({
  scenario: one(scenarios, {
    fields: [scenarioVehicles.scenarioId],
    references: [scenarios.id]
  }),
  vehicle: one(vehicles, {
    fields: [scenarioVehicles.vehicleId],
    references: [vehicles.id]
  })
}));

// Simulation Parameters
export const simulationParams = pgTable("simulation_params", {
  id: serial("id").primaryKey(),
  monthlyContribution: doublePrecision("monthly_contribution").notNull(),
  interestRate: doublePrecision("interest_rate").notNull(),
  inflationRate: doublePrecision("inflation_rate").notNull(),
  loanRate: doublePrecision("loan_rate").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas for all tables
export const insertVehicleSchema = createInsertSchema(vehicles).omit({ 
  id: true,
  createdAt: true 
});

export const insertFinancialSettingsSchema = createInsertSchema(financialSettings).omit({ 
  id: true, 
  isActive: true,
  createdAt: true 
});

export const insertAlertSettingsSchema = createInsertSchema(alertSettings).omit({ 
  id: true, 
  isActive: true,
  createdAt: true 
});

export const insertSystemSettingsSchema = createInsertSchema(systemSettings).omit({ 
  id: true, 
  isActive: true,
  createdAt: true 
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({ 
  id: true, 
  isActive: true,
  createdAt: true 
});

export const insertScenarioKeyPointSchema = createInsertSchema(scenarioKeyPoints).omit({ 
  id: true 
});

export const insertScenarioVehicleSchema = createInsertSchema(scenarioVehicles).omit({ 
  id: true 
});

export const insertSimulationParamsSchema = createInsertSchema(simulationParams).omit({ 
  id: true, 
  isActive: true,
  createdAt: true 
});

// Export types
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type FinancialSettings = typeof financialSettings.$inferSelect;
export type InsertFinancialSettings = z.infer<typeof insertFinancialSettingsSchema>;

export type AlertSettings = typeof alertSettings.$inferSelect;
export type InsertAlertSettings = z.infer<typeof insertAlertSettingsSchema>;

export type SystemSettings = typeof systemSettings.$inferSelect;
export type InsertSystemSettings = z.infer<typeof insertSystemSettingsSchema>;

export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;

export type ScenarioKeyPoint = typeof scenarioKeyPoints.$inferSelect;
export type InsertScenarioKeyPoint = z.infer<typeof insertScenarioKeyPointSchema>;

export type ScenarioVehicle = typeof scenarioVehicles.$inferSelect;
export type InsertScenarioVehicle = z.infer<typeof insertScenarioVehicleSchema>;

export type SimulationParams = typeof simulationParams.$inferSelect;
export type InsertSimulationParams = z.infer<typeof insertSimulationParamsSchema>;

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVehicleSchema, insertFinancialSettingsSchema, insertAlertSettingsSchema, 
  insertSystemSettingsSchema, insertScenarioSchema, insertScenarioKeyPointSchema,
  insertScenarioVehicleSchema, insertSimulationParamsSchema 
} from "@shared/schema";
import { ZodError } from "zod";

// Helper function for validation errors
const handleValidationError = (err: Error, res: Response) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors
    });
  }
  
  console.error("Unexpected error:", err);
  return res.status(500).json({ error: "Internal server error" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to parse request bodies as JSON
  app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      if (!req.headers["content-type"]?.includes("application/json")) {
        return res.status(415).json({ error: "Content-Type must be application/json" });
      }
    }
    next();
  });

  // 1. Vehicle Routes
  
  // Get all vehicles
  app.get("/api/vehicles", async (req: Request, res: Response) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });
  
  // Get single vehicle
  app.get("/api/vehicles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle ID" });
      }
      
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });
  
  // Create vehicle
  app.post("/api/vehicles", async (req: Request, res: Response) => {
    try {
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedData);
      res.status(201).json(vehicle);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Update vehicle
  app.put("/api/vehicles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle ID" });
      }
      
      const validatedData = insertVehicleSchema.partial().parse(req.body);
      const updatedVehicle = await storage.updateVehicle(id, validatedData);
      
      if (!updatedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Delete vehicle
  app.delete("/api/vehicles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle ID" });
      }
      
      const success = await storage.deleteVehicle(id);
      
      if (!success) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });
  
  // 2. Financial Settings Routes
  
  // Get active financial settings
  app.get("/api/settings/financial", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getActiveFinancialSettings();
      if (!settings) {
        return res.status(404).json({ error: "No financial settings found" });
      }
      res.json(settings);
    } catch (err) {
      console.error("Error fetching financial settings:", err);
      res.status(500).json({ error: "Failed to fetch financial settings" });
    }
  });
  
  // Create or update financial settings
  app.post("/api/settings/financial", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFinancialSettingsSchema.parse(req.body);
      const settings = await storage.createFinancialSettings(validatedData);
      res.status(201).json(settings);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Update financial settings
  app.put("/api/settings/financial/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid settings ID" });
      }
      
      const validatedData = insertFinancialSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateFinancialSettings(id, validatedData);
      
      if (!updatedSettings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // 3. Alert Settings Routes
  
  // Get active alert settings
  app.get("/api/settings/alerts", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getActiveAlertSettings();
      if (!settings) {
        return res.status(404).json({ error: "No alert settings found" });
      }
      res.json(settings);
    } catch (err) {
      console.error("Error fetching alert settings:", err);
      res.status(500).json({ error: "Failed to fetch alert settings" });
    }
  });
  
  // Create or update alert settings
  app.post("/api/settings/alerts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAlertSettingsSchema.parse(req.body);
      const settings = await storage.createAlertSettings(validatedData);
      res.status(201).json(settings);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Update alert settings
  app.put("/api/settings/alerts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid settings ID" });
      }
      
      const validatedData = insertAlertSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateAlertSettings(id, validatedData);
      
      if (!updatedSettings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // 4. System Settings Routes
  
  // Get active system settings
  app.get("/api/settings/system", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getActiveSystemSettings();
      if (!settings) {
        return res.status(404).json({ error: "No system settings found" });
      }
      res.json(settings);
    } catch (err) {
      console.error("Error fetching system settings:", err);
      res.status(500).json({ error: "Failed to fetch system settings" });
    }
  });
  
  // Create or update system settings
  app.post("/api/settings/system", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSystemSettingsSchema.parse(req.body);
      const settings = await storage.createSystemSettings(validatedData);
      res.status(201).json(settings);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Update system settings
  app.put("/api/settings/system/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid settings ID" });
      }
      
      const validatedData = insertSystemSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateSystemSettings(id, validatedData);
      
      if (!updatedSettings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // 5. Scenario Routes
  
  // Get all scenarios
  app.get("/api/scenarios", async (req: Request, res: Response) => {
    try {
      const scenarios = await storage.getScenarios();
      res.json(scenarios);
    } catch (err) {
      console.error("Error fetching scenarios:", err);
      res.status(500).json({ error: "Failed to fetch scenarios" });
    }
  });
  
  // Get single scenario
  app.get("/api/scenarios/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid scenario ID" });
      }
      
      const scenario = await storage.getScenario(id);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      
      // Get key points for this scenario
      const keyPoints = await storage.getScenarioKeyPoints(id);
      
      // Get vehicles for this scenario
      const scenarioVehicles = await storage.getScenarioVehicles(id);
      
      res.json({
        ...scenario,
        keyPoints,
        vehicles: scenarioVehicles
      });
    } catch (err) {
      console.error("Error fetching scenario:", err);
      res.status(500).json({ error: "Failed to fetch scenario" });
    }
  });
  
  // Create scenario
  app.post("/api/scenarios", async (req: Request, res: Response) => {
    try {
      const { keyPoints, vehicles, ...scenarioData } = req.body;
      
      // Validate and create the scenario
      const validatedScenarioData = insertScenarioSchema.parse(scenarioData);
      const scenario = await storage.createScenario(validatedScenarioData);
      
      // Add key points if provided
      if (Array.isArray(keyPoints)) {
        for (const point of keyPoints) {
          await storage.createScenarioKeyPoint({
            scenarioId: scenario.id,
            point
          });
        }
      }
      
      // Add scenario vehicles if provided
      if (Array.isArray(vehicles)) {
        for (const vehicle of vehicles) {
          await storage.createScenarioVehicle({
            scenarioId: scenario.id,
            ...vehicle
          });
        }
      }
      
      res.status(201).json({
        ...scenario,
        keyPoints: keyPoints || [],
        vehicles: vehicles || []
      });
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Update scenario
  app.put("/api/scenarios/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid scenario ID" });
      }
      
      const { keyPoints, vehicles, ...scenarioData } = req.body;
      
      // Validate and update the scenario
      const validatedScenarioData = insertScenarioSchema.partial().parse(scenarioData);
      const updatedScenario = await storage.updateScenario(id, validatedScenarioData);
      
      if (!updatedScenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      
      // Update key points if provided
      if (Array.isArray(keyPoints)) {
        // Remove existing key points
        await storage.deleteScenarioKeyPoints(id);
        
        // Add new key points
        for (const point of keyPoints) {
          await storage.createScenarioKeyPoint({
            scenarioId: id,
            point
          });
        }
      }
      
      // Update scenario vehicles if provided
      if (Array.isArray(vehicles)) {
        // Remove existing scenario vehicles
        await storage.deleteScenarioVehicles(id);
        
        // Add new scenario vehicles
        for (const vehicle of vehicles) {
          await storage.createScenarioVehicle({
            scenarioId: id,
            ...vehicle
          });
        }
      }
      
      // Get updated key points
      const updatedKeyPoints = keyPoints ? keyPoints : await storage.getScenarioKeyPoints(id);
      
      // Get updated vehicles
      const updatedVehicles = vehicles ? vehicles : await storage.getScenarioVehicles(id);
      
      res.json({
        ...updatedScenario,
        keyPoints: updatedKeyPoints,
        vehicles: updatedVehicles
      });
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Delete scenario
  app.delete("/api/scenarios/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid scenario ID" });
      }
      
      const success = await storage.deleteScenario(id);
      
      if (!success) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting scenario:", err);
      res.status(500).json({ error: "Failed to delete scenario" });
    }
  });
  
  // 6. Simulation Parameters Routes
  
  // Get active simulation params
  app.get("/api/simulation/params", async (req: Request, res: Response) => {
    try {
      const params = await storage.getActiveSimulationParams();
      if (!params) {
        return res.status(404).json({ error: "No simulation parameters found" });
      }
      res.json(params);
    } catch (err) {
      console.error("Error fetching simulation parameters:", err);
      res.status(500).json({ error: "Failed to fetch simulation parameters" });
    }
  });
  
  // Create or update simulation params
  app.post("/api/simulation/params", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSimulationParamsSchema.parse(req.body);
      const params = await storage.createSimulationParams(validatedData);
      res.status(201).json(params);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });
  
  // Update simulation params
  app.put("/api/simulation/params/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid parameters ID" });
      }
      
      const validatedData = insertSimulationParamsSchema.partial().parse(req.body);
      const updatedParams = await storage.updateSimulationParams(id, validatedData);
      
      if (!updatedParams) {
        return res.status(404).json({ error: "Parameters not found" });
      }
      
      res.json(updatedParams);
    } catch (err) {
      handleValidationError(err as Error, res);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

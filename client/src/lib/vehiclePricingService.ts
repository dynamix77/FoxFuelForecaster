// client/src/lib/vehiclePricingService.ts

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Example type declarations – adjust based on your actual backend schema
export interface Vehicle {
  id: string;
  name: string;
  year: number;
  mileage: number;
  purchasePrice: number;
  salvageValue: number;
  replacementYear: number;
}

export interface VehiclePricingInput {
  vehicle: Vehicle;
  inflationRate: number;
  investmentRate: number;
  taxRate: number;
  years: number;
}

export interface PricingResult {
  futureCost: number;
  fundNeeded: number;
  taxImpact: number;
  breakdown: any;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }
  return res.json();
}

// GET: Fetch all vehicles
export async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${API_BASE_URL}/api/vehicles`);
  return handleResponse<Vehicle[]>(res);
}

// POST: Add a new vehicle
export async function addVehicle(vehicle: Vehicle): Promise<Vehicle> {
  const res = await fetch(`${API_BASE_URL}/api/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  return handleResponse<Vehicle>(res);
}

// PUT: Update an existing vehicle
export async function updateVehicle(vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<Vehicle>(res);
}

// DELETE: Remove a vehicle
export async function deleteVehicle(vehicleId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete vehicle with ID: ${vehicleId}`);
}

// POST: Run pricing analysis
export async function runVehiclePricing(input: VehiclePricingInput): Promise<PricingResult> {
  const res = await fetch(`${API_BASE_URL}/api/vehicle-pricing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PricingResult>(res);
}

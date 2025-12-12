/* 
the following functions live here...

vehicle interface related:
    1. VehicleMotion
    2. VehicleControls
    3. VehicleSystems
    4. VehicleCluster
    5. VehicleEnvironment
    6. VehicleState

communication interface related:
    1. ControlInput
    2. EnvironmentUpdate
    3. ClientType    
*/

export interface VehicleMotion {
  speed: number; // current speed in mph
  direction: number; // heading in degrees (0-359°)
  x: number; // refers to horizontal position
  y: number; // refers to the vertical position
  accelerating: boolean; // indicative of acceleration state
}

export interface VehicleControls {
  throttle: number; // 0-1 from idle to full throttle
  brake: number; // 0-1 from no brake to full brake
  steering: number; // -1 to 1 from full left (-1) to full right (1)
  gear: "P" | "R" | "N" | "D" | "S";
}

/* 
gear cheat sheet:
    p = park / lock wheels
    r = reverse
    n = neutral / disengage engine
    d = drive / normal forward driving
    s = sport / better power + acceleration in lower gears
*/

export interface VehicleSystems {
  lights: boolean;
  leftSignal: boolean;
  rightSignal: boolean;
  hazards: boolean;
}

export interface VehicleCluster {
  rpm: number; // revolutions per minute, measures how fast engine's crankshaft spins & the number of times the crankshaft completes a full rotation in one minute
  fuel: number; // as a percentage
  battery: number; // as a percentage for electric vehicles
  warnings: string[]; // potential warnings stored as string
  trip: number; // refers to trip milage ONLY
  odometer: number; // refers to TOTAL milage
}

export interface VehicleEnvironment {
  speedLimit: number;
  nearbyTraffic: any[];
  alerts: string[];
}

// vehicleState is the master state object that combines all of the interfaces into a single source of truth for consistency across the entire system
export interface VehicleState {
  motion: VehicleMotion;
  controls: VehicleControls;
  systems: VehicleSystems;
  cluster: VehicleCluster;
  environment: VehicleEnvironment;
  timestamp?: number;
}

export interface ControlInput {
  type:
    | "throttle"
    | "brake"
    | "steering"
    | "gear"
    | "lights"
    | "leftSignal"
    | "rightSignal"
    | "hazards";
  value: number | string | boolean;
}

export interface EnvironmentUpdate {
  speedLimit?: number;
  alerts?: string[];
}

// refers to the type of connection the client is using
export type ClientType = "mobile" | "tablet" | "web" | "test";

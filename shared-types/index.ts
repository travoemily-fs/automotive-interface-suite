/* 
the following functions live here...

batmobile interface related:
    1. BatmobileMotion
    2. BatmobileControls
    3. BatmobileSystems
    4. BatmobileCockpit
    5. BatmobileEnvironment
    6. BatmobileState

communication interface related:
    1. ControlCommand
    2. TacticalUpdate
    3. ClientType    
*/

export interface BatmobileMotion {
  speed: number; // current speed in mph
  direction: number; // heading in degrees (0-359°)
  x: number; // refers to horizontal position
  y: number; // refers to the vertical position
  accelerating: boolean; // indicative of acceleration state
}

export interface BatmobileControls {
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

export interface BatmobileSystems {
  lights: boolean;
  leftSignal: boolean;
  rightSignal: boolean;
  hazards: boolean;
}

export interface BatmobileCockpit {
  rpm: number; // revolutions per minute, measures how fast engine's crankshaft spins & the number of times the crankshaft completes a full rotation in one minute
  fuel: number; // as a percentage
  battery: number; // as a percentage for electric vehicles
  warnings: string[]; // potential warnings stored as string
  trip: number; // refers to trip milage ONLY
  odometer: number; // refers to TOTAL milage
}

export interface BatmobileEnvironment {
  speedLimit: number;
  nearbyTraffic: any[];
  alerts: string[];
}

// batmobile state is the master state object that combines all of the interfaces into a single source of truth for consistency across the entire system
export interface BatmobileState {
  motion: BatmobileMotion;
  controls: BatmobileControls;
  systems: BatmobileSystems;
  cockpit: BatmobileCockpit;
  environment: BatmobileEnvironment;
  timestamp?: number;
}

export interface ControlCommand {
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

export interface TacticalUpdate {
  speedLimit?: number;
  alerts?: string[];
}

// refers to the type of connection the client is using
export type ClientType = "mobile" | "tablet" | "web" | "test";

// bat-signal functionality
export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface BatSignalAlert {
  id: string;  // unique id for the broadcast
  severity: "critical";  // bat-signal only fires on critical alerts
  reason: string;  // explanation of critical event
  message: string;  // message appearing on batman's interface
  vehicleId?: string;  // if the alert is tied to a specific vehicle
  location?: { x:number; y:number; } // where the alert is occurring in gotham
  timestamp: string;
}

// crime escalation system
export type CrimeLevel = "none" | "suspicious" | "major" | "citywide";

export type CrimeCategory =
  | "organized-crime"
  | "terror-threat"
  | "armed-activity"
  | "infrastructure-attack"
  | "arkham-riot"
  | "arkham-escape";

export interface CrimeEvent {
  id: string;  // denotes unique id for broadcast 
  level: CrimeLevel; // denotes level of crime committed 
  category: CrimeCategory;  // denotes type of crime
  description: string;  // brief description of crime in progress
  location: { x: number; y: number };  // where the crime is being committed in gotham
  timestamp: string;
}


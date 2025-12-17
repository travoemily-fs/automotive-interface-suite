// import needed dependencies
import { BatmobileState, EnvironmentUpdate } from "../../../shared-types";

// vehicle position on map
export interface VehiclePosition {
  id: string;
  coordinates: [number, number]; // in longitude, latitude format
  bearing: number; // direction in degrees
  speed: number;
  lastUpdate: number;
}

// map configuration for mapbox
export interface MapConfig {
  center: [number, number]; // in longitude, latitude format
  zoom: number;
  bearing: number;
  pitch: number;
  style: string;
}

// traffic control interfaces
export interface SpeedZone {
  id: string;
  center: [number, number]; // in longitude, latitude format
  radius: number; // in meters
  speedLimit: number;
  active: boolean;
}

export interface TrafficAlert {
  id: string;
  type: "construction" | "accident" | "weather" | "emergency";
  coordinates: [number, number]; // [longitude, latitude]
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: number;
  active: boolean;
}

// admin dashboard data
export interface SystemMetrics {
  connectedDevices: {
    mobile: number;
    tablet: number;
    web: number;
    test: number;
  };
  serverUptime: number;
  networkLatency: number;
  messagesPerSecond: number;
  lastUpdate: number;
}

// control panel interfaces
export interface ControlPanelProps {
  onSpeedLimitChange: (limit: number) => void;
  onAlertCreate: (alert: Omit<TrafficAlert, "id" | "timestamp">) => void;
  onEnvironmentUpdate: (update: EnvironmentUpdate) => void;
  currentSpeedLimit: number;
  activeAlerts: TrafficAlert[];
}

// maps component props
export interface MapComponentProps {
  vehicles: VehiclePosition[];
  speedZones: SpeedZone[];
  alerts: TrafficAlert[];
  config: MapConfig;
  onMapClick: (x: number, y: number) => void;
}

// admin dashboard props
export interface AdminDashboardProps {
  metrics: SystemMetrics;
  BatmobileStates: Record<string, BatmobileState>;
  connectionStatus: boolean;
}

export { EnvironmentUpdate };

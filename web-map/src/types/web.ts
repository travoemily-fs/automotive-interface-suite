// import needed dependencies
import { BatmobileEnvironment } from "../../../shared-types";

// vehicle position on map
export interface VehiclePosition {
  id: string;
  coordinates: [number, number];
  bearing: number;
  speed: number;
  lastUpdate: number;
}

// map configuration
export interface MapConfig {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  style: string;
}

// traffic control interfaces
export interface SpeedZone {
  id: string;
  center: [number, number];
  radius: number;
  speedLimit: number;
  active: boolean;
}

export interface TrafficAlert {
  id: string;
  type: "construction" | "accident" | "weather" | "emergency";
  coordinates: [number, number];
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
  onEnvironmentUpdate: (update: BatmobileEnvironment) => void;
  currentSpeedLimit: number;
  activeAlerts: TrafficAlert[];
}

// map component props
export interface MapComponentProps {
  vehicles: VehiclePosition[];
  speedZones: SpeedZone[];
  alerts: TrafficAlert[];
  config: MapConfig;
  onMapClick: (lng: number, lat: number) => void;
}

// admin dashboard props
export interface AdminDashboardProps {
  metrics: SystemMetrics;
  connectionStatus: boolean;
}

export type { BatmobileEnvironment };

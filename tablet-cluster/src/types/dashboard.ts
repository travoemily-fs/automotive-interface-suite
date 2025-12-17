// import needed dependencies
import { BatmobileState } from "./../../../shared-types/index";

// gauge config interfaces
export interface GaugeProps {
  value: number;
  min: number;
  max: number;
  size: number;
  warningThreshold?: number;
  dangerThreshold?: number;
  unit: string;
  label: string;
  color?: string;
}

// speedometer specific props
export interface SpeedometerProps {
  speed: number;
  size?: number;
  maxSpeed?: number;
  speedLimit?: number;
  color?: string;
}

// rpm gauge specific props
export interface RPMGaugeProps {
  rpm: number;
  size?: number;
  maxRpm?: number;
  redLine?: number;
  color?: string;
}

// status indicator props
export interface StatusIndicatorProps {
  active: boolean;
  type: "warning" | "info" | "success" | "danger";
  icon: string;
  label: string;
  blinking?: boolean;
}

// warning system interface
export interface WarningSystemProps {
  warnings: string[];
  system: {
    lights: boolean;
    leftSignal: boolean;
    rightSignal: boolean;
    hazards: boolean;
  };
}

// trip computer interface
export interface TripComputerProps {
  trip: number;
  odometer: number;
  fuel: number;
  battery: number;
}

// main gauges component props
export interface MainGaugesProps {
  speed: number;
  rpm: number;
  accelerating: boolean;
}

// dashboard header props
export interface DashboardHeaderProps {
  connected: boolean;
  lastUpdate: number;
  gear: string;
  speedLimit: number;
}

// status panel props
export interface StatusPanelProps {
  warnings: string[];
  systems: {
    lights: boolean;
    leftSignal: boolean;
    rightSignal: boolean;
    hazards: boolean;
  };
  trip: number;
  odometer: number;
  fuel: number;
  battery: number;
}

// main dashboard state
export interface DashboardState {
  BatmobileState: BatmobileState;
  connected: boolean;
  lastUpdate: number;
}

// importing server types
import { VehicleState, ControlInput, ClientType } from "../../../shared-types";

// steering slider props
export interface SteeringSliderProps {
  onSteer: (value: number) => void; // referring back to the -1 to 1 values of right and left steering
  disabled?: boolean;
}

// gas pedal props
export interface GasPedalProps {
  onThrottle: (value: number) => void; // referring back to 0-1 values of gas acceleration vs none
  disabled?: boolean;
}

// brake button props
export interface BrakeButtonProps {
  onBrake: (type: string, value: number) => void;
  disabled?: boolean;
}

// controls component props
export interface ControlsProps {
  onControl: (type: string, value: string | number| boolean) => void;
  currentGear?: string;
  systems?: {
    lights: boolean;
    leftSignal: boolean;
    rightSignal: boolean;
    hazards: boolean;
  };
}

// custom hook for vehicle connection
export interface VehicleConnection {
  socket: any;
  connected: boolean;
  vehicleState: VehicleState;
  sendControlInput: (type: string, value: string | number | boolean) => void;
}

// application state interface
export interface AppState {
  connected: boolean;
  vehicleState: VehicleState;
  connectionError?: string;
}

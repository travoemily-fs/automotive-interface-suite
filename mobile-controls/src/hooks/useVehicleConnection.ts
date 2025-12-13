// import needed dependencies
import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { VehicleState, ControlInput } from "../../../shared-types";
import { VehicleConnection } from "src/types";

// uses my ip address
const SERVER_URL = "http://10.0.0.52:3001";

export function useVehicleConnection(): VehicleConnection {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    motion: {
      speed: 0,
      direction: 0,
      x: 100,
      y: 100,
      accelerating: false,
    },
    controls: {
      throttle: 0,
      brake: 0,
      steering: 0,
      gear: "P",
    },
    systems: {
      lights: false,
      leftSignal: false,
      rightSignal: false,
      hazards: false,
    },
    cluster: {
      rpm: 0,
      fuel: 85,
      battery: 75,
      warnings: [],
      trip: 0,
      odometer: 45234,
    },
    environment: {
      speedLimit: 55,
      nearbyTraffic: [],
      alerts: [],
    },

    timestamp: Date.now(),
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // init socket connection
    const newSocket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    newSocket.on("connect", () => {
      console.log("connected to vehicle server!");
      setConnected(true);
      // registers as mobile client
      newSocket.emit("register-client", "mobile");
    });

    newSocket.on("disconnect", () => {
      console.log("disconnected from vehicle server!");
      setConnected(false);
    });

    newSocket.on("vehicle-update", (data: VehicleState) => {
      setVehicleState(data);
    });

    newSocket.on("connect_error", (error) => {
      console.log("connection error:", error);
      setConnected(false);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      newSocket.close();
    };
  }, []);

  const sendControlInput = (type: string, value: string | number | boolean) => {
    if (socket && connected) {
      const controlInput: ControlInput = { type: type as any, value };
      socket.emit("control-input", controlInput);
    }
  };

  return {
    socket,
    connected,
    vehicleState,
    sendControlInput,
  };
}

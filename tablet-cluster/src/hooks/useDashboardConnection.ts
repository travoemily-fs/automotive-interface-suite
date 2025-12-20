// import needed dependencies
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { BatmobileState } from "../../../shared-types";
import { DashboardState } from "../types/dashboard";

// uses my ip address
const SERVER_URL = "http://10.0.0.52:3001";

export function useDashboardConnection(): DashboardState & {
  socket: Socket | null;
} {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [batmobileState, setBatmobileState] = useState<BatmobileState>({
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
    cockpit: {
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

  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    console.log("Initializing dashboard connection...");

    const newSocket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Dashboard connected to secure server");
      setConnected(true);

      // registers as tablet client
      newSocket.emit("register-client", "tablet");
    });

    newSocket.on("disconnect", () => {
      console.log("Dashboard disconnected from secure server");
      setConnected(false);
    });

    newSocket.on("vehicle-update", (data: BatmobileState) => {
      setBatmobileState(data);
      setLastUpdate(Date.now());
    });

    newSocket.on("connect_error", (error) => {
      console.log("Dashboard connection error:", error);
      setConnected(false);
    });

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return {
    socket,
    BatmobileState: batmobileState,
    connected,
    lastUpdate,
  };
}

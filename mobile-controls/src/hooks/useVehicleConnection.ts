// import needed dependencies
import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { BatmobileState, ControlCommand } from "../../../shared-types";
import { VehicleConnection } from "src/types";

// uses my ip address
const SERVER_URL = "http://10.0.0.52:3001";

export function useVehicleConnection(): VehicleConnection {
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

  const socketRef = useRef<Socket | null>(null);
  const lastEmitRef = useRef<number>(0);

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

    newSocket.on("vehicle-update", (data: BatmobileState) => {
      setBatmobileState(data);
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

  const sendControlCommand = (
    type: string,
    value: string | number | boolean,
  ) => {
    const now = Date.now();

    if (now - lastEmitRef.current < 50) {
      return;
    }

    lastEmitRef.current = now;

    if (socketRef.current && connected) {
      const command: ControlCommand = { type: type as any, value };
      socketRef.current.emit("control-input", command);
    }
  };

  return {
    socket,
    connected,
    BatmobileState: batmobileState,
    sendControlCommand,
  };
}

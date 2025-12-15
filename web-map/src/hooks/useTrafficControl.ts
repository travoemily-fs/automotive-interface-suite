// import needed dependencies
import { useState, useEffect, useCallback, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { VehicleState, EnvironmentUpdate } from "../../../shared-types";
import {
  VehiclePosition,
  SystemMetrics,
  TrafficAlert,
  SpeedZone,
} from "../types/web";

// uses my ip address
const SERVER_URL = "http://10.0.0.52:3001";

export function useTrafficControl() {
  //  socket moved from useState to useRef
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);

  const [vehicles, setVehicles] = useState<Record<string, VehiclePosition>>({});

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    connectedDevices: { mobile: 0, tablet: 0, web: 0, test: 0 },
    serverUptime: 0,
    networkLatency: 0,
    messagesPerSecond: 0,
    // date.now() removed from render-time initialization
    lastUpdate: 0,
  });

  // removed setSpeedZones since it was never used
  const [speedZones] = useState<SpeedZone[]>([
    {
      id: "zone-1",
      center: [-84.388, 33.749], // atlanta, ga coordinates
      radius: 500, // 500 meters
      speedLimit: 55,
      active: true,
    },
  ]);

  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);
  const latencyStartRef = useRef<number>(0);
  const messageCountRef = useRef<number>(0);
  // date.now() removed from ref initializer
  const lastSecondRef = useRef<number>(0);

  useEffect(() => {
    console.log("Initializing traffic control connection...");

    // ref initialized inside effect instead of during render
    lastSecondRef.current = Date.now();

    const newSocket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    // socket assigned to ref instead of setState
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Traffic control connected to server");
      setConnected(true);
      // registers as web client
      newSocket.emit("register-client", "web");
    });

    newSocket.on("disconnect", () => {
      console.log("Traffic control disconnected from server");
      setConnected(false);
    });

    newSocket.on("vehicle-update", (data: VehicleState) => {
      // update vehicle position tracking
      const vehicleId = "vehicle-1"; // for now, we track one vehicle

      // convert pixel coordinates to real gps coordinates (simulation)
      // in a real system, vehicles would report actual gps coordinates
      const baseLatitude = 33.749; // atlanta, ga
      const baseLongitude = -84.388;

      // define coordinate conversion with proper validation
      const mapWidth = 0.01; // ~1.1km at this latitude
      const mapHeight = 0.01;
      const normalizedX = (data.motion.x - 400) / 800;
      const normalizedY = (data.motion.y - 300) / 600;
      const longitude = baseLongitude + normalizedX * mapWidth;
      const latitude = baseLatitude + normalizedY * mapHeight;

      const now = Date.now();

      const newPosition: VehiclePosition = {
        id: vehicleId,
        coordinates: [longitude, latitude],
        bearing: data.motion.direction,
        speed: data.motion.speed,
        lastUpdate: now,
      };

      setVehicles((prev) => ({
        ...prev,
        [vehicleId]: newPosition,
      }));

      // updates message counter for metrics
      messageCountRef.current++;
      if (now - lastSecondRef.current >= 1000) {
        setSystemMetrics((prev) => ({
          ...prev,
          messagesPerSecond: messageCountRef.current,
          lastUpdate: now,
        }));
        messageCountRef.current = 0;
        lastSecondRef.current = now;
      }
    });

    newSocket.on("connect_error", (error) => {
      console.log("Traffic control connection error:", error);
      setConnected(false);
    });

    // pings for latency measurement
    const latencyInterval = setInterval(() => {
      if (newSocket.connected) {
        latencyStartRef.current = Date.now();
        newSocket.emit("ping");
      }
    }, 5000);

    newSocket.on("pong", () => {
      const latency = Date.now() - latencyStartRef.current;
      setSystemMetrics((prev) => ({
        ...prev,
        networkLatency: latency,
      }));
    });

    return () => {
      clearInterval(latencyInterval);
      newSocket.close();
    };
  }, []);

  const updateEnvironment = useCallback(
    (update: EnvironmentUpdate) => {
      // use socketRef instead of socket state
      if (socketRef.current && connected) {
        socketRef.current.emit("environment-update", update);
      }
    },
    [connected],
  );

  const createAlert = useCallback(
    (alert: Omit<TrafficAlert, "id" | "timestamp">) => {
      const now = Date.now();

      const newAlert: TrafficAlert = {
        ...alert,
        id: `alert-${now}`,
        timestamp: now,
      };

      // functional state update to avoid stale alerts reference
      setAlerts((prev) => {
        const updated = [...prev, newAlert];

        // sends to all connected clients
        updateEnvironment({
          alerts: updated.map((a) => a.message),
        });

        return updated;
      });
    },
    [updateEnvironment],
  );

  const updateSpeedLimit = useCallback(
    (limit: number) => {
      updateEnvironment({ speedLimit: limit });
    },
    [updateEnvironment],
  );

  return {
    connected,
    vehicles: Object.values(vehicles),
    systemMetrics,
    speedZones,
    alerts,
    updateEnvironment,
    createAlert,
    updateSpeedLimit,
  };
}

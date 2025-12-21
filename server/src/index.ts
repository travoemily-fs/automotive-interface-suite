// import dependencies & setup
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  BatmobileState,
  ControlCommand,
  ClientType,
  BatSignalAlert,
  CrimeEvent,
} from "./../../shared-types/index.js";

// express & socket.io setup
const app = express();
const server = createServer(app);

// triggers one time bat-signal alert for demo
let demoBatSignalFired = false;

// enable cors for all domains (development only)
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// random bat-signal events
const DEMO_BAT_SIGNAL_EVENTS: Omit<BatSignalAlert, "id" | "timestamp">[] = [
  {
    severity: "critical",
    reason: "arkham escape",
    message: "mass breakout detected at arkham asylum",
    vehicleId: "batmobile-01",
    location: { x: 420, y: 690 },
  },
  {
    severity: "critical",
    reason: "joker riot",
    message: "citywide riot incited by joker factions",
    vehicleId: "batmobile-01",
    location: { x: 380, y: 610 },
  },
  {
    severity: "critical",
    reason: "scarecrow toxin",
    message: "fear toxin released in downtown sector",
    vehicleId: "batmobile-01",
    location: { x: 510, y: 450 },
  },
  {
    severity: "critical",
    reason: "blackgate break",
    message: "blackgate prison breach confirmed",
    vehicleId: "batmobile-01",
    location: { x: 300, y: 520 },
  },
];

function emitConnectionStats() {
  io.emit("connection-stats", {
    mobile: connectedClients.mobile,
    tablet: connectedClients.tablet,
    web: connectedClients.web,
    test: connectedClients.test,
  });
}

/* 
holds the initial vehicle state object in the following order: 
    1. motion
    2. controls
    3. systems
    4. cockpit
    5. environment
    6. timestamp
*/
let batmobileState: BatmobileState = {
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
};

// tracks connected clients by connection type
interface ConnectedClients {
  [key: string]: number;
}

const connectedClients: ConnectedClients = {
  mobile: 0,
  tablet: 0,
  web: 0,
  test: 0,
};

// extend socket interface to include the clientType
declare module "socket.io" {
  interface Socket {
    clientType?: ClientType;
  }
}

// tracks whether bat-signal is currently active
let batSignalActive = false;

// tracks active crime events in gotham
const activeCrimes: CrimeEvent[] = [];

/*
new clients immediately have synched vehicle state info
register client ➝ identifies client connection type
*/
io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  emitConnectionStats();

  // sends current state to newly establish client connection
  socket.emit("vehicle-update", batmobileState);

  // handles client type registration with connection-type guards
  socket.on("register-client", (clientType: ClientType) => {
    socket.clientType = clientType;
    connectedClients[clientType]++;

    console.log(
      `${clientType} client connected. total: ${connectedClients[clientType]}`,
    );

    emitConnectionStats();

    // sets up demo bat-signal firing timer
    if (clientType === "web" && !demoBatSignalFired) {
      demoBatSignalFired = true;

      setTimeout(() => {
        const baseEvent =
          DEMO_BAT_SIGNAL_EVENTS[
            Math.floor(Math.random() * DEMO_BAT_SIGNAL_EVENTS.length)
          ];

        const demoBatSignal: BatSignalAlert = {
          ...baseEvent,
          id: `bat-signal-demo-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        console.log(`bat-signal fired: ${demoBatSignal.reason}`);
        io.emit("bat-signal", demoBatSignal);
      }, 30_000); // bat-signal delay
    }
  });

  // handles client disconnects
  socket.on("disconnect", () => {
    const type = socket.clientType;

    if (type && connectedClients[type] > 0) {
      connectedClients[type]--;
      emitConnectionStats();
    }
  });

  // resets bat-signal after acknowledge
  socket.on("acknowledge-bat-signal", () => {
    batSignalActive = false;
    console.log("bat-signal acknowledged — system reset");
  });

  // handles control inputs from mobile app with type safety
  socket.on("control-input", (data: ControlCommand) => {
    const { type, value } = data;

    switch (type) {
      case "throttle":
        batmobileState.controls.throttle = Math.max(
          0,
          Math.min(1, value as number),
        );
        break;
      case "brake":
        batmobileState.controls.brake = Math.max(
          0,
          Math.min(1, value as number),
        );
        break;
      case "steering":
        batmobileState.controls.steering = Math.max(
          -1,
          Math.min(1, value as number),
        );
        break;
      case "gear":
        batmobileState.controls.gear = value as "P" | "R" | "N" | "D" | "S";
        break;
      case "lights":
        batmobileState.systems.lights = value as boolean;
        break;
      case "leftSignal":
        batmobileState.systems.leftSignal = value as boolean;
        break;
      case "rightSignal":
        batmobileState.systems.rightSignal = value as boolean;
        break;
      case "hazards":
        batmobileState.systems.hazards = value as boolean;
        break;
    }

    batmobileState.timestamp = Date.now();
    io.emit("vehicle-update", batmobileState);
  });

  // injects a crime event into the system
  socket.on("report-crime", (crime: Omit<CrimeEvent, "id" | "timestamp">) => {
    const newCrime: CrimeEvent = {
      ...crime,
      id: `crime-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    activeCrimes.push(newCrime);

    console.log("crime reported:", newCrime.category, newCrime.level);
  });
});

// starting the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(
    `Batmobile successfully connected to private server: ${PORT}. Welcome, Mr. Wayne.`,
  );
  console.log("Awaiting connections.");
});

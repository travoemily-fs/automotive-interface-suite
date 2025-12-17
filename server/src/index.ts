// import dependencies & setup
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  BatmobileState,
  ControlCommand,
  ClientType,
} from "./../../shared-types/index.js";

// express & socket.io setup
const app = express();
const server = createServer(app);

// enable cors for all domains (development only)
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
    speed: 0, // current speed in miles per hour
    direction: 0, // heading in degrees (0-359°)
    x: 100, // refers to horizontal position coordinate
    y: 100, // refers to vertical position coordinate,
    accelerating: false,
  },

  controls: {
    throttle: 0, // 0-1 from idle to full throttle
    brake: 0, // 0-1 from no brake to full brake
    steering: 0, // -1 to 1 w/ -1 referring to full left & 1 referring to full right
    gear: "P", // possible values: P, R, N, D, S
  },

  systems: {
    lights: false,
    leftSignal: false,
    rightSignal: false,
    hazards: false,
  },

  cockpit: {
    rpm: 0, // revolutions per minute, measures how fast engine's crankshaft spins & the number of times the crankshaft completes a full rotation in one
    fuel: 85, // as a percentage
    battery: 75, // as a percentage for electric vehicles only
    warnings: [], // array of warning strings
    trip: 0, // trip mileage ONLY
    odometer: 45234, // TOTAL mileage
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
  });

  // handles client disconnects
  socket.on("disconnect", () => {
    const type = socket.clientType;

    if (type && connectedClients[type] > 0) {
      connectedClients[type]--;
      emitConnectionStats();
    }
  });

  // handles control inputs from mobile app with type safety
  socket.on("control-input", (data: ControlCommand) => {
    const { type, value } = data;

    // updates vehicle state based on input with type-safe operations
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

    // broadcasts updated state to all clients
    io.emit("vehicle-update", batmobileState);
  });
});

// physics simulation that runs at 20 fps w/ type-safe operations
setInterval(() => {
  updateVehiclePhysics();
  io.emit("vehicle-update", batmobileState);
}, 50);

function updateVehiclePhysics(): void {
  const { controls, motion } = batmobileState;

  // simple acceleration/deceleration model
  if (controls.brake > 0) {
    // brake always overrides throttle
    motion.speed -= Math.sign(motion.speed || 1) * controls.brake * 1.0;
    motion.accelerating = false;
  } else if (controls.throttle > 0) {
    if (controls.gear === "D") {
      motion.speed += controls.throttle * 0.5;
      motion.accelerating = true;
    } else if (controls.gear === "R") {
      motion.speed -= controls.throttle * 0.5;
      motion.accelerating = true;
    }
  } else {
    motion.speed *= 0.98;
    motion.accelerating = false;
  }

  // applying speed limits
  motion.speed = Math.max(-60, Math.min(120, motion.speed));

  // updates rpm based on speed and gear
  if (controls.gear === "D" || controls.gear === "R") {
    batmobileState.cockpit.rpm = Math.min(
      6000,
      motion.speed * 50 + controls.throttle * 1000,
    );
  } else {
    batmobileState.cockpit.rpm *= 0.95; // rpm decay
  }

  // updates position based on speed and steering
  if (motion.speed > 0) {
    motion.direction += controls.steering * motion.speed * 0.1;
    motion.direction = (motion.direction + 360) % 360;

    const radians = (motion.direction * Math.PI) / 180;
    motion.x += Math.cos(radians) * motion.speed * 0.1;
    motion.y += Math.sin(radians) * motion.speed * 0.1;
  }
}

// starting the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚗 Vehicle Server running on port ${PORT}`);
  console.log("Waiting for clients to connect...");
});

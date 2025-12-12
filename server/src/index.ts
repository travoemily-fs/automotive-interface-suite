// import dependencies & setup
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  VehicleState,
  ControlInput,
  EnvironmentUpdate,
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

/* 
holds the initial vehicle state object in the following order: 
    1. motion
    2. controls
    3. systems
    4. cluster
    5. environment
    6. timestamp
*/
let vehicleState: VehicleState = {
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
  cluster: {
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

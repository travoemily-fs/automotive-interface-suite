// import needed dependencies
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { useVehicleConnection } from "src/hooks/useVehicleConnection";
import SteeringSlider from "./src/components/SteeringSlider";
import GasPedal from "./src/components/GasPedal";
import BrakeButton from "./src/components/BrakeButton";
import Controls from "./src/components/Controls";

const { width, height } = Dimensions.get("window");

export default function App() {
  const { connected, BatmobileState, sendControlCommand } =
    useVehicleConnection();

  useEffect(() => {
    // locks screen orientation to landscape
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
        console.log("orientation locked to landscape");
      } catch (error) {
        console.log("failed to lock orientation", error);
      }
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleSteering = (value: number) => {
    sendControlCommand("steering", value);
  };

  const handleThrottle = (value: number) => {
    sendControlCommand("throttle", value);

    const currentGear = BatmobileState.controls?.gear;

    // auto-shift ONLY from park or neutral
    if (value > 0 && (currentGear === "P" || currentGear === "N")) {
      sendControlCommand("gear", "D");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* header bar */}
      <View style={styles.header}>
        <View style={styles.connectionStatus}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: connected ? "#4CAF50" : "#F44336",
              },
            ]}
          />
          <Text style={styles.connectionText}>
            {connected ? "Connected" : "Disconnected"}
          </Text>
        </View>

        <Text style={styles.title}>🚗 Drive Controls</Text>

        <View style={styles.speedDisplay}>
          <Text style={styles.speedText}>
            {Math.round(Math.abs(BatmobileState.motion?.speed || 0))}
          </Text>
          <Text style={styles.speedUnit}>MPH</Text>
        </View>
      </View>

      {/* main control area */}
      <View style={styles.controlArea}>
        {/* left side - steering */}
        <View style={styles.leftControls}>
          <SteeringSlider onSteer={handleSteering} />
        </View>

        {/* center - vehicle info & controls */}
        <View style={styles.centerInfo}>
          <View style={styles.gearDisplay}>
            <Text style={styles.gearLabel}>GEAR</Text>
            <Text style={styles.gearValue}>
              {BatmobileState.controls?.gear || "P"}
            </Text>
          </View>

          <Controls
            onControl={sendControlCommand}
            currentGear={BatmobileState.controls?.gear}
            systems={BatmobileState.systems}
          />
        </View>

        {/* right side - gas & brake */}
        <View style={styles.rightControls}>
          <View style={styles.pedalControls}>
            <GasPedal onThrottle={handleThrottle} />
            <BrakeButton onBrake={sendControlCommand} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 2,
    borderBottomColor: "#444",
  },

  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },

  connectionText: {
    color: "#fff",
    fontSize: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 2,
    textAlign: "center",
  },

  speedDisplay: {
    alignItems: "center",
    flex: 1,
  },

  speedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00FF88",
  },

  speedUnit: {
    fontSize: 10,
    color: "#888",
  },

  controlArea: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  leftControls: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },

  centerInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  gearDisplay: {
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#444",
    minWidth: 80,
  },

  gearLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
  },

  gearValue: {
    color: "#00FF88",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },

  rightControls: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },

  pedalControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

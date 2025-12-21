// import needed dependencies
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MainGaugesProps } from "../types/dashboard";
import Speedometer from "./Speedometer";
import RPMGauge from "./RPMGauge";

const { width } = Dimensions.get("window");

export default function MainGauges({
  speed,
  rpm,
  accelerating,
}: MainGaugesProps) {
  return (
    <View style={styles.wrapper}>
      {/* main gauges row */}
      <View style={styles.container}>
        <Speedometer
          speed={speed}
          size={width > 900 ? 280 : 240}
          maxSpeed={120}
          speedLimit={55}
        />

        <RPMGauge
          rpm={rpm}
          size={width > 900 ? 260 : 220}
          maxRpm={6000}
          redLine={5000}
        />
      </View>

      {/* acceleration indicator (temporary, safe placement) */}
      {accelerating && (
        <View style={styles.accelerationIndicator}>
          <Text style={styles.accelerationText}>ACCELERATING</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: 900,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 30,
  },

  accelerationIndicator: {
    alignSelf: "center",
    marginTop: 8,
    backgroundColor: "#923434",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },

  accelerationText: {
    color: "#c1c3c7",
    fontSize: 12,
    fontWeight: "bold",
  },
});

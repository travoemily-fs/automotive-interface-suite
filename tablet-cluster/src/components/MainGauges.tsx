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
    <View style={styles.container}>
      {/* speedometer - primary gauge */}
      <View style={styles.primaryGauge}>
        <Speedometer
          speed={speed}
          size={width > 600 ? 240 : 200}
          maxSpeed={120}
          speedLimit={55}
        />
      </View>

      {/* rpm gauge - secondary gauge */}
      <View style={styles.secondaryGauge}>
        <RPMGauge
          rpm={rpm}
          size={width > 600 ? 200 : 160}
          maxRpm={6000}
          redLine={5000}
        />
      </View>

      {/* acceleration indicator */}
      {accelerating && (
        <View style={styles.accelerationIndicator}>
          <Text style={styles.accelerationText}>⬆️ ACCEL</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },

  primaryGauge: {
    alignItems: "center",
  },

  secondaryGauge: {
    alignItems: "center",
  },

  accelerationIndicator: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "#00FF88",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },

  accelerationText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
});

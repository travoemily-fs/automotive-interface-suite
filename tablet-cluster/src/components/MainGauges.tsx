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
    <View>
      {/* main gauges row */}
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
      </View>

      {/* acceleration indicator (temporary, safe placement) */}
      {accelerating && (
        <View style={styles.accelerationIndicator}>
          <Text style={styles.accelerationText}>⬆️ BOOST</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },

  primaryGauge: {
    flex: 2,
    alignItems: "center",
  },

  secondaryGauge: {
    flex: 1,
    alignItems: "center",
  },

  accelerationIndicator: {
    alignSelf: "center",
    marginTop: 8,
    backgroundColor: "#00FF88",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  accelerationText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
});

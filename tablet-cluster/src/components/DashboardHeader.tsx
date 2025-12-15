// import needed dependencies
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { DashboardHeaderProps } from "../types/dashboard";

const { width } = Dimensions.get("window");

export default function DashboardHeader({
  connected,
  lastUpdate,
  gear,
  speedLimit,
}: DashboardHeaderProps) {
  const timeSinceUpdate = Date.now() - lastUpdate;
  const isStale = timeSinceUpdate > 5000; // 5 seconds

  return (
    <View style={styles.container}>
      {/* connection status */}
      <View style={styles.statusSection}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: connected && !isStale ? "#4CAF50" : "#F44336",
            },
          ]}
        />
        <Text style={styles.statusText}>
          {connected ? (isStale ? "STALE DATA" : "CONNECTED") : "DISCONNECTED"}
        </Text>
      </View>

      {/* vehicle info */}
      <View style={styles.centerSection}>
        <Text style={styles.vehicleTitle}>AUTOMOTIVE CLUSTER</Text>
        <Text style={styles.vehicleSubtitle}>Digital Instrument Panel</Text>
      </View>

      {/* current gear and speed limit */}
      <View style={styles.infoSection}>
        <View style={styles.gearDisplay}>
          <Text style={styles.gearLabel}>GEAR</Text>
          <Text
            style={[
              styles.gearValue,
              {
                color:
                  gear === "P" ? "#888" : gear === "R" ? "#FF4444" : "#00FF88",
              },
            ]}>
            {gear}
          </Text>
        </View>

        <View style={styles.speedLimitDisplay}>
          <Text style={styles.speedLimitLabel}>LIMIT</Text>
          <Text style={styles.speedLimitValue}>{speedLimit}</Text>
          <Text style={styles.speedLimitUnit}>MPH</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 2,
    borderBottomColor: "#444",
  },

  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  centerSection: {
    alignItems: "center",
    flex: 2,
  },

  vehicleTitle: {
    color: "#00FF88",
    fontSize: 16,
    fontWeight: "bold",
  },

  vehicleSubtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },

  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    gap: 20,
  },

  gearDisplay: {
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#444",
  },

  gearLabel: {
    color: "#666",
    fontSize: 10,
  },

  gearValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },

  speedLimitDisplay: {
    alignItems: "center",
  },

  speedLimitLabel: {
    color: "#666",
    fontSize: 10,
  },

  speedLimitValue: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },

  speedLimitUnit: {
    color: "#888",
    fontSize: 8,
  },
});

// import needed dependencies
import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import StatusIndicator from "./StatusIndicator";
import { WarningSystemProps } from "../types/dashboard";

export default function WarningPanel({ warnings, system }: WarningSystemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SYSTEM STATUS</Text>

      {/* system indicators row */}
      <View style={styles.indicatorRow}>
        <StatusIndicator
          active={system.lights}
          type="info"
          icon="💡"
          label="LIGHTS"
        />

        <StatusIndicator
          active={system.leftSignal}
          type="warning"
          icon="⬅️"
          label="LEFT"
          blinking={system.leftSignal}
        />

        <StatusIndicator
          active={system.rightSignal}
          type="warning"
          icon="➡️"
          label="RIGHT"
          blinking={system.rightSignal}
        />

        <StatusIndicator
          active={system.hazards}
          type="danger"
          icon="⚠️"
          label="HAZARD"
          blinking={system.hazards}
        />
      </View>

      {/* warning messages */}
      {warnings.length > 0 && (
        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>SYSTEM ALERTS</Text>
          <ScrollView
            style={styles.warningList}
            showsVerticalScrollIndicator={false}>
            {warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                ⚠️ {warning}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  title: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  indicatorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  warningSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },

  warningTitle: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },

  warningList: {
    maxHeight: 80,
  },

  warningText: {
    color: "#FF6666",
    fontSize: 11,
    marginBottom: 3,
  },
});

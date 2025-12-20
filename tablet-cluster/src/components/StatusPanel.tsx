// import needed dependencies
import React from "react";
import { View, StyleSheet } from "react-native";
import WarningPanel from "./WarningPanel";
import TripComputer from "./TripComputer";
import { StatusPanelProps } from "../types/dashboard";
import { colors, spacing, radius, elevation } from "../theme/tabletTheme";

export default function StatusPanel({
  fuel,
  battery,
  warnings,
  systems,
  trip,
  odometer,
}: StatusPanelProps) {
  return (
    <View style={styles.container}>
      {/* system status */}
      <View style={styles.panelShell}>
        <WarningPanel warnings={warnings} system={systems} />
      </View>

      {/* mission telemetry */}
      <View style={styles.panelShell}>
        <TripComputer
          fuel={fuel}
          battery={battery}
          trip={trip}
          odometer={odometer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },

  panelShell: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.bgPanelOverlay,
    borderRadius: radius.lg,
    ...elevation.panel,
  },
  telemetryShell: {
    backgroundColor: colors.bgPanel,
  },
});

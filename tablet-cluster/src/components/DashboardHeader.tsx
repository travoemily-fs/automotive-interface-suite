// import needed dependencies
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DashboardHeaderProps } from "../types/dashboard";
import { colors, typography, spacing, radius } from "../theme/tabletTheme";

export default function DashboardHeader({
  connected,
  lastUpdate,
  gear,
  speedLimit,
}: DashboardHeaderProps) {
  const timeSinceUpdate = Date.now() - lastUpdate;
  const isStale = timeSinceUpdate > 5000;

  const statusColor = connected
    ? isStale
      ? colors.textPrimary
      : colors.textPrimary
    : colors.textPrimary;

  return (
    <View style={styles.container}>
      {/* system status */}
      <View style={styles.statusSection}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {connected ? (isStale ? "DATA STALE" : "ONLINE") : "OFFLINE"}
        </Text>
      </View>

      {/* identity */}
      <View style={styles.centerSection}>
        <Text style={styles.brand}>WAYNE INDUSTRIES</Text>
        <Text style={styles.subtitle}>BATMOBILE INTERFACE</Text>
      </View>

      {/* vehicle state */}
      <View style={styles.infoSection}>
        <View style={styles.readout}>
          <Text style={styles.readoutLabel}>GEAR</Text>
          <Text
            style={[
              styles.readoutValue,
              gear === "R" && { color: colors.alertLightRed },
            ]}>
            {gear}
          </Text>
        </View>

        <View style={styles.readout}>
          <Text style={styles.readoutLabel}>LIMIT</Text>
          <Text style={styles.readoutValue}>{speedLimit}</Text>
          <Text style={styles.unit}>MPH</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: "rgba(15, 18, 22, 0.65)",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },

  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingTop: 25,
    gap: spacing.sm,
    color: colors.textPrimary,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontFamily: typography.fontUIBold,
    fontSize: typography.sizes.micro,
    letterSpacing: 0.8,
    color: colors.textPrimary,
    textTransform: "uppercase",
  },

  centerSection: {
    flex: 2,
    alignItems: "center",
  },

  brand: {
    fontFamily: typography.fontHeading,
    fontSize: typography.sizes.display,
    letterSpacing: 1.2,
    paddingTop: 25,
    color: colors.alertLightRed,
  },

  subtitle: {
    marginTop: 2,
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.small,
    letterSpacing: 0.6,
    color: colors.textPrimary,
  },

  infoSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.lg,
  },

  readout: {
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    paddingTop: 15,
  },

  readoutLabel: {
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.micro,
    color: colors.textPrimary,
  },

  readoutValue: {
    fontFamily: typography.fontUIBold,
    fontSize: typography.sizes.display,
    color: colors.alertLightRed,
  },

  unit: {
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.micro,
    color: colors.textPrimary,
  },
});

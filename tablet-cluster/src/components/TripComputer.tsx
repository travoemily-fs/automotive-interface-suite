// import needed dependencies
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TripComputerProps } from "../types/dashboard";
import { colors, typography, spacing, radius } from "../theme/tabletTheme";

export default function TripComputer({
  trip,
  odometer,
  fuel,
  battery,
}: TripComputerProps) {
  // estimated ranges
  const estimatedRange = Math.round((fuel / 100) * 300);
  const batteryRange = Math.round((battery / 100) * 250);

  const formatOdometer = (value: number): string => value.toLocaleString();
  const formatTrip = (value: number): string => value.toFixed(1);

  const getFuelColor = () =>
    fuel < 20 ? colors.titleBlue : colors.alertLightRed;

  const getBatteryColor = () =>
    battery < 20 ? colors.alertLightRed : colors.titleBlue;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>mission telemetry</Text>

      <View style={styles.dataGrid}>
        {/* trip */}
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>trip</Text>
          <Text style={styles.dataValue}>{formatTrip(trip)}</Text>
          <Text style={styles.dataUnit}>mi</Text>
        </View>

        {/* odometer */}
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>odometer</Text>
          <Text style={styles.dataValue}>{formatOdometer(odometer)}</Text>
          <Text style={styles.dataUnit}>mi</Text>
        </View>

        {/* fuel */}
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>fuel</Text>
          <Text style={[styles.dataValue, { color: getFuelColor() }]}>
            {fuel.toFixed(0)}%
          </Text>
          <Text style={styles.dataUnit}>~{estimatedRange} mi</Text>
        </View>

        {/* battery */}
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>battery</Text>
          <Text style={[styles.dataValue, { color: getBatteryColor() }]}>
            {battery.toFixed(0)}%
          </Text>
          <Text style={styles.dataUnit}>~{batteryRange} mi</Text>
        </View>
      </View>

      {/* level bars */}
      <View style={styles.levelBars}>
        <View style={styles.levelBar}>
          <View
            style={[
              styles.levelFill,
              {
                width: `${fuel}%`,
                backgroundColor: getFuelColor(),
              },
            ]}
          />
        </View>

        <View style={styles.levelBar}>
          <View
            style={[
              styles.levelFill,
              {
                width: `${battery}%`,
                backgroundColor: getBatteryColor(),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },

  title: {
    fontFamily: typography.fontHeading,
    fontSize: typography.sizes.display,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
    color: colors.titleBlue,
    opacity: 0.9,
  },

  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  dataItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  dataLabel: {
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.label,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  dataValue: {
    fontFamily: typography.fontUIBold,
    fontSize: typography.sizes.heading,
    color: colors.textPrimary,
  },

  dataUnit: {
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.small,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: spacing.xs,
  },

  levelBars: {
    gap: spacing.sm,
  },

  levelBar: {
    height: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.borderSubtle,
    overflow: "hidden",
  },

  levelFill: {
    height: "100%",
    borderRadius: radius.sm,
  },
});

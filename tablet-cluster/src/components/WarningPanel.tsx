// import needed dependencies
import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import StatusIndicator from "./StatusIndicator";
import { WarningSystemProps } from "../types/dashboard";
import { colors, typography, spacing } from "../theme/tabletTheme";

import LightIcon from "../../assets/icons/light.svg";
import LeftIcon from "../../assets/icons/circle_chev_left.svg";
import RightIcon from "../../assets/icons/circle_chev_right.svg";
import WarningIcon from "../../assets/icons/warning.svg";

export default function WarningPanel({ warnings, system }: WarningSystemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>system status</Text>

      {/* system indicators row */}
      <View style={styles.indicatorRow}>
        <StatusIndicator
          active={system.lights}
          type="info"
          icon={<LightIcon width={22} height={22} stroke={colors.titleBlue} />}
          label="lights"
        />

        <StatusIndicator
          active={system.leftSignal}
          type="warning"
          icon={<LeftIcon width={22} height={22} stroke={colors.titleBlue} />}
          label="left"
          blinking={system.leftSignal}
        />

        <StatusIndicator
          active={system.rightSignal}
          type="warning"
          icon={<RightIcon width={22} height={22} stroke={colors.titleBlue} />}
          label="right"
          blinking={system.rightSignal}
        />

        <StatusIndicator
          active={system.hazards}
          type="danger"
          icon={<WarningIcon width={22} height={22} stroke={colors.alertLightRed} />}
          label="hazard"
          blinking={system.hazards}
        />
      </View>

      {/* warning messages */}
      {warnings.length > 0 && (
        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>system alerts</Text>

          <ScrollView
            style={styles.warningList}
            showsVerticalScrollIndicator={false}>
            {warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                {warning}
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
    flex: 1,
    gap: spacing.md,
  },

  title: {
    fontFamily: typography.fontHeading,
    fontSize: typography.sizes.display,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
    color: colors.titleBlue,
    opacity: 1,
  },

  indicatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    flexWrap: "nowrap",
  },

  warningSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },

  warningTitle: {
    fontFamily: typography.fontUIBold,
    fontSize: typography.sizes.label,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.alertLightRed,
  },

  warningList: {
    maxHeight: 90,
  },

  warningText: {
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.label,
    lineHeight: 15,
    color: colors.textPrimary,
    opacity: 1,
  },
});

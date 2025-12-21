// import needed dependencies
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ControlsProps } from "../types";
import { colors, typography, spacing, radius } from "../theme/mobileTheme";
import Icon from "./Icon";

const GEARS = ["P", "R", "N", "D", "S"] as const;
type Gear = (typeof GEARS)[number];

export default function Controls({
  onControl,
  currentGear = "P",
  systems,
}: ControlsProps) {
  const handleGearChange = (gear: Gear) => {
    onControl("gear", gear);
  };

  const handleSystemToggle = (system: string) => {
    const currentValue = systems?.[system as keyof typeof systems] || false;
    onControl(system, !currentValue);
  };

  return (
    <View style={styles.container}>
      {/* gear selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tactical Gear State</Text>

        <View style={styles.gearSelector}>
          {GEARS.map((gear) => {
            const isActive = currentGear === gear;

            return (
              <Pressable
                key={gear}
                style={[styles.gearButton, isActive && styles.gearButtonActive]}
                onPress={() => handleGearChange(gear)}>
                <Text
                  style={[styles.gearText, isActive && styles.gearTextActive]}>
                  {gear}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.gearDescription}>
          {getGearDescription(currentGear as Gear)}
        </Text>
      </View>

      {/* lighting controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toggle Optics</Text>

        <View style={styles.controlRow}>
          <SystemButton
            label="LIGHTS"
            active={!!systems?.lights}
            onPress={() => handleSystemToggle("lights")}
            icon="light"
          />

          <SystemButton
            label="HAZARD"
            active={!!systems?.hazards}
            onPress={() => handleSystemToggle("hazards")}
            icon="warning"
          />
        </View>

        <View style={styles.controlRow}>
          <SystemButton
            label="LEFT"
            active={!!systems?.leftSignal}
            onPress={() => handleSystemToggle("leftSignal")}
            icon="left"
          />

          <SystemButton
            label="RIGHT"
            active={!!systems?.rightSignal}
            onPress={() => handleSystemToggle("rightSignal")}
            icon="right"
          />
        </View>
      </View>
    </View>
  );
}

function SystemButton({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: "light" | "warning" | "left" | "right";
}) {
  const iconColor = active ? colors.textPrimary : colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.systemButton, active && styles.systemButtonActive]}>
      <View style={styles.systemContent}>
        <Icon name={icon} size={12} color={iconColor} />

        <Text style={[styles.systemText, active && styles.systemTextActive]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function getGearDescription(gear: Gear): string {
  switch (gear) {
    case "P":
      return "VEHICLE IN PARK";
    case "R":
      return "VEHICLE IN REVERSE";
    case "N":
      return "VEHICLE IN NEUTRAL";
    case "D":
      return "VEHICLE IN DRIVE";
    case "S":
      return "VEHICLE IN PERFORMANCE MODE";
    default:
      return "UNKNOWN GEAR";
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    backgroundColor: colors.bgPrimary,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: colors.borderSubtle,
  },

  section: {
    alignItems: "center",
    gap: spacing.sm,
  },

  sectionTitle: {
    color: colors.textPrimary,
    textAlign:"center",
    fontSize: 20,
    paddingTop: 5,
    fontFamily: typography.fontHeading,
    letterSpacing: 1,
  },

  gearSelector: {
    flexDirection: "row",
    backgroundColor: colors.bgPrimary,
    borderRadius: 999,
    padding: spacing.xs,
    gap: spacing.xs,
  },

  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  gearButtonActive: {
    backgroundColor: "#40010d94",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  gearText: {
    color: colors.titleBlue,
    fontSize: 25,
    fontFamily: typography.fontHeading,
    fontWeight: "bold",
  },

  gearTextActive: {
    color: colors.textPrimary,
  },

  gearDescription: {
    color: colors.textPrimary,
    fontSize: typography.sizes.micro,
    textAlign: "center",
    backgroundColor: "#3444595c",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  controlRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  systemButton: {
    minWidth: 110,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#40010d5d",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  systemButtonActive: {
    backgroundColor: colors.alertCritical,
    borderColor: colors.borderSubtle,
  },

  systemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  systemText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.small,
    fontWeight: "bold",
    fontFamily: typography.fontUIBold,
  },

  systemTextActive: {
    color: colors.textPrimary,
  },
});

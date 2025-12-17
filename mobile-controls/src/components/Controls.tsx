// import needed dependencies
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ControlsProps } from "../types";

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
        <Text style={styles.sectionTitle}>GEAR</Text>
        <View style={styles.gearSelector}>
          {GEARS.map((gear) => (
            <Pressable
              key={gear}
              style={[
                styles.gearButton,
                currentGear === gear && styles.gearButtonActive,
              ]}
              onPress={() => handleGearChange(gear)}>
              <Text
                style={[
                  styles.gearText,
                  currentGear === gear && styles.gearTextActive,
                ]}>
                {gear}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* gear descriptions */}
        <Text style={styles.gearDescription}>
          {getGearDescription(currentGear)}
        </Text>
      </View>

      {/* lighting controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LIGHTS</Text>

        <View style={styles.controlRow}>
          <Pressable
            style={[
              styles.systemButton,
              systems?.lights && styles.systemButtonActive,
            ]}
            onPress={() => handleSystemToggle("lights")}>
            <Text
              style={[
                styles.systemText,
                systems?.lights && styles.systemTextActive,
              ]}>
              💡 LIGHTS
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.systemButton,
              systems?.hazards && styles.systemButtonActive,
            ]}
            onPress={() => handleSystemToggle("hazards")}>
            <Text
              style={[
                styles.systemText,
                systems?.hazards && styles.systemTextActive,
              ]}>
              ⚠️ HAZARD
            </Text>
          </Pressable>
        </View>

        <View style={styles.controlRow}>
          <Pressable
            style={[
              styles.systemButton,
              systems?.leftSignal && styles.systemButtonActive,
            ]}
            onPress={() => handleSystemToggle("leftSignal")}>
            <Text
              style={[
                styles.systemText,
                systems?.leftSignal && styles.systemTextActive,
              ]}>
              ⬅️ LEFT
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.systemButton,
              systems?.rightSignal && styles.systemButtonActive,
            ]}
            onPress={() => handleSystemToggle("rightSignal")}>
            <Text
              style={[
                styles.systemText,
                systems?.rightSignal && styles.systemTextActive,
              ]}>
              ➡️ RIGHT
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function getGearDescription(gear: string): string {
  switch (gear) {
    case "P":
      return "Park - Vehicle locked";
    case "R":
      return "Reverse - Backing up";
    case "N":
      return "Neutral - No drive";
    case "D":
      return "Drive - Normal forward";
    case "S":
      return "Sport - Performance mode";
    default:
      return "Unknown gear";
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  section: {
    alignItems: "center",
    gap: 10,
  },

  sectionTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
  },

  gearSelector: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 25,
    padding: 4,
    gap: 2,
  },

  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  gearButtonActive: {
    backgroundColor: "#00FF88",
  },

  gearText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
  },

  gearTextActive: {
    color: "#000",
  },

  gearDescription: {
    color: "#666",
    fontSize: 10,
    textAlign: "center",
  },

  controlRow: {
    flexDirection: "row",
    gap: 10,
  },

  systemButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#444",
  },

  systemButtonActive: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },

  systemText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
  },

  systemTextActive: {
    color: "#000",
  },
});

// import needed dependencies
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Vibration,
  Platform,
} from "react-native";
import { BrakeButtonProps } from "../types";
import { colors, typography, spacing, radius } from "../theme/mobileTheme";

export default function BrakeButton({
  onBrake,
  disabled = false,
}: BrakeButtonProps) {
  const [pressing, setPressing] = useState(false);
  const [brakeValue, setBrakeValue] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const startBraking = () => {
    if (disabled) return;

    setPressing(true);

    // animates button press
    Animated.timing(scaleAnim, {
      toValue: 0.92,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // haptic feedback for ios or vibration for android
    if (Platform.OS === "ios") {
      // ios haptic feedback would go here
    } else {
      Vibration.vibrate(50);
    }

    // gradually increase brake force
    let currentForce = 0;
    pressTimer.current = setInterval(() => {
      currentForce = Math.min(1, currentForce + 0.1); // increases to max 1.0
      setBrakeValue(currentForce);
      onBrake("brake", currentForce);
    }, 50); // updates every 50ms
  };

  const stopBraking = () => {
    setPressing(false);

    // animates button release
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    // clears brake timer
    if (pressTimer.current) {
      clearInterval(pressTimer.current);
      pressTimer.current = null;
    }

    // immediately releases brake
    setBrakeValue(0);
    onBrake("brake", 0);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          style={[
            styles.brakeButton,
            pressing && styles.brakeButtonPressed,
            disabled && styles.brakeButtonDisabled,
          ]}
          onPressIn={startBraking}
          onPressOut={stopBraking}
          disabled={disabled}>
          <Text style={[styles.brakeText, pressing && styles.brakeTextPressed]}>
            BRAKE
          </Text>

          {/* brake force indicator */}
          {pressing && (
            <View style={styles.forceIndicator}>
              <View
                style={[styles.forceBar, { height: `${brakeValue * 100}%` }]}
              />
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  label: {
    color: colors.titleBlue,
    fontSize: 18,
    fontFamily: typography.fontHeading,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  brakeButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#40010d39",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.glowDanger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  brakeButtonPressed: {
    backgroundColor: "#40010d90",
    borderColor: colors.borderSubtle,
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },

  brakeButtonDisabled: {
    backgroundColor: colors.bgPanel,
    borderColor: colors.borderSubtle,
    shadowOpacity: 0,
  },

  brakeText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: typography.fontHeading,
    letterSpacing: 1,
  },

  brakeTextPressed: {
    color: colors.textPrimary,
  },

  forceIndicator: {
    position: "absolute",
    right: -14,
    top: 12,
    width: 4,
    height: 86,
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.sm,
  },

  forceBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: colors.alertCritical,
    borderRadius: radius.sm,
  },
});

// import needed dependencies
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { StatusIndicatorProps } from "../types/dashboard";
import { colors, typography, spacing } from "../theme/tabletTheme";

function StatusIndicator({
  active,
  type,
  icon,
  label,
  blinking = false,
}: StatusIndicatorProps) {
  const ringOpacity = useRef(new Animated.Value(active ? 1 : 0.6)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active && blinking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ringOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.35,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (active) {
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.15,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(ringOpacity, {
        toValue: 0.4,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      ringOpacity.stopAnimation();
      scaleAnimation.stopAnimation();
    };
  }, [active, blinking]);

  const getColorForType = () => {
    switch (type) {
      case "danger":
        return colors.alertLightRed;
      case "warning":
        return `${colors.titleBlue}AA`;
      case "success":
      case "info":
      default:
        return colors.titleBlue;
    }
  };

  const iconColor = getColorForType();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicatorWrap,
          {
            opacity: ringOpacity,
            transform: [{ scale: scaleAnimation }],
          },
        ]}>
        <View style={[styles.indicator, { borderColor: iconColor }]}>
          {React.isValidElement(icon) &&
            React.cloneElement(icon, {
              stroke: iconColor,
              fill: "none",
            } as any)}
        </View>
      </Animated.View>


      <Text style={[styles.label, { color: iconColor }]}>{label}</Text>
    </View>
  );
}

export default React.memo(StatusIndicator);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: spacing.xs,
  },

  indicatorWrap: {
    marginBottom: spacing.sm,
  },

  indicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.textDark,
  },

  label: {
    fontFamily: typography.fontUI,
    fontSize: typography.sizes.label,
    letterSpacing: 0.4,
    textAlign: "center",
    marginTop: spacing.sm,
    textTransform: "uppercase",
  },
});

// import needed dependencies
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { StatusIndicatorProps } from "../types/dashboard";

function StatusIndicator({
  active,
  type,
  icon,
  label,
  blinking = false,
}: StatusIndicatorProps) {
  const opacityAnimation = useRef(new Animated.Value(active ? 1 : 0.3)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active && blinking) {
      // blinking animation for turn signals and hazards
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (active) {
      // solid on for other indicators
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // pulse once when activated
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1.0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // off state
      opacityAnimation.stopAnimation();
      Animated.timing(opacityAnimation, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      opacityAnimation.stopAnimation();
      scaleAnimation.stopAnimation();
    };
  }, [active, blinking]);

  const getColorForType = (type: string): string => {
    switch (type) {
      case "warning":
        return "#FFD700";
      case "danger":
        return "#FF4444";
      case "success":
        return "#00FF88";
      case "info":
      default:
        return "#00AAFF";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}>
      <View style={[styles.indicator, { borderColor: getColorForType(type) }]}>
        <Text style={[styles.icon, { color: getColorForType(type) }]}>
          {icon}
        </Text>
      </View>
      <Text style={[styles.label, { color: getColorForType(type) }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

export default React.memo(StatusIndicator);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 5,
  },

  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },

  icon: {
    fontSize: 18,
  },

  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
});

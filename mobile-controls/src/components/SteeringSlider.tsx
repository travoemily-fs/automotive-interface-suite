// import needed dependencies
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  PanResponderInstance,
  Animated,
} from "react-native";
import Svg, {
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { SteeringSliderProps } from "../types";
import { colors, typography, spacing } from "../theme/mobileTheme";
import Icon from "./Icon";

const SLIDER_WIDTH = 190;
const SLIDER_HEIGHT = 80;
const KNOB_SIZE = 40;

// 🔧 critical fix
const SVG_PADDING = KNOB_SIZE / 2;
const SVG_WIDTH = SLIDER_WIDTH + SVG_PADDING * 2;

export default function SteeringSlider({
  onSteer,
  disabled = false,
}: SteeringSliderProps) {
  const [knobPosition, setKnobPosition] = useState(SLIDER_WIDTH / 2);
  const [isDragging, setIsDragging] = useState(false);

  const animatedPosition = useRef(new Animated.Value(SLIDER_WIDTH / 2)).current;

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,

    onPanResponderGrant: () => {
      setIsDragging(true);
      animationRef.current?.stop();
      animationRef.current = null;
    },

    onPanResponderMove: (evt) => {
      const touchX = evt.nativeEvent.locationX;

      const minX = KNOB_SIZE / 2;
      const maxX = SLIDER_WIDTH - KNOB_SIZE / 2;
      const newPosition = Math.max(minX, Math.min(maxX, touchX));

      setKnobPosition(newPosition);
      animatedPosition.setValue(newPosition);

      const centerX = SLIDER_WIDTH / 2;
      const maxDistance = (SLIDER_WIDTH - KNOB_SIZE) / 2;
      const normalized = (newPosition - centerX) / maxDistance;
      const deadZone = 0.05;

      onSteer(Math.abs(normalized) < deadZone ? 0 : normalized);
    },

    onPanResponderRelease: () => {
      setIsDragging(false);

      const centerX = SLIDER_WIDTH / 2;

      animationRef.current = Animated.timing(animatedPosition, {
        toValue: centerX,
        duration: 450,
        useNativeDriver: false,
      });

      animationRef.current.start(() => {
        setKnobPosition(centerX);
        onSteer(0);
        animationRef.current = null;
      });
    },
  });

  useEffect(() => {
    const listener = animatedPosition.addListener(({ value }) => {
      if (!isDragging) {
        setKnobPosition(value);

        const centerX = SLIDER_WIDTH / 2;
        const maxDistance = (SLIDER_WIDTH - KNOB_SIZE) / 2;
        const normalized = (value - centerX) / maxDistance;
        const deadZone = 0.05;

        onSteer(Math.abs(normalized) < deadZone ? 0 : normalized);
      }
    });

    return () => animatedPosition.removeListener(listener);
  }, [animatedPosition, isDragging, onSteer]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DIRECTIONAL CONTROL</Text>

      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        <Svg width={SVG_WIDTH} height={SLIDER_HEIGHT}>
          <Defs>
            <LinearGradient id="track" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.bgPanel} />
              <Stop offset="100%" stopColor={colors.bgPrimary} />
            </LinearGradient>

            <LinearGradient id="knob" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.alertLightRed} />
              <Stop offset="100%" stopColor={colors.alertDangerAccent} />
            </LinearGradient>
          </Defs>

          {/* track */}
          <Rect
            x={SVG_PADDING + 10}
            y={SLIDER_HEIGHT / 2 - 8}
            width={SLIDER_WIDTH - 20}
            height="16"
            rx="8"
            fill="url(#track)"
            stroke={colors.borderSubtle}
            strokeWidth="1"
          />

          {/* center notch */}
          <Rect
            x={SVG_PADDING + SLIDER_WIDTH / 2 - 1}
            y={SLIDER_HEIGHT / 2 - 12}
            width="2"
            height="24"
            fill={colors.textMuted}
          />

          {/* knob */}
          <Circle
            cx={knobPosition + SVG_PADDING}
            cy={SLIDER_HEIGHT / 2}
            r={isDragging ? KNOB_SIZE / 2 + 2 : KNOB_SIZE / 2}
            fill="url(#knob)"
            stroke={isDragging ? colors.glowDanger : colors.borderSubtle}
            strokeWidth={isDragging ? 3 : 2}
          />

          {/* knob core */}
          <Circle
            cx={knobPosition + SVG_PADDING}
            cy={SLIDER_HEIGHT / 2}
            r={isDragging ? 6 : 4}
            fill={colors.bgPrimary}
          />
        </Svg>

        {/* LEFT / RIGHT ICON OVERLAY */}
        <View style={styles.iconOverlay} pointerEvents="none">
          <Icon name="left" size={16} color={colors.textMuted} />
          <Icon name="right" size={16} color={colors.textMuted} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    overflow: "visible",
  },

  label: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: typography.fontHeading,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  sliderContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
  },

  iconOverlay: {
    position: "absolute",
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});

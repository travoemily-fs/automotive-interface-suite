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

const SLIDER_WIDTH = 200;
const SLIDER_HEIGHT = 60;
const KNOB_SIZE = 50;

export default function SteeringSlider({
  onSteer,
  disabled = false,
}: SteeringSliderProps) {
  const [knobPosition, setKnobPosition] = useState(SLIDER_WIDTH / 2); // start at center
  const [isDragging, setIsDragging] = useState(false);
  const animatedPosition = useRef(new Animated.Value(SLIDER_WIDTH / 2)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,

    onPanResponderGrant: () => {
      setIsDragging(true);
      // stops any ongoing animation
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      // uses absolute touch position instead of relative dx
      const touchX = evt.nativeEvent.locationX;

      // calculates new knob position - follow touch directly!
      const minX = KNOB_SIZE / 2;
      const maxX = SLIDER_WIDTH - KNOB_SIZE / 2;
      const newPosition = Math.max(minX, Math.min(maxX, touchX));

      // updates position immediately - no resistance!
      setKnobPosition(newPosition);
      animatedPosition.setValue(newPosition);

      // converts to steering value (-1 to 1)
      const centerX = SLIDER_WIDTH / 2;
      const maxDistance = (SLIDER_WIDTH - KNOB_SIZE) / 2;
      const normalizedPosition = (newPosition - centerX) / maxDistance;

      // applies dead zone
      const deadZone = 0.05;
      const steeringValue =
        Math.abs(normalizedPosition) < deadZone ? 0 : normalizedPosition;

      onSteer(steeringValue);
    },

    onPanResponderRelease: () => {
      setIsDragging(false);

      // smooth return to center
      const centerX = SLIDER_WIDTH / 2;
      animationRef.current = Animated.timing(animatedPosition, {
        toValue: centerX,
        duration: 500,
        useNativeDriver: false,
      });

      animationRef.current.start(() => {
        setKnobPosition(centerX);
        onSteer(0);
        animationRef.current = null;
      });
    },
  });

  // listens to animation updates and update steering value during animation
  useEffect(() => {
    const listener = animatedPosition.addListener(({ value }) => {
      if (!isDragging) {
        setKnobPosition(value);

        // calculates steering value on animation
        const centerX = SLIDER_WIDTH / 2;
        const maxDistance = (SLIDER_WIDTH - KNOB_SIZE) / 2;
        const normalizedPosition = (value - centerX) / maxDistance;
        const deadZone = 0.05;
        const steeringValue =
          Math.abs(normalizedPosition) < deadZone ? 0 : normalizedPosition;
        onSteer(steeringValue);
      }
    });

    return () => {
      animatedPosition.removeListener(listener);
    };
  }, [animatedPosition, isDragging, onSteer]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DIRECTIONAL CONTROL</Text>

      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        <Svg width={SLIDER_WIDTH} height={SLIDER_HEIGHT} style={styles.svg}>
          <Defs>
            <LinearGradient
              id="trackGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%">
              <Stop offset="0%" stopColor="#2a2a2a" />
              <Stop offset="50%" stopColor="#1a1a1a" />
              <Stop offset="100%" stopColor="#0a0a0a" />
            </LinearGradient>
            <LinearGradient id="knobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFD700" />
              <Stop offset="50%" stopColor="#FFA500" />
              <Stop offset="100%" stopColor="#FF8C00" />
            </LinearGradient>
          </Defs>

          {/* slider track */}
          <Rect
            x="10"
            y={SLIDER_HEIGHT / 2 - 8}
            width={SLIDER_WIDTH - 20}
            height="16"
            rx="8"
            fill="url(#trackGradient)"
            stroke="#444"
            strokeWidth="1"
          />

          {/* center mark */}
          <Rect
            x={SLIDER_WIDTH / 2 - 1}
            y={SLIDER_HEIGHT / 2 - 12}
            width="2"
            height="24"
            fill="#666"
          />

          {/* left indicator */}
          <Circle
            cx="25"
            cy={SLIDER_HEIGHT / 2}
            r="3"
            fill="#FFD700"
            opacity="0.6"
          />

          {/* right indicator */}
          <Circle
            cx={SLIDER_WIDTH - 25}
            cy={SLIDER_HEIGHT / 2}
            r="3"
            fill="#FFD700"
            opacity="0.6"
          />

          {/* main control knob */}
          <Circle
            cx={knobPosition}
            cy={SLIDER_HEIGHT / 2}
            r={isDragging ? KNOB_SIZE / 2 + 2 : KNOB_SIZE / 2}
            fill="url(#knobGradient)"
            stroke={isDragging ? "#FFFF00" : "#FFD700"}
            strokeWidth={isDragging ? "3" : "2"}
          />

          {/* knob center dot */}
          <Circle
            cx={knobPosition}
            cy={SLIDER_HEIGHT / 2}
            r={isDragging ? "6" : "4"}
            fill="#000"
          />
        </Svg>
      </View>

      <Text style={styles.instruction}>⬅️ LEFT RIGHT ➡️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  label: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },

  sliderContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  svg: {
    position: "absolute",
  },

  instruction: {
    color: "#666",
    fontSize: 10,
    marginTop: 10,
    textAlign: "center",
  },
});

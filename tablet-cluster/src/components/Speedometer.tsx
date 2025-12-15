// import needed dependencies
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, {
  Circle,
  Path,
  Line,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
  G,
} from "react-native-svg";
import { SpeedometerProps } from "../types/dashboard";
import {
  calculateGaugePosition,
  generateGaugePath,
  formatSpeed,
} from "../utils/gaugeUtils";

const SPEEDOMETER_SIZE = 200;
const CENTER_X = SPEEDOMETER_SIZE / 2;
const CENTER_Y = SPEEDOMETER_SIZE / 2;
const GAUGE_RADIUS = 80;
const NEEDLE_LENGTH = 70;

// creation of animated svg group
const AnimatedG = Animated.createAnimatedComponent(G);

function Speedometer({
  speed,
  size = SPEEDOMETER_SIZE,
  maxSpeed = 120,
  speedLimit = 55,
  color = "#00FF88",
}: SpeedometerProps) {
  const needleRotation = useRef(new Animated.Value(-120)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // calculates target needle angle
    const gaugeCalc = calculateGaugePosition(
      speed,
      0,
      maxSpeed,
      -120,
      120,
      CENTER_X,
      CENTER_Y,
      NEEDLE_LENGTH,
      speedLimit * 0.9, // warning at 90% of speed limit
      speedLimit // danger at speed limit
    );

    // animates needle to new position
    Animated.timing(needleRotation, {
      toValue: gaugeCalc.angle,
      duration: 300,
      useNativeDriver: false, // svg animations require this to be false
    }).start();

    // pulse effect when over speed limit
    if (speed > speedLimit) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1.0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      needleRotation.stopAnimation();
      scaleValue.stopAnimation();
    };
  }, [speed, speedLimit, maxSpeed]);

  // generates tick marks for speedometer
  const generateTickMarks = () => {
    const ticks = [];
    const tickCount = 13; // 0, 10, 20, ... 120

    for (let i = 0; i <= tickCount; i++) {
      const value = (maxSpeed / tickCount) * i;
      const angle = -120 + (240 / tickCount) * i;
      const radians = (angle * Math.PI) / 180;

      const isMajor = i % 2 === 0; // every OTHER tick is major
      const tickLength = isMajor ? 15 : 8;
      const tickWidth = isMajor ? 2 : 1;

      const startRadius = GAUGE_RADIUS - tickLength;
      const endRadius = GAUGE_RADIUS;

      const x1 = CENTER_X + Math.cos(radians) * startRadius;
      const y1 = CENTER_Y + Math.sin(radians) * startRadius;
      const x2 = CENTER_X + Math.cos(radians) * endRadius;
      const y2 = CENTER_Y + Math.sin(radians) * endRadius;

      ticks.push(
        <Line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={value > speedLimit ? "#FF4444" : "#666"}
          strokeWidth={tickWidth}
        />
      );

      // adds numbers for major ticks
      if (isMajor) {
        const numberRadius = GAUGE_RADIUS - 25;
        const numberX = CENTER_X + Math.cos(radians) * numberRadius;
        const numberY = CENTER_Y + Math.sin(radians) * numberRadius + 5; // offset for text baseline

        ticks.push(
          <SvgText
            key={`number-${i}`}
            x={numberX}
            y={numberY}
            fontSize="12"
            fill={value > speedLimit ? "#FF4444" : "#888"}
            textAnchor="middle">
            {Math.round(value)}
          </SvgText>
        );
      }
    }

    return ticks;
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="gaugeGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1a1a1a" />
            <Stop offset="100%" stopColor="#0a0a0a" />
          </RadialGradient>
          <RadialGradient id="needleGradient" cx="30%" cy="30%">
            <Stop
              offset="0%"
              stopColor={speed > speedLimit ? "#FF6666" : color}
            />
            <Stop
              offset="100%"
              stopColor={speed > speedLimit ? "#FF0000" : "#008844"}
            />
          </RadialGradient>
        </Defs>

        {/* gauge background */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={GAUGE_RADIUS}
          fill="url(#gaugeGradient)"
          stroke="#333"
          strokeWidth="2"
        />

        {/* speed limit arc */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 5,
            -120,
            -120 + (240 * speedLimit) / maxSpeed
          )}
          stroke="#FFD700"
          strokeWidth="4"
          fill="none"
          opacity="0.6"
        />

        {/* danger zone arc */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 5,
            -120 + (240 * speedLimit) / maxSpeed,
            120
          )}
          stroke="#FF4444"
          strokeWidth="4"
          fill="none"
          opacity="0.6"
        />

        {/* tick marks and numbers */}
        {generateTickMarks()}

        {/* needle */}
        <AnimatedG
          originX={CENTER_X}
          originY={CENTER_Y}
          transform={[
            {
              rotate: needleRotation.interpolate({
                inputRange: [-120, 120],
                outputRange: ["-120deg", "120deg"],
              }),
            },
          ]}>
          {/* needle base */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="8"
            fill="url(#needleGradient)"
            stroke="#fff"
            strokeWidth="2"
          />
        </AnimatedG>

        {/* center display */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r="35"
          fill="#000"
          stroke="#333"
          strokeWidth="1"
        />
      </Svg>

      {/* digital speed display */}
      <View style={styles.digitalDisplay}>
        <Text
          style={[
            styles.speedText,
            { color: speed > speedLimit ? "#FF4444" : color },
          ]}>
          {formatSpeed(speed)}
        </Text>
        <Text style={styles.unitText}>MPH</Text>
      </View>

      <Text style={styles.label}>SPEED</Text>
    </Animated.View>
  );
}

export default React.memo(Speedometer);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  digitalDisplay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  speedText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  unitText: {
    fontSize: 10,
    color: "#888",
    marginTop: -5,
  },

  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
    marginTop: 10,
  },
});

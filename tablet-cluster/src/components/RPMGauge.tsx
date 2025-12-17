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
import { RPMGaugeProps } from "../types/dashboard";
import {
  calculateGaugePosition,
  generateGaugePath,
  formatRPM,
} from "../utils/gaugeUtils";

const RPM_GAUGE_SIZE = 180;
const CENTER_X = RPM_GAUGE_SIZE / 2;
const CENTER_Y = RPM_GAUGE_SIZE / 2;
const GAUGE_RADIUS = 70;
const NEEDLE_LENGTH = 60;

// creation of animated svg group
const AnimatedG = Animated.createAnimatedComponent(G);

function RPMGauge({
  rpm,
  size = RPM_GAUGE_SIZE,
  maxRpm = 6000,
  redLine = 5000,
  color = "#00AAFF",
}: RPMGaugeProps) {
  const needleRotation = useRef(new Animated.Value(-120)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const gaugeCalc = calculateGaugePosition(
      rpm,
      0,
      maxRpm,
      -120,
      120,
      CENTER_X,
      CENTER_Y,
      NEEDLE_LENGTH,
      redLine * 0.9, // warning zone
      redLine, // redline zone
    );

    Animated.timing(needleRotation, {
      toValue: gaugeCalc.angle,
      duration: 200, // faster response for RPM
      useNativeDriver: false,
    }).start();

    // redline warning animation
    if (rpm > redLine) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1.0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnimation.stopAnimation();
      Animated.timing(pulseAnimation, {
        toValue: 1.0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      needleRotation.stopAnimation();
      pulseAnimation.stopAnimation();
    };
  }, [rpm, redLine, maxRpm]);

  const generateRPMTicks = () => {
    const ticks = [];
    const tickCount = 6; // 0, 1, 2, 3, 4, 5, 6 (x1000 RPM)

    for (let i = 0; i <= tickCount; i++) {
      const value = (maxRpm / 1000 / tickCount) * i;
      const angle = -120 + (240 / tickCount) * i;
      const radians = (angle * Math.PI) / 180;

      const tickLength = 12;
      const startRadius = GAUGE_RADIUS - tickLength;
      const endRadius = GAUGE_RADIUS;

      const x1 = CENTER_X + Math.cos(radians) * startRadius;
      const y1 = CENTER_Y + Math.sin(radians) * startRadius;
      const x2 = CENTER_X + Math.cos(radians) * endRadius;
      const y2 = CENTER_Y + Math.sin(radians) * endRadius;

      const isRedline = value * 1000 >= redLine;

      ticks.push(
        <Line
          key={`rpm-tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isRedline ? "#FF4444" : "#666"}
          strokeWidth="2"
        />,
      );

      // adds numbers
      const numberRadius = GAUGE_RADIUS - 20;
      const numberX = CENTER_X + Math.cos(radians) * numberRadius;
      const numberY = CENTER_Y + Math.sin(radians) * numberRadius + 4;

      ticks.push(
        <SvgText
          key={`rpm-number-${i}`}
          x={numberX}
          y={numberY}
          fontSize="10"
          fill={isRedline ? "#FF4444" : "#888"}
          textAnchor="middle">
          {/* problematic line fixed by simply multiplying the gauge value by 1000 to simulate a real rpm gauge */}
          {Math.round(value * 1000)}
        </SvgText>,
      );
    }

    return ticks;
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: pulseAnimation }] }]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="rpmGaugeGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1a1a1a" />
            <Stop offset="100%" stopColor="#0a0a0a" />
          </RadialGradient>
          <RadialGradient id="rpmNeedleGradient" cx="30%" cy="30%">
            <Stop offset="0%" stopColor={rpm > redLine ? "#FF6666" : color} />
            <Stop
              offset="100%"
              stopColor={rpm > redLine ? "#FF0000" : "#0066AA"}
            />
          </RadialGradient>
        </Defs>

        {/* gauge background */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={GAUGE_RADIUS}
          fill="url(#rpmGaugeGradient)"
          stroke="#333"
          strokeWidth="2"
        />

        {/* normal operating range */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 3,
            -120,
            -120 + (240 * (redLine * 0.9)) / maxRpm,
          )}
          stroke="#00AA44"
          strokeWidth="6"
          fill="none"
          opacity="0.6"
        />

        {/* warning zone */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 3,
            -120 + (240 * (redLine * 0.9)) / maxRpm,
            -120 + (240 * redLine) / maxRpm,
          )}
          stroke="#FFD700"
          strokeWidth="6"
          fill="none"
          opacity="0.8"
        />

        {/* readline zone */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 3,
            -120 + (240 * redLine) / maxRpm,
            120,
          )}
          stroke="#FF4444"
          strokeWidth="6"
          fill="none"
          opacity="0.9"
        />

        {/* tick marks and numbers */}
        {generateRPMTicks()}

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
          <Line
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={CENTER_X}
            y2={CENTER_Y - NEEDLE_LENGTH}
            stroke="url(#rpmNeedleGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="6"
            fill="url(#rpmNeedleGradient)"
            stroke="#fff"
            strokeWidth="2"
          />
        </AnimatedG>

        {/* center circle */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r="25"
          fill="#000"
          stroke="#333"
          strokeWidth="1"
        />
      </Svg>

      {/* digital rpm display */}
      <View style={styles.digitalDisplay}>
        <Text
          style={[
            styles.rpmText,
            { color: rpm > redLine ? "#FF4444" : color },
          ]}>
          {formatRPM(rpm)}
        </Text>
        <Text style={styles.unitText}>x1000</Text>
      </View>

      <Text style={styles.label}>ENGINE RPM</Text>
    </Animated.View>
  );
}

export default React.memo(RPMGauge);

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

  rpmText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  unitText: {
    fontSize: 8,
    color: "#888",
    marginTop: -3,
  },

  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
    marginTop: 10,
  },
});

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
} from "react-native-svg";
import { SpeedometerProps } from "../types/dashboard";
import { generateGaugePath, formatSpeed } from "../utils/gaugeUtils";
import { colors, typography } from "../theme/tabletTheme";

const SPEEDOMETER_SIZE = 280;
const CENTER_X = SPEEDOMETER_SIZE / 2;
const CENTER_Y = SPEEDOMETER_SIZE / 2;
const GAUGE_RADIUS = 120;

function Speedometer({
  speed,
  size = SPEEDOMETER_SIZE,
  maxSpeed = 120,
  speedLimit = 55,
}: SpeedometerProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const displaySpeed = Math.abs(speed);

  useEffect(() => {
    if (displaySpeed > speedLimit) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.04,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      scaleValue.stopAnimation();
    };
  }, [displaySpeed, speedLimit]);

  // generates tick marks for speedometer
  const generateTickMarks = () => {
    const ticks = [];
    const tickCount = 12;

    for (let i = 0; i <= tickCount; i++) {
      const value = (maxSpeed / tickCount) * i;
      const angle = -120 + (240 / tickCount) * i;
      const radians = (angle * Math.PI) / 180;

      const isMajor = i % 2 === 0;
      const tickLength = isMajor ? 16 : 8;
      const tickOpacity = isMajor ? 0.9 : 0.4;

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
          stroke={value >= speedLimit ? colors.alertLightRed : colors.titleBlue}
          strokeWidth={isMajor ? 2 : 1}
          opacity={tickOpacity}
        />,
      );

      if (isMajor) {
        const numberRadius = GAUGE_RADIUS - 36;
        const numberX = CENTER_X + Math.cos(radians) * numberRadius;
        const numberY = CENTER_Y + Math.sin(radians) * numberRadius + 4;

        ticks.push(
          <SvgText
            key={`number-${i}`}
            x={numberX}
            y={numberY}
            fontSize="12"
            fill={value >= speedLimit ? colors.alertLightRed : colors.textMuted}
            textAnchor="middle"
            fontFamily={typography.fontUI}>
            {Math.round(value)}
          </SvgText>,
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
            <Stop offset="0%" stopColor={colors.bgPanelOverlay} />
            <Stop offset="100%" stopColor={colors.bgPrimary} />
          </RadialGradient>
        </Defs>

        {/* gauge background */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={GAUGE_RADIUS}
          fill="url(#gaugeGradient)"
          stroke={colors.borderSubtle}
          strokeWidth="2"
        />

        {/* speed limit arc */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 8,
            -120,
            -120 + (240 * speedLimit) / maxSpeed,
          )}
          stroke={colors.titleBlue}
          strokeWidth="5"
          fill="none"
          opacity="0.45"
        />

        {/* danger zone arc */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 8,
            -120 + (240 * speedLimit) / maxSpeed,
            120,
          )}
          stroke={colors.alertLightRed}
          strokeWidth="5"
          fill="none"
          opacity="0.85"
        />

        {/* tick marks and numbers */}
        {generateTickMarks()}

        {/* center display */}
        <Circle cx={CENTER_X} cy={CENTER_Y} r="52" fill={colors.bgPrimary} />
      </Svg>

      {/* digital speed display */}
      <View style={styles.digitalDisplay}>
        <Text style={styles.speedText}>{formatSpeed(displaySpeed)}</Text>
        <Text style={styles.unitText}>MPH</Text>
      </View>

      <Text style={styles.label}>VELOCITY</Text>
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
    width: 104,
    height: 104,
    marginLeft: 0,
    marginTop: -10,
    alignItems: "center",
    justifyContent: "center",
  },

  speedText: {
    fontFamily: typography.fontHeading,
    fontSize: 32,
    color: colors.titleBlue,
    textAlign: "center",
  },

  unitText: {
    fontFamily: typography.fontUI,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -2,
  },

  label: {
    fontFamily: typography.fontHeading,
    fontSize: 22,
    letterSpacing: 2,
    color: colors.titleBlue,
    marginTop: 28,
  },
});

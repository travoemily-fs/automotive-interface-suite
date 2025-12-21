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
import { RPMGaugeProps } from "../types/dashboard";
import { generateGaugePath, formatRPM } from "../utils/gaugeUtils";
import { colors, typography } from "../theme/tabletTheme";

const RPM_GAUGE_SIZE = 280;
const CENTER_X = RPM_GAUGE_SIZE / 2;
const CENTER_Y = RPM_GAUGE_SIZE / 2;
const GAUGE_RADIUS = 120;

function RPMGauge({
  rpm,
  size = RPM_GAUGE_SIZE,
  maxRpm = 6000,
  redLine = 5000,
}: RPMGaugeProps) {
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const displayRPM = Math.max(0, rpm);

  useEffect(() => {
    if (displayRPM >= redLine) {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.04,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      pulseAnimation.stopAnimation();
    };
  }, [displayRPM, redLine]);

  const generateRPMTicks = () => {
    const ticks = [];
    const tickCount = 6;

    for (let i = 0; i <= tickCount; i++) {
      const value = (maxRpm / tickCount) * i;
      const angle = -120 + (240 / tickCount) * i;
      const radians = (angle * Math.PI) / 180;

      const tickLength = 16;

      const startRadius = GAUGE_RADIUS - tickLength;
      const endRadius = GAUGE_RADIUS;

      const x1 = CENTER_X + Math.cos(radians) * startRadius;
      const y1 = CENTER_Y + Math.sin(radians) * startRadius;
      const x2 = CENTER_X + Math.cos(radians) * endRadius;
      const y2 = CENTER_Y + Math.sin(radians) * endRadius;

      const isRedline = value >= redLine;

      ticks.push(
        <Line
          key={`rpm-tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isRedline ? colors.alertLightRed : colors.titleBlue}
          strokeWidth="2"
          opacity={isRedline ? 0.9 : 0.6}
        />,
      );

      const numberRadius = GAUGE_RADIUS - 36;
      const numberX = CENTER_X + Math.cos(radians) * numberRadius;
      const numberY = CENTER_Y + Math.sin(radians) * numberRadius + 4;

      ticks.push(
        <SvgText
          key={`rpm-number-${i}`}
          x={numberX}
          y={numberY}
          fontSize="12"
          fill={isRedline ? colors.alertLightRed : colors.textMuted}
          textAnchor="middle"
          fontFamily={typography.fontUI}>
          {Math.round(value / 1000)}
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
            <Stop offset="0%" stopColor={colors.bgPanelOverlay} />
            <Stop offset="100%" stopColor={colors.bgPrimary} />
          </RadialGradient>
        </Defs>

        {/* gauge background */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={GAUGE_RADIUS}
          fill="url(#rpmGaugeGradient)"
          stroke={colors.borderSubtle}
          strokeWidth="2"
        />

        {/* normal operating range */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 8,
            -120,
            -120 + (240 * redLine) / maxRpm,
          )}
          stroke={colors.titleBlue}
          strokeWidth="5"
          fill="none"
          opacity="0.45"
        />

        {/* redline zone */}
        <Path
          d={generateGaugePath(
            CENTER_X,
            CENTER_Y,
            GAUGE_RADIUS - 8,
            -120 + (240 * redLine) / maxRpm,
            120,
          )}
          stroke={colors.alertLightRed}
          strokeWidth="5"
          fill="none"
          opacity="0.85"
        />

        {/* tick marks and numbers */}
        {generateRPMTicks()}

        {/* center display */}
        <Circle cx={CENTER_X} cy={CENTER_Y} r="52" fill={colors.bgPrimary} />
      </Svg>

      {/* digital rpm display */}
      <View style={styles.digitalDisplay}>
        <Text
          style={[
            styles.rpmText,
            {
              color:
                displayRPM >= redLine ? colors.alertLightRed : colors.titleBlue,
            },
          ]}>
          {formatRPM(displayRPM)}
        </Text>
        <Text style={styles.unitText}>RPM</Text>
      </View>

      <Text style={styles.label}>ENGINE</Text>
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
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },

  rpmText: {
    fontFamily: typography.fontHeading,
    fontSize: 32,
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

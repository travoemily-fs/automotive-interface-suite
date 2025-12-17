// import needed dependencies
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, PanResponderInstance, Animated } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GasPedalProps } from '../types';

const PEDAL_HEIGHT = 200;
const PEDAL_WIDTH = 60;
const KNOB_SIZE = 40;

export default function GasPedal({ onThrottle, disabled = false }: GasPedalProps) {
  const [knobPosition, setKnobPosition] = useState(PEDAL_HEIGHT - KNOB_SIZE / 2); // starts at bottom (0%)
  const [isDragging, setIsDragging] = useState(false);
  const animatedPosition = useRef(new Animated.Value(PEDAL_HEIGHT - KNOB_SIZE / 2)).current;
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
      // uses absolute touch position instead of relative dy
      const touchY = evt.nativeEvent.locationY;
      
      // calculates new knob position - follow touch directly!
      const minY = KNOB_SIZE / 2;
      const maxY = PEDAL_HEIGHT - KNOB_SIZE / 2;
      const newPosition = Math.max(minY, Math.min(maxY, touchY));
      
      // updates position immediately - no resistance!
      setKnobPosition(newPosition);
      animatedPosition.setValue(newPosition);
      
      // converts to throttle value (0 to 1, inverted because bottom = 0, top = 1)
      const normalizedPosition = 1 - ((newPosition - minY) / (maxY - minY));
      
      // applies dead zone
      const deadZone = 0.05;
      const throttleValue = normalizedPosition < deadZone ? 0 : normalizedPosition;
      
      onThrottle(throttleValue);
    },
    
    onPanResponderRelease: () => {
      setIsDragging(false);
      
      // smooth return to bottom (idle position)
      const bottomY = PEDAL_HEIGHT - KNOB_SIZE / 2;
      animationRef.current = Animated.timing(animatedPosition, {
        toValue: bottomY,
        duration: 500,
        useNativeDriver: false,
      });
      
      animationRef.current.start(() => {
        setKnobPosition(bottomY);
        onThrottle(0);
        animationRef.current = null;
      });
    },
  });

  // listens to animation updates and update throttle value during animation
  useEffect(() => {
    const listener = animatedPosition.addListener(({ value }) => {
      if (!isDragging) {
        setKnobPosition(value);
        
        // calculates throttle value during animation
        const minY = KNOB_SIZE / 2;
        const maxY = PEDAL_HEIGHT - KNOB_SIZE / 2;
        const normalizedPosition = 1 - ((value - minY) / (maxY - minY));
        const deadZone = 0.05;
        const throttleValue = normalizedPosition < deadZone ? 0 : normalizedPosition;
        onThrottle(throttleValue);
      }
    });
    return () => {
      animatedPosition.removeListener(listener);
    };
  }, [animatedPosition, isDragging, onThrottle]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>THROTTLE</Text>
      
      <View style={styles.pedalContainer} {...panResponder.panHandlers}>
        <Svg width={PEDAL_WIDTH} height={PEDAL_HEIGHT} style={styles.svg}>
          <Defs>
            <LinearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#2a2a2a" />
              <Stop offset="50%" stopColor="#1a1a1a" />
              <Stop offset="100%" stopColor="#0a0a0a" />
            </LinearGradient>
            <LinearGradient id="knobGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#00FF88" />
              <Stop offset="50%" stopColor="#00CC66" />
              <Stop offset="100%" stopColor="#008844" />
            </LinearGradient>
          </Defs>
          
          {/* pedal track */}
          <Rect
            x={PEDAL_WIDTH / 2 - 8}
            y="10"
            width="16"
            height={PEDAL_HEIGHT - 20}
            rx="8"
            fill="url(#trackGradient)"
            stroke="#444"
            strokeWidth="1"
          />
          
          {/* percentage markers */}
          <Rect x={PEDAL_WIDTH / 2 - 12} y="15" width="8" height="1" fill="#666" />
          <Rect x={PEDAL_WIDTH / 2 - 12} y={PEDAL_HEIGHT / 4} width="8" height="1" fill="#666" />
          <Rect x={PEDAL_WIDTH / 2 - 12} y={PEDAL_HEIGHT / 2} width="8" height="1" fill="#666" />
          <Rect x={PEDAL_WIDTH / 2 - 12} y={3 * PEDAL_HEIGHT / 4} width="8" height="1" fill="#666" />
          
          {/* main control knob */}
          <Circle
            cx={PEDAL_WIDTH / 2}
            cy={knobPosition}
            r={isDragging ? KNOB_SIZE / 2 + 2 : KNOB_SIZE / 2}
            fill="url(#knobGradient)"
            stroke={isDragging ? "#00FFAA" : "#00FF88"}
            strokeWidth={isDragging ? "3" : "2"}
          />
          
          {/* knob center dot */}
          <Circle
            cx={PEDAL_WIDTH / 2}
            cy={knobPosition}
            r={isDragging ? "6" : "4"}
            fill="#fff"
          />
        </Svg>
      </View>
      
      <Text style={styles.instruction}>INCREASE THRUST</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  pedalContainer: {
    width: PEDAL_WIDTH,
    height: PEDAL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  svg: {
    position: 'absolute',
  },

  instruction: {
    color: '#666',
    fontSize: 10,
    marginTop: 10,
    textAlign: 'center',
  },
});
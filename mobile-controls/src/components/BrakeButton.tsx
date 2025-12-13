// import needed dependencies
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Animated,
  Vibration,
  Platform 
} from 'react-native';
import { BrakeButtonProps } from '../types';

export default function BrakeButton({ onBrake, disabled = false }: BrakeButtonProps) {
  const [pressing, setPressing] = useState(false);
  const [brakeValue, setBrakeValue] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const startBraking = () => {
    if (disabled) return;
    
    setPressing(true);
    
    // animates button press
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
    
    // haptic feedback for ios or vibration for android
    if (Platform.OS === 'ios') {
      // ios haptic feedback would go here
    } else {
      Vibration.vibrate(50);
    }
    
    // gradually increase brake force
    let currentForce = 0;
    pressTimer.current = setInterval(() => {
      currentForce = Math.min(1, currentForce + 0.1);  // increases to max 1.0
      setBrakeValue(currentForce);
      onBrake('brake', currentForce);
    }, 50);  // updates every 50ms
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
    onBrake('brake', 0);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>BRAKE</Text>
      
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          style={[
            styles.brakeButton,
            pressing && styles.brakeButtonPressed,
            disabled && styles.brakeButtonDisabled
          ]}
          onPressIn={startBraking}
          onPressOut={stopBraking}
          disabled={disabled}
        >
          <Text style={[styles.brakeText, pressing && styles.brakeTextPressed]}>
            BRAKE
          </Text>
          
          {/* brake force indicator */}
          {pressing && (
            <View style={styles.forceIndicator}>
              <View 
                style={[
                  styles.forceBar, 
                  { height: `${brakeValue * 100}%` }
                ]} 
              />
            </View>
          )}
        </Pressable>
      </Animated.View>
      
      <Text style={styles.instruction}>
        Hold to brake
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  brakeButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    borderWidth: 3,
    borderColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  brakeButtonPressed: {
    backgroundColor: '#FF4444',
    borderColor: '#FF6666',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },

  brakeButtonDisabled: {
    backgroundColor: '#222',
    borderColor: '#444',
    shadowOpacity: 0,
  },

  brakeText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },

  brakeTextPressed: {
    color: '#fff',
  },

  forceIndicator: {
    position: 'absolute',
    right: -15,
    top: 10,
    width: 4,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 2,
  },

  forceBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FF4444',
    borderRadius: 2,
  },

  instruction: {
    color: '#666',
    fontSize: 10,
    marginTop: 10,
  },
});
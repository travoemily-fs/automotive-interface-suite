// import needed dependencies
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TripComputerProps } from "../types/dashboard";

export default function TripComputer({
  trip,
  odometer,
  fuel,
  battery,
}: TripComputerProps) {
  // calculates estimated range based on fuel/battery
  const estimatedRange = Math.round((fuel / 100) * 300); // assuming 300 mile range
  const batteryRange = Math.round((battery / 100) * 250); // assuming 250 mile electric range

  // formats large numbers with commas
  const formatOdometer = (value: number): string => {
    return value.toLocaleString();
  };

  const formatTrip = (value: number): string => {
    return value.toFixed(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRIP COMPUTER</Text>

      <View style={styles.dataGrid}>
        {/* top row */}
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>TRIP</Text>
          <Text style={styles.dataValue}>{formatTrip(trip)}</Text>
          <Text style={styles.dataUnit}>mi</Text>
        </View>

        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>ODOMETER</Text>
          <Text style={styles.dataValue}>{formatOdometer(odometer)}</Text>
          <Text style={styles.dataUnit}>mi</Text>
        </View>

        {/* bottom row */}
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>FUEL</Text>
          <Text
            style={[
              styles.dataValue,
              { color: fuel < 20 ? "#FF4444" : "#00FF88" },
            ]}>
            {fuel.toFixed(0)}%
          </Text>
          <Text style={styles.dataUnit}>~{estimatedRange}mi</Text>
        </View>

        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>BATTERY</Text>
          <Text
            style={[
              styles.dataValue,
              { color: battery < 20 ? "#FF4444" : "#00AAFF" },
            ]}>
            {battery.toFixed(0)}%
          </Text>
          <Text style={styles.dataUnit}>~{batteryRange}mi</Text>
        </View>
      </View>

      {/* fuel/battery level bars */}
      <View style={styles.levelBars}>
        <View style={styles.levelBar}>
          <View style={styles.levelBarBackground} />
          <View
            style={[
              styles.levelBarFill,
              {
                width: `${fuel}%`,
                backgroundColor:
                  fuel < 20 ? "#FF4444" : fuel < 50 ? "#FFD700" : "#00FF88",
              },
            ]}
          />
        </View>

        <View style={styles.levelBar}>
          <View style={styles.levelBarBackground} />
          <View
            style={[
              styles.levelBarFill,
              {
                width: `${battery}%`,
                backgroundColor:
                  battery < 20
                    ? "#FF4444"
                    : battery < 50
                    ? "#FFD700"
                    : "#00AAFF",
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  title: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  dataItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 15,
  },

  dataLabel: {
    color: "#666",
    fontSize: 10,
    marginBottom: 3,
  },

  dataValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  dataUnit: {
    color: "#888",
    fontSize: 9,
    marginTop: 2,
  },

  levelBars: {
    gap: 8,
  },

  levelBar: {
    height: 6,
    position: "relative",
    borderRadius: 3,
    overflow: "hidden",
  },

  levelBarBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
  },

  levelBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});

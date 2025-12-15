// import needed dependencies
import React from "react";
import {
  StyleSheet,
  View,
  StatusBar as RNStatusBar,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDashboardConnection } from "./src/hooks/useDashboardConnection";
import DashboardHeader from "./src/components/DashboardHeader";
import MainGauges from "./src/components/MainGauges";
import StatusPanel from "./src/components/StatusPanel";

const { width, height } = Dimensions.get("window");

export default function App() {
  const { vehicleState, connected, lastUpdate } = useDashboardConnection();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RNStatusBar hidden />

      {/* dashboard header with connection status */}
      <DashboardHeader
        connected={connected}
        lastUpdate={lastUpdate}
        gear={vehicleState.controls.gear}
        speedLimit={vehicleState.environment.speedLimit}
      />

      {/* main gauge cluster */}
      <MainGauges
        speed={vehicleState.motion.speed}
        rpm={vehicleState.cluster.rpm}
        accelerating={vehicleState.motion.accelerating}
      />

      {/* status indicators & trip computer */}
      <StatusPanel
        fuel={vehicleState.cluster.fuel}
        battery={vehicleState.cluster.battery}
        warnings={vehicleState.cluster.warnings}
        systems={vehicleState.systems}
        trip={vehicleState.cluster.trip}
        odometer={vehicleState.cluster.odometer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
  },
});

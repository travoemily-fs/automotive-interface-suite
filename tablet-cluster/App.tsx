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
  const { BatmobileState, connected, lastUpdate } = useDashboardConnection();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RNStatusBar hidden />

      {/* dashboard header with connection status */}
      <DashboardHeader
        connected={connected}
        lastUpdate={lastUpdate}
        gear={BatmobileState.controls.gear}
        speedLimit={BatmobileState.environment.speedLimit}
      />

      {/* main gauge  */}
      <MainGauges
        speed={BatmobileState.motion.speed}
        rpm={BatmobileState.cockpit.rpm}
        accelerating={BatmobileState.motion.accelerating}
      />

      {/* status indicators & trip computer */}
      <StatusPanel
        fuel={BatmobileState.cockpit.fuel}
        battery={BatmobileState.cockpit.battery}
        warnings={BatmobileState.cockpit.warnings}
        systems={BatmobileState.systems}
        trip={BatmobileState.cockpit.trip}
        odometer={BatmobileState.cockpit.odometer}
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

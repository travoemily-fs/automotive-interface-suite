// import needed dependencies
import React from "react";
import { StyleSheet, View, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { useDashboardConnection } from "./src/hooks/useDashboardConnection";
import DashboardHeader from "./src/components/DashboardHeader";
import MainGauges from "./src/components/MainGauges";
import StatusPanel from "./src/components/StatusPanel";

export default function App() {
  const [fontsLoaded] = useFonts({
    NexaLight: require("./assets/fonts/Nexa-ExtraLight.ttf"),
    NexaHeavy: require("./assets/fonts/Nexa-Heavy.ttf"),
    Tsing: require("./assets/fonts/Tsing.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <TabletApp />;
}

function TabletApp() {
  const { BatmobileState, connected, lastUpdate } = useDashboardConnection();

return (
  <View style={styles.container}>
    <StatusBar style="light" />
    <RNStatusBar hidden />

    {/* Header */}
    <View style={styles.headerZone}>
      <DashboardHeader
        connected={connected}
        lastUpdate={lastUpdate}
        gear={BatmobileState.controls.gear}
        speedLimit={BatmobileState.environment.speedLimit}
      />
    </View>

    {/* Main gauges – free space */}
    <View style={styles.gaugeZone}>
      <MainGauges
        speed={BatmobileState.motion.speed}
        rpm={BatmobileState.cockpit.rpm}
        accelerating={BatmobileState.motion.accelerating}
      />
    </View>

    {/* Bottom-anchored systems */}
    <View style={styles.bottomPanel}>
      <StatusPanel
        fuel={BatmobileState.cockpit.fuel}
        battery={BatmobileState.cockpit.battery}
        warnings={BatmobileState.cockpit.warnings}
        systems={BatmobileState.systems}
        trip={BatmobileState.cockpit.trip}
        odometer={BatmobileState.cockpit.odometer}
      />
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0305",
  },

  headerZone: {
    height: 80,
    justifyContent: "center",
  },

  gaugeZone: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  bottomPanel: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(13, 3, 5, 1)",
    overflow: "visible",
    minHeight: 190,
  },
});

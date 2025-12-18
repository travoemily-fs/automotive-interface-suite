// import needed dependencies
import React from "react";
import "./App.css";
import { useTrafficControl } from "./hooks/useTrafficControl";
import VehicleMap from "./components/VehicleMap";
import ControlPanel from "./components/ControlPanel";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const {
    connected,
    vehicles,
    systemMetrics,
    speedZones,
    alerts,
    updateEnvironment,
    createAlert,
    updateSpeedLimit,
    batSignal,
  } = useTrafficControl();

  const handleMapClick = (lng: number, lat: number) => {
    console.log(`Map clicked at: (${lng.toFixed(4)}, ${lat.toFixed(4)})`);
    // could add functionality to create alerts at clicked location
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Traffic Control Center</h1>
        <div className="header-info">
          <span>Real-time Vehicle Monitoring & Management System</span>
        </div>
      </header>

      <main className="app-main">
        <div className="main-grid">
          {/* vehicle tracking map */}
          <div className="map-section">
            <VehicleMap
              vehicles={vehicles}
              speedZones={speedZones}
              alerts={alerts}
              onMapClick={handleMapClick}
            />
          </div>

          {/* control panel */}
          <div className="control-section">
            <ControlPanel
              onSpeedLimitChange={updateSpeedLimit}
              onAlertCreate={createAlert}
              onEnvironmentUpdate={updateEnvironment}
              currentSpeedLimit={55}
              activeAlerts={alerts}
            />
          </div>
        </div>

        {/* admin dashboard */}
        <div className="admin-section">
          <AdminDashboard
            metrics={systemMetrics}
            connectionStatus={connected}
            batSignal={batSignal}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <span>
            Automotive Interface Suite • Lesson 4: Web Traffic Control Center
          </span>
          <span>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</span>
        </div>
      </footer>
    </div>
  );
}
export default App;

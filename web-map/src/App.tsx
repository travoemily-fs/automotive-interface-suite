// import needed dependencies
import React from "react";
import "./App.css";
import { useTrafficControl } from "./hooks/useTrafficControl";
import VehicleMap from "./components/VehicleMap";
import ControlPanel from "./components/ControlPanel";
import AdminDashboard from "./components/AdminDashboard";
import BatSignalOverlay from "./components/BatSignalOverlay";
import { CiBarcode } from "react-icons/ci";
import BatLogo from "./assets/batlogo.svg";
import { BatSignalAlert } from "../../shared-types";

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
    clearBatSignal,
  } = useTrafficControl();

  const [showBatSignal, setShowBatSignal] = React.useState(true);

  React.useEffect(() => {
    if (batSignal) {
      setShowBatSignal(true);
    }
  }, [batSignal]);

  const handleMapClick = (lng: number, lat: number) => {
    console.log(`Map clicked at: (${lng.toFixed(4)}, ${lat.toFixed(4)})`);
    // could add functionality to create alerts at clicked location
  };

  const handleBatSignalAcknowledge = (signal: BatSignalAlert) => {
    createAlert({
      type: "emergency",
      coordinates: [-74.006, 40.7128],
      message: signal.message,
      severity: signal.severity === "critical" ? "high" : signal.severity,
      active: true,
    });

    setShowBatSignal(false);
    clearBatSignal();
  };

  return (
    <div className="App">
      {batSignal && showBatSignal && (
        <BatSignalOverlay
          alert={batSignal}
          onAcknowledge={handleBatSignalAcknowledge}
        />
      )}

      <header className="app-header">
        <img src={BatLogo} alt="Batman Logo" className="bat-logo" />
        <h1>WAYNE TECHNOLOGIES</h1>
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
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <span>
            <CiBarcode className="barcode" /> PROPERTY OF WAYNE ENTERPRISES
          </span>

          <span>
            <b className="systemBold">system status:</b>{" "}
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;

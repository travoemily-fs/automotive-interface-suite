// import needed dependencies
import React from "react";
import "./AdminDashboard.css";
import { SystemMetrics } from "@/types/web";
import { CiWifiOn, CiClock1, CiSatellite1, CiDatabase } from "react-icons/ci";

interface AdminDashboardProps {
  metrics: SystemMetrics;
  connectionStatus: boolean;
}

export default function AdminDashboard({
  metrics,
  connectionStatus,
}: AdminDashboardProps) {
  const formatUptime = (uptime: number): string => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTotalConnections = (): number => {
    return Object.values(metrics.connectedDevices).reduce(
      (sum, count) => sum + count,
      0,
    );
  };

  const getLatencyStatus = (): { color: string; status: string } => {
    if (metrics.networkLatency < 50)
      return {
        color: "var(--color-title-blue)",
        status: "Excellent",
      };
    if (metrics.networkLatency < 100)
      return {
        color: "var(--color-accent-light-red)",
        status: "Good",
      };
    if (metrics.networkLatency < 200)
      return {
        color: "var(--color-text-accent)",
        status: "Fair",
      };
    return {
      color: "var(--color-alert-critical)",
      status: "Poor",
    };
  };

  const latencyStatus = getLatencyStatus();

  return (
    <>
      <div className="admin-dashboard">
        <h3>System Administration</h3>

        {/* system status overview */}
        <div className="status-grid">
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">
                <CiWifiOn className="connectedIcon" />
              </span>
              <span className="status-title">Connection</span>
            </div>
            <div
              className={`status-value ${
                connectionStatus ? "connected" : "disconnected"
              }`}>
              {connectionStatus ? "ONLINE" : "OFFLINE"}
            </div>
          </div>

          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">
                <CiClock1 className="uptimeIcon" />
              </span>
              <span className="status-title">Uptime</span>
            </div>

            <div className="status-value">
              {formatUptime(metrics.serverUptime)}
            </div>
          </div>

          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">
                <CiSatellite1 className="latencyIcon" />
              </span>
              <span className="status-title">Latency</span>
            </div>

            <div
              className="status-value"
              style={{ color: latencyStatus.color }}>
              {metrics.networkLatency}ms
            </div>
          </div>

          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">
                <CiDatabase className="messagesIcon" />
              </span>
              <span className="status-title">Throughput</span>
            </div>
            <div className="status-value">{metrics.messagesPerSecond}</div>
          </div>
        </div>

        {/* connected devices */}
        <div className="devices-section">
          <h4>Connected Devices ({getTotalConnections()})</h4>
          <div className="devices-grid">
            <div className="device-card mobile">
              <div className="device-info">
                <div className="device-type">Mobile Controls</div>
                <div className="device-count">
                  {metrics.connectedDevices.mobile}
                </div>
              </div>

              <div className="device-status">
                <div
                  className={`status-dot ${
                    metrics.connectedDevices.mobile > 0 ? "active" : "inactive"
                  }`}></div>
              </div>
            </div>

            <div className="device-card tablet">
              <div className="device-info">
                <div className="device-type">Tablet Clusters</div>
                <div className="device-count">
                  {metrics.connectedDevices.tablet}
                </div>
              </div>

              <div className="device-status">
                <div
                  className={`status-dot ${
                    metrics.connectedDevices.tablet > 0 ? "active" : "inactive"
                  }`}></div>
              </div>
            </div>

            <div className="device-card web">
              <div className="device-info">
                <div className="device-type">Web Interfaces</div>
                <div className="device-count">
                  {metrics.connectedDevices.web}
                </div>
              </div>

              <div className="device-status">
                <div
                  className={`status-dot ${
                    metrics.connectedDevices.web > 0 ? "active" : "inactive"
                  }`}></div>
              </div>
            </div>

            <div className="device-card test">
              <div className="device-info">
                <div className="device-type">Test Clients</div>
                <div className="device-count">
                  {metrics.connectedDevices.test}
                </div>
              </div>
              <div className="device-status">
                <div
                  className={`status-dot ${
                    metrics.connectedDevices.test > 0 ? "active" : "inactive"
                  }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* performance metrics */}
        <div className="metrics-section">
          <h4>Performance Metrics</h4>
          <div className="metrics-charts">
            <div className="metric-item">
              <div className="metric-label">Network Health:</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, 100 - metrics.networkLatency / 2),
                    )}%`,
                    backgroundColor: latencyStatus.color,
                  }}></div>
              </div>

              <div className="metric-value">
                {100 - Math.min(100, Math.floor(metrics.networkLatency / 2))}%
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-label">Message Rate:</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      (metrics.messagesPerSecond / 50) * 100,
                    )}%`,
                    backgroundColor:
                      metrics.messagesPerSecond > 30
                        ? "var(--color-alert-critical)"
                        : metrics.messagesPerSecond > 15
                          ? "var(--color-accent-light-red)"
                          : "var(--color-title-blue)",
                  }}></div>
              </div>

              <div className="metric-value">
                {metrics.messagesPerSecond}/50 max
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-label">System Load:</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${Math.min(100, getTotalConnections() * 10)}%`,
                    backgroundColor:
                      getTotalConnections() > 8
                        ? "var(--color-alert-critical)"
                        : getTotalConnections() > 4
                          ? "var(--color-accent-light-red)"
                          : "var(--color-title-blue)",
                  }}></div>
              </div>

              <div className="metric-value">
                {getTotalConnections()}/10 clients
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

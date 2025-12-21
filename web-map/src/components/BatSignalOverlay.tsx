// import needed dependencies
import React from "react";
import "./BatSignalOverlay.css";
import { BatSignalAlert } from "../../../shared-types";
import { CiGps, CiSquareAlert, CiWarning } from "react-icons/ci";
import BatLogo from "../assets/batlogo2.svg";

interface BatSignalOverlayProps {
  alert: BatSignalAlert;
  onAcknowledge: (alert: BatSignalAlert) => void;
}

export default function BatSignalOverlay({
  alert,
  onAcknowledge,
}: BatSignalOverlayProps) {
  const handleAcknowledge = () => {
    onAcknowledge(alert);
  };

  return (
    <div className="bat-signal-overlay" onClick={handleAcknowledge}>
      <div className="bat-signal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="bat-signal-header">
          <img src={BatLogo} alt="Bat Signal" className="bat-signal-logo" />
          <span>BAT-SIGNAL ACTIVATED</span>
        </div>

        <div className="bat-signal-body">
          <div>
            <strong>
              <CiGps className="threatIcon" />
              Threat:
            </strong>
            <div className="details">{alert.reason}</div>
          </div>

          <div>
            <strong>
              <CiSquareAlert className="descIcon" />
              Message:
            </strong>
            <div className="details">{alert.message}</div>
          </div>

          <div>
            <strong>
              <CiWarning className="severityIcon" />
              Severity:
            </strong>
            <div className="details">{alert.severity.toUpperCase()}</div>
          </div>
        </div>

        <button className="bat-signal-dismiss" onClick={handleAcknowledge}>
          Acknowledge
        </button>
      </div>
    </div>
  );
}

// import needed dependencies
import React from "react";
import "./BatSignalOverlay.css";
import { BatSignalAlert } from "../../../shared-types";

interface BatSignalOverlayProps {
  alert: BatSignalAlert;
  onDismiss: () => void;
}

export default function BatSignalOverlay({
  alert,
  onDismiss,
}: BatSignalOverlayProps) {
  return (
    <div className="bat-signal-overlay" onClick={onDismiss}>
      <div className="bat-signal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bat-signal-header">BAT-SIGNAL ACTIVATED</div>

        <div className="bat-signal-body">
          <div>
            <strong>Threat:</strong> {alert.reason}
          </div>
          <div>
            <strong>Message:</strong> {alert.message}
          </div>
          <div>
            <strong>Severity:</strong> {alert.severity.toUpperCase()}
          </div>
        </div>

        <button className="bat-signal-dismiss" onClick={onDismiss}>
          Acknowledge
        </button>
      </div>
    </div>
  );
}

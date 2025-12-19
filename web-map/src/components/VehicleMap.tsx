// import needed dependencies
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./VehicleMap.css";
import { VehiclePosition, SpeedZone, TrafficAlert } from "../types/web";
import {
  CiLocationOn,
  CiWarning,
  CiRoute,
  CiCloud,
  CiSquareAlert,
  CiLocationArrow1,
} from "react-icons/ci";

// set mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface VehicleMapProps {
  vehicles: VehiclePosition[];
  speedZones: SpeedZone[];
  alerts: TrafficAlert[];
  onMapClick: (lng: number, lat: number) => void;
}

export default function VehicleMap({
  vehicles,
  speedZones,
  alerts,
  onMapClick,
}: VehicleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const alertMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const onMapClickRef = useRef(onMapClick);

  const [mapLoaded, setMapLoaded] = useState(false);

  // update the click handler ref when the prop changes
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  const centerOnVehicles = () => {
    if (!map.current || vehicles.length === 0) return;

    if (vehicles.length === 1) {
      map.current.flyTo({
        center: vehicles[0].coordinates,
        zoom: 15,
        duration: 1000,
      });
    } else {
      const bounds = new mapboxgl.LngLatBounds();
      vehicles.forEach((vehicle) => bounds.extend(vehicle.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  // initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    const initTimeout = setTimeout(() => {
      if (!mapContainer.current || map.current) return;

      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [-74.006, 40.7128],
          zoom: 12,
          bearing: 0,
          pitch: 0,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

        map.current.on("click", (e) => {
          onMapClickRef.current(e.lngLat.lng, e.lngLat.lat);
        });

        map.current.on("load", () => {
          setMapLoaded(true);

          map.current!.setPaintProperty(
            "road-primary",
            "line-color",
            "#7389a5",
          );
          map.current!.setPaintProperty(
            "road-secondary-tertiary",
            "line-color",
            "#923434",
          );
          map.current!.setPaintProperty("road-street", "line-color", "#666");
        });
      } catch (error) {
        console.error("Error setting up map:", error);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // updates vehicles
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const features = vehicles.map((vehicle) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: vehicle.coordinates,
      },
      properties: {
        id: vehicle.id,
        speed: vehicle.speed,
      },
    }));

    const source = map.current.getSource("vehicles") as mapboxgl.GeoJSONSource;

    if (source) {
      source.setData({
        type: "FeatureCollection",
        features,
      });
    }
  }, [vehicles, mapLoaded]);

  // updates speed zones
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const features = speedZones
      .filter((zone) => zone.active)
      .map((zone) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: zone.center,
        },
        properties: {
          speedLimit: zone.speedLimit,
          radius: zone.radius,
        },
      }));

    const source = map.current.getSource(
      "speed-zones",
    ) as mapboxgl.GeoJSONSource;

    if (source) {
      source.setData({
        type: "FeatureCollection",
        features,
      });
    }
  }, [speedZones, mapLoaded]);

  // updates traffic alerts
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    alertMarkers.current.forEach((marker) => marker.remove());
    alertMarkers.current.clear();

    alerts
      .filter((alert) => alert.active)
      .forEach((alert) => {
        const el = document.createElement("div");
        el.className = `alert-marker severity-${alert.severity} type-${alert.type}`;

        el.innerHTML = `<span class="alert-icon"></span>`;

        const marker = new mapboxgl.Marker(el)
          .setLngLat(alert.coordinates)
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="alert-popup severity-${alert.severity}">
            <h4>${alert.type.toUpperCase()}</h4>
            <p>${alert.message}</p>
            <p>${new Date(alert.timestamp).toLocaleTimeString()}</p>
          </div>
        `);

        marker.setPopup(popup);
        alertMarkers.current.set(alert.id, marker);
      });
  }, [alerts, mapLoaded]);

  return (
    <div className="vehicle-map-container">
      <div className="map-header">
        <h3>Urban Traffic Surveillance</h3>

        <div className="map-controls">
          <div className="map-stats">
            <span>
              <CiLocationOn className="vehiclesIcon" /> <b>Vehicles:</b>{" "}
               {vehicles.length}
            </span>
            <span>
              <CiWarning className="alertsIcon" /> <b>Alerts:</b>{" "}
              {alerts.filter((a) => a.active).length}
            </span>
            <span>
              <CiRoute className="zonesIcon" /> <b>Zones:</b>{" "}
              {speedZones.filter((z) => z.active).length}
            </span>
          </div>

          <button
            className="locate-vehicles-btn"
            onClick={centerOnVehicles}
            disabled={vehicles.length === 0}>
            <CiLocationArrow1 className="locateIcon" /> Locate Vehicles
          </button>
        </div>
      </div>

      <div className="map-wrapper">
        <div ref={mapContainer} className="map-container" />

        <div className="map-overlays">
          <div className="map-legend">
            <h4>Traffic Status</h4>

            <div className="legend-item">
              <div className="legend-color speed-normal"></div>
              <span>Normal</span>
            </div>

            <div className="legend-item">
              <div className="legend-color speed-moderate"></div>
              <span>Moderate</span>
            </div>

            <div className="legend-item">
              <div className="legend-color speed-high"></div>
              <span>Critical</span>
            </div>

            <hr />

            <h4>Alert Types</h4>

            <div className="legend-item">
              <CiWarning /> Construction
            </div>

            <div className="legend-item">
              <CiRoute /> Accident
            </div>

            <div className="legend-item">
              <CiCloud /> Weather
            </div>

            <div className="legend-item">
              <CiSquareAlert /> Emergency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { gatewayIcon, sensorIcon } from "./Icon";
import sensorPlaceholder from "../assets/sensor.png";
import gatewayPlaceholder from "../assets/gateway.png";
import { MarkerData } from '../types';
import "./Map.css";
import { divIcon, point } from "leaflet";

interface MapProps {
  markers: MarkerData[];
}

const createClusterCustomIcon = (cluster: any) => divIcon({
  html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
  className: "custom-marker-cluster",
  iconSize: point(35, 35, true)
});

const Map: React.FC<MapProps> = ({ markers }) => (
  <MapContainer className="map-container" center={[50.84045, 4.34878]} zoom={13}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of Humanitarian OpenStreetMap Team (HOT)'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />
    <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.geocode}
          icon={marker.type === "GATEWAY" ? gatewayIcon : sensorIcon}
        >
          <Popup>
            <div className="popup-content">
              <img
                src={marker.type === "GATEWAY" ? gatewayPlaceholder : sensorPlaceholder}
                alt={marker.type}
              />
              <div className="device-name">{marker.device_name}</div>
              <div className="info-grid">
                <div className="info-label">Statut</div>
                <div className="info-value">
                  <span
                    className={`status-indicator ${marker.status === 1 ? 'active' : 'inactive'}`}
                  />
                  {marker.status === 1 ? 'actif' : 'inactif'}
                </div>
                <div className="info-label">ID</div>
                <div className="info-value info-id">{marker.gateway_id}</div>
                <div className="info-label">Type</div>
                <div className="info-value">{marker.type}</div>
                <div className="info-label">Lieu</div>
                <div className="info-value">{marker.place}</div>
                <div className="info-label">Application</div>
                <div className="info-value">{marker.application_name}</div>
                <div className="info-label">Référence</div>
                <div className="info-value">{marker.device_reference}</div>
                <div className="info-label">Latitude</div>
                <div className="info-value">{marker.geocode[0]}</div>
                <div className="info-label">Longitude</div>
                <div className="info-value">{marker.geocode[1]}</div>
                {marker.device_eui && (
                  <>
                    <div className="info-label">Device EUI</div>
                    <div className="info-value">{marker.device_eui}</div>
                  </>
                )}
              </div>
              <div className="description">
                <span className="description-title">Description</span><br />
                {marker.description}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  </MapContainer>
);

export default Map;

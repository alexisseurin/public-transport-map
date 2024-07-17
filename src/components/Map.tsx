import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { trainIcon, stopIcon } from "./Icon";
import stopPlaceholder from "../assets/stop.svg";
import trainPlaceholder from "../assets/train.svg";
import informationPlaceholder from "../assets/information.svg"
import { StopData, RouteData, TrainData } from '../types';
import "./Map.css";
import './LinesDisplay.css';
import { divIcon, point, LatLngExpression } from "leaflet";

interface MapProps {
  stops: StopData[];
  routes: RouteData[];
  trains: TrainData[];
}

const createClusterCustomIcon = (cluster: any) => divIcon({
  html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
  className: "custom-marker-cluster",
  iconSize: point(35, 35, true)
});

const findStopById = (stops: StopData[], stopId: string) => {
  return stops.find(stop => stop.stop_id === stopId);
};

const findRouteById = (routes: RouteData[], routeShortName: string) => {
  return routes.find(route => route.route_short_name === routeShortName);
};

const interpolatePosition = (start: [number, number], end: [number, number], fraction: number): LatLngExpression => {
  const lat = start[0] + (end[0] - start[0]) * fraction;
  const lon = start[1] + (end[1] - start[1]) * fraction;
  return [lat, lon];
};

const Map: React.FC<MapProps> = ({ stops, routes, trains }) => {
  //console.log('Stops in Map component:', stops);
  //console.log('Routes in Map component:', routes);
  //console.log('Trains in Map component:', trains);
  
  const tramRoutes = routes
  //.filter(route => route.route_type == "Subway" && "Tram")
  .flatMap((route, index) => {
    return route.shape.geometry.coordinates.map((coords, i) => {
      const segmentCoordinates = coords.map(
        (coord: [number, number]) => [coord[1], coord[0]] as LatLngExpression
      );

      //console.log(`Route ${route.route_id} segment ${i} coordinates:`, segmentCoordinates);

      return (
        <Polyline
          key={`${index}-${i}`}
          positions={segmentCoordinates}
          color={`#${route.route_color}`}
          weight={5}
          opacity={0.7}
          lineJoin="round"
          lineCap="round"
        />
      );
    });
  });


  //const filteredStops = stops.filter(stop => stop.stop_id.length <= 5);

  const calculateTrainPositions = () => {
    return trains.flatMap(train => {
      const route = findRouteById(routes, train.lineid);
      if (!route) {
        console.error(`Route not found for train lineid: ${train.lineid}`);
        return [];
      }

      let vehiclePositions;
      try {
        vehiclePositions = JSON.parse(train.vehiclepositions);
      } catch (error) {
        console.error(`Error parsing vehicle positions for train lineid: ${train.lineid}`, error);
        return [];
      }

      if (!Array.isArray(vehiclePositions)) {
        console.error(`Vehicle positions are not an array for train lineid: ${train.lineid}`, vehiclePositions);
        return [];
      }

      return vehiclePositions.map(position => {
        const nextStop = findStopById(stops, position.pointId);
        if (!nextStop) {
          console.error(`Next stop not found for pointId: ${position.pointId}`);
          return null;
        }

        const startStop = findStopById(stops, position.directionId);
        if (!startStop) {
          console.error(`Start stop not found for directionId: ${position.directionId}`);
          return null;
        }

        const totalDistance = Math.sqrt(
          Math.pow(nextStop.stop_coordinates.lat - startStop.stop_coordinates.lat, 2) +
          Math.pow(nextStop.stop_coordinates.lon - startStop.stop_coordinates.lon, 2)
        );

        if (totalDistance === 0) {
          console.error(`Total distance is zero for train: ${train.lineid}, pointId: ${position.pointId}`);
          return null;
        }

        const fraction = position.distanceFromPoint / totalDistance;
        const trainPosition = interpolatePosition(
          [startStop.stop_coordinates.lat, startStop.stop_coordinates.lon],
          [nextStop.stop_coordinates.lat, nextStop.stop_coordinates.lon],
          fraction
        );

        return (
          <Marker
            key={`${train.lineid}-${position.pointId}`}
            position={trainPosition}
            icon={trainIcon}
            zIndexOffset={1000} // Ensure trains are rendered above other markers
          >
            <Popup>
              <div className="popup-content">
                <img
                  src={trainPlaceholder}
                  alt="Train"
                />
                <div className="device-name">Train</div>
                <div className="lines-section">
                    <h4>Line</h4>
                    <div className="list-lines">
                      <div className="list-lines__item">
                      <div className={`line line--big line-${train.lineid}`}>
                      {train.lineid}
                    </div>
                        </div>
                    </div>
                  </div>
                <div className="info-grid">
                  <div className="info-label">Direction ID</div>
                  <div className="info-value">{position.directionId}</div>
                  <div className="info-label">Point ID</div>
                  <div className="info-value">{position.pointId}</div>
                  <div className="info-label">Distance from Point</div>
                  <div className="info-value">{position.distanceFromPoint}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      }).filter(Boolean);
    });
  };

  const trainMarkers = calculateTrainPositions();

  return (
    <MapContainer className="map-container" center={[50.84045, 4.34878]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
      <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
        {stops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.stop_coordinates.lat, stop.stop_coordinates.lon]}
            icon={stopIcon}
          >
            <Popup>
              <div className="popup-content">
                <img
                  src={stopPlaceholder}
                  alt="Stop"
                />
                
                <div className="device-name">
                  {stop.stop_name.fr}
                  <div className="device-name italic">
                    {stop.stop_name.fr === stop.stop_name.nl ? null : stop.stop_name.nl}
                  </div>
                </div>

                <div className="lines-section">
                    <h4>Line</h4>
                    <div className="list-lines">
                      <div className="list-lines__item">
                      <div className={`line line--big line-${stop.lineid}`}>
                      {stop.lineid}
                    </div>
                        </div>
                    </div>
                  </div>
                
                <div className="info-grid">

                  
                  <div className="info-label">Order</div>
                  <div className="info-value">{stop.order}</div>
                  <div className="info-label">Type</div>
                  <div className="info-value">{stop.location_type}</div>
                  <div className="info-label">ID</div>
                  <div className="info-value">{stop.stop_id}</div>
                  <div className="info-label">Longitude</div>
                  <div className="info-value">{stop.stop_coordinates.lon}</div>
                  <div className="info-label">Latitude</div>
                  <div className="info-value">{stop.stop_coordinates.lat}</div>
                  <div className="info-label">Parent Station</div>
                  <div className="info-value">{stop.parent_station}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {tramRoutes}
      </MarkerClusterGroup>
      {trainMarkers}

      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control-info leaflet-control">
          <button id="infoButton" title="Map Information">
            <img src={informationPlaceholder} alt="Information"/>
          </button>
          <div id="infoTooltip" className="leaflet-info-tooltip">
            <a href="https://leafletjs.com" title="A JavaScript library for interactive maps">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" className="leaflet-attribution-flag">
                <path fill="#4C7BE1" d="M0 0h12v4H0z"></path>
                <path fill="#FFD500" d="M0 4h12v3H0z"></path>
                <path fill="#E0BC00" d="M0 7h12v1H0z"></path>
              </svg> Leaflet
            </a>
            <span aria-hidden="true">|</span> © 
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of Humanitarian OpenStreetMap Team (HOT)
          </div>
        </div>
      </div>

    </MapContainer>
  );
};

export default Map;

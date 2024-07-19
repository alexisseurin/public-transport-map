import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { trainIcon, stopIcon, tramIcon, busIcon, subwayIcon } from "./Icon";
import stopPlaceholder from "../assets/stop.svg";
import trainPlaceholder from "../assets/train.svg";
import subwayPlaceholder from "../assets/subway.svg";
import tramPlaceholder from "../assets/tram.svg";
import busPlaceholder from "../assets/bus.svg";
import informationPlaceholder from "../assets/information.svg"
import { StopData, RouteData, TrainData } from '../types';
import "./Map.css";
import './LinesDisplay.css';
import { divIcon, point, LatLngExpression, LatLngLiteral, LatLngTuple } from "leaflet";
import L from "leaflet";

interface MapProps {
  stops: StopData[];
  routes: RouteData[];
  trains: TrainData[];
}

const getPlaceholder = (routeType: string) => {
  switch (routeType) {
    case 'Subway':
      return subwayPlaceholder;
    case 'Tram':
      return tramPlaceholder;
    case 'Bus':
      return busPlaceholder;
    default:
      return trainPlaceholder;
  }
};

const getIcon = (routeType: string) => {
  switch (routeType) {
    case 'Subway':
      return subwayIcon;
    case 'Tram':
      return tramIcon;
    case 'Bus':
      return busIcon;
    default:
      return trainIcon;
  }
};

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
  
  const tramRoutes = routes.flatMap((route, index) => {
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

      const icon = getIcon(route.route_type);
      const placeholder = getPlaceholder(route.route_type);

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
        const trainPosition: number[] | LatLngLiteral | LatLngTuple = [
          startStop.stop_coordinates.lat,
          startStop.stop_coordinates.lon,
          nextStop.stop_coordinates.lat,
          nextStop.stop_coordinates.lon,
          fraction
        ];

        const createCustomIcon = (route_type: string) => {
          const imageSrc = getPlaceholder(route_type);

          return L.divIcon({
            html: `
              <div class="custom-icon-wrapper">
                <img src="${imageSrc}" class="custom-icon-img" />
                <div class="custom-icon-label">
                  <div class="line--big line-${train.lineid.startsWith('T') || train.lineid.startsWith('M') ? train.lineid.slice(1) : train.lineid}">
                    ${train.lineid.startsWith('T') || train.lineid.startsWith('M') ? train.lineid.slice(1) : train.lineid}
                  </div>
              </div>`,
          });
        };

        
        return (
          <>
          <Marker
            key={`${train.lineid}-${position.pointId}`}
            position={[trainPosition[0], trainPosition[1]]}
            icon={createCustomIcon(route.route_type)}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="popup-content">
                <img
                  src={placeholder}
                  alt={route.route_type}
                />
                
                <div className="device-name">{route.route_type}</div>
                {train.lineid && (
                    <>
                <div className="lines-section">
                  <div className="list-columns">
                      <div className="titles">
                        <h4>Line</h4>
                      </div>
                      <div className="list-columns__item">
                        <div className="rows">
                        <div className={`line-column line--big line-${train.lineid.startsWith('T') || train.lineid.startsWith('M') ? train.lineid.slice(1) : train.lineid}`}>
                        {train.lineid.startsWith('T') || train.lineid.startsWith('M') ? train.lineid.slice(1) : train.lineid}
                        </div>
                        </div>
                      </div>
                  </div>
                </div>
                </>
                )}
               
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
          </>
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

                {stop.stop_id && (
                <>
                  {stop.ordersAndLineIds.some((line: any) => line.lineid || line.order) && (
                    <div className="lines-section">
                      <div className="list-columns">
                        <div className="titles">
                          {stop.ordersAndLineIds.some((line: any) => line.lineid) && <h4>Line</h4>}
                          {stop.ordersAndLineIds.some((line: any) => line.order) && <h4>Order</h4>}
                        </div>
                        {stop.ordersAndLineIds.map((line: any, index: any) => (
                          (line.lineid || line.order) && (
                            <div key={index} className="list-columns__item">
                              <div className="rows">
                                {line.lineid && (
                                  <div className={`line-column line--big line-${line.lineid.startsWith('T') || line.lineid.startsWith('M') ? line.lineid.slice(1) : line.lineid}`}>
                                    {line.lineid.startsWith('T') || line.lineid.startsWith('M') ? line.lineid.slice(1) : line.lineid}
                                  </div>
                                )}
                              </div>
                              <div className="rows">
                                {line.order && (
                                  <div className="order-column">
                                    {line.order}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

                
                <div className="info-grid">
                  {stop.stop_id && (
                    <>
                      <div className="info-label">ID</div>
                      <div className="info-value">{stop.stop_id}</div>
                    </>
                  )}
                  {stop.stop_coordinates.lon && (
                    <>
                      <div className="info-label">Longitude</div>
                      <div className="info-value">{stop.stop_coordinates.lon}</div>
                    </>
                  )}
                  {stop.stop_coordinates.lat && (
                    <>
                      <div className="info-label">Latitude</div>
                      <div className="info-value">{stop.stop_coordinates.lat}</div>
                    </>
                  )}
                  {stop.parent_station && (
                    <>
                      <div className="info-label">Parent Station</div>
                      <div className="info-value">{stop.parent_station}</div>
                    </>
                  )}
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

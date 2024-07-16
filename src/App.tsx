import { useEffect, useState, useMemo } from 'react';
import './App.css';
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";
import StatCounter from "./components/StatCounter";
import sensorPlaceholder from "./assets/sensor.png";
import gatewayPlaceholder from "./assets/gateway.png";
import './components/Icon.css';
import './components/StatCounter.css';
import { MarkerData, RouteData, StopData, TrainData } from './types';

function App() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [stops, setStops] = useState<StopData[]>([]);
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('data/markers.json')
      .then(response => response.json())
      .then(data => {
        console.log('Markers loaded:', data); 
        setMarkers(data);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error loading markers:', error);
        setIsLoaded(true);
      });

    fetch('data/gtfs-routes-production.json')
      .then(response => response.json())
      .then(data => {
        console.log('Routes loaded:', data); 
        setRoutes(data);
      })
      .catch(error => {
        console.error('Error loading routes:', error);
      });

    fetch('data/gtfs-stops-production.json')
      .then(response => response.json())
      .then(data => {
        console.log('Stops loaded:', data); 
        setStops(data);
      })
      .catch(error => {
        console.error('Error loading stops:', error);
      });

    const fetchTrainData = () => {
      fetch('data/vehicle-position-rt-production.json')
        .then(response => response.json())
        .then(data => {
          console.log('Trains loaded:', data); 
          setTrains(data);
        })
        .catch(error => {
          console.error('Error loading trains:', error);
        });
    };

    fetchTrainData(); // Initial fetch
    const interval = setInterval(fetchTrainData, 20000); // Fetch every 20 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const { sensorCount, gatewayCount, activeSensorCount, activeGatewayCount } = useMemo(() => {
    const sensors = markers.filter(marker => marker.type === 'CAPTEUR');
    const gateways = markers.filter(marker => marker.type === 'GATEWAY');
    const activeSensors = sensors.filter(marker => marker.status === 1);
    const activeGateways = gateways.filter(marker => marker.status === 1);

    return {
      sensorCount: sensors.length,
      gatewayCount: gateways.length,
      activeSensorCount: activeSensors.length,
      activeGatewayCount: activeGateways.length
    };
  }, [markers]);

  return (
    <div className="app-container">
      <div className="top-left-text">
        <span>Public transport map</span>
      </div>
      <div className="bottom-left-stats">
        <StatCounter icon={sensorPlaceholder} label="Capteurs" count={sensorCount} />
        <StatCounter icon={gatewayPlaceholder} label="Passerelles" count={gatewayCount} />
        <div className="stat-item">
          <span>
            <span className="status-indicator active" />
            {activeSensorCount} capteurs et {activeGatewayCount} passerelles actifs
          </span>
        </div>
      </div>
      {isLoaded && <Map routes={routes} stops={stops} trains={trains} />}
    </div>
  );
}

export default App;

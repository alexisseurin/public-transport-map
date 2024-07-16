import { useEffect, useState, useMemo } from 'react';
import './App.css';
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";
import StatCounter from "./components/StatCounter";
import stopPlaceholder from "./assets/stop.svg";
import trainPlaceholder from "./assets/train.svg";
import routePlaceholder from "./assets/road.svg";
import './components/Icon.css';
import './components/StatCounter.css';
import { RouteData, StopData, TrainData } from './types';
import LinesDisplay from './components/LinesDisplay';

function App() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [stops, setStops] = useState<StopData[]>([]);
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLineDisplayVisible, setisLineDisplayVisible] = useState(false);
  
  useEffect(() => {
    Promise.all([
      fetch('data/gtfs-routes-production.json').then(response => response.json()),
      fetch('data/gtfs-stops-production.json').then(response => response.json()),
      fetch('data/vehicle-position-rt-production.json').then(response => response.json())
    ]).then(([routesData, stopsData, trainsData]) => {
      console.log('Routes, stops, and trains loaded');
      setRoutes(routesData);
      setStops(stopsData);
      setTrains(trainsData);
      setIsLoaded(true);
    }).catch(error => {
      console.error('Error loading data:', error);
    });
  }, []);

  /*useEffect(() => {
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
  }, []);*/


    const { RouteCount, stopCount, trainCount } = useMemo(() => {
      //const tramRoutes = routes.filter(route => route.route_type === 'Tram');
      //const otherRoutes = routes.filter(route => route.route_type !== 'Tram');
      const totalRoutes = routes.length;
      const totalStops = stops.length;
      const totalTrains = trains.length;
  
    return {
        RouteCount: totalRoutes,
        stopCount: totalStops,
        trainCount: totalTrains
      };
    }, [routes, stops, trains]);

    const toggleStatsVisibility = () => {
      setisLineDisplayVisible(!isLineDisplayVisible);
    };
  
    return (
      <div className="app-container">
        <div className="top-left-text">
          <span>Public transport map</span>
        </div>
        <div className="bottom-left-stats">
          <StatCounter icon={routePlaceholder} label="routes" count={RouteCount} />
          <StatCounter icon={stopPlaceholder} label="stops" count={stopCount} />
          <StatCounter icon={trainPlaceholder} label="trains" count={trainCount} />
        </div>
        <LinesDisplay 
          isLineDisplayVisible={isLineDisplayVisible}
          toggleStatsVisibility={toggleStatsVisibility} 
        />
        {isLoaded && <Map routes={routes} stops={stops} trains={trains} />}
      </div>
    );
  }

export default App;

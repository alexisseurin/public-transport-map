import { useEffect, useState, useMemo, useCallback } from 'react';
import Map from "./components/Map";
import StatCounter from "./components/StatCounter";
import { RouteData, StopData, TrainData } from './types';
import LinesDisplay from './components/LinesDisplay';
import './App.css';
import "leaflet/dist/leaflet.css";
import './components/Icon.css';
import './components/StatCounter.css';
import stopPlaceholder from "./assets/stop.svg";
import trainPlaceholder from "/assets/train.svg";
import routePlaceholder from "./assets/road.svg";

function App() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [stops, setStops] = useState<StopData[]>([]);
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLineDisplayVisible, setisLineDisplayVisible] = useState(false);

  const updateTrainPositions = useCallback((newTrains: TrainData[]) => {
    setTrains(newTrains);
  }, []);

  useEffect(() => {

    
    Promise.all([
      fetch('data/gtfs-routes-production.json').then(response => response.json()),
      fetch('data/gtfs-stops-production.json').then(response => response.json()),
      fetch('data/vehicle-position-rt-production.json').then(response => response.json()),
      fetch('data/stop-details-production.json').then(response => response.json()),
      fetch('data/stops-by-line-production.json').then(response => response.json())
    ]).then(([routesData, stopsData, trainsData, stopDetailsData, stopsByLineData]) => {
      console.log('Routes, stops, and trains loaded');
      
      const combinedStopsData = stopsData.map((stop: { stop_id: string; stop_name: string; }) => {
        const stopDetails = stopDetailsData.find((detail: { id: string; name: string; }) => detail.id === stop.stop_id);
        const stopName = stopDetails ? JSON.parse(stopDetails.name.replace(/\\/g, '')) : { fr: stop.stop_name, nl: stop.stop_name };
        
        let ordersAndLineIds: { order: any; lineid: string; }[] = [];
        stopsByLineData.forEach((line: { lineid: string, points: string }) => {
            const points = JSON.parse(line.points);
            const stopPoint = points.find((point: { id: string; order: number }) => point.id === stop.stop_id);
            if (stopPoint) {
                ordersAndLineIds.push({ order: stopPoint.order, lineid: line.lineid });
            }
        });
    
        return {
            ...stop,
            stop_name: stopName,
            ordersAndLineIds: ordersAndLineIds
        };
    });
    
  
      setRoutes(routesData);
      setStops(combinedStopsData); 
      updateTrainPositions(trainsData);
      setIsLoaded(true);
    }).catch(error => {
      console.error('Error loading data:', error);
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
  }, [updateTrainPositions]);
  

    const { RouteCount, stopCount, trainCount } = useMemo(() => {
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
          <StatCounter icon={routePlaceholder} label="lines" count={RouteCount} />
          <StatCounter icon={stopPlaceholder} label="stops" count={stopCount} />
          <StatCounter icon={trainPlaceholder} label="trams, subways and buses" count={trainCount} />
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

import { useEffect, useState, useMemo, useCallback } from 'react';
import Map from "./components/Map";
import StatCounter from "./components/StatCounter";
import { RouteData, StopData, TrainData } from './types';
import LinesDisplay from './components/LinesDisplay';
import './App.css';
import "leaflet/dist/leaflet.css";
import './components/Icon.css';
import './components/StatCounter.css';
import stopPlaceholder from './assets/map/stop.svg';
import trainPlaceholder from './assets/vehicles/train.svg';
import routePlaceholder from "./assets/map/road.svg";

function App() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [stops, setStops] = useState<StopData[]>([]);
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLineDisplayVisible, setIsLineDisplayVisible] = useState(false);

  const updateTrainPositions = useCallback((newTrains: TrainData[]) => {
    setTrains(newTrains);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesData, stopsData, trainsData, stopDetailsData, stopsByLineData] = await Promise.all([
          fetch('data/gtfs-routes-production.json').then(response => response.json()),
          fetch('data/gtfs-stops-production.json').then(response => response.json()),
          fetch('data/vehicle-position-rt-production.json').then(response => response.json()),
          fetch('data/stop-details-production.json').then(response => response.json()),
          fetch('data/stops-by-line-production.json').then(response => response.json())
        ]);

        const combinedStopsData = stopsData.map((stop: { stop_id: string; stop_name: string; }) => {
          const stopDetails = stopDetailsData.find((detail: { id: string; name: string; }) => detail.id === stop.stop_id);
          const stopName = stopDetails ? JSON.parse(stopDetails.name.replace(/\\/g, '')) : { fr: stop.stop_name, nl: stop.stop_name };
        
          const ordersAndLineIds = stopsByLineData.reduce((acc: { order: number; lineid: string }[], line: { lineid: string; points: string }) => {
            const points = JSON.parse(line.points);
            const stopPoint = points.find((point: { id: string; order: number }) => point.id === stop.stop_id);
            if (stopPoint) {
              acc.push({ order: stopPoint.order, lineid: line.lineid });
            }
            return acc;
          }, []);
        
          return {
            ...stop,
            stop_name: stopName,
            ordersAndLineIds
          };
        });

        setRoutes(routesData);
        setStops(combinedStopsData);
        updateTrainPositions(trainsData);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error); // Uncommented error logging
      }
    };

    fetchData();

    const fetchTrainData = async () => {
      try {
        const response = await fetch('data/vehicle-position-rt-production.json');
        const data = await response.json();
        updateTrainPositions(data);
      } catch (error) {
        console.error('Error loading trains:', error); // Uncommented error logging
      }
    };

    fetchTrainData(); // Initial fetch
    const interval = setInterval(fetchTrainData, 20000); // Fetch every 20 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [updateTrainPositions]);

  const { RouteCount, stopCount, trainCount } = useMemo(() => {
    return {
      RouteCount: routes.length,
      stopCount: stops.length,
      trainCount: trains.length
    };
  }, [routes, stops, trains]);

  const toggleStatsVisibility = useCallback(() => {
    setIsLineDisplayVisible(prevState => !prevState);
  }, []);

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
      {isLoaded && <Map routes={routes} stops={stops} trains={trains} loading={!isLoaded} />}
    </div>
  );
}

export default App;

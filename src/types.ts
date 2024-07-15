export interface MarkerData {
  device_name: string;
  type: string;
  device_reference: string;
  status: number;
  gateway_id: string;
  geocode: [number, number];
  place: string;
  description: string;
  application_name: string;
  device_eui: string;
}

export interface RouteData {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: string;
  route_color: string;
  route_url: string | null;
  shape: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
  };
}

export interface StopData {
  stop_id: string;
  stop_code: string | null;
  stop_name: string;
  stop_coordinates: {
    lon: number;
    lat: number;
  };
  stop_desc: string | null;
  zone_id: string | null;
  stop_url: string | null;
  location_type: string;
  parent_station: string;
  stop_timezone: string | null;
  wheelchair_boarding: string | null;
}


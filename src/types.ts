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

import { Icon } from "leaflet";
import sensorPlaceholder from "../assets/sensor.png";
import gatewayPlaceholder from "../assets/gateway.png";

export const gatewayIcon = new Icon({
  iconUrl: gatewayPlaceholder,
  iconSize: [43, 43],
  className: "marker-icon"
});

export const sensorIcon = new Icon({
  iconUrl: sensorPlaceholder,
  iconSize: [38, 38],
  className: "marker-icon"
});

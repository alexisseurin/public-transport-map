import { Icon } from "leaflet";
import stopPlaceholder from "../assets/stop.svg";
import trainPlaceholder from "../assets/train.svg";

export const trainIcon = new Icon({
  iconUrl: trainPlaceholder,
  iconSize: [43, 43],
  className: "marker-icon"
});

export const stopIcon = new Icon({
  iconUrl: stopPlaceholder,
  iconSize: [38, 38],
  className: "marker-icon"
});

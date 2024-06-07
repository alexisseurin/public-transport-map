import React from "react";
import "./StatCounter.css";

interface StatCounterProps {
  icon: string;
  label: string;
  count: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ icon, label, count }) => (
  <div className="stat-item">
    <img src={icon} alt={label} className="stat-icon" />
    <span>{count} {label}</span>
  </div>
);

export default StatCounter;

import React from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

export default function Timer() {
  const endDate = new Date().getTime() + 6 * 60 * 60 * 1000;
;

  return (
    <div style={{ textAlign: "center" }}>
      <strong><h2>Le temps restant : </h2></strong>

      <FlipClockCountdown
        to={endDate}
        labels={["Jours", "Heures", "Minutes", "Secondes"]}
        showLabels={true}
        duration={0.5}
      />
    </div>
  );
}

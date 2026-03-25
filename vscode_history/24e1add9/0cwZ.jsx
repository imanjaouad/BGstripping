import React from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

export default function Timer() {
  // Date de fin (exemple : 24 heures à partir de maintenant)
  const ;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Temps restant</h2>

      <FlipClockCountdown
        to={endDate}
        labels={["Jours", "Heures", "Minutes", "Secondes"]}
        showLabels={true}
        duration={0.5}
        onComplete={() => alert("⏰ Temps écoulé !")}
      />
    </div>
  );
}

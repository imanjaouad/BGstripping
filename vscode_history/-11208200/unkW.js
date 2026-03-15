// src/components/WeatherApp.js
import React, { useState } from "react";
import axios from "axios";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const response = await axios.get(
        "https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0"
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <div>
      <button onClick={getWeather}>Récupérer la météo</button>
      {weather && <pre>{JSON.stringify(weather, null, 2)}</pre>}
    </div>
  );
}

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

      {weather && weather.dataseries && (
        <div>
          <p><strong>Init :</strong> {weather.init}</p>
          <p><strong>Latitude :</strong> 23.1</p>
          <p><strong>Longitude :</strong> 113.2</p>
          <h3>Prévisions :</h3>
          <ul>
            {weather.dataseries.map((item, index) => (
              <li key={index}>
                Jour {item.date}: {item.temp2m.max}°C / {item.temp2m.min}°C, 
                Temps: {item.weather}, Vent: {item.wind10m_max} m/s
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

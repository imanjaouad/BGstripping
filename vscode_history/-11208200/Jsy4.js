import React, { useState } from "react";
import axios from "axios";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0"
      );
      setWeather(response.data);
      console.log(response.data); // Pour voir la structure exacte
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={getWeather}>Récupérer la météo</button>

      {loading && <p>Chargement...</p>}

      {weather && weather.dataseries && weather.dataseries.length > 0 ? (
        <div>
          <p><strong>Init :</strong> {weather.init}</p>
          <h3>Prévisions :</h3>
          <ul>
            {weather.dataseries.map((item, index) => (
              <li key={index}>
                Heure {item.timepoint}h: {item.temp2m}°C, 
                Temps: {item.weather}, Vent max: {item.wind10m_max} m/s
              </li>
            ))}
          </ul>
        </div>
      ) : (
        weather && <p>Aucune donnée disponible</p>
      )}
    </div>
  );
}

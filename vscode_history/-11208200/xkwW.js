import React, { useState } from "react";
import axios from "axios";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0"
      );
      console.log("Données reçues :", response.data); // <- vérifie ici
      setWeather(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getWeather}>Récupérer la météo</button>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && weather.dataseries && weather.dataseries.length > 0 ? (
        <div>
          <p><strong>Init :</strong> {weather.init}</p>
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
      ) : (
        weather && <p>Aucune donnée disponible</p>
      )}
    </div>
  );
}

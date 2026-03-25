import React, { useState } from "react";
import axios from "axios";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    if (!city) return;

    // 1️⃣ Récupérer latitude/longitude de la ville via Nominatim
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?city=${city}&format=json`
    );

    if (geoRes.data.length === 0) {
      setWeather(null);
      setError("Ville introuvable !");
      return;
    }

    const { lat, lon } = geoRes.data[0];

    // 2️⃣ Récupérer météo via Open-Meteo
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    setWeather(weatherRes.data.current_weather);
    setError(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Météo d'une ville (sans clé API)</h2>

      <input
        type="text"
        placeholder="Entrez le nom de la ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ width: "70%", padding: "8px", marginRight: "5px" }}
      />

      <button onClick={getWeather} style={{ padding: "8px 12px" }}>
        Rechercher
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <p>Température : {weather.temperature}°C</p>
          <p>Vitesse du vent : {weather.windspeed} km/h</p>
          <p>Direction du vent : {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}

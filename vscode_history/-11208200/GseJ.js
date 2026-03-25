import React, { useState } from "react";
import axios from "axios";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    if (!city) return;

    // 1️⃣ Récupérer latitude/longitude de la ville via Nominatim
    const geo = await axios.get(
      `https://nominatim.openstreetmap.org/search?city=${city}&format=json`
    );

    if (!geo.data[0]) {
      setWeather("Ville introuvable !");
      return;
    }

    const { lat, lon } = geo.data[0];

    // 2️⃣ Récupérer météo via Open-Meteo
    const w = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    setWeather(w.data.current_weather);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Entrez une ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Voir météo</button>

      {weather && typeof weather === "string" && <p>{weather}</p>}

      {weather && typeof weather !== "string" && (
        <div>
          <p>Température : {weather.temperature}°C</p>
          <p>Vent : {weather.windspeed} km/h</p>
          <p>Direction : {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}

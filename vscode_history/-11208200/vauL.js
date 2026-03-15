import React, { useState } from "react";
import axios from "axios";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    if (!city) return;

    const geo = await axios.get(
      `https://nominatim.openstreetmap.org/search?city=${city}&format=json`
    );

    if (!geo.data[0]) return setWeather("Ville introuvable !");

    const { lat, lon } = geo.data[0];

    const w = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    setWeather(w.data.current_weather);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <input
        type="text"
        placeholder="Ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ width: "70%", padding: "5px", marginRight: "5px" }}
      />
      <button onClick={getWeather}>Voir météo</button>

      {weather && typeof weather === "string" && <p>{weather}</p>}

      {weather && typeof weather !== "string" && (
        <div style={{ marginTop: "10px" }}>
          <p>Température : {weather.temperature}</p>
          <p>Vent : {weather.windspeed}</p>
          <p>Direction : {weather.winddirection}</p>
        </div>
      )}
    </div>
  );
}

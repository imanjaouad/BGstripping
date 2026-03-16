import React from "react";
import ListUser from "./components/ListUser";
import WeatherApp from "./components/WeatherApp";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* Composant pour afficher les utilisateurs */}
      <ListUser />

      {/* Composant pour récupérer et afficher la météo */}
      <WeatherApp />
    </div>
  );
}

export default App;

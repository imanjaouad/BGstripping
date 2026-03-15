import React, { useEffect, useState } from "react";
import axios from "axios";
import ListUser from "./components/ListUser";
import "./App.css"
import WeatherApp from "./components/WeatherApp";

function App() {
  <>
  const [utilisateurs, setUtilisateurs] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("https://jsonplaceholder.typicode.com/users");
        setUtilisateurs(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      {utilisateurs.length > 0 ? 
      (
        <div>
          <ListUser utilisateurs={utilisateurs} />
        </div>)
        :("pas d'utilisateurs!!!!")}
    </div>
  );
  <WeatherApp/>
  </>
}

export default App;

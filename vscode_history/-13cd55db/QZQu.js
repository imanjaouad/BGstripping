import React, { useEffect, useState } from "react";
import axios from "axios";
import ListUser from "./components/ListUser";

function App() {
  const [utilisateurs,setUilisaters] = useState([]);

  useEffect(()=>[
    const getData = async () =>{
      const users = await axios.get("https://jsonplaceholder.typicode.com/users%22")
      .then()
    }
  ])
  
}

export default App;
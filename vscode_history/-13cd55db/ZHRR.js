import React, { useEffect, useState } from "react";
import axios from "axios";
import ListUser from "./components/ListUser";

function App() {
  const [utilisateurs,setUtilisaters] = useState([]);

  useEffect(()=>{
    const getData = async () =>{
      const users = await axios.get("https://jsonplaceholder.typicode.com/users%22")
      setUilisaters(users.data)
    }
    getData()
},[])

  return(
    <div>
      {utilisateurs? 
      (<div>
      <ListUser utilisateurs={utilisateurs} />
      </div>): "pas d'utilisateurs!!!!"}
    </div>
  )
}

export default App;
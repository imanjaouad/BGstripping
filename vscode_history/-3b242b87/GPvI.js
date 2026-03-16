import { useState } from "react";
import Form from "./Form";

export default function Users() {
  const [users, setUsers] = useState([]);

  const handleRegister = (user) => {
    setUsers([...users, user]);
  };

  return (
    <div>
      <Form onRegister={handleRegister} />

      <h2>Liste des utilisateurs</h2>
      
        {users.map((user, index) => (
        key={index}
            >Nom: {user.nom}, Email: {user.email}
          
        ))}
     
    </div>
  );
}

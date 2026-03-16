import { useState } from "react";
import Form from "./Form";

export default function Users() {
  const [users, setUsers] = useState([]);

  const handleRegister = (user) => {
    setUsers([...users, user]);
  };

  return (
    if user=""
    <div>
      <h2>Ajouter un utilisateur</h2>
      <Form onRegister={handleRegister} />

      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            Nom: {user.nom}, Email: {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

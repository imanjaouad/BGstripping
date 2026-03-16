import { useState } from "react";
import Form from "./Form";

export default function Users() {
  const [users, setUsers] = useState([]);

  const handleRegister = (user) => {
    setUsers([...users, user]);

    const handleDelete = (indexToDelete) => {
    const newUsers = users.filter((index) => index !== indexToDelete);
    setUsers(newUsers);
  };

  };

  return (
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
       <ul>
          {users.map((user, index) => (
            <li key={index}>
              Nom: {user.nom}, Email: {user.email}{" "}
              <button onClick={() => handleDelete(index)}>Supprimer</button>
            </li>
          ))}
        </ul>
    </div>
  );
}

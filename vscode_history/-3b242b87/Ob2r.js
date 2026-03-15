import { useState } from "react";
import Form from "./Form";

export default function Users() {
  const [users, setUsers] = useState([]);

  // Ajouter un utilisateur
  const handleRegister = (user) => {
    setUsers([...users, user]);
  };

  // Supprimer un utilisateur par index
  const handleDelete = (indexToDelete) => {
    const newUsers = users.filter((_, index) => index !== indexToDelete);
    setUsers(newUsers);
  };

  return (
    <div>
      <h2>Ajouter un utilisateur</h2>
      <Form onRegister={handleRegister} />

      <h2>Liste des utilisateurs</h2>
      {users.length === 0 ? (
        <p>Aucun utilisateur pour le moment.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              Nom: {user.nom}, Email: {user.email}{" "}
              <button onClick={() => handleDelete(index)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

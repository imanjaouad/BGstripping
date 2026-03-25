import { useState } from "react";
import Form from "./Form"; // ton composant formulaire

export default function Users() {
  const [users, setUsers] = useState([]);

  // Fonction pour ajouter un utilisateur depuis le formulaire
  const handlerRegister = (user) => {
    setUsers([...users, user]);
  };

  return (
    <div>
      <h2>Ajouter un utilisateur</h2>
      <Form onRegister={handlerRegister} />

      <h2>Liste des utilisateurs</h2>
      {users.length === 0 ? (
        <p>Aucun utilisateur pour le moment.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              Nom: {user.nom}, Email: {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

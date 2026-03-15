import React, { useState } from "react";

export default function Form(props) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // On envoie les données à la fonction passée en props
    props.onregister({ nom, prenom, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom :</label>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />

      <label>Prénom :</label>
      <input
        type="text"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />

      <label>Email :</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">S'inscrire</button>
    </form>
  );
}

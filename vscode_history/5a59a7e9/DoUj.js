import { useState } from "react";

export default function Form({ onRegister }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ nom, email });
    setNom("");
    setEmail("");

    const nom =

    if (!nom.trim() || !email.trim(){
      alert("tous les champs sont requis:")
      return;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Nom :</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />

        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />

        <button type="submit">Envoyer</button>
      </form>
    </>
  );
}

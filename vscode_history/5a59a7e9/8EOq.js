import { useState } from "react";
import Users from "./Users";

export default function Form({ onRegister }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");



 const handleSubmit = (e) => {
    e.preventDefault();

  onRegister({nom,email})
  setNom("")
  setEmail("")

  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Nom :</label>
        <inpu type="text" value={nom} onChange={(e) => setNom(e.target.value)} /><br />

        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        <br />

        <button type="submit">envoyer</button>
      </form>
    </>
  );
}
import { useState } from "react";

export default function Form({ onRegister }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");



 const handleSubmit = (e) => {
    e.preventDefault();

  onRegister({nom,email})
  setNom("")
  setEmail("")

  };

  return(
    <form onSubmit={handleSubmit}>
      <label> nom :</label>
      <input type="text" onChange={(e)=>setNom(e.target.value)}></input>
      <label> prenom :</label>
      <input type="text" onChange={(e)=>setEmail(e.target.value)}></input>
    </form>
  )
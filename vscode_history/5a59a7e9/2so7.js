import { useState } from "react";

export default function Form({ onRegister }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");



 const handleSubmit = (e) => {
    e.preventDefault();
    

}
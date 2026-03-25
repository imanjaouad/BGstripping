import React, { useState } from "react";
export default function Form(){
const [nom,setNom]=useState('')
const [prenom,setPrenom]=useState('')
const [email,setEmail]=useState('')


function handleOnchange(e){
    e.preventDefault()

    props.onregister(nom,email)

return(
    <form onSubmit={handleSubmit}>
        <label>nom :</label>
        <input type="text" onChange={(e)setNom(e.target.nom)
        <label>prenom :</label>
        <input type="text" onChange={(e)setEmail(e.target.nom)
    </form>
)
}
}
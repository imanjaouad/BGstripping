import { useState } from "react";
import styled from "styled-components";


const Input = styled.input`
border : 2px solid blue;
border-radius : 13px;
width : 600px;
height: 30px;
`
const Btn = styled.input`
background-color : blue;
color : white
border-radius : 13px;
width : 60px
height : 40px;

`


const NameForm = () =>{
    const [Nom,setNom] = useState("");
    const [Pass,setPassword] = useState("");
    const handleChange = (e) =>{
        setNom(e.target.value)
        setPassword(e.target.value)

    }
const handleSubmit = (event) =>{
    alert ("Votre nom est  " + Nom + "votre mot de passe est :" + Pass)
    event.preventDefault();
}




return (
    <>
    <form onSubmit={handleSubmit}>
    <label> Nom :</label><br />
    <Input type="text" name="nom" value={Nom} onChange={handleChange}/><br />
    <label> Password :</label><br />
    <Input type="password" name="nom" value={Nom} onChange={handleChange}/>

    <Btn type="submit" value="envoyer" />

    </form>
    </>
)
}
export default NameForm;

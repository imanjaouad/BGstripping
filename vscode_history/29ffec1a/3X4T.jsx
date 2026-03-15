import { useState } from "react";
import styled from "styled-components";



const Input = styled.input`
border : 2px solid blue;
border-radius : 13px;
width : 600px;
height: 30px;
`
const Btn = styled.input`
background-color : BLUE;
color : BLACK
border-radius : 13px;
width : 200px;
height : 40px;

`


class NameForm extends React.Component{
    constructor(props){
        super(props);
        this.state = handleChange = this.handleChange
        this.state = handleSubmit = this.handleSubmit

    }
    handleChange(event){
        this.setState({event.target.value})
    }
    handleSubmit(event){
        alert("le nom a été soumis " + this.state.nom)
        <event className="prevent"></event>
    }


}



render(){
return (
    <>
    <form onSubmit={handleSubmit}>
    <label> Nom :</label><br />
    <Input type="text" name="nom" value={Nom} onChange={handleChange}/><br />
    <label> Password :</label><br />
    <Input type="password" name="nom" value={Pass} onChange={passChange}/><br /><br />

    <Btn type="submit" value="envoyer" />

    </form>
    </>
)
}
}
export default NameForm;

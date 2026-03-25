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
        this.state = handleChange = this.handleChange.bind(this)
        this.state = handleSubmit = this.handleSubmit.bind(this)

    }
    handleChange(event){
        this.setState({event.target.value})
    }
    handleSubmit(event){
        alert("le nom a été soumis " + this.state.Nom)
        event.preventDefault();
    }



}



render(){
return (
    <>
    <form onSubmit={this.state.handleSubmit}>
    <label> Nom :</label><br />
    <Input type="text" name="nom" value={Nom} onChange={this.state.handleChange}/><br />
    <Btn type="submit" value="envoyer" />

    </form>
    </>
)
}
}
export default NameForm;

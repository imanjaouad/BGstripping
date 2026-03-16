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


class NameForm extends React.Component {
constructor(props) {
super(props);
this.state = {nom: ''};
this.handleChange = this.handleChange.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
}
handleChange(event) {
this.setState({nom: event.target.value});
}
handleSubmit(event) {
alert('Le nom a été soumis : ' + this.state.nom);
event.preventDefault();
}



render() {
return (
<form onSubmit={this.handleSubmit}>
<label>
Nom :
<input type="text" name="nom" value={this.state.nom}
onChange={this.handleChange} />
</label>
<input type="submit" value="Envoyer" />
</form>
);
}
}

export default NameForm;

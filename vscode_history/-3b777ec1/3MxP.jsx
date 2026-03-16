import React from "react";

export default class Message extends React.Component{
    constructor(){
        super()
        this.state={message:"Bienvenue visiteur",btnMessage:"inscription"}
    }
inscription(){
    this.setState({message:"votre inscription est effectué",btnMessage:"merci"})
this.render(){
    return (<div>
        <h2>{this.state.message}</h2>
        <button onClick={()=>this.inscription()}>{this.state.btnMessage}</button>
    </div>)
    
}
}
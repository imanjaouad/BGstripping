import React from "react";

export default class Message extends React.Component{
    constructor(){
        super()
        this.state={message:"Bienvenue visiteur",btnMessage:"inscription"}
    }
inscription(){
    this.setState({message:"votre inscription est effectué",btnMessage:"merci"})
}
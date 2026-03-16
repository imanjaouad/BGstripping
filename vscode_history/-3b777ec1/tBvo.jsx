import React, { Component } from "react";

export default class Message extends Component {
  constructor() {
    super();
    this.state = {
      message: "Bienvenue visiteur",
      btnMessage: "inscription"
    };
  }

  // Méthode pour changer le message et le texte du bouton
  inscription = () => {
    this.setState({
      message: "Votre inscription est effectuée",
      btnMessage: "Merci"
    });
  }

  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
        <button onClick={this.inscription}>{this.state.btnMessage}</button>
      </div>
    );
  }
}
<div>
        <h2>{this.state.message}</h2>
        <button onClick={this.inscription}>{this.state.btnMessage}</button>
      </div>
    );
  }
}

inscriptionT = () => {
    this.setState({
      message:"Merci a vous",
      btnMessage: "Merci"
    });
  }





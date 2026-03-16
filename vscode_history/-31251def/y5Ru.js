import React from "react";
class Contact extends React.Component {
  constructor(props){
    super({id});
    this.state = {id:id}
  }
  render() {
    return (
      <div>
        <h2>Blog id : {this.state.id}</h2>
      </div>
    );
  }
}

export default Contact;

import React from "react";
class Contact extends React.Component {
  constructor(props){
    super(props);
    this.state = {id:props.id}
  }render() {
    return (
      <div>
        <h2>Blog id : {this.state.id}</h2>
      </div>
    );
  }
}

export default Contact;

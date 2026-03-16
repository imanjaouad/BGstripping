import React from "react";
class About extends React.Component {
  render() {
    constructor(props){
    super(props);
    this.state = {id:props.id}
  }
    return (
      <div>
        <h2>About {this.state.id}</h2>
      </div>
    );
  }
}

export default About;
